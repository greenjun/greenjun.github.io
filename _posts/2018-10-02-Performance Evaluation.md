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
세부 내용은 위키에 검색하시면 됩니다.

* MAE(Mean absoulute error) - 오차(실제값과 예측값)에 전부 절댓값을 취한 후 평균을 구한 것
* AE(Average error) - 오차의 평균
* MAPE(Mean absolute percentage error) - 실제값 중에서 오차가 차지하는 비에 절댓값을 취한 후 평균을 구하여 100을 곱한것
* RMSE(Root-mean-square deviation) - 오차에 제곱을 취한것의 평균을 구한 후 루트를 취한 것
* SSE - 오차의 제곱의 합

### training, validation, test data
일반적으로 하나의 데이터 셋을 여러가지 용도에 맞게 나누게 됩니다.

기본적으로 train data로 모델을 만들고

validation data로 모델 검증을 하게 됩니다. 이때 모델은 이 validation data로 배우는 것이 아니라 parameter를 수정하는데 사용하게 됩니다. 간접적으로는 모델에 영향을 주긴하지만 이 모델로부터 배우는 것은 아닙니다.

모델을 평가할 때 사용하는 것이 바로  test data입니다. 모델이 완전히 만들어진 후 오직 한번만 사용됩니다. 

### Ratio of splited datasets
아마도 하나의 데이터 셋을 나눈다고 말했기때문에 어떤 비율로 데이터를 나누는 게 좋을지 고민할것이라고 생각이듭니다. 여기서 고민해야 할 것은 두가지가 있습니다. 

First, 데이터의 총 샘플수

second, 만들고 있는 모델

만약에 여러분들이 만들고 있는 모델이 엄청나게 많은 train data를 필요로 하고 parameter tuning이 적게 필요하다면 아마도 데이터 비율이 train data에 집중이 되고 validation에는 데이터가 적을 것입니다. 반대의 경우도 마찬가지입니다. 만약에 많은 tuning해야 될 많은 parameters가 있다면 validation 데이터가 많이 필요하겠죠. cross-validation을 검색해보면 이와 관련된 아이디어를 얻을 수 있을겁니다. 즉, 비율에 관한 정확한 정답을 없기에 여러분들이 많은 모델을 만들어 본 후에 많은 use-case가 생긴다면 비율에 관해서 know-how가 생길 것 입니다.

<a href="http://imgur.com/3PVaEXE"><img src="https://i.stack.imgur.com/1fXzJ.png" width="400px" title="source: imgur.com" /></a>

### Separation of Records
* “High separation of records” means that using predictor variables attains low error

* “Low separation of records” means that using predictor variables does not improve much on naïve rule

### Threshold logic unit

<a href="http://www.aistudy.co.kr/ai/ains/threshold_unit.gif" width="400px" title="source: aistudy.co.kr" /></a>

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
* [About train, validation, test data](https://towardsdatascience.com/train-validation-and-test-sets-72cb40cba9e7){: .btn .btn--info}
* www.washburn.edu/faculty/boncella/XLMiner/Lecture%204%20-%20Model%20Evaluation.ppt
$${ c }_{ 1 }=5,\quad Y=\begin{pmatrix} { 1 } \\ { 2 } \\ { 3 } \end{pmatrix}$$
>
### 용어정리 
* validation, 
