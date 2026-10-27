---
title: "시계열 분석 4. 이동평균 모형은 무엇을 평균낼까요?"
date: 2026-10-27 09:04:00 +0900
last_modified_at: 2026-10-27
categories: [Time Series]
tags: [R, time series, MA, invertibility]
author_profile: false
mathjax: true
comments: true
toc: true
toc_label: "이 글의 순서"
excerpt: "평활화 이동평균과 MA 모형을 구분하고, MA(1)의 분산·ACF·가역성을 직접 계산하고 시뮬레이션합니다."
---

## 어제의 충격이 오늘에도 남을 수 있을까요?

어제 발생한 주문 지연이 오늘의 배송량에도 영향을 줄 수 있겠죠. 현재 값이 오늘의 새로운 충격과 과거의 충격을 합쳐 만들어진다고 생각해 보겠습니다. 이때 사용하는 기본 모형이 **이동평균 모형(moving average model, MA)**입니다.

이름 때문에 최근 관측값의 단순 평균을 떠올리기 쉬운데요. 그래프를 매끄럽게 하는 이동평균은 관측값을 평균내는 도구이고, MA 모형은 **관측되지 않는 오차들의 가중합**으로 자료의 생성 과정을 설명합니다. 두 개념을 구분하는 것이 첫걸음입니다.

## MA(1)은 어떤 식인가요?

평균이 $\mu$인 MA(1)을 다음과 같이 쓰겠습니다. $a_t$는 평균 0, 분산 $\sigma_a^2$인 백색소음입니다.

$$
X_t=\mu+a_t+\theta a_{t-1}.
$$

숫자 1은 한 시점 전의 오차까지 사용한다는 뜻입니다. $\theta=0.6$이면 어제의 충격이 오늘에 0.6배로 남습니다. 백색소음 사이의 공분산이 0이므로 평균과 분산은 다음과 같습니다.

$$
E[X_t]=\mu,\qquad \operatorname{Var}(X_t)=(1+\theta^2)\sigma_a^2.
$$

분산을 계산할 때 교차항이 사라지는 이유가 무상관 조건입니다. 분포를 정규분포로 가정하지 않아도 이 계산은 성립합니다.

## ACF가 시차 1에서 끝나는 이유는 무엇일까요?

$X_t$와 $X_{t-1}$에는 공통 오차 $a_{t-1}$가 있습니다. 하지만 두 시점 이상 떨어지면 겹치는 오차가 없겠죠. 따라서 다음과 같습니다.

$$
\gamma(1)=\theta\sigma_a^2,\qquad
\rho(1)=\frac{\theta}{1+\theta^2},\qquad
\rho(h)=0\quad(|h|>1).
$$

```r
set.seed(104)
theta <- 0.6
x <- arima.sim(model = list(ma = theta), n = 500)
c(theory_variance = 1 + theta^2, sample_variance = var(x),
  theory_rho1 = theta / (1 + theta^2))
old_par <- par(mfrow = c(1, 2))
plot.ts(x, main = "MA(1), theta = 0.6", ylab = "Value")
acf(x, lag.max = 20, main = "Sample ACF")
par(old_par)
```

![MA(1)의 관측 경로와 표본 자기상관](/assets/images/time-series/ma.png)

이론상 시차 2 이후는 0이지만 표본 막대는 정확히 0이 아닙니다. MA(q)에서는 겹치는 오차가 q시차까지만 남기 때문에 이론 ACF가 그 이후에 끊어집니다. 표본의 모양만으로 q를 확정할 수는 없고, 후보 모형과 진단을 함께 봐야 합니다.

## 정상성과 가역성은 같은 조건일까요?

유한한 개수의 백색소음을 고정 계수로 합친 MA(q)는 약정상성입니다. MA(1)의 $\theta$가 1보다 커도 분산이 시간에 따라 커지는 것은 아닙니다.

반면 **가역성(invertibility)**은 관측한 과거 값들로 오차를 안정적으로 되짚을 수 있는가에 관한 조건입니다. MA(1)은 $|\theta|<1$이면 가역적인 표현을 갖습니다. 일반 MA 다항식 $1+\theta_1z+\cdots+\theta_qz^q$에서는 근들이 단위원 밖에 있어야 합니다.

$\theta$와 $1/\theta$는 오차 분산을 조정하면 같은 자기공분산 구조를 만들 수 있습니다. 관측된 공분산만으로 구분하기 어려운 표현을 정리하기 위해 가역적인 표현을 택하는 이유입니다. 정상성 조건과 서로 바꾸어 외우면 안 됩니다.

```r
rho1 <- function(theta) theta / (1 + theta^2)
c(theta_06 = rho1(0.6), reciprocal = rho1(1 / 0.6))
fit <- arima(x, order = c(0, 0, 1), include.mean = TRUE, method = "ML")
coef(fit)
```

## 미래 예측은 어떻게 달라질까요?

MA(1)에서 미래 오차의 조건부 평균이 0인 혁신 모형을 생각하면, 한 시점 뒤 예측에는 마지막 오차의 영향이 남습니다. 두 시점 이상 뒤에서는 그 영향도 사라져 평균 $\mu$로 돌아갑니다. 이 조건부 해석에는 약한 백색소음보다 강한 가정이 필요할 수 있으므로, 보통 독립 정규 혁신 등을 명시합니다.

```r
forecast <- predict(fit, n.ahead = 10)
data.frame(horizon = 1:10, prediction = as.numeric(forecast$pred),
           standard_error = as.numeric(forecast$se))
```

R의 `arima()`는 위 식처럼 MA 항에 더하기 부호를 사용합니다. 교재에 따라 빼기 부호를 쓰기도 하므로 계수를 비교하기 전에 식부터 맞춰 보세요.

## 다음에는 무엇을 배우면 좋을까요?

MA 모형은 과거의 **오차**를 기억합니다. 그렇다면 과거의 **관측값**이 현재를 설명하는 모형은 어떨까요? 다음 글의 [자기회귀 모형 AR]({% post_url 2026-10-27-Time-Series-AR %})에서 이어 보겠습니다.

## 직접 생각해 보기와 참고 자료

1. $\theta=-0.6$으로 바꾸면 시차 1의 ACF 부호는 어떻게 바뀔까요?
2. $\theta=1.5$일 때 정상성과 가역성을 각각 판단해 보세요.

- [연재 전체 목차]({{ '/time-series/' | relative_url }})
- [R: arima](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/arima.html)
- [ARIMA models](https://otexts.com/fpp3/non-seasonal-arima.html)
