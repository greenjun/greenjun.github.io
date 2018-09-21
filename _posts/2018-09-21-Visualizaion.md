---
title:  "시각화(Visualization)"
categories:
  - data mining
tags:
  - Visualization
  - EDA
  - ggplot
  - R
toc: true
toc_label: "My Table of Contents"
---
* 내용은 지속적으로 업데이트 될것입니다.
* 최대한 수식을 배제하고 전체적인 흐름을 익히게 했습니다.
* 따라서 궁금하신 점은 메일이나 검색을 활용해주세요.

## Introduction
이전 포스팅 [탐색적자료분석(EDA)](https://greenjun.github.io/data%20mining/EDA/) 에 이어서
데이터를 시각화하는 방법에 대해 알아보겠습니다
전에도 말했다시피  EDA하는 방법에는 크게 4가지가 있다고 했고, 
이번 글은 그 중에서 graphic으로 표현하는 것은 포스팅 하겠습니다.

### ggplot2
수많은 책과 포스팅을 보면 시각화하는 수많은 패키지와 프로그램이 있지만

여기서 소개해드릴 것은 R에서 사용하는  **ggplot2** 입니다.

제가 시각화하는 책과 여러가지 프로젝트를 보았지만 ggplot2 만큼 많은 것을 커버할수있고 

활용하는 패키지는 없는 것 같았습니다.

그래서 만약 데이터 시각화에 관심이 있으시고 R을 사용하신다면 ggplot2만 익혀도 표현하고자 하는 

수많은 생각을 시각화 하는데 도움이 될 것입니다.

[ggplot2 공식 메뉴얼](https://cloud.r-project.org/web/packages/ggplot2/ggplot2.pdf)






```ruby
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
```
