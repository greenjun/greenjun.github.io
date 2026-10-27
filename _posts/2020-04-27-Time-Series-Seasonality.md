---
title: "시계열 분석 9. 추세와 계절성을 나누면 무엇이 보일까요?"
date: 2020-04-27 09:09:00 +0900
last_modified_at: 2020-04-29
categories: [Time Series]
tags: [R, time series, seasonality, STL]
author_profile: false
mathjax: true
comments: true
toc: true
toc_label: "이 글의 순서"
excerpt: "추세·계절성·불규칙 성분을 나누어 보고, 가법·승법 분해와 STL을 미래 정보 누수 없이 적용합니다."
---

## 매년 여름에 증가한다면 단순한 추세일까요?

항공 승객 수가 해마다 늘면서 여름마다 더 높아진다면 두 종류의 변화가 겹친 것입니다. 장기적인 증가와 일정한 달력 주기로 돌아오는 패턴을 나누어 보면 설명이 쉬워지겠죠.

고정된 주기에 따라 반복되는 성질을 **계절성(seasonality)**이라고 합니다. 경기 변동처럼 길이가 일정하지 않은 cycle과는 구분합니다. 월별 자료의 연간 계절 주기는 12이고, 분기별 자료는 4입니다.

## 더하기와 곱하기 중 무엇이 어울릴까요?

가법 분해에서는 관측값을 추세·계절·불규칙 성분의 합으로 생각합니다.

$$
X_t=T_t+S_t+R_t.
$$

계절 진폭이 수준과 무관하게 비슷하면 자연스러운 출발점입니다. 반면 수준이 커질수록 계절 진폭도 비례해 커진다면 승법 구조 $X_t=T_tS_tR_t$를 생각할 수 있습니다. 양수 자료에서는 로그를 취해 덧셈 구조로 바꿀 수 있죠.

$$
\log X_t=\log T_t+\log S_t+\log R_t.
$$

이것은 자료를 설명하기 위한 모형적 분리입니다. 각 성분이 관측된 독립적인 실체라고 단정하지는 않습니다. 같은 자료에서도 분해 방법과 평활화 설정에 따라 결과가 달라질 수 있습니다.

## STL로 나누어 볼까요?

STL은 LOESS를 이용해 계절·추세 성분을 추정하는 방법입니다. 다음 예에서는 미래를 평가에 남기기 위해 1958년까지의 자료만 분해합니다.

```r
data(AirPassengers)
training <- window(AirPassengers, end = c(1958, 12))
fit <- stl(log(training), s.window = "periodic", robust = TRUE)
plot(fit, main = "STL of log passengers: training period only")
components <- fit$time.series
head(components)
```

![학습 기간의 로그 항공 승객 수를 나눈 STL 분해](/assets/images/time-series/seasonality.png)

`s.window = "periodic"`은 같은 달의 계절 패턴이 일정하다는 설정입니다. 계절 구조가 시간에 따라 바뀌는 모형을 택하려면 다른 창 설정을 검토할 수 있습니다. `robust = TRUE`는 일부 극단값의 영향을 줄이려는 옵션이며, 모든 구조 변화를 해결한다는 뜻은 아닙니다.

## 계절 조정 자료와 잔차는 같을까요?

```r
adjusted <- log(training) - components[, "seasonal"]
remainder <- components[, "remainder"]
c(adjusted_variance = var(adjusted), remainder_variance = var(remainder))
acf(remainder, lag.max = 24, main = "STL remainder: sample ACF")
```

계절 조정 자료는 계절 성분을 뺀 것이므로 추세가 남을 수 있습니다. remainder는 추세까지 제거한 나머지입니다. 하지만 remainder라는 이름만으로 백색소음이나 독립 오차가 보장되지는 않습니다. 남은 ACF와 분산 변화도 확인해야 합니다.

## 시계열 전체를 분해한 뒤 나누면 왜 문제가 될까요?

STL과 여러 평활화 방법은 한 시점의 추세를 추정할 때 그 뒤 관측값도 사용할 수 있습니다. 전체 자료를 먼저 분해하면 미래를 본 상태로 과거 성분을 계산할 수 있겠죠. 그 결과로 검증 성능을 계산하면 실제 예측보다 쉬운 문제를 평가하게 됩니다.

실제로 검증하려면 각 예측 원점까지의 자료만으로 분해와 모형 적합을 다시 해야 합니다. 전체 자료의 사후 설명을 위한 분해 그림과, 미래 예측의 검증 절차는 목적이 다르다는 점을 구분해 주세요.

## 계절 차분과 분해는 같은 방법인가요?

계절 차분은 $X_t-X_{t-m}$이라는 연산입니다. 분해는 계절 성분을 추정해 빼는 방법이죠. 하나를 다른 하나의 이름으로 부르면 가정이 흐려집니다. 계절 패턴이 결정적이고 일정한지, 계절 시차에서 확률적 누적이 있는지에 따라 모형을 생각해야 합니다.

불규칙 자료나 여러 계절 주기가 함께 있는 자료에는 이 단순한 월별 STL 예제를 그대로 적용하기 어렵습니다. 날짜의 빈도, 빠진 기간, 달력 효과부터 확인하는 것이 좋습니다.

## 다음에는 무엇을 배우면 좋을까요?

계절성을 나누어 보면 어느 주기에 어떤 관계가 남는지 생각하기 쉬워집니다. 다음 글에서는 계절 차분과 계절 AR·MA 항을 함께 사용하는 [SARIMA]({% post_url 2020-05-04-Time-Series-SARIMA %})로 이어 보겠습니다.

## 직접 생각해 보기와 참고 자료

1. 계절 조정 자료에도 장기 증가가 남는 이유를 분해식으로 설명해 보세요.
2. 미래를 모르는 1958년 말에 예측한다면 1959년 자료를 사용해 추세를 매끄럽게 해도 될까요?

- [연재 목차]({{ '/time-series/' | relative_url }})
- [R: stl](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/stl.html)
- [Time series decomposition](https://otexts.com/fpp3/decomposition.html)
