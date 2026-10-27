const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// Exercise the same browser script loaded by the Jekyll search page.
const context = {};
vm.runInNewContext(fs.readFileSync('assets/js/lunr/search.js', 'utf8'), context);
const find = context.GreenJunSearch.find;
const posts = [
  { title: '탐색적 데이터 분석', excerpt: '결측값과 분포를 살펴봅니다.', tags: ['EDA'], categories: ['data mining'] },
  { title: '유의확률 (p-value)', excerpt: '통계적 가설을 해석합니다.', tags: ['Statistics'], categories: ['통계'] },
  { title: '막대그래프', excerpt: 'R과 ggplot2로 데이터를 시각화합니다.', tags: ['R'], categories: ['data mining'] }
];

test('empty and whitespace-only searches show no results', () => {
  assert.equal(find(posts, '').length, 0);
  assert.equal(find(posts, '   ').length, 0);
});

test('Korean words match inside longer words', () => {
  assert.equal(find(posts, '탐색')[0], 0);
  assert.equal(find(posts, '결측')[0], 0);
});

test('search includes tags and categories and ignores English case', () => {
  assert.equal(find(posts, '  eda  ')[0], 0);
  assert.equal(find(posts, 'P-VALUE')[0], 1);
  assert.equal(find(posts, '통계')[0], 1);
});

test('multiple terms must all match, with flexible whitespace', () => {
  assert.equal(find(posts, 'DATA   mining').length, 2);
  assert.equal(find(posts, '데이터 EDA')[0], 0);
  assert.equal(find(posts, '탐색 p-value').length, 0);
});

test('punctuation and unmatched input do not throw or match everything', () => {
  assert.equal(find(posts, '+*:[]').length, 0);
  assert.equal(find(posts, '존재하지않는검색어').length, 0);
});
