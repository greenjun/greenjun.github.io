"""Check generated Jekyll pages: python test/check_site.py [_site]."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site').resolve()

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.links, self.ids, self.duplicates = [], set(), []
        self.disqus_script = '.disqus.com/embed.js' in source
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            if attrs['id'] in self.ids:
                self.duplicates.append(attrs['id'])
            self.ids.add(attrs['id'])
        for key in ('href', 'src'):
            if attrs.get(key):
                self.links.append(attrs[key])

pages = {p: Page(p.read_text(encoding='utf-8')) for p in root.rglob('*.html')}
errors = []
checked = 0
for path, page in pages.items():
    if page.disqus_script and 'disqus_thread' not in page.ids:
        errors.append(f'{path.relative_to(root)}: Disqus script loaded without its comment container')
    errors.extend(f'{path.relative_to(root)}: duplicate id {value}' for value in page.duplicates)
    for href in page.links:
        url = urlsplit(href)
        if url.scheme not in ('', 'http', 'https') or url.netloc not in ('', 'greenjun.github.io'):
            continue
        target = root / unquote(url.path).lstrip('/') if url.path.startswith('/') else path.parent / unquote(url.path)
        if not url.path:
            target = path
        if target.is_dir():
            target /= 'index.html'
        checked += 1
        if not target.exists():
            errors.append(f'{path.relative_to(root)}: missing {href}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{path.relative_to(root)}: missing anchor {href}')

if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'PASS: {len(pages)} HTML pages, {checked} internal links/assets/anchors, no missing targets or duplicate IDs.')
