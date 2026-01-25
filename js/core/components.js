/* js/core/components.js
   Factories UI básicas que devuelven elementos DOM para reutilizar en páginas
   Requiere: window.DOM
*/
window.Components = (function(DOM){
  if (!DOM) throw new Error('DOM helper missing');

  const card = (content, opts={}) => {
    const c = DOM.el('div', { class: 'card' });
    if (opts.id) c.id = opts.id;
    if (typeof content === 'string') c.innerHTML = content;
    else if (content instanceof Node) c.appendChild(content);
    else if (Array.isArray(content)) content.forEach(n => c.appendChild(n));
    return c;
  };

  const select = ({id, className='menu-select', options=[], value, onChange}) => {
    const s = DOM.el('select', { id, class: className });
    s.innerHTML = options.map(opt => `<option value="${opt.value}" ${opt.value===value ? 'selected' : ''}>${opt.label}</option>`).join('');
    if (typeof onChange === 'function') s.addEventListener('change', onChange);
    return s;
  };

  const statPill = (text, opts={}) => {
    const cls = ['stat-pill', opts.class || ''].join(' ').trim();
    return DOM.el('span', { class: cls, html: text });
  };

  return { card, select, statPill };
})(window.DOM);