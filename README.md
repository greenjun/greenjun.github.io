# GreenJun

통계, 데이터 분석, R 시각화를 정리하는 Jekyll 블로그입니다.

- 블로그: https://greenjun.github.io/
- 문의: junhyuck@pusan.ac.kr

## 로컬 실행

Ruby와 Bundler를 설치한 뒤 실행합니다. Windows에서는 네이티브 gem 빌드를 위해 RubyInstaller의 DevKit도 필요합니다.

```sh
bundle install
bundle exec jekyll serve
```

미리보기 주소는 http://127.0.0.1:4000/ 입니다. `_config.yml`을 바꿨다면 서버를 다시 시작하세요. 댓글은 `production` 빌드에서만 로드됩니다.

## 검증

```sh
npm test
bundle exec jekyll build
python test/check_site.py
```

검색 테스트에는 Node.js 18 이상, 생성된 페이지의 링크 검사에는 Python 3이 필요합니다. 두 검사는 추가 npm·Python 패키지 없이 실행됩니다. 링크 검사는 내부 페이지, 이미지, 문서 내 앵커와 중복 ID를 확인합니다.

## 글 수정

- `_posts/`: 본문, 제목, 목록용 요약(`excerpt`)
- `_pages/`: 소개, 주제별 글, 태그 페이지
- `_data/navigation.yml`: 상단 메뉴
- `_sass/_readability.scss`: 가독성과 모바일 스타일

기존 글의 주소를 유지하려면 파일명과 카테고리를 그대로 두세요. 내부 글 링크는 Jekyll의 `post_url` 태그로 연결합니다.

## 문체와 연재 작성

모든 기존·신규 글에는 루트 [AGENTS.md](AGENTS.md)의 교육형 문체를 적용합니다.

- 처음에 독자가 궁금해할 질문을 던지고, 친숙한 예로 직관을 설명합니다.
- 전문 용어는 영어 원어를 병기하고, 정의에 필요한 조건과 예외를 적습니다.
- 필요한 수식은 기호의 뜻과 식을 읽는 자연어 설명을 함께 씁니다. 수식이 있으면 front matter의 `mathjax: true`를 지정합니다.
- 친근하고 차분한 존댓말을 사용합니다. `~입니다`, `~인데요`, `~겠죠`, 질문문을 맥락에 맞게 섞되 반복을 늘리지는 않습니다.
- 예제 결과를 원리와 연결하고, 마지막에는 실제 작성된 다음 학습 글로 안내합니다.
- 브랜드 자기소개·관성적인 인사·구독·공감 유도 문구와 복사 과정의 HTML 공백 엔터티는 넣지 않습니다.
- 시계열 글은 공개 [연재 목차](_pages/time-series.md)에도 등록합니다. 자료의 시간 간격·주기·변환·분할·검증 원점을 명시합니다.

티스토리 이관 범위와 원래 게시일은 `_data/tistory-migration.yml`에서 확인할 수 있습니다. 원본 날짜와 기존 글 주소를 보존하고, 새 글의 날짜는 실제 작성 시점에 맞춰 지정합니다.
