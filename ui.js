(() => {
  const railLinks=[...document.querySelectorAll('#railList a')];
  const sections=railLinks.map(a=>document.getElementById(a.hash.slice(1)));
  document.addEventListener('keydown',e=>{
    if(e.key!=='Tab'||!openSheet)return;
    const focusable=[...openSheet.querySelectorAll('a[href],button,input,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);
    if(e.shiftKey&&document.activeElement===focusable[0]){e.preventDefault();focusable.at(-1)?.focus();}
    else if(!e.shiftKey&&document.activeElement===focusable.at(-1)){e.preventDefault();focusable[0]?.focus();}
  });
  let scheduled = false;
  function updateProgress() {
    scheduled = false;
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    const progress = scrollable > 0 ? Math.max(0,Math.min(100,scrollY / scrollable * 100)) : 0;
    document.getElementById('readingProgress').style.width = progress + '%';
    document.getElementById('railProgress').style.width = progress + '%';
    document.getElementById('backTop').classList.toggle('visible', scrollY > 600);
    let active = 0;
    sections.forEach((section,i) => {if(section && section.getBoundingClientRect().top <= 150) active=i;});
    const hash = railLinks[active].hash;
    railLinks.forEach(a => {
      a.classList.toggle('on',a.hash === hash);
      if(a.hash === hash) a.setAttribute('aria-current','location');
      else a.removeAttribute('aria-current');
    });
    document.getElementById('readingStatus').textContent = railLinks[active].textContent + ' · ' + String(active + 1).padStart(2,'0') + ' / ' + sections.length;
  }
  function scheduleProgress() {if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress);}}
  addEventListener('scroll',scheduleProgress,{passive:true});
  addEventListener('resize',scheduleProgress);
  addEventListener('load',scheduleProgress);
  document.querySelector('.report-intro').addEventListener('toggle',scheduleProgress);
  const compact = matchMedia('(max-width: 860px)');
  const mobileNavMedia = matchMedia('(max-width: 980px)');
  function updateDetailMode() {
    if(openSheet) closeSheet();
    document.querySelectorAll('.ex-detail').forEach(el=>{
      el.inert=compact.matches;
      el.setAttribute('aria-hidden',String(compact.matches));
    });
  }
  compact.addEventListener('change',updateDetailMode);

  document.addEventListener('click', async e => {
    const button=e.target.closest('[data-copy]');
    if(!button)return;
    const text=button.closest('.d-sec').querySelector('.invoke').textContent;
    try {
      await navigator.clipboard.writeText(text);
      if(!button.isConnected)return;
      button.textContent='已复制';button.setAttribute('aria-live','polite');
      setTimeout(()=>{if(button.isConnected)button.textContent='复制示例';},1800);
    } catch {
      button.textContent='请手动选择并复制';
      const selection=getSelection();const range=document.createRange();
      range.selectNodeContents(button.closest('.d-sec').querySelector('.invoke'));
      selection.removeAllRanges();selection.addRange(range);
    }
  });
  updateProgress();
})();
