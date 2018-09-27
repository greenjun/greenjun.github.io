---
title:  "시각화(Visualization)-Violinplot"
categories:
  - data mining
tags:
  - Visualization
  - EDA
  - ggplot
  - R
  - violinplot
  
toc: true
toc_label: "My Table of Contents"
---
* 내용은 지속적으로 업데이트 될것입니다.
* 최대한 수식을 배제하고 전체적인 흐름을 익히게 했습니다.
* 따라서 궁금하신 점은 메일이나 검색을 활용해주세요.

## Introduction
이전 포스팅 [탐색적자료분석(EDA)](https://greenjun.github.io/data%20mining/EDA/) 에 이어서
데이터를 시각화하는 방법에 대해 알아보겠습니다
이 글에서 이해가 안되시는 분은 이전 포스팅을 참고해주세요
전에도 말했다시피  EDA하는 방법에는 크게 4가지가 있다고 했고, 
이번 글은 그 중에서 graphic으로 표현하는 것은 포스팅 하겠습니다.

### 참고자료

[ggplot2 공식 메뉴얼](https://cloud.r-project.org/web/packages/ggplot2/ggplot2.pdf)

[ggplot2 개발자 Hadley Wickham의 paper](http://byrneslab.net/classes/biol607/readings/wickham_layered-grammar.pdf)


## ggplot2
수많은 책과 포스팅을 보면 시각화하는 수많은 패키지와 프로그램이 있지만

여기서 소개해드릴 것은 R에서 사용하는  **ggplot2** 입니다.

제가 시각화하는 책과 여러가지 프로젝트를 보았지만 ggplot2 만큼 많은 것을 커버할수있고 

활용하는 패키지는 없는 것 같았습니다.

그래서 만약 데이터 시각화에 관심이 있으시고 R을 사용하신다면 ggplot2만 익혀도 표현하고자 하는 

수 많은 생각을 시각화 하는데 도움이 될 것입니다.


### ggplot2 구성 방식
* 레이어를 하나씩 쌓아가면서 그림을 그리는 방식
* 이때 레이어를 연결시키는 방법이 `+` 라는 기호를 사용하여 연결

ex)
```R
ggplot(data = mpg, aes(x = displ, y = hwy))+  #배경레이어 - 이용할 데이터와 축을 명시한다.
  geom_point()+                               #그래프레이어 - 배경레이어 위에 어떤 그래프를 그릴지 선택한다.
  xlim(3, 6)+                                 #기타 레이어 - 그외의 축범위 조정 외 수많은 기능들을 실행한다.
  ylim(10,30)``
```

### 설치
```R
install.packages("ggplot2")
install.packages("ggplot2")
library(ggplot2) #시각화 
library(dplyr)   #데이터 프레임 조작
```
> 모든 예제는 ggplot2 패키지 내의 mpg 데이터를 이용하겠습니다. 데이터 구성은 다음과 같습니다.

11 variables, 234 row, dataframe

variable이름 - 설명

manufacturer

model - model name

displ - engine displacement, in litres

year - year of manufacture

cyl - number of cylinders

trans - type of transmission

drv - f = front-wheel drive, r = rear wheel drive, 4 = 4wd

cty - city miles per gallon

hwy - highway miles per gallon

fl - fuel type

class - "type" of car

## Univariate graphical EDA
* [Visualizaion-Barplot](https://greenjun.github.io/data%20mining/Visualizaion-Barplot/)

### Violinplot
* central tendency, spread, modality, shape and outliers
* continous data distribution
* boxplot보다 많은 정보를 나타낼 수 있고 더 많은 정보를 보여주므로 boxplot보다는 violinplot을 사용하는것을 권합니다.

![boxplotexample](/assets/images/boxplotexample.PNG)

기본적으로 boxplot의 역할은 다음과 같이 median과 Q1, Q3을 표시함으로써 outlier의 존재성을 밝혀줍니다.

**먼저 mpg 데이터에 포함되어 있는 hwy연비의 분포를 확인하여 봅시다.**

```R
ggplot(mpg, aes(x = drv, y = hwy)) +
  geom_violin()
  
ggplot(mpg, aes(x = drv, y = hwy)) +
  geom_boxplot()
```

![violinplot1](/assets/images/violinplot1.png)

![boxplot1](/assets/images/boxplot1.png)


`기존의 boxplot과 비교해 보면 데이터의 분포 모형까지도 함께 알 수 있습니다.`

**이제 기존의 boxplot처럼 median과 mean 등의 summary statistics를 표시해봅시다.**

```R
ggplot(mpg, aes(x = drv, y = hwy)) +
  geom_violin() +
  geom_boxplot(width = 0.1) +
  stat_summary(fun.y = mean, geom = "point", color = 2, size = 2))
```

![violinplot2](/assets/images/violinplot2.png)

`stat_summary 함수를 통해 mean, median을 지정하여 plot상에 점을 찍어서 통계량을 알 수 있습니다`

`geom_boxplot()함수를 추가함으로써 violinplot 내에 boxplot을 표시함으로써 많은 정보를 포함 할 수 있습니다`

**그림안에 실제 hwy에 해당되는 케이스를 점을 찍어봅시다**

```R
ggplot(mpg, aes(x = drv, y = hwy)) +
  geom_violin() +
  geom_boxplot(width = 0.1, color = "blue") +
  stat_summary(fun.y = mean, geom = "point", color = 2, size = 2) +
  geom_jitter(shape=16, position=position_jitter(0.2))
```

![violinplot3](/assets/images/violinplot3.png)

`실제 데이터의 점을 찍음으로써 데이터가 어떻게 분포하는지 확인가능합니다`

**그래프 안의 색을 채우는 것은 fill함수, 그래프의 선을 바꾸는 것은 color함수를 통해 가능합니다**

```R
ggplot(mpg, aes(x = drv, y = hwy, fill = drv, color = drv)) +
  geom_violin() +
  scale_color_manual(values=c("#999999", "#E69F00", "#56B4E9")) +
  scale_fill_brewer(palette="Dark2")
```

`scale_color_manual() : to use custom colors`

`scale_color_brewer() : to use color palettes from RColorBrewer package`

`scale_color_grey() : to use grey color palettes`

> 제목과 x축 y축 이름을 바꾸고 범례 위치를 바꾸는 참고 코드

```R
ggplot(mpg, aes(x = drv, y = hwy, fill = drv)) +
  geom_violin(trim = T) +
  labs(main = "drv 별 연비 분포",
       x = "구동방식",
       y = "연비") +
  theme(legend.position = "top")
```

### Quantile-normal plots(QQ-plot)
* 샘플이 가정한 분포와 얼마나 일치하는지 여부
* detect left or right skew
* detect positive or negative kurtosis
* detect bimodality

### Reference 
* [ggplot2_essentials](#http://www.sthda.com/english/wiki/ggplot2-violin-plot-quick-start-guide-r-software-and-data-visualization){: .btn .btn--success}

> 용어정리 
* boxplot, violin plot
