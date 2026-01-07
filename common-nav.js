// 通用导航与返回逻辑
(function() {
  const keyFor = () => 'scroll:' + location.pathname + location.search + location.hash;

  function saveScrollPosition() {
    try { sessionStorage.setItem(keyFor(), String(window.scrollY || window.pageYOffset || 0)); } catch(e) {}
  }

  function restoreScrollPosition() {
    try {
      const raw = sessionStorage.getItem(keyFor());
      const y = raw == null ? null : Number(raw);
      if (typeof y === 'number' && !isNaN(y)) {
        // 使用两帧确保布局完成后再恢复
        requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, y)));
      }
    } catch(e) {}
  }

  function navigateTo(href) {
    if (typeof href === 'string' && href.trim() !== '') {
      // 离开前保存当前滚动
      saveScrollPosition();
      // 若在 iframe 中，尽量同步登录态到父窗口，避免页面间出现“已登录/未登录”不同步
      try {
        if (window.top !== window && window.parent && window.parent.localStorage) {
          const flag = localStorage.getItem('isLoggedIn');
          if (flag != null) window.parent.localStorage.setItem('isLoggedIn', flag);
          const ap = localStorage.getItem('accountProfile');
          if (ap != null) window.parent.localStorage.setItem('accountProfile', ap);
        }
      } catch (e) { /* ignore */ }
      window.location.href = href;
    }
  }

  function doBack(fallback) {
    try {
      const returnTo = localStorage.getItem('returnToPage');
      if (returnTo && typeof returnTo === 'string' && returnTo.trim() !== '') {
        localStorage.removeItem('returnToPage');
        navigateTo(returnTo);
        return;
      }
    } catch (e) { /* no-op */ }

    // 优先使用浏览器历史
    if (document.referrer && document.referrer !== window.location.href) {
      try { window.history.back(); return; } catch (e) { /* fallback below */ }
    }
    // 兜底：回到首页
    navigateTo(fallback || 'home.html');
  }

  function ensureBackBinding(el) {
    if (!el) return;
    if (!el.hasAttribute('data-back')) el.setAttribute('data-back', '');
    el.addEventListener('click', function(ev) {
      ev.preventDefault();
      doBack(this.getAttribute('data-fallback'));
    }, { once: false });
  }

  function wireAll() {
    // 优先允许浏览器参与，但我们也自行兜底
    try { if (history && 'scrollRestoration' in history) history.scrollRestoration = 'auto'; } catch(e) {}

    // 初次进入尝试恢复
    restoreScrollPosition();

    // 关键时机保存滚动
    window.addEventListener('pagehide', saveScrollPosition);
    window.addEventListener('beforeunload', saveScrollPosition);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveScrollPosition(); });

    // 绑定显式 data-back 元素
    document.querySelectorAll('[data-back]').forEach(ensureBackBinding);

    // 兼容：含有 .back-btn 或 左箭头图标的元素，自动赋予 data-back
    document.querySelectorAll('.back-btn').forEach(ensureBackBinding);
    document.querySelectorAll('.fa-arrow-left').forEach(function(icon){
      const parentButton = icon.closest('button, .back-btn');
      if (parentButton) ensureBackBinding(parentButton);
    });

    // 通用跳转：data-link / data-return 可选带回退来源
    document.querySelectorAll('[data-link]').forEach(function(el){
      el.addEventListener('click', function(){
        saveScrollPosition();
        const target = this.getAttribute('data-link');
        const ret = this.getAttribute('data-return');
        if (ret) {
          try { localStorage.setItem('returnToPage', ret); } catch (e) {}
        }
        navigateTo(target);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireAll);
  } else {
    wireAll();
  }

  // 暴露全局以便个别页面需要直接调用
  window.__CommonNav__ = { back: doBack, go: navigateTo };

  // ===== 页面链接自动采集与上报（用于 index.html 自动生成交互流程图）=====
  (function setupFlowCollector(){
    function getCurrentPageName(){
      try {
        var path = window.location.pathname || '';
        var name = path.split('/').pop() || path || document.title || '';
        return name || 'unknown';
      } catch (e) { return 'unknown'; }
    }

    function normalizeTarget(href){
      if (!href || typeof href !== 'string') return null;
      href = href.trim();
      // 只关心本项目内的 .html 目标
      var m = href.match(/[A-Za-z0-9_\-]+\.html(?:[^'"\s]*)?/);
      return m ? m[0] : null;
    }

    function collectLinks(){
      var out = new Set();
      // data-link 明确导航
      document.querySelectorAll('[data-link]').forEach(function(el){
        var t = normalizeTarget(el.getAttribute('data-link'));
        if (t) out.add(t);
      });
      // a[href]
      document.querySelectorAll('a[href$=".html"]').forEach(function(a){
        var t = normalizeTarget(a.getAttribute('href'));
        if (t) out.add(t);
      });
      // 含有 onclick 的元素，解析 window.location.href/ location.href/ 'xxx.html'
      document.querySelectorAll('[onclick]').forEach(function(el){
        var code = String(el.getAttribute('onclick') || '');
        var m1 = code.match(/location\.href\s*=\s*['"]([^'"]+\.html[^'"]*)['"]/);
        if (m1 && m1[1]) {
          var t1 = normalizeTarget(m1[1]);
          if (t1) out.add(t1);
        }
        var m2 = code.match(/['"]([A-Za-z0-9_\-]+\.html[^'"]*)['"]/);
        if (m2 && m2[1]) {
          var t2 = normalizeTarget(m2[1]);
          if (t2) out.add(t2);
        }
      });
      return Array.from(out);
    }

    function postFlow(){
      var payload = { type: '__FLOW_LINKS__', from: getCurrentPageName(), links: collectLinks() };
      try { window.parent && window.parent.postMessage(payload, '*'); } catch(e) {}
      // 也缓存一份在本页 localStorage，便于独立调试
      try { localStorage.setItem('__FLOW_LINKS__:' + payload.from, JSON.stringify(payload.links)); } catch(e) {}
    }

    // 允许父页面主动请求
    window.addEventListener('message', function(evt){
      if (!evt || !evt.data) return;
      if (evt.data.type === '__REQUEST_FLOW__') {
        postFlow();
      }
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', postFlow);
    } else {
      // 延一帧，确保页面主要DOM生成完毕
      requestAnimationFrame(postFlow);
    }
  })();
})();


