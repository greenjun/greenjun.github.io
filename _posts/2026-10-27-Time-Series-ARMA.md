---
title: "시계열 분석 6. AR과 MA를 함께 쓰면 무엇이 달라질까요?"
date: 2026-10-27 09:06:00 +0900
last_modified_at: 2026-10-27
categories: [Time Series]
tags: [R, time series, ARMA, model selection]
author_profile: false
mathjax: true
comments: true
toc: true
toc_label: "이 글의 순서"
excerpt: "ARMA의 식과 근 조건을 이해하고, ACF·PACF·AIC·잔차를 함께 사용해 후보 모형을 비교합니다."
---

## 과거 값과 과거 충격이 모두 필요하다면 어떨까요?

어제의 상태가 이어지는 효과와 일시적인 충격의 효과를 함께 설명하고 싶을 수 있습니다. AR과 MA를 합친 **자기회귀 이동평균 모형(autoregressive moving average model, ARMA)**이 이때의 출발점입니다.

ARMA(p,q)의 p는 과거 관측값의 차수이고, q는 과거 오차의 차수입니다. 먼저 두 항이 하나씩 있는 경우를 살펴볼까요?

## ARMA(1,1)은 어떤 식일까요?

$$
X_t-\mu=\phi(X_{t-1}-\mu)+a_t+\theta a_{t-1}.
$$

AR 항의 충격은 여러 시점으로 이어지고, MA 항은 최근 오차의 영향을 조정합니다. 인과적인 정상 표현에는 $|\phi|<1$, 가역적인 표현에는 $|\theta|<1$이 필요합니다. 두 조건이 서로 다른 역할을 한다는 점은 앞 글과 같습니다.

시차 연산자 $BX_t=X_{t-1}$를 사용하면 $(1-\phi B)(X_t-\mu)=(1+\theta B)a_t$로 적을 수 있습니다. 양쪽 다항식에 공통 인수가 있으면 상쇄될 수 있는데요. 실제보다 큰 차수로 같은 구조를 표현하지 않도록 확인해야 합니다.

## ACF와 PACF를 보면 차수를 바로 알 수 있을까요?

| 모형 | 이론 ACF | 이론 PACF |
| --- | --- | --- |
| 정상 AR(p) | 대체로 점차 감소 | p 이후 0 |
| 가역 MA(q) | q 이후 0 | 대체로 점차 감소 |
| 최소 표현 ARMA(p,q) | 일반적으로 점차 감소 | 일반적으로 점차 감소 |

표본에서는 경계가 선명하지 않습니다. 상쇄되거나 계수가 작은 항도 있을 수 있으므로, 표의 모양은 후보를 만드는 단서로 사용하겠습니다.

```r
set.seed(106)
x <- arima.sim(model = list(ar = 0.6, ma = 0.4), n = 400)
old_par <- par(mfrow = c(1, 2))
acf(x, lag.max = 20, main = "ARMA(1,1): ACF")
pacf(x, lag.max = 20, main = "ARMA(1,1): PACF")
par(old_par)
```

![ARMA 모형에서 점차 줄어드는 표본 ACF와 PACF](/assets/images/time-series/arma.png)

## AIC는 무엇을 비교하나요?

모형을 복잡하게 하면 학습 자료를 더 잘 맞출 여지가 커집니다. 그래서 적합도와 복잡도를 함께 비교하는 기준이 필요합니다.

$$
\operatorname{AIC}=-2\log L+2k.
$$

$L$은 적합한 모형의 우도이고, $k$는 추정한 모수의 수입니다. 같은 자료와 비교 가능한 우도 정의 아래에서 작은 값의 후보를 선호합니다. AIC가 작다는 사실이 미래 오차도 반드시 작다는 뜻은 아니며, 차분 차수가 다른 모형의 수치를 무턱대고 비교해서도 안 됩니다.

```r
orders <- list(AR1 = c(1, 0, 0), MA1 = c(0, 0, 1), ARMA11 = c(1, 0, 1))
fits <- lapply(orders, function(order) arima(x, order = order, method = "ML"))
comparison <- data.frame(model = names(fits), AIC = sapply(fits, AIC))
comparison[order(comparison$AIC), ]
```

이 예제는 구조를 알고 있는 가상 자료입니다. 실제 자료에서는 알려진 정답 모형이 없으므로, 표본 크기와 추정 안정성도 함께 봐야 하겠죠. 작은 표본에서는 모수 수에 추가 보정을 하는 AICc도 검토할 수 있습니다.

## 선택한 뒤에는 무엇을 확인할까요?

```r
candidate <- fits[[which.min(comparison$AIC)]]
coef(candidate)
Box.test(as.numeric(residuals(candidate)), lag = 20,
         type = "Ljung-Box",
         fitdf = length(coef(candidate)) - 1)
```

여기서는 차분 없는 비계절 모형의 평균 모수가 하나 있으므로 이를 빼고 AR·MA 모수 수를 자유도 보정에 썼습니다. 다른 모형에 이 계산을 그대로 옮기지 말고 p+q 등을 명시적으로 확인해야 합니다. 검정의 상세한 조건은 [잔차 진단 글]({% post_url 2026-10-27-Time-Series-Diagnostics %})에서 다시 다룹니다.

잔차가 시간에 따라 치우치거나 ACF에 패턴이 남으면 평균 구조가 부족할 수 있습니다. 반대로 잔차 검정을 기각하지 못했다고 모형이 참이라고 증명된 것은 아닙니다. 최종 선택에는 실제 예측 상황을 닮은 검증도 필요합니다.

## 다음에는 무엇을 배우면 좋을까요?

지금까지는 정상적인 부분을 AR·MA 구조로 설명했습니다. 평균이 계속 증가하는 자료에는 어떻게 적용할까요? 다음 글에서 [변환·추세 제거·차분]({% post_url 2026-10-27-Time-Series-Differencing %})을 구분해 보겠습니다.

## 직접 생각해 보기와 참고 자료

1. ARMA(1,1)에서 $\theta=-\phi$이면 두 다항식에 어떤 일이 일어날까요?
2. AIC가 가장 낮은 모형의 잔차에 계절 패턴이 남았다면 다음으로 무엇을 확인해야 할까요?

- [연재 목차]({{ '/time-series/' | relative_url }})
- [R: AIC](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/AIC.html)
- [Information criteria](https://otexts.com/fpp3/arima-ic.html)
