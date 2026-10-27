---
title: "선형회귀 처음부터 끝까지: 계수보다 먼저 확인할 것"
date: 2019-02-25 09:00:00 +0900
last_modified_at: 2019-02-27
categories:
  - data mining
tags:
  - R
  - regression
  - model diagnostics
classes: single
author_profile: false
mathjax: true
comments: true
toc: true
toc_label: "이 글의 순서"
excerpt: "mtcars로 연비 회귀모형을 만들고 계수의 단위, 잔차·영향점 진단, 신뢰구간과 예측구간, 테스트 오차를 확인합니다."
---

자동차 무게를 알면 연비를 예측할 수 있을까요? 관련은 있을 수 있지만, 그림에서 보이는 관계를 식으로 적었다고 모든 차이가 설명되지는 않겠죠. 회귀모형(regression model)은 관계와 남은 오차를 함께 생각하는 방법입니다.

계수에 단위를 붙이는 것에서 시작해 잔차와 영향점을 확인하고, 새 자동차에서의 예측 오차까지 순서대로 살펴보겠습니다.

## 설명할 것인가요, 예측할 것인가요?

자동차 무게와 출력으로 연비를 예측해 보겠습니다. “무게가 연비를 얼마나 바꾸는가?”라는 인과 질문과 “이 차의 연비를 얼마나 잘 예측하는가?”는 다릅니다. 여기서는 후자를 위한 작은 학습 예제로 접근합니다.

R의 `mtcars`는 1974년 자동차 32종의 자료입니다. 최신 자동차 전체를 대표하는 무작위 표본이 아니므로 일반화에는 한계가 있습니다. `mpg`는 연비, `wt`는 무게(1,000파운드), `hp`는 마력입니다.

## 학습과 최종 평가는 어떻게 나눌까요?

```r
data(mtcars)
set.seed(225)
train_id <- sample(seq_len(nrow(mtcars)), size = 24)
train <- mtcars[train_id, ]
test <- mtcars[-train_id, ]

fit <- lm(mpg ~ wt + hp, data = train)
summary(fit)
confint(fit)
```

예제는 원자료에서 결측값이 없는 변수를 사용합니다. 실제 자료라면 [결측 처리]({% post_url 2019-01-07-Missing-Data %})와 변환 기준도 학습 자료에서 정해야 합니다. 이 작은 표본에서 한 번 나눈 결과는 불안정할 수 있으므로 모델 선택에는 [교차검증]({% post_url 2019-03-04-Cross-Validation-Leakage %})을 사용할 수 있습니다.

## 회귀계수에 단위를 붙이면 무엇이 보일까요?

이번 예제의 식을 먼저 적어 볼까요?

$$
\mathrm{mpg}_i=\beta_0+\beta_w\mathrm{wt}_i+\beta_h\mathrm{hp}_i+\varepsilon_i.
$$

계수는 식에 넣은 다른 변수를 고정했을 때의 관계를 나타냅니다. 오차 ε에는 관측하지 않은 차이도 남습니다. 따라서 조건부 관계를 적합하는 것과 인과효과를 식별하는 것을 구분해야 합니다.

`wt` 계수는 모형 안에서 `hp`를 고정했을 때 무게가 1,000파운드 늘어나는 경우의 평균 연비 차이입니다. 무게 1kg의 효과로 읽으면 틀립니다. `hp` 계수는 무게를 고정했을 때 출력 1마력에 대응하는 차이입니다.

“다른 조건이 같다”는 말은 **모형에 포함한 변수의 조건부 관계**를 의미합니다. 관측하지 않은 설계 특성이나 차종의 영향을 제거했다는 뜻은 아닙니다. 절편은 무게와 출력이 모두 0일 때의 값이므로 실제 자동차로 해석하기 어렵습니다.

회귀계수의 p-value는 해당 모형과 오차 가정 아래에서 계산합니다. 작은 p-value가 큰 예측 개선이나 인과효과를 보장하지는 않습니다. 계수의 크기·단위·신뢰구간을 함께 보세요.

## 잔차 그래프에는 어떤 규칙이 남을까요?

```r
old_par <- par(mfrow = c(2, 2))
plot(fit)
par(old_par)
```

![학습 자료에 적합한 선형회귀의 네 가지 진단 그래프](/assets/images/2019/regression-diagnostics.png)

