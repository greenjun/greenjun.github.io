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
그림에서 보는 것처럼 일정 한계값을 넘어서면 1, 아니면 0으로 분류하는 것이 TLU이고, 이를 이용하여 AND, OR 등을 만들 수 있습니다.

![Threshold logic unit](http://present5.com/presentation/f38da7bb0a544eef73457e93f6811f3f/image-2.jpg){: width="400" height="400"}

### Linearly separable functions
여기에서는 일반적으로 AND나 OR 같은 경우는 한개의 선으로 구별되어지지만, XOR의 경우 어떤 경우에도 하나의 선으로 구별되지 않습니다. 이때, 하나의 선으로 구별된다면 linearly separable function이라고 말합니다.

![Lineary separable functions](https://cdn-images-1.medium.com/max/1600/1*wEomny4n9fzKL7X9TABWjw.png){: width="400" height="400"}

### Cutoff
실제로 데이털르 예측하게 되면 거의 대부분의 데이터마이닝 알고리즘은 1로 분류할 확률을 결과 값으로 내놓게 됩니다. 그런 후에 이 확률을 cutoff를 기준으로 0인지 1인지 분류하게 되죠.

![Cutoff](https://www.cansfordlabs.co.uk/wp-content/uploads/2016/01/CutoffPic-800x568.png){: width="400" height="400"}

### 주의점
정확도를 올리는 것이 기본이지만 사기탐지, 결함파악, 비행기 딜레이 예측, 질병 예측 등의 모델에서는 사기를 치지않는 것보다는 사기를 치는 것을 정확하게 잡아내는 것이 중요하고, 결함이 없는 걸 맞추는 것보다는 결함을 맞추는 것이 더 중요합니다. 


## 성과 분석 척도
자 드디어 introduction을 마치고 본격적으로 어떤 것으로 성능을 평가하는 지 알아봅시다.

### Confusion matrix
![Confusion Matrix](https://3.bp.blogspot.com/--jLXutUe5Ss/VvPIO6ZH2tI/AAAAAAAACkU/pvVL4L-a70gnFEURcfBbL_R-GnhBR6f1Q/s1600/ConfusionMatrix.png){: width="400" height="400"}

여기서 용어를 쉽게 외우려면 일단 틀리면 앞에 False를 붙입니다. 그런후에 내가 예측을 positive로 했냐, negative로 했냐를 확인하면 됩니다.

이제 본격적으로 들어가봅시다. 

Overall error rate = 전체 경우 중에 예측이 틀린 것의 비율

Accuracy = 1 - error rate

Sensitivity = 실제로 Positive 중에 예측이 맞은 것

Specificity = 실제로 Negative 중에 예측이 맞은 것

### Lift amd Decile charts
* 여러 케이스 중에서 보다 중요한 것들을 식별하는 관점에서 모델 성능을 평가하는 지표입니다.
* 먼저 좋은 분류기는 적은 수의 케이스 만으로 높은 향상을 제공합니다.
* 상대적으로 사례를 적게 선택하고 상대적으로 높은 응답자의 비율을 찾고자 할때 사용.

이 경우를 생각해 봅시다. 음..예를 들어 여러분이 메일을 보내서 사람들의 응답을 조사하는 분석가라고 해봅시다. 기본적으로 메일에 응답하는 사람에게만 메일을 보내는 것이 이득일 것입니다. 일단, 여러분은 사람들의 응답을 기대하면서 메일을 보냈습니다. 그런데 과거의 응답 비율을 보면 거의 응답을 하지 않고 메일을 받은 사람들 중 8% 만이 응답했었습니다. 만약 1000개의 메일을 보내면 80개 정도의 응답을 받을 수 있겠군요. 이제, 여러분들은 과거의 데이터를 바탕으로 사람들이 응답할지 하지 않을지를 예측하는 logistic regression modeld을 만들었습니다. 이를 이용해서 메일을 받았던 사람마다 응답할지 말지에 관한 확률을 얻었습니다. 각 사람마다의 응답할 확률을 가장 낮은것부터 높은것 순서대로 나열합니다.

![Lift](https://i.stack.imgur.com/N1ryb.png){: width="400" height="400"}

두번째 그림을 보세요. 나열된 사람들을 10개의 구간이 되도록 같은 구간으로 묶어서 히스토그램을 그립니다. 그러면 첫번재 막대는 상위 10%인 고객들의 집합으로 응답확률의 평균이 29%입니다. 이는 8%로 기대했을때보다 29/8 = 3.63 배의 lift가 있었습니다.

이제 첫번째 그림을 보세요. 응답자를 찾아내는 비율은 모델 없이 랜덤하게 100%의 사람에게 보냈을때랑 모델을 이용하여 나열 한 후 메일을 보냈을 때랑 비교한다면, 별 차이가 없습니다. 즉, 모든 사람에게 보냈으므로 응답자를 전부 찾아내겠죠.

하지만 20%의 사람들에게 보내는 경우에는, 랜덤하게 보냈을 경우에는 응답자를 찾아내는 비율은 20%만 찾아내겠죠. 즉, 전체 중에 20%만 보냈으니깐 20%만 찾을 수 있습니다. 그런데 모델을 이용한다면 20%를 보내면 29% + 14% = 43%를 찾아낼 수 있습니다.

![Lift](https://paultebraak.files.wordpress.com/2013/10/103113_2355_understandi1.png?w=640){: width="400" height="400"}

### ROC Curve
Sensitivity와 Specificity를 구하는 방법이 기억나시나요?

구하는 것 보다는 의미를 다시 한번 확인하여봅시다. 

Sensitivity는 실제로 1인데 예측을 1로해서 맞은 것이고

Specificity는 실제로 0인데 예측을 0으로 해서 맞은 것입니다.

그러면 1 - Specificity는 실제로 0인데 예측을 1로해서 틀린것입니다.

x축에 1 - Specificity = False Positive

y축에 Sensitivity = True Positive

를 그립니다.

![Lift](https://docs.eyesopen.com/toolkits/cookbook/python/_images/roc-theory-small.png){: width="400" height="400"}

바보에게 케이스를 주면서 맞춰봐라고 하면 그냥 반반의 확률로 찍기때문에 0을 1로 판정할 확률(1-Specificity)과 1인데 1로 판정할 확률(Sensitivity)이 같을 것입니다. 

우리가 만들 모델은 적어도 이 바보 보다는 많이 맞춰야합니다. 즉 0을 1로 판정하는 것보다는 1을 1이라고 더 많이 판정해야합니다.









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
