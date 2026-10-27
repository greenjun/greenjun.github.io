---
layout: null
---

$(document).ready(function () {
  var input = $('#search');
  var results = $('#results');
  var status = $('#search-status');
  var toggle = $('.search__toggle');
  var panel = $('.search-content');

  $('.skip-link').on('click', function () {
    $('#main').attr('tabindex', '-1').focus();
  });

  toggle.on('click', function () {
    var expanded = panel.hasClass('is--visible');
    toggle.attr('aria-expanded', String(expanded));
    toggle.attr('aria-label', expanded ? '글 검색 닫기' : '글 검색 열기');
    panel.attr('aria-hidden', String(!expanded));
    if (!expanded) toggle.focus();
  });

  $(document).on('keydown', function (event) {
    if (event.key === 'Escape' && panel.hasClass('is--visible')) toggle.trigger('click');
  });

  input.on('input', function () {
    var query = input.val().trim();
    results.empty();
    if (!query) {
      status.text('검색어를 입력하면 관련 글이 표시됩니다.');
      return;
    }
    var matches = GreenJunSearch.find(store, query);
    status.text(matches.length ? matches.length + '개의 글을 찾았습니다.' : '검색 결과가 없습니다. 다른 키워드로 검색해 보세요.');
    matches.forEach(function (index) {
      var post = store[index];
      var article = $('<article>').addClass('archive__item');
      var title = $('<h2>').addClass('archive__item-title');
      title.append($('<a>').attr('href', post.url).text(post.title));
      article.append(title);
      article.append($('<p>').addClass('archive__item-excerpt').text(post.summary));
      results.append($('<div>').addClass('list__item').append(article));
    });
  });
});
