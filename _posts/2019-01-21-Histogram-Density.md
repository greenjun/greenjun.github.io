---
title: "ggplot2 히스토그램과 밀도 그래프: 구간을 바꾸면 무엇이 달라질까?"
date: 2019-01-21 09:00:00 +0900
last_modified_at: 2019-01-23
categories:
  - data mining
tags:
  - R
  - ggplot2
  - EDA
  - histogram
classes: single
author_profile: false
mathjax: false
comments: true
toc: true
toc_label: "이 글의 순서"
excerpt: "같은 연비 자료의 구간 너비와 밀도 추정 설정을 바꾸며, 분포 그림이 달라지는 이유와 올바른 비교 방법을 알아봅니다."
---

> **핵심 요약** — 히스토그램의 구간과 밀도 곡선의 평활화는 그림의 인상을 바꿉니다. 하나의 설정에 의존하지 말고 여러 너비와 원자료를 함께 확인하세요.

## 막대그래프와 무엇이 다른가요?

[막대그래프]({% post_url 2018-09-21-Visualizaion-Barplot %})는 구동 방식처럼 범주별 값을 비교합니다. 히스토그램은 연비처럼 수치형인 변수를 구간으로 나누어 분포를 보여줍니다. 구간을 어떻게 정했는지가 결과의 일부가 됩니다.

예를 들어 연비 20~25인 자동차와 25~30인 자동차의 수를 세면 히스토그램입니다. 이 구간의 폭과 시작점을 바꾸면 같은 관측값으로도 봉우리와 빈틈이 다르게 보일 수 있습니다.

## 같은 데이터, 다른 구간 너비

```r
# 처음 한 번만 실행합니다.
install.packages("ggplot2")
library(ggplot2)

p_narrow <- ggplot(mpg, aes(x = hwy)) +
  geom_histogram(binwidth = 1, boundary = 0,
                 fill = "#84b09c", color = "white") +
  labs(x = "Highway fuel economy (mpg)", y = "Count", title = "Bin width: 1") +
  theme_light()

p_wide <- ggplot(mpg, aes(x = hwy)) +
  geom_histogram(binwidth = 5, boundary = 0,
                 fill = "#84b09c", color = "white") +
  labs(x = "Highway fuel economy (mpg)", y = "Count", title = "Bin width: 5") +
  theme_light()

print(p_narrow)
print(p_wide)
```

`mpg`는 ggplot2에 포함된 234개 자동차 관측 자료이고, `hwy`는 고속도로 연비입니다. 별도의 파일을 받을 필요가 없습니다.

![구간 너비 1과 5로 비교한 고속도로 연비 히스토그램](/assets/images/2019/histogram-bins.png)

너비 1에서는 세부 빈도와 빈 구간이 드러나고, 너비 5에서는 큰 흐름이 더 단순해집니다. 너비가 작다고 항상 정확한 것도, 매끄럽다고 더 신뢰할 만한 것도 아닙니다. 표본의 크기와 측정 정밀도를 함께 고려하세요.

`bins = 20`은 대략적인 구간 수를 지정하고 `binwidth = 2`는 원래 단위로 폭을 지정합니다. `boundary`는 구간 경계의 위치를 정합니다. 집단끼리 비교할 때에는 같은 폭과 경계를 사용해야 합니다.

## 개수와 밀도는 축의 뜻이 다릅니다

밀도 그래프의 y축은 관측값의 개수가 아닙니다. 연속 확률밀도에서 확률은 특정 구간 아래의 **면적**으로 해석합니다. 높이가 1보다 클 수도 있고, 특정 점에서의 높이를 그 값이 나올 확률이라고 읽으면 안 됩니다.

다음은 면적이 1이 되도록 맞춘 히스토그램에 밀도 곡선을 겹친 예입니다. `..density..`는 ggplot2 3.1 계열에서도 사용할 수 있는 계산 변수 표기입니다.

```r
ggplot(mpg, aes(x = hwy)) +
  geom_histogram(aes(y = ..density..), binwidth = 2, boundary = 0,
                 fill = "#d5e6dc", color = "white") +
  geom_density(adjust = 1, color = "#28765b", size = 1) +
  geom_rug(alpha = 0.15) +
  labs(x = "Highway fuel economy (mpg)", y = "Density") +
  theme_light()
```

최근 ggplot2에서는 위 표기에 사용 중단 안내가 나올 수 있습니다. 이 글의 예제는 구버전에서도 실행할 수 있는 문법으로 작성했습니다.

`geom_rug()`는 관측값을 축 근처의 짧은 선으로 보여줍니다. 표본이 어디에 실제로 존재하는지 곡선과 대조하기 좋습니다. 곡선이 관측 범위 밖으로 조금 이어져도 그곳에 관측값이 있었다는 뜻은 아닙니다.

## 밀도 곡선의 매끄러움 조절하기

```r
ggplot(mpg, aes(x = hwy)) +
  geom_density(aes(color = "adjust = 0.5"), adjust = 0.5, size = 0.8) +
  geom_density(aes(color = "adjust = 1"), adjust = 1, size = 0.8) +
  geom_density(aes(color = "adjust = 2"), adjust = 2, size = 0.8) +
  labs(x = "Highway fuel economy (mpg)", y = "Density", color = "Smoothing") +
  theme_light()
```

`adjust`는 기본 대역폭에 곱하는 값입니다. 작게 설정하면 굴곡이 늘어나고, 크게 설정하면 세부 특징이 뭉개질 수 있습니다. 작은 봉우리를 발견했다면 실제 하위 집단의 흔적인지, 표본 변동이나 평활화의 결과인지 확인하세요.

## 표본 수가 다른 집단 비교하기

```r
table(mpg$drv)

ggplot(mpg, aes(x = hwy)) +
  geom_histogram(aes(y = ..density..), binwidth = 2, boundary = 0,
                 fill = "#84b09c", color = "white") +
  facet_wrap(~ drv, ncol = 1) +
  labs(x = "Highway fuel economy (mpg)", y = "Density") +
  theme_light()
```

구동 방식별 표본 수는 사륜 103개, 전륜 106개, 후륜 25개입니다. 밀도 축으로 바꾸면 집단별 분포 모양을 비교하기 쉬워지지만 표본 수의 차이는 숨겨집니다. 그림과 함께 `table()`의 결과도 제시하세요. `facet_wrap()`의 축을 자유롭게 바꾸면 집단별 모양이 과장되거나 비슷하게 보일 수 있으므로 여기서는 공통 축을 유지합니다.

[바이올린 플롯]({% post_url 2018-09-27-Visualizaion-Violinplot %})도 밀도 추정을 이용합니다. 그 폭을 읽을 때 역시 평활화와 표본 수를 고려해야 합니다.

## 직접 해보기

1. `binwidth = 2`에서 `boundary`를 0과 1로 바꿔 봉우리의 위치가 어떻게 보이는지 비교하세요.
2. `hwy` 대신 도심 연비 `cty`를 사용해 두 분포의 범위와 치우침을 설명하세요.
3. 표본이 25개인 후륜 집단에서 `adjust = 0.5`로 보이는 세부 굴곡을 그대로 해석해도 될까요?

## 이어서 읽기와 참고 자료

- [상관계수가 같아도 산점도는 다르다]({% post_url 2019-02-04-Correlation-Scatterplot %})
- [ggplot2: geom_histogram](https://ggplot2.tidyverse.org/reference/geom_histogram.html)
- [ggplot2: geom_density](https://ggplot2.tidyverse.org/reference/geom_density.html)
