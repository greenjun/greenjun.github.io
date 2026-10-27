---
title: "시계열 분석 3. 자기상관으로 무엇을 알 수 있을까요?"
date: 2022-03-18 14:38:56 +0900
last_modified_at: 2022-09-23
categories: [Time Series]
tags: [R, time series, ACF, PACF]
classes: single
author_profile: false
mathjax: true
comments: true
toc: true
toc_label: "이 글의 순서"
excerpt: "자기공분산을 자기상관으로 바꾸는 이유를 수식으로 살펴보고, ACF와 PACF의 해석 범위를 알아봅니다."
---

## 어제의 값과 오늘의 값은 얼마나 닮았을까요?

기온처럼 가까운 시점의 값이 비슷한 자료가 있습니다. 반대로 한 번 증가한 뒤 바로 감소하는 자료도 있겠죠. 이런 시간 사이의 선형 관계를 **자기상관(autocorrelation)**으로 살펴볼 수 있습니다.

[정상성 글]({% post_url 2022-03-11-Time-Series-Stationarity %})에서 자기공분산이 시간 간격에만 의존한다고 했는데요. 그 함수부터 하나씩 정리해 보겠습니다.

## 자기공분산은 어떤 함수인가요?

평균 $\mu$를 가진 실수값 약정상 과정에서 시차(lag) $h$의 자기공분산 함수는 다음과 같습니다.

$$
\gamma(h)=\operatorname{Cov}(X_t,X_{t+h})
=E[(X_t-\mu)(X_{t+h}-\mu)].
$$

두 값이 함께 평균보다 크거나 작으면 곱이 양수가 되겠죠. 반대 방향으로 움직이면 음수가 됩니다. 다만 자기공분산의 크기는 변수의 단위에 영향을 받습니다. 원 단위와 천 원 단위의 매출을 그대로 비교하기는 어렵습니다.

자기공분산에는 $|\gamma(h)|\leq\gamma(0)$과 $\gamma(h)=\gamma(-h)$라는 성질이 있습니다. 첫 번째는 Cauchy–Schwarz 부등식으로 설명할 수 있습니다.

$$
|\operatorname{Cov}(X_t,X_{t+h})|
\leq\sqrt{\operatorname{Var}(X_t)\operatorname{Var}(X_{t+h})}
=\gamma(0).
$$

두 번째 성질은 공분산의 대칭성과 정상성을 함께 사용합니다. $\operatorname{Cov}(X_t,X_{t+h})=\operatorname{Cov}(X_{t+h},X_t)$이고, 기준 시점을 옮기면 오른쪽이 $\gamma(-h)$가 됩니다.

## 단위의 영향을 없애면 자기상관이 됩니다

분산 $\gamma(0)>0$이라고 하겠습니다. 자기공분산을 공통 분산으로 나누면 다음과 같습니다.

$$
\rho(h)=\operatorname{Cor}(X_t,X_{t+h})
=\frac{\gamma(h)}{\sqrt{\gamma(0)\gamma(0)}}
=\frac{\gamma(h)}{\gamma(0)}.
$$

이를 자기상관 함수(autocorrelation function, ACF)라고 합니다. 단위가 없어지고 범위는 -1에서 1 사이가 됩니다. $\rho(0)=1$이고, 양의 값은 같은 방향의 선형 관계를 뜻합니다. 0에 가깝다는 사실은 비선형 관계까지 없다는 뜻은 아닙니다.

## 표본 ACF는 이론 ACF와 다릅니다

우리가 가진 값은 유한한 관측 경로입니다. 다음처럼 평균을 뺀 값의 곱을 이용해 모집단 ACF를 추정합니다.

$$
\widehat{\rho}(h)=
\frac{\sum_{t=1}^{n-h}(x_t-\bar x)(x_{t+h}-\bar x)}
{\sum_{t=1}^{n}(x_t-\bar x)^2},\qquad 0\leq h<n.
$$

아래는 양의 상관이 있는 AR(1) 과정을 생성한 예입니다. 모형의 자세한 뜻은 뒤에서 배우고, 지금은 그래프의 읽는 방법에 집중해 보세요.

```r
set.seed(318)
x <- arima.sim(model = list(ar = 0.7), n = 300)
old_par <- par(mfrow = c(1, 2))
acf(x, lag.max = 20, main = "Sample ACF")
pacf(x, lag.max = 20, main = "Sample PACF")
par(old_par)
head(as.numeric(acf(x, lag.max = 5, plot = FALSE)$acf))
```

점선은 백색소음이라는 기준 아래의 근사적인 개별 시차 구간입니다. 여러 막대를 동시에 확인하므로 일부가 밖으로 나올 수 있습니다. 비정상 자료의 느린 감소나 계절 패턴도 함께 보아야 하고, 막대 몇 개만으로 차수를 자동 결정하지는 않습니다.

## PACF는 무엇을 더 구분하나요?

오늘과 그제의 값이 닮은 이유가 어제를 통해 이어지는 관계 때문일 수도 있겠죠. 편자기상관 함수(partial autocorrelation function, PACF)는 중간 시점들의 선형 영향을 제거한 뒤 남는 관계를 봅니다.

정상 AR(1) 모형에서는 이론 PACF가 시차 1 이후 0입니다. 반면 ACF는 점차 줄어듭니다. 표본에서는 이 패턴이 완벽하게 보이지 않기 때문에 모형 선택의 단서로 활용합니다.

## 자기상관의 제곱을 설명력으로 읽어도 될까요?

자기상관이 0.6이라면 제곱은 0.36입니다. **절편을 포함해 한 예측 변수로 적합한 단순 OLS 회귀**에서는 같은 자료로 계산한 표본 상관의 제곱과 R²가 같습니다. 모집단의 최적 선형 투영에서도 이에 대응하는 분산 설명 비율을 생각할 수 있습니다.

하지만 이것이 다변량 모형의 R²나 미래 자료에서의 예측 성능을 뜻하지는 않습니다. 인과효과나 비선형 관계 전체에 대한 설명 비율도 아닙니다. 어떤 모형과 평가 범위에서 쓰는 말인지 함께 밝혀야 합니다.

## 무엇을 기억하면 좋을까요?

자기공분산은 원래 단위의 관계를, 자기상관은 단위를 없앤 관계를 요약합니다. ACF와 PACF는 모형의 구조를 생각하는 출발점이지만, 그 자체가 완성된 예측 모형은 아닙니다.

다음 글에서는 현재 값이 과거의 잡음과 연결되는 [이동평균 모형]({% post_url 2026-10-27-Time-Series-MA %})을 살펴보겠습니다.

## 직접 생각해 보기와 참고 자료

1. 자료를 100배 하면 자기공분산과 자기상관은 각각 어떻게 바뀔까요?
2. ACF가 0에 가깝다고 모든 형태의 예측이 불가능하다고 말할 수 있을까요?

- [연재 목차]({{ '/time-series/' | relative_url }})
- [R: acf와 pacf](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/acf.html)

이 글은 티스토리에서 2022년 3월 18일 처음 게시한 글을 옮기고, 자기공분산의 성질과 R² 해석의 조건을 보완한 것입니다.
