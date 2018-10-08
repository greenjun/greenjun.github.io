---
title:  "모델 성능 평가(Performance Evaluations)"
categories:
  - data mining
tags:
  - Performance
  - R
  - Evaluations
  
toc: true
toc_label: "My Table of Contents"
---
* 내용은 지속적으로 업데이트 될것입니다.
* 최대한 수식을 배제하고 전체적인 흐름을 익히게 했습니다.
* 따라서 궁금하신 점은 메일이나 검색을 활용해주세요.

## Introduction
한개의 데이터 셋에 대해서도 사용할 수 있는 모델의 수가 굉장히 많습니다. 따라서 모델을 만든 후에 어떤 모델이 좋은 지 확인하는 과정이 필요합니다. 그래서 모델을 평가하는 성과분석(performance analysis)를 하게 됩니다. 

### Typers of output
모델을 통해 나온는 결과는 다음과 같이 세가지가 있습니다.

* 일반적인 회귀분석의 결과로 나오는 Numerical value
* 일반적인 의사결정나무의 결과로 나오는 Class
* 그리고 Class가 될 확률로 나오는 Tendancy

### Misclassification error
기본적으로 에러는 맞는데 틀리게 분류하였거나,틀렸는데 맞게 분류한것을 말합니다. 용어로는 error, error rate를 쓰게 됩니다.

### Benchmark
* 분류 벤치마크 - 가장 빈도가 많은 class로 모든 값을 분류해 버리는 것
* 예측 벤치마크 - 학습 데이터들의 평균 값을 예측 값으로 사용하는 것 

다음과 같은 경우를 생각해봅시다. 여러분들이 암을 예측하는 모델을 만들었다고 합시다. 이 모델은 0이면 음성, 1이면 양성으로 분류합니다.

검사한 사람들 10,000명 중에 양성인 사람들은 100명이라고 합시다. 

이 경우 이 사람들에 대해서 10,000을 모두 음성이라고 판단을 내리는 모델에 대해서 단순히  error rate로 측정을 하게되면 정확도가 99%가 됩니다.

단순히 모두 음성이라고 했을 뿐인데 말이죠. 그래서 일반적으로 모델을 만들었을때 단순히 정확도만으로 평가하는 것은 위헙합니다.

###  Error measure for prediction

e = 실제값 - 예측값 = yi - xi

* MAE(Mean absoulute error) - 1/𝑛 * ∑|𝑒𝑖| 
* AE(Average error) - 1/𝑛 * ∑𝑒𝑖
* MAPE(Mean absolute percentage error) - 1/𝑛 * ∑|𝑒𝑖/𝑦𝑖| * 100
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

>
### Reference 
* [ggplot2_essentials](http://www.sthda.com/english/wiki/ggplot2-violin-plot-quick-start-guide-r-software-and-data-visualization){: .btn .btn--info}

>
### 용어정리 
* boxplot, violin plot
