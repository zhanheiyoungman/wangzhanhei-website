// Language toggle — persists across pages two ways:
//  1) a ?lang= URL parameter carried on every internal link (works everywhere,
//     including sandboxed previews and file:// browsing)
//  2) localStorage as a backup, so even opening a page directly (typing the
//     URL, bookmarking, etc.) remembers your last choice on real hosting.
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.querySelector('.lang-toggle');
  if (!btn) return;

  var STORAGE_KEY = 'wzh-lang';

  function readStoredLang() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function writeStoredLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore — falls back to URL param only */
    }
  }

  function resolveLang() {
    var params = new URLSearchParams(window.location.search);
    var fromURL = params.get('lang');
    if (fromURL === 'en' || fromURL === 'zh') return fromURL;
    var stored = readStoredLang();
    if (stored === 'en' || stored === 'zh') return stored;
    return 'en';
  }

  function setLang(lang) {
    document.body.classList.remove('lang-zh', 'lang-en');
    document.body.classList.add('lang-' + lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    btn.textContent = lang === 'zh' ? 'EN' : '中';
    btn.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文');
  }

  // Rewrite every internal link (nav + site name) to carry the current
  // language forward as ?lang=xx, so clicking through pages keeps it.
  function applyLangToLinks(lang) {
    document.querySelectorAll('a[href$=".html"]').forEach(function (a) {
      var url = new URL(a.getAttribute('href'), window.location.href);
      url.searchParams.set('lang', lang);
      a.setAttribute('href', url.pathname + url.search);
    });
  }

  function updateURL(lang) {
    var url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState(null, '', url.pathname + url.search);
  }

  var lang = resolveLang();
  setLang(lang);
  applyLangToLinks(lang);
  writeStoredLang(lang);

  btn.addEventListener('click', function () {
    lang = document.body.classList.contains('lang-zh') ? 'en' : 'zh';
    setLang(lang);
    applyLangToLinks(lang);
    updateURL(lang);
    writeStoredLang(lang);
  });
});
