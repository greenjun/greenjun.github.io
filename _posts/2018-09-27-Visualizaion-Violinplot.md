---
title: "R 시각화: 바이올린 플롯으로 분포 비교하기"
categories:
  - data mining
tags:
  - Visualization
  - EDA
  - ggplot
  - R
  - violinplot
  
classes: single
author_profile: false
mathjax: false
comments: true
toc: true
toc_label: "이 글의 순서"
excerpt: "바이올린 플롯, 상자그림, 실제 관측값을 함께 그려 집단별 분포를 해석하는 방법을 알아봅니다."
last_modified_at: 2026-10-26
---

> **핵심 요약** — 바이올린 플롯은 값이 모인 구간을 폭으로 표현합니다. 상자그림과 실제 관측값을 함께 보면 집단의 중심, 퍼짐, 표본 수를 이해하기 쉽습니다.

## 언제 사용하나요?

집단별 평균이 같아도 분포는 다를 수 있습니다. 바이올린 플롯(Violin plot)은 집단마다 값이 어디에 모여 있는지 비교할 때 유용합니다.

| 도구 | 보여주는 것 | 주의할 점 |
| --- | --- | --- |
| 상자그림 | 중앙값, 사분위 범위, 이상치 후보 | 분포의 세부 모양은 잘 드러나지 않습니다. |
| 바이올린 플롯 | 밀도를 추정한 분포 모양 | 평활화 설정과 표본 수에 영향을 받습니다. |
| 관측값 점 | 실제 값과 관측값 수 | 데이터가 많으면 점이 겹칠 수 있습니다. |

바이올린 플롯이 항상 더 좋은 것은 아닙니다. 특히 표본이 적으면 매끈한 곡선이 실제 데이터보다 많은 정보를 암시할 수 있으므로 점을 함께 보여주세요.

## 데이터 준비하기

```r
# 처음 사용할 때만 설치합니다.
install.packages("ggplot2")
library(ggplot2)
```

ggplot2의 `mpg` 데이터에서 `drv`는 구동 방식(`f` 전륜, `r` 후륜, `4` 사륜), `hwy`는 고속도로 연비(mpg)입니다. ggplot2의 기본 문법은 [막대그래프 글]({% post_url 2018-09-21-Visualizaion-Barplot %})을 참고하세요.

## 바이올린 플롯과 상자그림 비교하기

```r
ggplot(mpg, aes(x = drv, y = hwy)) +
  geom_violin() +
  labs(x = "구동 방식", y = "고속도로 연비(mpg)") +
  theme_light()

ggplot(mpg, aes(x = drv, y = hwy)) +
  geom_boxplot() +
  labs(x = "구동 방식", y = "고속도로 연비(mpg)") +
  theme_light()
```

![구동 방식별 고속도로 연비의 바이올린 플롯](/assets/images/violinplot1.png)

![같은 데이터를 나타낸 상자그림](/assets/images/boxplot1.png)

바이올린이 넓은 구간은 그 주변에 관측값이 많이 모여 있다는 뜻입니다. 기본 설정에서는 집단마다 면적을 맞추므로, 바이올린의 전체 크기만으로 표본 수를 비교하면 안 됩니다.

## 중앙값과 평균 함께 표시하기

좁은 상자그림을 겹쳐 중앙값과 사분위 범위를 보여주고, 평균은 별도의 점으로 표시합니다.

```r
ggplot(mpg, aes(x = drv, y = hwy)) +
  geom_violin(fill = "#dcece5") +
  geom_boxplot(width = 0.1) +
  stat_summary(fun = mean, geom = "point", color = "#b34e30", size = 2) +
  labs(x = "구동 방식", y = "고속도로 연비(mpg)") +
  theme_light()
```

![바이올린 플롯 안에 상자그림과 평균을 겹친 예](/assets/images/violinplot2.png)

상자 안의 선은 중앙값이고, 별도로 추가한 점은 평균입니다. 평균과 중앙값의 차이가 크다면 분포의 치우침이나 극단적인 값을 살펴보세요.

## 실제 관측값을 점으로 표시하기

`geom_jitter()`는 겹치는 점을 조금씩 흩어 보여줍니다. 값이 바뀐 것처럼 보이지 않도록 y축 방향의 흔들림은 0으로 둡니다.

```r
ggplot(mpg, aes(x = drv, y = hwy)) +
  geom_violin(fill = "#dcece5") +
  geom_boxplot(width = 0.1, outlier.shape = NA) +
  geom_jitter(
    width = 0.12, height = 0,
    alpha = 0.45, size = 1.5
  ) +
  stat_summary(fun = mean, geom = "point", color = "#b34e30", size = 2) +
  labs(title = "구동 방식별 연비 분포", x = "구동 방식", y = "고속도로 연비(mpg)") +
  theme_light()
```

`outlier.shape = NA`는 상자그림의 이상치 점만 숨깁니다. 모든 관측값을 jitter로 다시 표시하므로 동일한 점을 두 번 그리는 일을 줄입니다.

![실제 관측값을 함께 표시한 바이올린 플롯의 예](/assets/images/violinplot3.png)

## 해석 전에 확인할 것

1. 집단별 표본 수가 충분한지 확인합니다.
2. 축의 범위와 단위가 같은지 확인합니다.
3. 폭은 밀도 추정치라는 점을 기억합니다. 개별 값은 점으로 확인하세요.
4. 분포 모양만으로 집단 차이의 통계적 유의성을 단정하지 않습니다.

## 참고 자료

- [ggplot2: geom_violin()](https://ggplot2.tidyverse.org/reference/geom_violin.html)
- [ggplot2: stat_summary()](https://ggplot2.tidyverse.org/reference/stat_summary.html)
- [ggplot2: geom_jitter()](https://ggplot2.tidyverse.org/reference/geom_jitter.html)

그림은 기존 예시입니다. 코드의 색상, 글꼴, ggplot2 버전에 따라 실행 화면은 달라질 수 있습니다.
