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
