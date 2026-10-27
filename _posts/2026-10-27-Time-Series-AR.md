---
title: "시계열 분석 5. 자기회귀 모형은 과거를 어떻게 기억할까요?"
date: 2026-10-27 09:05:00 +0900
last_modified_at: 2026-10-27
categories: [Time Series]
tags: [R, time series, AR, stationarity]
author_profile: false
mathjax: true
comments: true
toc: true
toc_label: "이 글의 순서"
excerpt: "AR(1)의 평균·분산·자기상관을 유도하고, 정상성·상수항·다단계 예측을 R 예제로 연결합니다."
---

## 오늘의 값이 어제의 값에 달려 있다면 어떨까요?

실내 온도는 어제의 상태에서 갑자기 완전히 다른 값이 되기보다 조금씩 바뀌는 경우가 많습니다. 현재 값이 과거 관측값과 새로운 충격으로 정해진다고 생각할 수 있겠죠. 이런 모형을 **자기회귀 모형(autoregressive model, AR)**이라고 합니다.

[MA 모형]({% post_url 2026-10-27-Time-Series-MA %})이 과거 오차를 사용했다면, AR 모형은 과거의 자기 자신을 예측 변수로 사용합니다.

## AR(1)의 평균은 상수항과 같을까요?

AR(1)은 한 시점 전의 값을 사용합니다. 백색소음 $a_t$와 상수 $c$를 이용해 다음처럼 씁니다.

$$
X_t=c+\phi X_{t-1}+a_t.
$$

정상 평균이 존재하고 $\phi\ne1$이면 양변의 기댓값에서 $\mu=c+\phi\mu$이므로 다음을 얻습니다.

$$
\mu=\frac{c}{1-\phi},\qquad
X_t-\mu=\phi(X_{t-1}-\mu)+a_t.
$$

따라서 상수항 $c$와 장기 평균 $\mu$는 일반적으로 다릅니다. R의 차분하지 않은 `arima()`에서 `intercept`는 이 식의 $c$가 아니라 평균 $\mu$에 해당한다는 점도 기억해 주세요.

## 언제 안정적인 과정이 될까요?

과거 혁신의 영향을 앞으로 계속 전개하면 $\phi$의 거듭제곱이 나타납니다. **과거의 혁신들로 표현하는 인과적인 정상해**를 원하면 $|\phi|<1$이 필요합니다. 이때 유한 분산은 다음과 같습니다.

$$
\operatorname{Var}(X_t)=\phi^2\operatorname{Var}(X_t)+\sigma_a^2
\quad\Rightarrow\quad
\operatorname{Var}(X_t)=\frac{\sigma_a^2}{1-\phi^2}.
$$

$\phi$가 1에 가까워질수록 충격이 오래 남고 분산도 커집니다. $\phi=1$, $c=0$에서 고정 초기값으로 시작하면 랜덤워크가 되죠. 다만 $|\phi|<1$인 식도 임의의 고정 초기값에서 시작하면 초기에는 정상분포와 다를 수 있습니다. 정상해와 초기화 방식을 구분해야 합니다.

## 양수와 음수의 계수는 어떤 차이를 만들까요?

$$
\rho(h)=\phi^{|h|}.
$$

$\phi>0$이면 양의 ACF가 점차 줄어듭니다. $\phi<0$이면 부호를 번갈아 바꾸며 줄어들겠죠. 이론 PACF는 시차 1 이후 0입니다.

```r
set.seed(105)
positive <- arima.sim(model = list(ar = 0.7), n = 400)
negative <- arima.sim(model = list(ar = -0.7), n = 400)
old_par <- par(mfrow = c(2, 2))
plot.ts(positive, main = "AR(1): phi = 0.7", ylab = "Value")
acf(positive, lag.max = 16, main = "Positive phi: ACF")
plot.ts(negative, main = "AR(1): phi = -0.7", ylab = "Value")
acf(negative, lag.max = 16, main = "Negative phi: ACF")
par(old_par)
```

![AR 계수 부호에 따른 관측 경로와 자기상관의 차이](/assets/images/time-series/ar.png)

```r
theory <- data.frame(lag = 0:6, rho_positive = 0.7^(0:6),
                     rho_negative = (-0.7)^(0:6))
theory
```

표본 ACF는 이론값과 정확히 일치하지 않습니다. 특히 표본이 작고 계수가 1에 가까우면 정상 과정도 긴 추세처럼 보일 수 있습니다.

## 여러 시점 앞의 예측은 어디로 갈까요?

독립 정규 혁신을 가진 AR(1)에서 모형의 참값을 안다고 하면, 현재로부터 $h$시점 뒤의 조건부 평균은 다음과 같습니다.

$$
\widehat X_{t+h|t}=\mu+\phi^h(X_t-\mu).
$$

$|\phi|<1$이면 현재 수준의 영향이 줄어들고 예측은 장기 평균으로 향합니다. 아래는 모형을 추정한 뒤 10시점 앞을 계산하는 예입니다.

```r
fit <- arima(positive, order = c(1, 0, 0), method = "ML")
coef(fit)
forecast <- predict(fit, n.ahead = 10)
data.frame(horizon = 1:10, forecast = as.numeric(forecast$pred),
           se = as.numeric(forecast$se))
```

AR(p)로 확장하면 $1-\phi_1z-\cdots-\phi_pz^p$의 모든 근이 단위원 밖에 있는지 확인합니다. 각 계수의 절댓값이 1보다 작은지만 확인하는 것으로는 충분하지 않습니다.

## 다음에는 무엇을 배우면 좋을까요?

AR은 과거 관측값을, MA는 과거 오차를 사용한다는 차이가 있습니다. 두 구조가 함께 필요할 수도 있겠죠. 다음 글에서는 [ARMA 모형]({% post_url 2026-10-27-Time-Series-ARMA %})으로 두 생각을 합쳐 보겠습니다.

## 직접 생각해 보기와 참고 자료

1. $\mu=10$, $\phi=0.7$이면 상수항 $c$는 얼마일까요?
2. $\phi=0.95$와 0.3 중 어느 모형에서 현재의 충격이 더 오래 남을까요?

- [연재 목차]({{ '/time-series/' | relative_url }})
- [R: arima.sim](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/arima.sim.html)
- [Autoregressive models](https://otexts.com/fpp3/AR.html)
