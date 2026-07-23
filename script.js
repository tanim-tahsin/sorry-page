(() => {
  const screens = Array.from(document.querySelectorAll('.screen'));
  let current = 0;

  const state = { date: null, place: null };

  function goTo(step){
    screens.forEach(s => s.classList.toggle('active', Number(s.dataset.screen) === step));
    current = step;
    if(step === 5){
      fillSummary();
      scheduleHeartButton();
    }
    if(step === 6){
      startLetterFly();
    }
    if(step === 7){

    document.body.classList.add('ended');

    const photo = document.querySelector('.end-photo');

    if(photo){
        photo.style.animation = 'none';
        photo.offsetHeight;      // force reflow
        photo.style.animation = 'finalScene 2.8s forwards';
    }

}
  }

  // envelope open
  const envelope = document.getElementById('envelope');
  envelope.addEventListener('click', () => {
    if(envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    setTimeout(() => goTo(1), 650);
  });

  // generic "next" buttons
  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      if(btn.disabled) return;
      goTo(current + 1);
    });
  });

  // choice tiles (date + place)
  document.querySelectorAll('.choice-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const group = tile.dataset.choiceGroup;
      document.querySelectorAll(`.choice-tile[data-choice-group="${group}"]`)
        .forEach(t => t.classList.remove('selected'));
      tile.classList.add('selected');
      state[group] = tile.dataset.value;

      if(group === 'date'){
        document.getElementById('dateNext').disabled = false;
      }
      if(group === 'place'){
        document.getElementById('placeNext').disabled = false;
      }
    });
  });

  function fillSummary(){
    document.getElementById('summaryDate').textContent = state.date || '—';
    document.getElementById('summaryPlace').textContent = state.place || '—';
  }

  // slideshow crossfade
  const slides = Array.from(document.querySelectorAll('.slide'));
  let slideIdx = 0;
  setInterval(() => {
    if(slides.length < 2) return;
    slides[slideIdx].classList.remove('active');
    slideIdx = (slideIdx + 1) % slides.length;
    slides[slideIdx].classList.add('active');
  }, 3200);

  // heart-shaped deal button suddenly appears while the slideshow plays
  let heartScheduled = false;
  function scheduleHeartButton(){
    if(heartScheduled) return;
    heartScheduled = true;
    setTimeout(() => {
      dealBtn.classList.add('show');
    }, 2600);
  }

  // deal button -> hearts burst + popup reveal -> letter flies away -> the end
  const dealRow = document.getElementById('dealRow');
  const dealBtn = document.getElementById('dealBtn');
  const dealPopup = document.getElementById('dealPopup');
  const burstLayer = document.getElementById('burstLayer');
  let dealt = false;

  dealBtn.addEventListener('click', () => {
    if(dealt) return;
    dealt = true;

    spawnHearts(24);
    dealRow.classList.add('hide');

    dealPopup.classList.add('show');
    requestAnimationFrame(() => {
      setTimeout(() => dealPopup.classList.add('animate'), 30);
    });

    setTimeout(() => {
      dealPopup.classList.remove('show', 'animate');
      goTo(6);
    }, 2700);
  });

  function startLetterFly(){
    const miniLetter = document.getElementById('miniLetter');
    setTimeout(() => miniLetter.classList.add('flying'), 500);
    setTimeout(() => goTo(7), 500 + 1600 + 200);
  }

  function spawnHearts(n){
    const emoji = ['💛','🤍','✨'];
    for(let i=0;i<n;i++){
      const h = document.createElement('span');
      h.className = 'burst-heart';
      h.textContent = emoji[Math.floor(Math.random()*emoji.length)];
      h.style.left = (10 + Math.random()*80) + 'vw';
      h.style.setProperty('--bx', (Math.random()*160-80)+'px');
      h.style.setProperty('--br', (Math.random()*60-30)+'deg');
      h.style.animationDelay = (Math.random()*0.4)+'s';
      burstLayer.appendChild(h);
      setTimeout(() => h.remove(), 2200);
    }
  }

  // ambient embers
  const embers = document.getElementById('embers');
  function spawnEmber(){
    const e = document.createElement('span');
    e.className = 'ember';
    e.style.left = Math.random()*100 + 'vw';
    e.style.setProperty('--drift', (Math.random()*60-30)+'px');
    e.style.animationDuration = (7 + Math.random()*6) + 's';
    e.style.opacity = 0.3 + Math.random()*0.5;
    embers.appendChild(e);
    setTimeout(() => e.remove(), 13000);
  }
  setInterval(spawnEmber, 550);
  for(let i=0;i<8;i++) setTimeout(spawnEmber, i*300);

  // magic cursor trail — little hearts/sparkles following the pointer
  const cursorTrail = document.getElementById('cursorTrail');
  const sparkEmoji = ['💗','✨','💫'];
  let lastSpark = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if(now - lastSpark < 70) return;
    lastSpark = now;
    const s = document.createElement('span');
    s.className = 'cursor-spark';
    s.textContent = sparkEmoji[Math.floor(Math.random()*sparkEmoji.length)];
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    cursorTrail.appendChild(s);
    setTimeout(() => s.remove(), 900);
  });

  goTo(0);
})();
