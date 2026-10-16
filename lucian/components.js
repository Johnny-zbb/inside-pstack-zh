/* Lucian UX/UI Prompt #008 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#008 */

(function () {
  var root = document.getElementById('lucianCopy');
  const commandSlot=root.closest('.lucian-command');
  function placeCommand(){if(matchMedia('(max-width:760px)').matches)document.querySelector('.report-intro').appendChild(commandSlot);else document.querySelector('.hero-layout').appendChild(commandSlot);}
  matchMedia('(max-width:760px)').addEventListener('change',placeCommand);placeCommand();
  var btn = root.querySelector('.u008-btn');
  var cmd = root.querySelector('.u008-cmd');
  var tip = root.querySelector('.u008-tip');
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.u008-tab'));
  var t = 0;
  var reduced = function(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.reducedMotion==='true';};
  tip.textContent = '';
  function text() { return cmd.textContent; }
  async function write(s) {
    if(navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(s);
    throw new Error('clipboard unavailable');
  }
  btn.addEventListener('click', async function () {
    root.classList.remove('is-error');
    try {await write(text());} catch {
      root.classList.add('is-error');tip.textContent='请手动选择命令复制';
      const range=document.createRange();range.selectNodeContents(cmd);const sel=getSelection();sel.removeAllRanges();sel.addRange(range);return;
    }
    clearTimeout(t);
    root.classList.remove('is-copied');
    void root.offsetWidth;
    root.classList.add('is-copied');
    tip.textContent = '已复制';
    t = setTimeout(function () { if (root.isConnected) { root.classList.remove('is-copied'); tip.textContent = ''; } }, 1800);
  });
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(i); });
    tab.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); var n = (i + d + tabs.length) % tabs.length; select(n); tabs[n].focus(); }
    });
  });
  function select(i) {
    tabs.forEach(function (tb, k) { tb.setAttribute('aria-selected', String(k === i)); tb.tabIndex = k === i ? 0 : -1; });
    cmd.textContent = tabs[i].dataset.cmd;
    if (cmd.animate && !reduced()) cmd.animate([{ transform: 'translateY(-60%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.34,1.45,.64,1)' });
  }
  tabs.forEach(function (tb, k) { tb.tabIndex = k === 0 ? 0 : -1; });
})();

/* Lucian UX/UI Prompt #044 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#044 */

(function () {
  var root = document.getElementById('lucianInfo');
  var items = Array.prototype.slice.call(root.querySelectorAll('.u044-it'));
  var qs = items.map(function (it) { return it.querySelector('.u044-q'); });
  var uid = 'u044-' + Math.random().toString(36).slice(2, 7);
  items.forEach(function (it, i) {
    var q = qs[i], body = it.querySelector('.u044-body');
    q.id = uid + '-q' + i; body.id = uid + '-a' + i;
    q.setAttribute('aria-controls', body.id); body.setAttribute('aria-labelledby', q.id);
  });
  function set(it, open) {
    it.classList.toggle('open', open);
    it.querySelector('.u044-q').setAttribute('aria-expanded', String(open));
    it.querySelector('.u044-body').inert=!open;it.querySelector('.u044-body').setAttribute('aria-hidden',String(!open));
  }
  items.forEach(function (it, i) {
    set(it, it.classList.contains('open'));
    qs[i].addEventListener('click', function () {
      var willOpen = !it.classList.contains('open');
      items.forEach(function (o) { if (o !== it) set(o, false); });
      set(it, willOpen);
    });
    qs[i].addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? qs.length - 1 : -2;
      if (n === -2) return;
      e.preventDefault();
      qs[(n + qs.length) % qs.length].focus();
    });

  });
})();

/* Lucian UX/UI Prompt #286 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#286 */

