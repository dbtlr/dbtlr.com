// dbtlr.com — quick search palette (⌘K / "/")
// Ported from the design reference; the index is generated at build time
// (src/pages/search.json.ts) and fetched on first open.
var ITEMS = [];
var loaded = false;

var overlay = null;
var input = null;
var list = null;
var active = 0;
var results = ITEMS;

function load() {
  if (loaded) return Promise.resolve();
  return fetch('/search.json')
    .then(function (res) { return res.json(); })
    .then(function (items) {
      ITEMS = items;
      loaded = true;
    });
}

function esc(s) {
  return s.replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

function highlight(title, q) {
  if (!q) return esc(title);
  var i = title.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return esc(title);
  return esc(title.slice(0, i)) + '<mark>' + esc(title.slice(i, i + q.length)) + '</mark>' + esc(title.slice(i + q.length));
}

function build() {
  overlay = document.createElement('div');
  overlay.className = 'srch-overlay';
  overlay.innerHTML =
    '<div class="srch-panel" role="dialog" aria-label="Search">' +
    '<div class="srch-inputrow">' +
    '<input class="srch-input" type="text" placeholder="Search posts, projects, pages…" spellcheck="false">' +
    '<span class="srch-esc">esc</span>' +
    '</div>' +
    '<div class="srch-list"></div>' +
    '<div class="srch-foot"><span>↑↓ navigate</span><span>↵ open</span></div>' +
    '</div>';
  document.body.appendChild(overlay);
  input = overlay.querySelector('.srch-input');
  list = overlay.querySelector('.srch-list');

  overlay.addEventListener('mousedown', function (e) {
    if (e.target === overlay) close();
  });
  input.addEventListener('input', function () {
    filter(input.value.trim());
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      var row = list.querySelector('[data-i="' + active + '"]');
      if (row) window.location.href = row.getAttribute('href');
    }
  });
  filter('');
}

function filter(q) {
  results = !q
    ? ITEMS
    : ITEMS.filter(function (it) {
        return (it.title + ' ' + it.sub + ' ' + it.type).toLowerCase().indexOf(q.toLowerCase()) >= 0;
      });
  active = 0;
  render(q);
}

function render(q) {
  if (!results.length) {
    list.innerHTML = '<div class="srch-empty">No matches. Try “retries”, “rust”, or “relaymesh”.</div>';
    return;
  }
  var html = '';
  var lastType = null;
  results.forEach(function (it, i) {
    if (it.type !== lastType) {
      html += '<div class="srch-group">' + esc(it.type === 'post' ? 'Writing' : it.type === 'project' ? 'Projects' : 'Pages') + '</div>';
      lastType = it.type;
    }
    html +=
      '<a class="srch-row' + (i === active ? ' on' : '') + '" data-i="' + i + '" href="' + esc(it.href) + '">' +
      '<span class="srch-title">' + highlight(it.title, q) + '</span>' +
      '<span class="srch-sub">' + esc(it.sub) + '</span>' +
      '</a>';
  });
  list.innerHTML = html;
  Array.prototype.forEach.call(list.querySelectorAll('.srch-row'), function (row) {
    row.addEventListener('mousemove', function () {
      setActive(parseInt(row.getAttribute('data-i'), 10));
    });
  });
}

function setActive(i) {
  active = i;
  Array.prototype.forEach.call(list.querySelectorAll('.srch-row'), function (row) {
    row.classList.toggle('on', parseInt(row.getAttribute('data-i'), 10) === i);
  });
}

function move(dir) {
  if (!results.length) return;
  var next = (active + dir + results.length) % results.length;
  setActive(next);
  var row = list.querySelector('[data-i="' + next + '"]');
  if (row) {
    var top = row.offsetTop - list.scrollTop;
    if (top < 0) list.scrollTop = row.offsetTop;
    else if (top + row.offsetHeight > list.clientHeight) list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight;
  }
}

function open() {
  load().then(function () {
    if (!overlay) build();
    overlay.classList.add('open');
    input.value = '';
    filter('');
    requestAnimationFrame(function () { input.focus(); });
  });
}

function close() {
  if (overlay) overlay.classList.remove('open');
}

function isOpen() {
  return overlay && overlay.classList.contains('open');
}

document.addEventListener('keydown', function (e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    isOpen() ? close() : open();
  } else if (e.key === 'Escape' && isOpen()) {
    close();
  } else if (e.key === '/' && !isOpen()) {
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    e.preventDefault();
    open();
  }
});

document.addEventListener('click', function (e) {
  if (e.target.closest('.searchbtn')) open();
});
