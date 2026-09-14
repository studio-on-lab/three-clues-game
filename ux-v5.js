(()=>{
  const form=document.querySelector('#form');
  const input=document.querySelector('#answer');
  const msg=document.querySelector('#msg');
  const result=document.querySelector('#result');
  const hint=document.querySelector('#hint');
  const clues=document.querySelector('#clues');
  if(!form||!input||!msg||!result) return;

  const attemptBox=document.createElement('div');
  attemptBox.id='attemptBox';
  attemptBox.setAttribute('aria-live','polite');
  msg.insertAdjacentElement('afterend',attemptBox);

  const progress=document.createElement('div');
  progress.id='clueProgress';
  clues.insertAdjacentElement('afterend',progress);

  const tomorrow=document.createElement('div');
  tomorrow.id='tomorrowBox';
  tomorrow.className='tomorrow-box hidden';
  result.appendChild(tomorrow);

  function wrongCount(){ return Math.max(0,(t?.tries||0)-(t?.won?1:0)); }

  function renderAttempts(){
    const n=wrongCount();
    attemptBox.innerHTML=n?`<span class="attempt-label">오답</span>${Array.from({length:n},(_,i)=>`<span class="attempt-chip">${i+1}</span>`).join('')}`:'';
  }

  function renderProgress(){
    if(typeof t==='undefined') return;
    const used=Math.min(5,t.revealed||2);
    progress.innerHTML=`<span>현재 단서 <b>${used}/5</b></span><span>${t.won?'정답 완료':'적은 단서로 맞힐수록 고득점'}</span>`;
  }

  function secondsToTomorrowKST(){
    const now=new Date();
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',hour12:false,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}).formatToParts(now);
    const get=k=>Number(parts.find(x=>x.type===k).value);
    const kstAsUTC=Date.UTC(get('year'),get('month')-1,get('day'),get('hour')%24,get('minute'),get('second'));
    const next=Date.UTC(get('year'),get('month')-1,get('day')+1,0,0,0);
    return Math.max(0,Math.floor((next-kstAsUTC)/1000));
  }

  function renderTomorrow(){
    if(typeof t==='undefined'||!t.won){tomorrow.classList.add('hidden');return;}
    const sec=secondsToTomorrowKST();
    const h=String(Math.floor(sec/3600)).padStart(2,'0');
    const m=String(Math.floor((sec%3600)/60)).padStart(2,'0');
    const s2=String(sec%60).padStart(2,'0');
    tomorrow.classList.remove('hidden');
    tomorrow.innerHTML=`<small>다음 문제까지</small><strong>${h}:${m}:${s2}</strong><span>내일 새로운 단어가 열려요</span>`;
  }

  form.addEventListener('submit',()=>{
    const before=typeof t!=='undefined'?t.tries:0;
    setTimeout(()=>{
      if(typeof t==='undefined') return;
      if(t.tries>before && !t.won){
        input.classList.remove('wrong-shake'); void input.offsetWidth; input.classList.add('wrong-shake');
        msg.textContent=`아쉽다! 오답 ${wrongCount()}회. 다른 연결고리를 생각해봐.`;
        input.value='';
        input.focus();
      }
      if(t.won){
        input.blur();
        const share=document.querySelector('#share');
        if(share) share.textContent='결과 공유하기';
      }
      renderAttempts(); renderProgress(); renderTomorrow();
    },0);
  });

  if(hint) hint.addEventListener('click',()=>setTimeout(()=>{renderProgress();},0));

  const oldRender=typeof render==='function'?render:null;
  if(oldRender){
    render=function(){ oldRender(); renderAttempts(); renderProgress(); renderTomorrow(); };
    render();
  } else { renderAttempts(); renderProgress(); renderTomorrow(); }

  setInterval(renderTomorrow,1000);
})();
