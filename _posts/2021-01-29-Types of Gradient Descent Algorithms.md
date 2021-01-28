---
title:  "경사 하강법 알고리즘 유형(Types of Gradient Descent Algorithms)"
categories:
  - Deep Learning
tags:
  - pytorch
  - deep learning
  - gradient descent algorithm
  
classes: wide

use_math: true
comments: true
toc: true
toc_label: "Contents"
---
## Introduction
Neural network에서는 비용함수를 최소화하는 파라미터를 찾기위해 경사하강법을 사용한다. 

경사하강법에 사용하는 다양한 알고리즘을 정리하고 각각의 특징을 적어보고자 한다. 

<center><img src="https://imgur.com/2dKCQHh.png" width="400px" title="source: imgur.com"></center>

## Algorithms

## SGD
* 기본적으로 딥러닝에 처음 입문해서 사용하는 optimizaer가 아마 이 알고리즘일 것이다. 밑에 소개하는 다른 알고리즘들도 기본적으로 이 방법이 가지는 단점들을 하나씩 극복하면서
만든 알고리즘이다. 
* 먼저 gradient를 계산하기위해서 cost를 계산해야한다. 
이때 전체 데이터를 사용해서 계산하면 computational cost가 많이 들기 때문에 데이터를 하나씩 뽑아서 cost를 계산한후 gradient를 구해 parameter를 최적화한다.

## momentum
* SGD에서 진동하면서 자리에 머무는 단점을 극복하기위해 추가한 것
* pytorch에서는 SGD의 argument에 moment값이 들어있다. 

## Adagrad
https://jmlr.org/papers/v12/duchi11a.html

$$G_{t}=G_{t-1}+\left( \nabla _{\theta }JJ\left( \theta _{t}\right) \right) ^{2}$$

## RMSprop
* Adagrad의 단점 극복
https://www.cs.toronto.edu/~tijmen/csc321/slides/lecture_slides_lec6.pdf

## Adadelta
https://arxiv.org/abs/1212.5701

## Adam
https://arxiv.org/abs/1412.6980

https://openreview.net/forum?id=ryQu7f-RZ

## AdamW
https://arxiv.org/abs/1412.6980

https://arxiv.org/abs/1711.05101

## Adamax
* a variant of Adam based on infinity norm  

https://arxiv.org/abs/1412.6980

## SparseAdam
* Implements lazy version of Adam algorithm suitable for sparse tensors. In this variant, only moments that show up in the gradient get updated,
 and only those portions of the gradient get applied to the parameters.  
 
 https://arxiv.org/abs/1412.6980
 
## ASGD
https://epubs.siam.org/doi/10.1137/0330046
## Rprop
https://en.wikipedia.org/wiki/Rprop

## LBFGS
https://ko.wikipedia.org/wiki/L-BFGS

### Reference 
* [An overview of gradient descent optimization algorithms](https://ruder.io/optimizing-gradient-descent/){: .btn .btn--info}
* [Gradient Descent Optimization Algorithms 정리](http://shuuki4.github.io/deep%20learning/2016/05/20/Gradient-Descent-Algorithm-Overview.html){: .btn .btn--info}