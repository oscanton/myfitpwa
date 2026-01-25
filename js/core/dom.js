/* js/core/dom.js
   Helpers DOM reutilizables - fábrica pequeña para crear y manipular elementos
*/
window.DOM = (function(){
  const el = (tag, attrs = {}, children = []) => {
    const $el = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k,v]) => {
      if (k === 'class') $el.className = v;
      else if (k === 'text') $el.textContent = v;
      else if (k === 'html') $el.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign($el.style, v);
      else $el.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : (children ? [children] : [])).forEach(c => {
      if (!c) return;
      if (typeof c === 'string') $el.appendChild(document.createTextNode(c));
      else $el.appendChild(c);
    });
    return $el;
  };

  const q = (sel, ctx=document) => ctx.querySelector(sel);
  const qAll = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const empty = ($el) => { if (!$el) return; while($el.firstChild) $el.removeChild($el.firstChild); };
  const on = ($el, evt, fn, opts) => $el && $el.addEventListener(evt, fn, opts);
  const attr = ($el, name, value) => { if (!$el) return; if (value === undefined) return $el.getAttribute(name); $el.setAttribute(name, value); };

  return { el, q, qAll, empty, on, attr };
})();