/* Small, dependency-free search that also matches partial Korean words. */
var GreenJunSearch = {
  find: function (posts, query) {
    var terms = String(query || '').toLowerCase().trim().split(/\s+/);
    if (!terms[0]) return [];

    var matches = [];
    posts.forEach(function (post, index) {
      var text = [post.title, post.excerpt, (post.tags || []).join(' '),
        (post.categories || []).join(' ')].join(' ').toLowerCase();
      if (terms.every(function (term) { return text.indexOf(term) !== -1; })) {
        matches.push(index);
      }
    });
    return matches;
  }
};
