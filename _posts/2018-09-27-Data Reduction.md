---
title:  "데이터 축소(Data Reduction) - 개요"
categories:
  - data mining
tags:
  - R
  - data reduction
  
classes: wide

toc: true
toc_label: "Contents"
---
* 내용은 지속적으로 업데이트 될것입니다.
* 최대한 수식을 배제하고 전체적인 흐름을 익히게 했습니다.
* 따라서 궁금하신 점은 메일이나 검색을 활용해주세요.

***

# Introduction
데이터 축소라는 개념이 왜 등장했을까요? database나 datawarehouse를 보면 terabyte 이상의 데이터가 들어있습니다.
이것을 가지고 분석을 진행한다면 오랜 시간이 걸리겠지요. 그래서 그 중에서 중요한 데이터만 골라내어 분석하려는 시도에서 나왔습니다.

요약하면 **much smaller in volume but yet produces the almost same analytical results**를 하기 위해서 입니다.

# Data reduction strategies

* Numerosity reduction
   * Regression and Log-Linear Models
   * Histograms, clustering, sampling
   * Data cube aggregation

* Dimensionality reduction -  중요하지않은 속성을 제거하는 것
   * Wavelet transforms
   * Principal Components Analysis
   * eature subset selection, Feature creation
   
* Data compression

## Numerosity reduction
수 많은 데이터 대신에 그 데이터를 표현할 수 있는 작은 형태로 표현하여 기존의 데이터를 대신하는 테크닉입니다.

parametric과 nonparametric 두가지가 있습니다.

### Parametric methods
데이터를 표현할수있는 모델을 만든 후에 data는 지우고 parameter만 남겨 놓는 것입니다. 이때, outlier는 남겨 놓아야 합니다

**Regression and Log-Linear Models**

* To approximate the given data.

* In **(simple) linear regression**, the data are modeled to fit a straight line.

* **Multiple linear regression** is an extension of (simple) linear regression, which allows a response variable y to be modeled as a linear function of two or more predictor variables.

* **Log-linear models** approximate **discrete multidimensional probability distributions**.

* Log-linear models can be used to **estimate the probability of each point** in a multidimensional space for a set of discretized attributes, based on a smaller subset of **dimensional combinations**.

* This allows a higher-dimensional data space to be **constructed from lower dimensional spaces**.

* **Log-linear models are therefore also useful for dimensionality reduction and data smoothing**

