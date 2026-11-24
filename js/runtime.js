/*
 * Tiny template runtime for the Huang Family Spiral.
 * Reads <template id="app-template">, fills {{holes}}, repeats <sc-for>,
 * toggles <sc-if>, and patches the live DOM in place on every state change.
 */
(function () {
  'use strict';

  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var EVENTS = { onclick: 'click', onmousemove: 'mousemove', onmouseleave: 'mouseleave', onwheel: 'wheel', onchange: 'input', oninput: 'input', onkeydown: 'keydown' };

  function parts(str) {
    var out = [], last = 0, m;
    HOLE.lastIndex = 0;
    while ((m = HOLE.exec(str))) {
      if (m.index > last) out.push(str.slice(last, m.index));
      out.push({ path: m[1].split('.') });
      last = m.index + m[0].length;
    }
    if (last < str.length) out.push(str.slice(last));
    return out;
  }
  function hasHole(str) { HOLE.lastIndex = 0; return HOLE.test(str); }
  function onlyHole(str) { var p = parts(str); return p.length === 1 && typeof p[0] !== 'string' ? p[0].path : null; }

  function lookup(scope, path) {
    var v = scope[path[0]];
    for (var i = 1; i < path.length && v != null; i++) v = v[path[i]];
    return v;
  }
  function fill(ps, scope) {
    if (ps.length === 1) { var p = ps[0]; if (typeof p === 'string') return p; var v = lookup(scope, p.path); return v == null ? '' : String(v); }
    var s = '';
    for (var i = 0; i < ps.length; i++) { var q = ps[i]; if (typeof q === 'string') s += q; else { var w = lookup(scope, q.path); if (w != null) s += w; } }
    return s;
  }

  /* ---------- compile template DOM into descriptors ---------- */
  function compileKids(node) {
    var out = [];
    for (var c = node.firstChild; c; c = c.nextSibling) { var d = compile(c); if (d) out.push(d); }
    return out;
  }
  function compile(node) {
    if (node.nodeType === 3) {
      var txt = node.nodeValue;
      if (!txt.trim()) txt = ' ';
      return { k: 'text', parts: parts(txt) };
    }
    if (node.nodeType !== 1) return null;
    var tag = node.localName;
    if (tag === 'sc-for') return { k: 'for', list: onlyHole(node.getAttribute('list')), as: node.getAttribute('as'), kids: compileKids(node) };
    if (tag === 'sc-if') return { k: 'if', path: onlyHole(node.getAttribute('value')), kids: compileKids(node) };
    var attrs = [], ev = [];
    for (var i = 0; i < node.attributes.length; i++) {
      var a = node.attributes[i], name = a.name;
      if (name.indexOf('hint-') === 0) continue;
      var low = name.toLowerCase();
      if (EVENTS[low]) { ev.push({ type: EVENTS[low], path: onlyHole(a.value) }); continue; }
      attrs.push({ name: name, parts: hasHole(a.value) ? parts(a.value) : [a.value] });
    }
    return { k: 'el', tag: tag, ns: node.namespaceURI, attrs: attrs, ev: ev, kids: tag === 'template' ? [] : compileKids(node) };
  }

  /* ---------- render descriptors to light virtual nodes ---------- */
  function render(list, scope, out) {
    for (var i = 0; i < list.length; i++) {
      var d = list[i];
      if (d.k === 'text') out.push(fill(d.parts, scope));
      else if (d.k === 'if') { if (lookup(scope, d.path)) render(d.kids, scope, out); }
      else if (d.k === 'for') {
        var items = lookup(scope, d.list) || [];
        for (var j = 0; j < items.length; j++) { var sc = Object.create(scope); sc[d.as] = items[j]; render(d.kids, sc, out); }
      } else {
        var attrs = {};
        for (var a = 0; a < d.attrs.length; a++) attrs[d.attrs[a].name] = fill(d.attrs[a].parts, scope);
        var ev = null;
        for (var e = 0; e < d.ev.length; e++) { var f = lookup(scope, d.ev[e].path); if (typeof f === 'function') { ev = ev || {}; ev[d.ev[e].type] = f; } }
        var kids = [];
        render(d.kids, scope, kids);
        out.push({ tag: d.tag, ns: d.ns, attrs: attrs, ev: ev, kids: kids });
      }
    }
    return out;
  }

  /* ---------- patch the live DOM ---------- */
  function bind(el, type) {
    el.__bound = el.__bound || {};
    if (el.__bound[type]) return;
    el.__bound[type] = true;
    el.addEventListener(type, function (e) {
      var h = el.__h && el.__h[type];
      if (!h) return;
      if (type === 'wheel') e.preventDefault();
      h(e);
    }, type === 'wheel' ? { passive: false } : false);
  }
  function create(v) {
    if (typeof v === 'string') return document.createTextNode(v);
    var el = v.ns && v.ns !== 'http://www.w3.org/1999/xhtml' ? document.createElementNS(v.ns, v.tag) : document.createElement(v.tag);
    patchEl(el, v);
    return el;
  }
  function patchEl(el, v) {
    var prev = el.__a || {}, next = v.attrs;
    for (var name in next) {
      var val = next[name];
      if (prev[name] !== val) el.setAttribute(name, val);
    }
    for (var old in prev) if (!(old in next)) el.removeAttribute(old);
    el.__a = next;
    if (el.localName === 'input' && 'value' in next && el.value !== next.value) el.value = next.value;
    el.__h = v.ev;
    if (v.ev) for (var t in v.ev) bind(el, t);
    patchKids(el, v.kids);
  }
  function patchKids(parent, kids) {
    var nodes = parent.childNodes;
    for (var i = 0; i < kids.length; i++) {
      var v = kids[i], cur = nodes[i];
      if (typeof v === 'string') {
        if (cur && cur.nodeType === 3) { if (cur.nodeValue !== v) cur.nodeValue = v; }
        else if (cur) parent.replaceChild(document.createTextNode(v), cur);
        else parent.appendChild(document.createTextNode(v));
      } else if (cur && cur.nodeType === 1 && cur.localName === v.tag && (cur.namespaceURI || '') === (v.ns || cur.namespaceURI || '')) {
        patchEl(cur, v);
      } else if (cur) parent.replaceChild(create(v), cur);
      else parent.appendChild(create(v));
    }
    while (nodes.length > kids.length) parent.removeChild(parent.lastChild);
  }

  /* ---------- component base ---------- */
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch) {
    var p = typeof patch === 'function' ? patch(this.state) : patch;
    if (p) for (var k in p) this.state[k] = p[k];
    if (this.__mount) this.__mount.schedule();
  };
  window.DCLogic = DCLogic;

  window.mountDC = function (Comp, root, tpl, props) {
    var desc = compileKids(tpl.content);
    var inst = new Comp(props);
    var queued = false;
    function draw() { queued = false; var vals = inst.renderVals(); patchKids(root, render(desc, vals, [])); }
    inst.__mount = { schedule: function () { if (!queued) { queued = true; Promise.resolve().then(draw); } } };
    draw();
    if (inst.componentDidMount) inst.componentDidMount();
    return inst;
  };
})();
