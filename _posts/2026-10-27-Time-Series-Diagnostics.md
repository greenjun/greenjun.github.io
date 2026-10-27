---
title: "시계열 분석 11. 잔차가 조용하면 예측도 믿을 수 있을까요?"
date: 2026-10-27 09:11:00 +0900
last_modified_at: 2026-10-27
categories: [Time Series]
tags: [R, time series, residual diagnostics, Ljung-Box]
author_profile: false
mathjax: true
comments: true
toc: true
toc_label: "이 글의 순서"
excerpt: "잔차의 평균·분산·ACF와 Ljung–Box 검정을 연결하고, 예측구간이 보장하는 범위와 보장하지 않는 것을 살펴봅니다."
---

## 모형이 놓친 규칙은 어디에 남을까요?

모형이 예측한 값과 실제 값의 차이를 잔차(residual)로 살펴봅니다. 아직 설명하지 못한 시간 패턴이 남았다면 잔차도 일정한 규칙을 보일 수 있겠죠. 그래서 모형을 고른 뒤에는 잔차를 다시 시계열처럼 읽습니다.

잔차와 미래 예측오차는 구분해야 합니다. 잔차는 적합 과정에서 얻은 값이고, 실제 미래 예측오차는 새로운 관측값을 받은 뒤에야 계산할 수 있습니다. 잔차가 작다는 사실만으로 미래 성능까지 확인된 것은 아닙니다.

## 어떤 그림부터 볼까요?

```r
set.seed(111)
x <- arima.sim(model = list(ar = 0.6, ma = 0.4), n = 400)
fit <- arima(x, order = c(1, 0, 1), method = "ML")
r <- as.numeric(residuals(fit))
old_par <- par(mfrow = c(2, 2))
plot.ts(r, main = "Residuals", ylab = "Residual")
acf(r, lag.max = 24, main = "Residual ACF")
qqnorm(r, main = "Normal Q-Q"); qqline(r)
acf(r^2, lag.max = 24, main = "Squared residual ACF")
par(old_par)
```

![잔차 경로·자기상관·정규 Q-Q·제곱 잔차의 자기상관](/assets/images/time-series/diagnostics.png)

평균이 한 방향으로 치우치거나, 시간에 따라 퍼짐이 달라지는지 보겠습니다. 잔차 ACF가 작아도 제곱 잔차에는 관계가 남을 수 있습니다. 이는 변동성에 대한 모형이 더 필요하다는 단서가 될 수 있죠. 정규 Q-Q 그림은 정규 근사에 관한 단서이며 독립성을 검정하는 그림은 아닙니다.

## Ljung–Box 검정은 무엇을 묻나요?

선택한 시차 1부터 H까지의 자기상관이 함께 0인지 검토하는 검정입니다. 표본 크기를 n이라 하면 통계량은 다음과 같습니다.

$$
Q=n(n+2)\sum_{h=1}^{H}\frac{\widehat\rho(h)^2}{n-h}.
$$

ARMA 모형을 자료에 적합한 뒤에는 추정한 AR·MA 차수만큼 자유도를 보정하는 근사를 사용합니다. 계절 모형에서는 일반·계절 AR·MA 차수 p+q+P+Q 등을 고려하고 H가 보정 자유도보다 커야 합니다.

```r
p <- 1
q <- 1
H <- 20
stopifnot(H > p + q)
Box.test(r, lag = H, type = "Ljung-Box", fitdf = p + q)
c(mean = mean(r), sd = sd(r))
```

큰 p-value는 선택한 범위에서 무상관 가설을 기각할 충분한 증거를 얻지 못했다는 뜻입니다. 모든 시차의 관계나 독립성, 정규성, 미래 성능을 증명하지는 않습니다. 작은 표본과 여러 H를 탐색한 뒤 원하는 결과만 보고하는 문제도 생각해야 합니다.

## 예측구간은 어떤 불확실성을 담을까요?

예측이 평균적으로 맞더라도 개별 미래 관측값은 흔들릴 수 있습니다. 정규 혁신의 조건부 모형에서 점 예측 $\widehat X_{t+h|t}$와 예측 표준오차 $s_h$를 사용하면 다음과 같은 점별 근사 구간을 만들 수 있습니다.

$$
\widehat X_{t+h|t}\pm1.96s_h.
$$

이것은 평균 수준만의 신뢰구간과 다릅니다. 여러 미래 시점 전체가 함께 들어가는 동시 구간도 아닙니다. 모형·분포 가정이 틀리거나 구조 변화가 생기면 명목 95%와 실제 포함률이 달라질 수 있습니다.

```r
forecast <- predict(fit, n.ahead = 12)
interval <- data.frame(
  horizon = 1:12,
  prediction = as.numeric(forecast$pred),
  low = as.numeric(forecast$pred - qnorm(0.975) * forecast$se),
  high = as.numeric(forecast$pred + qnorm(0.975) * forecast$se)
)
interval
```

이 구간은 적합한 모수 값을 대입한 계산입니다. `predict.Arima()`의 표준오차가 모수 추정 불확실성까지 충분히 반영하는 것은 아닙니다. 비정규·비대칭 오차나 변하는 분산이 중요하다면 그 구조를 다루는 모형과 적절한 재표집 방법을 검토해야 합니다.

## 구간이 넓으면 무조건 좋은 것일까요?

구간을 아주 넓게 만들면 포함률은 높아지기 쉽겠죠. 하지만 결정에 도움이 되는지는 다른 문제입니다. 미래 구간에서 실제 포함률과 구간 폭을 함께 확인해야 합니다. 예측 시점·horizon별로 결과를 나누어 보는 것도 유용합니다.

진단 결과가 나쁘면 자료 수집, 변환, 누락된 계절성, 구조 변화부터 차례로 살핍니다. 검정을 통과시키려고 관측값을 지우거나 시차를 바꾸는 방법으로 문제를 숨겨서는 안 됩니다.

## 다음에는 무엇을 배우면 좋을까요?

잔차 진단은 모형 안에 남은 구조를 살피는 단계이고, 시간순 검증은 새 자료에서의 예측을 평가하는 단계입니다. 마지막 글에서는 두 단계를 연결한 [시계열 예측 프로젝트]({% post_url 2026-10-27-Time-Series-Forecast-Project %})를 완성하겠습니다.

## 직접 생각해 보기와 참고 자료

1. 잔차 ACF는 작지만 제곱 잔차 ACF가 크다면 어떤 종류의 규칙이 남아 있을까요?
2. 24개 예측 각각의 95% 구간을 그렸을 때, 전체 24개가 동시에 들어갈 확률도 95%일까요?

- [연재 목차]({{ '/time-series/' | relative_url }})
- [R: Box.test](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/box.test.html)
- [Prediction intervals](https://otexts.com/fpp3/prediction-intervals.html)