* Regression and log-linear models can both be used on [sparse data](https://gerardnico.com/data/modeling/dense_sparse){: .btn .btn--info}, although their application may be **limited**.

* While both methods can handle **skewed data**, **regression** does exceptionally well. Regression can be computationally intensive when applied to **high dimensional data**, whereas **log-linear models show good scalability for up to 10 or so dimensions**.

### Non-parametric methods
모델을 가정하지 않고 축소된 데이터를 표현하여 저장하기위한 방법입니다.
histogram, clustering, sampling등을 사용합니다.

**Histogram**

* **Histograms** use binning to **approximate data distributions** and are a popular form of data reduction.

* A histogram **partitions** the data distribution into **disjoint subsets**, or buckets.

* If each bucket represents **only a single attribute-value/frequency pair**, the buckets are called **singleton buckets**.

* Singleton buckets are useful for **storing outliers with high frequency**.

* Histograms are highly effective at **approximating both sparse and dense data**, aswell as **highly skewed and uniform data**.

* The histograms for single attributes can be extended for multiple attributes.

* **Multidimensional histograms** can capture **dependencies** between attributes.

**Clustering**

*  **Cluster**는 유사성에 기반하여 데이터를 군집으로 나눈 후, cluster representation만 남깁니다 (centroid, diameter)

* 데이터가 잘 퍼져있다면 효과적이지 못하지만, 만약 군집이 이루어져있다면 효과적이다.

* Hierarchical clustering(계층적 군집분석)을 이용하면 multi-dimensional index tree structures를 이용하여 저장가능하다.

**Sampling**
* Clustering -> Stratified sampling 하는 식으로 이용함.

* 데이터 베이스의 크기를 줄여주지는 못합니다.

* Simple random sampling, Sampling without replacement, Sampling without replacement, [Stratified sampling](https://ko.wikipedia.org/wiki/%EC%B8%B5%ED%99%94%EC%B6%94%EC%B6%9C%EB%B2%95){: .btn .btn--info}

* 전체 데이터를 표현하는 작은 샘플을 뽑는것

* 데이터의 크기에 sub-linear 한 곳에서 즉 복잡한 곳에서 데이터마이닝 알고리즘이 작동하도록 도와준다.

**Data Cube Aggregation**

**Categorical data**
* 빈도나 비율 같은것이 범주형 변수를 요약하는데 유용합니다.

**Grouped numerical data**
* 평균이 그룹지어진 연속형 변수를 요약하는데 유용합니다.
* Group by multiple criteria를 이용하여 그룹을 더 세분화하여 데이터를 보게되면 유용한 인사이트를 얻을수있습니다. 

**Reducing categories**
* Problem: Can end up with too many variables
* Solution: Reduce by combining categories that are close to each other
* Use pivot tables to assess outcome variable sensitivity to the dummies
* Exception: Naïve Bayes can handle categorical variables without transforming them into dummie
* Ex) 만약 방향이라는 변수가 범주형 변수로 4가지의 방향을 표현한다면 3개의 더미 변수로 표현가능합니다.
   * 동 - 1000
   * 서 - 0100
   * 남 - 0010
   * 북 - 0001
   * 동서 - 1100
   * 남북 - 0011

**Combining categories**
다른 한가지 변수를 기준으로 범주형 변수를 바라 보았을때, 범주형 변수가 같은 특징을 보인다면 묶어서 같은 카테고리내로 두는 것을 고려해볼수있습니다.

**Transform categorical variable to numerical variable**
Ex) 범주가 나이 20-30인 경우라면, 그냥 25를 사용


## Dimensionality reduction

### Wavelet transforms
[Wavelet transforms](https://hansung.ac.kr/web/multi/510324?p_p_id=EXT_BBS&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_EXT_BBS_struts_action=%2Fext%2Fbbs%2Fget_file&_EXT_BBS_extFileId=657507){: .btn .btn--info}

### PCA
* 단계
   * Apply PCA to training data
   * Decide how many PC’s to use
   * Use variable weights in those PC’s with validation/new data
   * This creates a new reduced set of predictors in validation/new data
* 단위에 영향을 받지 않기 위해 먼저 Normalizing 하는 것이 필요합니다.
* 상관관계가 높은 측정치들이 존재할때, 상관관계가 높은 변수끼리 묶어서 표현하는 것
* 두 변수간의 정보를 모두 포함하지는 못하지만 대부분은 포함시키는 두 변수의 선형결랍을 찾는 것
* 새로운 변수는 원래 변수의 선형결합으로 이루어집니다.
* 새롭게 생긴 변수는 서로간에 상관관계가 없고, 원래 데이터의 대부분을 표현할 수 있습니다.
* 이 새로운 변수는 principal components 라고 부릅니다.
[주성분분석](http://elearning.kocw.net/document/lec/2012/DukSung/KimJaehee/09.pdf){: .btn .btn--info}

### Regression-Based Dimension Reduction
* Multiple Linear Regression or Logistic Regression
* Use subset selection
* Algorithm chooses a subset of variables
* This procedure is integrated directly into the predictive task
* 통계적으로 유의하지 않은 계수를 가진 변수는 다른 변수와 통합
* 유사한 계수를 가지는 변수는 하나의 변수로 통합

>
### Reference 
* http://www.ques10.com/p/158/write-short-notes-on-numerosity-reduction-1/
* http://bsclab.pusan.ac.kr

>
### 용어정리 
* PCA, wavelet transforms
