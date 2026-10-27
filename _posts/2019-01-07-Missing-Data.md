---
title: "R 결측값 처리: NA를 지우기 전에 확인할 것"
date: 2019-01-07 09:00:00 +0900
last_modified_at: 2019-01-09
categories:
  - data mining
tags:
  - R
  - EDA
  - missing data
classes: single
author_profile: false
mathjax: false
comments: true
toc: true
toc_label: "이 글의 순서"
excerpt: "결측 비율과 집단별 누락 패턴을 확인하고, 삭제와 평균 대체가 분석 결과를 어떻게 바꾸는지 R로 비교합니다."
---

> **핵심 요약** — 결측값 처리는 빈칸을 채우는 작업에 그치지 않습니다. 누가, 어떤 변수에서, 왜 빠졌는지 확인하고 처리 전후의 표본과 결과를 비교해야 합니다.

## NA가 있다는 이유만으로 행을 지워도 될까요?

[EDA]({% post_url 2018-09-19-EDA %})에서 결측값을 찾았다면 다음은 처리 방법을 정할 차례입니다. 설문에서 소득 응답을 하지 않은 사람과 센서 고장으로 값이 기록되지 않은 사례는 모두 `NA`로 표시될 수 있지만, 발생 과정과 분석상의 의미는 다릅니다.

R에서 `NA`는 관측되지 않은 값입니다. `0`은 관측한 값이고, 문자 `"NA"`는 문자열이므로 구분해야 합니다. 빈 문자열과 `-999` 같은 코드는 자료 설명을 확인한 뒤 결측값으로 바꿔야 합니다.

## 작은 데이터로 결측 현황 확인하기

아래 예제는 설명을 위해 만든 가상 자료입니다. 별도 패키지 없이 순서대로 실행할 수 있습니다.

```r
survey <- data.frame(
  id = 1:8,
  group = rep(c("A", "B"), each = 4),
  age = c(25, 30, NA, 35, 40, NA, 50, 45),
  income = c(200, 220, NA, 260, 400, NA, NA, 500)
)

data.frame(
  variable = names(survey),
  missing_n = colSums(is.na(survey)),
  missing_pct = 100 * colMeans(is.na(survey))
)
sum(complete.cases(survey))
```

나이는 2개, 소득은 3개가 빠져 있습니다. 완전한 행은 5개입니다. 두 변수에서 누락된 행이 일부 겹치므로 결측 개수를 더한 5개 행이 삭제되는 것은 아닙니다.

`survey$age == NA`로는 결측 여부를 판별할 수 없습니다. `is.na(survey$age)`를 사용하세요. 전체 결측률만 보면 집단 간 차이를 놓칠 수 있으므로 다음 표도 확인합니다.

```r
aggregate(is.na(income) ~ group, data = survey, FUN = mean)
table(survey$group, is.na(survey$income))
```

A의 소득 누락률은 25%, B는 50%입니다. 이 패턴만으로 누락 원인을 확정할 수는 없지만, 어느 집단의 정보가 더 많이 빠졌는지 알 수 있습니다.

## 누락 과정에 따라 달라지는 가정

| 구분 | 의미 | 생각해 볼 예 |
| --- | --- | --- |
| MCAR | 누락이 관측·미관측 값과 무관 | 무작위로 일부 설문지가 분실됨 |
| MAR | 관측된 변수를 조건으로 하면 누락이 미관측 값에 의존하지 않음 | 관측된 연령을 고려하면 소득 누락이 소득 자체와 무관함 |
| MNAR | 관측된 변수를 고려해도 누락이 미관측 값에 의존함 | 같은 연령 안에서도 소득이 높을수록 응답을 피함 |

MAR와 MNAR를 관측 자료만으로 완전히 구별하기는 어렵습니다. 수집 과정, 응답 안내, 장비 기록 등 자료 밖의 정보가 필요합니다. 결측률이 낮다고 해서 편향도 반드시 작은 것은 아닙니다.

## 삭제와 평균 대체를 비교하기

```r
complete_data <- survey[complete.cases(survey), ]
observed_income <- survey$income[!is.na(survey$income)]

filled_data <- survey
filled_data$income[is.na(filled_data$income)] <- mean(observed_income)

comparison <- data.frame(
  method = c("Observed income", "Complete rows", "Mean imputation"),
  n = c(length(observed_income), nrow(complete_data), nrow(filled_data)),
  mean_income = c(mean(observed_income), mean(complete_data$income),
                  mean(filled_data$income)),
  sd_income = c(sd(observed_income), sd(complete_data$income),
                sd(filled_data$income))
)
round(comparison[, -1], 2)
comparison$method

boxplot(observed_income, filled_data$income,
        names = c("Observed", "Mean imputed"),
        ylab = "Income (10,000 KRW)", col = c("#86b5a1", "#e5bb80"))
```

관측된 소득은 평균 316, 표준편차 약 129.15입니다. 평균 대체 후 평균은 316으로 같지만 표준편차는 약 97.63으로 줄어듭니다. **평균을 보존했다는 이유로 원래의 정보가 복원된 것은 아닙니다.**

![평균 대체 전후 소득 분포 비교](/assets/images/2019/missing-data.png)

이 자료에서는 소득이 있는 5개 행이 다른 변수까지 완전한 5개 행과 우연히 같습니다. 실제 자료에서는 분석에 필요하지 않은 열까지 포함해 `na.omit()`을 적용하면 불필요하게 표본을 잃을 수 있습니다. 분석에 쓰는 열과 삭제 기준을 먼저 정하세요.

## 실무에서는 어떻게 선택하나요?

단순 평균 대체는 비교 기준으로는 유용하지만 분산과 변수 관계를 왜곡하고 불확실성을 과소평가할 수 있습니다. 집단별 대체 역시 집단 안의 차이를 복원하지는 못합니다. 통계적 추론이 목적이라면 다중 대체와 대체 모형의 가정을 검토하고, 여러 처리 방법에서 결론이 유지되는지 비교하세요.

예측 모델에서는 데이터를 먼저 나눕니다. 학습 데이터로 대체값을 계산하고, 검증·테스트 데이터에는 그 값을 그대로 적용해야 합니다. 테스트 데이터의 평균까지 쓰면 [데이터 누수]({% post_url 2019-03-04-Cross-Validation-Leakage %})가 생깁니다. 정답 변수의 누락은 입력 변수와 구분해서 처리해야 합니다.

분석 결과에는 원래 표본 수, 변수별 누락 수, 제외된 사례 수, 사용한 대체 방법과 가정을 함께 적습니다. “결측치를 처리했다”는 문장만으로는 분석 과정을 재현할 수 없습니다.

## 직접 해보기

1. `income`의 결측값을 중앙값으로 대체하고 평균·표준편차를 다시 계산하세요.
2. 삭제 전후 A와 B의 인원 비율을 비교하세요.
3. B 집단의 누락된 소득이 관측값보다 컸다면, 단순 평균 대체가 전체 평균을 어느 방향으로 움직일지 생각해 보세요.

## 이어서 읽기와 참고 자료

- [dplyr로 분석용 데이터 만들기]({% post_url 2019-01-28-Dplyr-Data-Preparation %})
- [이상치는 언제 제거해야 할까?]({% post_url 2019-02-11-Outliers %})
- [R: NA](https://stat.ethz.ch/R-manual/R-devel/library/base/html/NA.html)
- [R: complete.cases](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/complete.cases.html)

예제의 소득은 가상 값이며 단위는 만 원입니다. 사용하는 R 버전은 `sessionInfo()`로 함께 기록하세요.
