---
title:  "시각화(Visualization)-Barplot"
categories:
  - data mining
tags:
  - Visualization
  - EDA
  - ggplot
  - R
  - barplot
  
classes: wide

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

### Boxplots
* outlier
* symmetry (데이터 치우침정도 파악가능)
* robust measures of location and spread
* categorical data 데이터 분포 
* continous data에 사용하면 전체적인 분포를 빼곡히 파악 가능

먼저 하나씩 차근 차근 시작하여봅시다

**mpg라는 데이터 셋에서 drv 별로 얼마나 많은 빈도를 가지고 있는지 확인하여 봅시다**

```R
ggplot(data = mpg, aes(x = drv)) +
  geom_bar()
```
![barplot1](/assets/images/barplot1.png)

`data = mpg는 사용할 데이터 셋이 mpg라는 것`

`aes(x = drv)는 x축으로 drv를 지정하는 것, drv는 categorical 변수입니다.`

`y축을 지정하지 않은 이유는 막대 그래프이기 때문데 x축만을 지정하여도 되기 때문입니다`

`+ 기호를 사용하여 layer를 연결시킵니다. `

`geom_bar() 는 막대그래프를 그리라는 함수입니다.`

**배경에 격자 무늬를 수정해봅시다.**

```R
ggplot(data = mpg, aes(x = drv)) +
  geom_bar() +
  theme_lightl()
```

`theme 함수를 통해서 배경의 격자 무늬를 수정할 수 있습니다`

**색이 좀 칙칙하다구요? fill=drv는 drv별로 색을 다르게 채우겠다는 뜻입니다.**

```R
ggplot(data = mpg, aes(x = drv, fill=drv))+
  geom_bar() +
  theme_lightl()
```

**막대를 수정해봅시다**

```R
ggplot(data = mpg, aes(x = drv, fill = drv)) +
  geom_bar(width = 0.7) +
  theme_light()
```

`geom_bar 함수 안에 숫자를 입력하면 됩니다. 만약 aes에 fill을 채우지 않았다면 color, fill함수를 여기에 사용하여 막대를 수정할 수 있습니다`

**x축의 drv에서 원하는 크기 순으로 나열해 봅시다**

```R
ggplot(data = mpg, aes(x = drv, fill = drv)) +
  geom_bar(width=0.7) +
  theme_light() +
  scale_x_discrete(limits=c("f", "4", "r"))
```

`x축의 drv를 원하는 숫자만 가져오거나 내가  원하는 순서대로 배열하고 싶다면 다음과 같이 scale_x_discrete(limits=..)) 함수를 사용합니다`

**x축의 이름을 바꾸고 싶다면 labs(x = "움직이는 바퀴")이라는 layer를 추가 해주면 됩니다**

```R
ggplot(data = mpg, aes(x = drv, fill = drv)) +
  geom_bar(width=0.7) +
  theme_light() +
  scale_x_discrete(limits=c("f", "4", "r")) +
  labs(x = "움직이는 바퀴") 
```

**흠...막대기 위에 숫자도 추가해볼까요?**
 
 ```R
ggplot(data = mpg, aes(x = drv, fill = drv)) +
  geom_bar(width=0.7) +
  theme_light() +
  scale_x_discrete(limits=c("f", "4", "r")) +
  labs(x = "움직이는 바퀴") +
  geom_label(stat='count', aes(label=..count..))
```

![barplot2](/assets/images/barplot2.png)

 **만약 drv별로 연료타입이 어떻게 되는지 확인하고 싶다면 fill = fl로 바꿔주시면 됩니다.**
 
 ```R
ggplot(data = mpg, aes(x = drv, fill = fl)) +
  geom_bar(width=0.7, position = "dodge") +
  theme_light() +
  scale_x_discrete(limits=c("f", "4", "r")) +
  labs(x = "drv별로 연료타입 분포")
```

`여기서 한 막대안에 들어 있는 여러개의 분포를 x축위에 나란히 놓고 싶다면 geom_bar(position = "dodge")를 추가하시면 됩니다.`

![barplot3](/assets/images/barplot3.png)

**자 이제 y축에 새로운 정보를 추가하여 나타내 봅시다. x축에 drv, y축에 hwy(연비), 그룹은 manufacturer별로**

**즉 각 drv별로 생산자들이 만든 제품의 연비가 어떻게 되는지 보려고 합니다** 

```R
ggplot(data = mpg, aes(x = drv, y = hwy, group = manufacturer)) +
  geom_col(aes(fill = manufacturer), position = "dodge") +
  geom_text(aes(label = hwy), position = position_dodge(0.9))
```

![barplot4](/assets/images/barplot4.png)

`geom_col(aes(fill = manufacturer), position = "dodge")은 생산자별로 색을 다르게 표시하고 dodge로 옆으로 나란히 표시하겠다는 말입니다`

`dodge가 아니라 stack을 사용한다면 한 막대위에 길게 쌓아지게 됩니다.`

`geom_text(aes(label = hwy), position = position_dodge(0.9))는 막대위 텍스트의 표시를 y축의 hwy로 하겠다는 말입니다.`

`gerom_col과 geom_test의 position은 같은 표시로 해야합니다`

**만약 drv 별로 연비의 총합을 알고 싶다면 다음과 같이 y = hwy, stat = 'identity'를 추가하면 됩니다.**

```R
ggplot(data = mpg, aes(x = drv, y = hwy, fill = drv))+
  geom_bar(stat='identity') +
  labs(x = "drv 별로 hwy의 총합")
```

![barplot5](/assets/images/barplot5.png)

> stack 사용시 참고 코드 

```R
ggplot(data = df, aes(x, y, group = grp)) +
  geom_col(aes(fill = grp)) +
  geom_text(aes(label = y), position = position_stack(vjust = 0.5))
```

> stat 사용시 참고 코드


```R
# the height of the bar represents the count of cases in each category.
labeling
ggplot(data = mpg, aes(x = drv, y = hwy, fill = drv))+
  geom_bar(stat='identity') +
  labs(title = "y - stat identity")

ggplot(data = mpg, aes(x = drv))+
  geom_bar() +
  labs(title = "x - default stat bin")
```

> 크기순으로 라벨링 할떄 참고코드

```R

library(plyr)
mpg2 <- mpg[,c(7,9)]
mpg_sorted <- arrange(mpg2, drv, hwy)
mpg_cumsum <- ddply(mpg_sorted, 
                    .(drv),
                    transform,
                    label_cumsum = cumsum(hwy))
ggplot(data = mpg_cumsum, aes(x = drv, y = hwy, fill = drv))+
  geom_bar(stat='identity') +
  labs(x = "drv 별로 hwy의 총합") +
  geom_text(aes(y=label_cumsum, label=hwy))
  ```

**Quiz1. mpg라는 데이터 셋에서 class 별로 얼마나 많은 빈도를 가지고 있는지 확인하여 봅시다**

### Histograms

### Quantile-normal plots(QQ-plot)

## Reference 
* http://www.sthda.com/english/wiki/ggplot2-barplots-quick-start-guide-r-software-and-data-visualization

> 용어정리 
* barplot
