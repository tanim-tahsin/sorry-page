(() => {
  const screens = Array.from(document.querySelectorAll('.screen'));
  const dots = Array.from(document.querySelectorAll('.stepper .dot'));
  let current = 0;

  const state = { date: null, place: null };

  function goTo(step){
    screens.forEach(s => s.classList.toggle('active', Number(s.dataset.screen) === step));
    dots.forEach(d => {
      const n = Number(d.dataset.step);
      d.classList.toggle('current', n === step);
      d.classList.toggle('done', n < step);
    });
    current = step;
    if(step === 5) fillSummary();
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
    slides[slideIdx].classList.remove('active');
    slideIdx = (slideIdx + 1) % slides.length;
    slides[slideIdx].classList.add('active');
  }, 3200);

  // deal button -> hearts burst + note
  const dealBtn = document.getElementById('dealBtn');
  const burstLayer = document.getElementById('burstLayer');
  const finalNote = document.getElementById('finalNote');
  const notes = [
    "thank you for reading this far.",
    "I'll be counting the hours till 8 AM.",
    "see you soon, Sadia."
  ];
  let dealt = false;
  dealBtn.addEventListener('click', () => {
    spawnHearts(24);
    if(!dealt){
      dealt = true;
      let i = 0;
      finalNote.textContent = notes[0];
      const cycle = setInterval(() => {
        i++;
        if(i >= notes.length){ clearInterval(cycle); return; }
        finalNote.style.opacity = 0;
        setTimeout(() => {
          finalNote.textContent = notes[i];
          finalNote.style.opacity = 1;
        }, 300);
      }, 2200);
      dealBtn.textContent = 'Deal ✓';
    }
  });

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

  goTo(0);
})();