(function () {
  var root = document.getElementById('lucianMenu');
  var bg = root.querySelector('.u286-bg'), vw = root.querySelector('.u286-vw'), bk = root.querySelector('.u286-bk'), tt = root.querySelector('.u286-tt'), mn = root.querySelector('.u286-mn');
  var reduced=function(){return matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.reducedMotion==='true';};
  var TREE = {t:'本文目录',c:[{t:'开始阅读',c:[{t:'概览',id:'top'},{t:'整体结构',id:'map'},{t:'技能的文件结构',id:'anatomy'}]},{t:'技能与流程',c:[{t:'技能索引',id:'skills'},{t:'操作流程',id:'playbooks'},{t:'24 条原则',id:'principles'}]},{t:'模型与实现',c:[{t:'模型与子代理',id:'models'},{t:'脚本',id:'scripts'},{t:'她怎样使用',id:'driving'}]},{t:'观点与实践',c:[{t:'她的理念',id:'philosophy'},{t:'如何评价',id:'verdict'},{t:'构建自己的技能包',id:'yours'}]},{t:'历史与来源',id:'history'}]};
  var stack = [TREE], open = false;
  var ARW = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 2.5L9.5 7 5 11.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function render(dir) {
    var node = stack[stack.length - 1], old = vw.querySelector('.u286-ls:not(.is-out)');
    var ul = document.createElement('ul'); ul.className = 'u286-ls';
    node.c.forEach(function (ch, i) {
      var li = document.createElement('li'), b = document.createElement('button');
      b.type = 'button'; b.className = 'u286-it'; b.style.transitionDelay = (0.04 * i + 0.05) + 's';
      b.innerHTML = '<span></span>' + (ch.c ? ARW : ''); b.firstChild.textContent = ch.t;
      if (ch.c) b.setAttribute('aria-label', ch.t + '，展开子目录');
      b.addEventListener('click', function () { if (ch.c) { stack.push(ch); render(1); }else if(ch.id){setOpen(false);location.hash=ch.id;} });
      li.appendChild(b); ul.appendChild(li);
    });
    if (dir && !reduced()) ul.style.transform = 'translateX(' + (dir * 100) + '%)';
    vw.appendChild(ul);
    if (old) {
      old.classList.add('is-out');
      if (reduced()) old.remove(); else { old.style.transform = 'translateX(' + (-dir * 30) + '%)'; old.style.opacity = 0; setTimeout(function () { old.remove(); }, 400); }
    }
    requestAnimationFrame(function () { requestAnimationFrame(function () { ul.style.transform = ''; ul.classList.add('is-in'); }); });
    tt.textContent = node.t; bk.hidden = stack.length < 2;
  }
  bk.addEventListener('click', function () { if (stack.length > 1) { stack.pop(); render(-1); } });
  const overlay=document.getElementById('mobileToc');const toggle=document.getElementById('tocToggle');
  function setOpen(value) {
    open = value;overlay.inert=!open;overlay.classList.toggle('open',open);overlay.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open));document.body.classList.toggle('modal-open',open); root.classList.toggle('is-open', open);
    bg.setAttribute('aria-expanded', open); bg.setAttribute('aria-label', open ? '关闭目录' : '打开目录');
    if (open) { stack = [TREE]; vw.innerHTML = ''; render(0);bg.focus({preventScroll:true}); }else toggle.focus({preventScroll:true});
  }
  bg.addEventListener('click',()=>setOpen(!open));toggle.addEventListener('click',()=>setOpen(!open));
  overlay.addEventListener('click',e=>{if(e.target===overlay)setOpen(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open)setOpen(false);if(e.key==='Tab'&&open){const fs=[...root.querySelectorAll('button')].filter(b=>!b.hidden&&!b.closest('.is-out'));if(e.shiftKey&&document.activeElement===fs[0]){e.preventDefault();fs.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===fs.at(-1)){e.preventDefault();fs[0].focus();}}});
  matchMedia('(min-width:981px)').addEventListener('change',e=>{if(e.matches&&open)setOpen(false);});
  bg.setAttribute('aria-label','关闭目录');bk.setAttribute('aria-label','返回上一级');
})();
