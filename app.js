(function(){
  const SECTIONS = JSON.parse(document.getElementById('sections-data').textContent);
  const PROCEDURES = JSON.parse(document.getElementById('procedures-data').textContent);
  const SIMPLIFIED = JSON.parse(document.getElementById('simplified-data').textContent);

  const app = document.getElementById('app');
  const modeButtons = document.querySelectorAll('.modebar button');
  let currentMode = 'study';

  modeButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      modeButtons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      render();
    });
  });

  function render(){
    if(currentMode==='study') renderStudyHome();
    else if(currentMode==='vocab') renderVocabHome();
    else if(currentMode==='simplified') renderSimplifiedHome('script');
    else renderTestHome();
  }

  // ---------------- SIMPLIFIED MODE ----------------
  function renderSimplifiedHome(sub){
    let html = `<div class="subnav" id="simpleSubnav">
      <button data-sub="script">Pre-Trip Script · Skript</button>
      <button data-sub="glossary">Pronunciation · Talaffuz</button>
      <button data-sub="interview">Interview Q&amp;A · Suhbat</button>
    </div>
    <div id="simpleBody"></div>`;
    app.innerHTML = html;
    document.querySelectorAll('#simpleSubnav button').forEach(b=>{
      if(b.dataset.sub===sub) b.classList.add('active');
      b.addEventListener('click', ()=>{
        document.querySelectorAll('#simpleSubnav button').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        renderSimpleBody(b.dataset.sub);
      });
    });
    renderSimpleBody(sub);
  }

  function renderSimpleBody(sub){
    const body = document.getElementById('simpleBody');
    if(sub==='script'){
      let html = `<div class="group-label">Condensed Pre-Trip Script &nbsp;·&nbsp; Qisqartirilgan pre-trip skripti</div>`;
      SIMPLIFIED.script.forEach(st=>{
        html += `<div class="stage-block">
          <h3>${st.stage_en}</h3>
          <div class="stage-uz">${st.stage_uz}</div>`;
        if(st.note_en){
          html += `<div class="stage-note"><div class="sp-en">&ldquo;${st.note_en}&rdquo;</div><div class="sp-uz">&ldquo;${st.note_uz}&rdquo;</div></div>`;
        }
        html += `<ul class="simple-list">`;
        st.items.forEach((it,i)=>{
          html += `<li><div class="snum2">${i+1}.</div><div class="stext2"><div class="en">${it.en}</div><div class="uz">${it.uz}</div></div></li>`;
        });
        html += `</ul></div>`;
      });
      body.innerHTML = html;
    } else if(sub==='glossary'){
      let html = `<div class="group-label">Phonetic Pronunciation Glossary &nbsp;·&nbsp; Fonetik talaffuz lug‘ati</div>
        <div class="gloss-wrap"><table class="glossary-table">
        <thead><tr><th>Phonetic · Fonetik</th><th>English</th><th>O‘zbekcha</th></tr></thead><tbody>`;
      SIMPLIFIED.glossary.forEach(g=>{
        html += `<tr><td class="ph">${g.ph}</td><td class="en">${g.en}</td><td class="uz">${g.uz}</td></tr>`;
      });
      html += `</tbody></table></div>`;
      body.innerHTML = html;
    } else {
      let html = `<div class="group-label">Roadside Interview Questions &amp; Answers &nbsp;·&nbsp; Yo‘lda suhbat savol-javoblari</div>`;
      SIMPLIFIED.interview.forEach(cat=>{
        html += `<div class="interview-cat"><h3>${cat.cat_en} <span style="color:var(--orange);font-style:italic;font-size:.85rem;text-transform:none;font-family:'Source Sans 3',sans-serif;">· ${cat.cat_uz}</span></h3>`;
        cat.qas.forEach(qa=>{
          html += `<div class="qa-card">
            <div class="qline"><span class="tag">Q</span>${qa.q_en}</div>
            <div class="qline-uz">${qa.q_uz}</div>
            <div class="aline"><span class="tag">A</span>${qa.a_en}</div>
            <div class="aline-uz">${qa.a_uz}</div>
          </div>`;
        });
        html += `</div>`;
      });
      body.innerHTML = html;
    }
    window.scrollTo({top:0,behavior:'smooth'});
  }

  // ---------------- VOCABULARY MODE ----------------
  function renderVocabHome(){
    let html = `<div class="group-label">Part Names Only &nbsp;·&nbsp; Faqat qism nomlari — yodlash uchun</div><div class="grid" id="grid-vocab"></div>`;
    app.innerHTML = html;
    const gv = document.getElementById('grid-vocab');
    SECTIONS.forEach((s,i)=>{
      const t = document.createElement('button');
      t.className='tile';
      t.innerHTML = `<div class="tnum">Section ${String(i+1).padStart(2,'0')}</div>
        <div class="ten">${s.title_en}</div>
        <div class="tuz">${s.title_uz}</div>
        <div class="tcount">${s.items.length} names</div>`;
      t.addEventListener('click', ()=>renderVocabSection(s));
      gv.appendChild(t);
    });
  }

  function renderVocabSection(s){
    let html = `<button class="backbtn" id="backBtn">&larr; Back · Orqaga</button>
      <div class="section-head">
        <h2>${s.title_en}</h2>
        <div class="uzsub">${s.title_uz}</div>
      </div>
      <div class="vocab-imgstrip">${s.images.map(im=>`<img src="${im.src}" alt="${im.alt}">`).join('')}</div>
      <div class="vocab-grid">`;
    s.items.forEach(it=>{
      html += `<div class="vocab-card">
        <div class="vbadge">${it.num}</div>
        <div class="vbody">
          <div class="v-en">${it.en_t}</div>
          <div class="v-uz">${it.uz_t}</div>
        </div>
      </div>`;
    });
    html += `</div>`;
    app.innerHTML = html;
    document.getElementById('backBtn').addEventListener('click', renderVocabHome);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  // ---------------- STUDY MODE ----------------
  function renderStudyHome(){
    let html = `<div class="group-label">Vehicle Walkaround &nbsp;·&nbsp; Mashina aylanma tekshiruvi</div><div class="grid" id="grid-sections"></div>`;
    html += `<div class="group-label">Procedures &amp; Rules &nbsp;·&nbsp; Tartib-qoidalar</div><div class="grid" id="grid-procedures"></div>`;
    app.innerHTML = html;

    const gs = document.getElementById('grid-sections');
    SECTIONS.forEach((s,i)=>{
      const t = document.createElement('button');
      t.className='tile';
      t.innerHTML = `<div class="tnum">Section ${String(i+1).padStart(2,'0')}</div>
        <div class="ten">${s.title_en}</div>
        <div class="tuz">${s.title_uz}</div>
        <div class="tcount">${s.items.length} items · ${s.images.length} photo${s.images.length>1?'s':''}</div>`;
      t.addEventListener('click', ()=>renderSectionDetail(s));
      gs.appendChild(t);
    });

    const gp = document.getElementById('grid-procedures');
    PROCEDURES.forEach((p)=>{
      const t = document.createElement('button');
      t.className='tile';
      t.innerHTML = `<div class="tnum">Procedure</div>
        <div class="ten">${p.title_en}</div>
        <div class="tuz">${p.title_uz}</div>
        <div class="tcount">${p.steps.length} steps</div>`;
      t.addEventListener('click', ()=>renderProcedureDetail(p));
      gp.appendChild(t);
    });
  }

  function renderSectionDetail(s){
    let html = `<button class="backbtn" id="backBtn">&larr; Back · Orqaga</button>
      <div class="section-head">
        <h2>${s.title_en}</h2>
        <div class="uzsub">${s.title_uz}</div>
      </div>
      <div class="imgrow">${s.images.map(im=>`<img src="${im.src}" alt="${im.alt}">`).join('')}</div>
      <div class="items">`;
    s.items.forEach(it=>{
      html += `<div class="itemcard">
        <div class="badge">${it.num}</div>
        <div class="body">
          <div><span class="langflag">EN</span></div>
          <div class="en-t">${it.en_t}</div>
          <div class="en-d">${it.en_d}</div>
          <hr>
          <div><span class="langflag">UZ</span></div>
          <div class="uz-t">${it.uz_t}</div>
          <div class="uz-d">${it.uz_d}</div>
        </div>
      </div>`;
    });
    html += `</div>`;
    app.innerHTML = html;
    document.getElementById('backBtn').addEventListener('click', renderStudyHome);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function renderProcedureDetail(p){
    let html = `<button class="backbtn" id="backBtn">&larr; Back · Orqaga</button>
      <div class="section-head">
        <h2>${p.title_en}</h2>
        <div class="uzsub">${p.title_uz}</div>
      </div>`;
    if(p.image){
      html += `<div class="imgrow"><img src="${p.image}" alt="${p.title_en}"></div>`;
    }
    html += `<ul class="steplist">`;
    p.steps.forEach((st,i)=>{
      html += `<li><div class="snum">${i+1}</div><div class="stext"><div class="en">${st.en}</div><div class="uz">${st.uz}</div></div></li>`;
    });
    html += `</ul>`;
    app.innerHTML = html;
    document.getElementById('backBtn').addEventListener('click', renderStudyHome);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  // ---------------- TEST MODE ----------------
  function renderTestHome(){
    let html = `<div class="group-label">Image Identification Quiz &nbsp;·&nbsp; Rasm bo‘yicha test</div>
      <div class="quiz-select" id="qs-image"></div>
      <div class="group-label">Knowledge Check &nbsp;·&nbsp; Bilim tekshiruvi</div>
      <div class="quiz-select" id="qs-text"></div>`;
    app.innerHTML = html;

    const qsi = document.getElementById('qs-image');
    const randAll = document.createElement('button');
    randAll.className='tile random';
    randAll.innerHTML = `Random Mix · All Sections<span class="qsub">Aralash savollar · Barcha bo‘limlar</span>`;
    randAll.addEventListener('click', ()=>startImageQuiz(null));
    qsi.appendChild(randAll);
    SECTIONS.forEach(s=>{
      const b = document.createElement('button');
      b.innerHTML = `${s.title_en}<span class="qsub">${s.title_uz} · ${s.labels.length} Q</span>`;
      b.addEventListener('click', ()=>startImageQuiz(s.id));
      qsi.appendChild(b);
    });

    const qst = document.getElementById('qs-text');
    PROCEDURES.forEach(p=>{
      const b = document.createElement('button');
      b.innerHTML = `${p.title_en}<span class="qsub">${p.title_uz} · ${p.quiz.length} Q</span>`;
      b.addEventListener('click', ()=>startTextQuiz(p.id));
      qst.appendChild(b);
    });
  }

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  // Build a flat pool of all image labels across all sections (for distractors & random mode)
  function allLabelPool(){
    let pool = [];
    SECTIONS.forEach(s=>{
      s.labels.forEach(l=>pool.push({en:l.en, uz:l.uz}));
    });
    return pool;
  }

  function startImageQuiz(sectionId){
    let questions = [];
    const pool = allLabelPool();
    const sourceSections = sectionId ? SECTIONS.filter(s=>s.id===sectionId) : SECTIONS;
    sourceSections.forEach(s=>{
      s.labels.forEach(l=>{
        questions.push({
          type:'image',
          img: s.images[l.img].src,
          marker: l.marker,
          correctEn: l.en,
          correctUz: l.uz,
          sectionTitle: s.title_en
        });
      });
    });
    questions = shuffle(questions);
    if(!sectionId) questions = questions.slice(0, 15); // random mix cap
    runQuiz(questions, pool);
  }

  function startTextQuiz(procId){
    const p = PROCEDURES.find(x=>x.id===procId);
    let questions = p.quiz.map(q=>({
      type:'text',
      q_en:q.q_en, q_uz:q.q_uz,
      opts_en:q.opts_en, opts_uz:q.opts_uz,
      correctIdx:q.correct
    }));
    questions = shuffle(questions);
    runQuiz(questions, null);
  }

  function runQuiz(questions, distractorPool){
    let idx = 0;
    let score = 0;

    function renderQuestion(){
      if(idx >= questions.length){
        renderSummary();
        return;
      }
      const q = questions[idx];
      let optionsHtml = '';
      let correctPos = 0;

      if(q.type==='image'){
        // build 4 options: correct + 3 random distractors from pool (excluding same text)
        let distractors = shuffle(distractorPool.filter(d=>d.en!==q.correctEn));
        // ensure uniqueness of english text
        const seen = new Set([q.correctEn]);
        const chosen = [];
        for(const d of distractors){
          if(chosen.length>=3) break;
          if(seen.has(d.en)) continue;
          seen.add(d.en);
          chosen.push(d);
        }
        let opts = shuffle([{en:q.correctEn,uz:q.correctUz,correct:true}, ...chosen.map(c=>({...c,correct:false}))]);
        optionsHtml = opts.map((o,i)=>`<button data-correct="${o.correct}" data-i="${i}">
            <div class="oen">${o.en}</div><div class="ouz">${o.uz}</div>
          </button>`).join('');

        app.innerHTML = `
          <div class="quizbox">
            <div class="quiz-progress"><span>Question ${idx+1} / ${questions.length}</span><span class="score">Score: ${score}</span></div>
            <div class="quizimg-wrap"><img src="${q.img}" alt="quiz"></div>
            <div class="quiz-question">What is the part labeled <span class="marker-badge">${q.marker}</span>?<br><span style="font-size:.85rem;color:var(--steel);text-transform:none;font-family:'Source Sans 3',sans-serif;">Doiracha ${q.marker} bilan belgilangan qism nima?</span></div>
            <div class="quiz-options">${optionsHtml}</div>
            <div class="quiz-feedback" id="qfeedback"></div>
            <div class="quiz-nextrow" id="nextrow"></div>
          </div>
          <div style="text-align:center;margin-top:14px;"><button class="backbtn" id="backBtn">&larr; Choose another test · Boshqa testni tanlash</button></div>
        `;
      } else {
        optionsHtml = q.opts_en.map((o,i)=>`<button data-correct="${i===q.correctIdx}" data-i="${i}">
            <div class="oen">${o}</div><div class="ouz">${q.opts_uz[i]}</div>
          </button>`).join('');

        app.innerHTML = `
          <div class="quizbox">
            <div class="quiz-progress"><span>Question ${idx+1} / ${questions.length}</span><span class="score">Score: ${score}</span></div>
            <div class="quiz-question">${q.q_en}<br><span style="font-size:.85rem;color:var(--steel);text-transform:none;font-family:'Source Sans 3',sans-serif;">${q.q_uz}</span></div>
            <div class="quiz-options">${optionsHtml}</div>
            <div class="quiz-feedback" id="qfeedback"></div>
            <div class="quiz-nextrow" id="nextrow"></div>
          </div>
          <div style="text-align:center;margin-top:14px;"><button class="backbtn" id="backBtn">&larr; Choose another test · Boshqa testni tanlash</button></div>
        `;
      }

      document.getElementById('backBtn').addEventListener('click', renderTestHome);

      const optBtns = app.querySelectorAll('.quiz-options button');
      optBtns.forEach(b=>{
        b.addEventListener('click', ()=>{
          optBtns.forEach(x=>x.disabled=true);
          const isCorrect = b.dataset.correct === 'true';
          const fb = document.getElementById('qfeedback');
          if(isCorrect){
            b.classList.add('correct');
            score++;
            fb.textContent = 'Correct! · To‘g‘ri!';
            fb.className = 'quiz-feedback correct';
          } else {
            b.classList.add('wrong');
            optBtns.forEach(x=>{ if(x.dataset.correct==='true') x.classList.add('correct'); });
            fb.textContent = 'Not quite · Unday emas';
            fb.className = 'quiz-feedback wrong';
          }
          const nr = document.getElementById('nextrow');
          const nb = document.createElement('button');
          nb.className='btn-next';
          nb.textContent = (idx+1 < questions.length) ? 'Next · Keyingi' : 'See results · Natijalar';
          nb.addEventListener('click', ()=>{ idx++; renderQuestion(); });
          nr.appendChild(nb);
        });
      });
    }

    function renderSummary(){
      const pct = Math.round((score/questions.length)*100);
      app.innerHTML = `
        <div class="quizbox quiz-summary">
          <div class="group-label" style="border:none;justify-content:center;">Test Complete · Test yakunlandi</div>
          <div class="big">${score} / ${questions.length}</div>
          <div class="lbl">${pct}% correct · to‘g‘ri javoblar</div>
          <div class="quiz-nextrow" style="margin-top:22px;gap:10px;">
            <button class="btn-next" id="retryBtn">Try Again · Qayta urinish</button>
          </div>
        </div>
        <div style="text-align:center;margin-top:14px;"><button class="backbtn" id="backBtn">&larr; Choose another test · Boshqa testni tanlash</button></div>
      `;
      document.getElementById('backBtn').addEventListener('click', renderTestHome);
      document.getElementById('retryBtn').addEventListener('click', ()=>{ idx=0; score=0; questions=shuffle(questions); renderQuestion(); });
    }

    renderQuestion();
  }

  render();
})();