| 그래프 | 주로 확인하는 것 | 발견했을 때의 다음 질문 |
| --- | --- | --- |
| Residuals vs Fitted | 곡선 등 체계적인 잔차 패턴 | 비선형 항이나 누락된 구조가 있는가? |
| Normal Q-Q | 잔차의 꼬리와 정규근사 | 작은 표본의 구간·검정이 민감하지 않은가? |
| Scale-Location | 예측 수준에 따른 퍼짐 변화 | 이분산성이 있는가? |
| Residuals vs Leverage | 독특한 x와 큰 영향력 | 특정 차량이 계수를 지배하는가? |

잔차는 관측값에서 적합값을 뺀 값입니다. 오차의 독립성은 그림만으로 확정할 수 없으므로 시간·군집 등 수집 구조를 확인해야 합니다. 정규성은 주로 작은 표본에서의 고전적인 추론과 관련되며, y 자체가 정규분포여야 한다는 조건은 아닙니다.

```r
influence_table <- data.frame(
  car = rownames(train),
  leverage = hatvalues(fit),
  cooks_distance = cooks.distance(fit)
)
head(influence_table[order(-influence_table$cooks_distance), ], 3)
```

Cook's distance가 큰 점도 자동으로 삭제하지 않습니다. 입력·측정 오류를 검토하고, 유효한 사례라면 포함·제외 결과를 비교하는 [민감도 분석]({% post_url 2019-02-11-Outliers %})을 할 수 있습니다.

## 평균의 신뢰구간과 새 차의 예측구간은 같을까요?

```r
new_car <- data.frame(wt = 3.0, hp = 110)
predict(fit, newdata = new_car, interval = "confidence")
predict(fit, newdata = new_car, interval = "prediction")

range(train$wt)
range(train$hp)
```

신뢰구간은 이 조건에서의 평균 연비 추정을 다룹니다. 예측구간은 이 조건에 해당하는 새 차 한 대의 연비를 다루므로 관측 수준의 변동까지 포함해 더 넓습니다. 둘은 대체할 수 없습니다.

입력값 각각이 관측 범위 안에 있더라도 그 **조합**이 자료에서 드물 수 있습니다. 범위 밖 예측인 외삽은 더 주의해야 하며, 수치가 계산된다고 신뢰할 수 있다는 뜻은 아닙니다.

## 새 자료에서는 단순 기준보다 나을까요?

모형을 고쳤다면 테스트 결과를 반복해서 확인하지 말고 학습 자료 안의 검증 절차를 사용해야 합니다. 아래는 모형 구성을 정한 뒤 한 번 평가하는 단계입니다.

```r
prediction <- predict(fit, newdata = test)
baseline <- rep(mean(train$mpg), nrow(test))
rmse <- function(actual, predicted) sqrt(mean((actual - predicted)^2))
mae <- function(actual, predicted) mean(abs(actual - predicted))

data.frame(
  model = c("Train mean", "Linear regression"),
  RMSE = c(rmse(test$mpg, baseline), rmse(test$mpg, prediction)),
  MAE = c(mae(test$mpg, baseline), mae(test$mpg, prediction))
)

plot(test$mpg, prediction, pch = 19, col = "#28765b",
     xlab = "Observed mpg", ylab = "Predicted mpg")
abline(0, 1, lty = 2, col = "gray50")
```

RMSE와 MAE의 단위는 mpg입니다. 훈련 R²가 높다는 사실만으로 새 자료의 오차를 알 수 없으며, 기준 모형보다 얼마나 나아졌는지 확인해야 합니다. 단 8대에 대한 테스트 결과를 전체 환경의 확정적인 성능으로 보고해서도 안 됩니다.

## 무엇을 연결해서 기억하면 좋을까요?

회귀식과 잔차를 함께 읽으면 계수만 볼 때 놓친 문제를 확인할 수 있습니다. 반복해 후보를 비교하려면 [교차검증]({% post_url 2019-03-04-Cross-Validation-Leakage %})으로 평가의 역할도 나누어 보겠습니다.

## 직접 해볼까요?

1. 테스트 자료를 보지 않고 학습 자료 안에서 `mpg ~ wt`와 `mpg ~ wt + hp`를 비교할 방법을 설계하세요.
2. Cook's distance가 가장 큰 차량을 학습 자료에서 제외했을 때 계수와 예측이 얼마나 변하는지 확인해 보세요.
3. `wt = 10`인 자동차를 예측하는 것이 왜 위험한지 자료의 범위와 연결해 설명하세요.

## 이어서 읽기와 참고 자료

- [모델 평가 지표]({% post_url 2018-10-02-Performance Evaluation %})
- [교차검증과 데이터 누수]({% post_url 2019-03-04-Cross-Validation-Leakage %})
- [R: lm](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/lm.html)
- [R: predict.lm](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/predict.lm.html)
