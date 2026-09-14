(()=>{
  const gameCard=document.querySelector('section.card');
  const result=document.querySelector('#result');
  const share=document.querySelector('#share');
  if(!gameCard||!result) return;

  // 첫 화면에 오늘의 도전 헤더 추가
  const hero=document.createElement('div');
  hero.className='game-hero';
  hero.innerHTML='<div><span class="hero-kicker">TODAY</span><strong>두 단서로 시작해 보세요</strong><small>추가 단서는 1분마다 하나씩 열립니다.</small></div><div class="hero-mark">5</div>';
  const h2=gameCard.querySelector('h2');
  if(h2){ h2.textContent='이 단서들이 가리키는 단어는?'; h2.insertAdjacentElement('beforebegin',hero); }

  // 입력 도움말
  const form=document.querySelector('#form');
  if(form){
    const helper=document.createElement('div');
    helper.className='answer-helper';
    helper.textContent='띄어쓰기는 달라도 정답으로 인정돼요';
    form.insertAdjacentElement('afterend',helper);
  }

  // 결과 공유 미리보기 카드
  const preview=document.createElement('div');
  preview.id='sharePreview';
  preview.className='share-preview hidden';
  result.insertBefore(preview,share||null);

  function rank(){
    if(typeof t==='undefined') return '-';
    if(t.score>=95) return 'S';
    if(t.score>=80) return 'A';
    if(t.score>=60) return 'B';
    return 'C';
  }
  function updatePreview(){
    if(typeof t==='undefined'||!t.won){preview.classList.add('hidden');return;}
    const used=t.revealed||2;
    const cells=Array.from({length:5},(_,i)=>`<span class="share-cell ${i<used?'on':''}"></span>`).join('');
    preview.classList.remove('hidden');
    preview.innerHTML=`<small>공유하면 정답은 숨겨져요</small><div class="share-line"><b>세잇단서 DAY ${typeof di!=='undefined'?di+1:''}</b><strong>${rank()}등급</strong></div><div class="share-cells">${cells}</div><span>${used}개 단서 · ${t.score}점</span>`;
  }

  const oldRender=typeof render==='function'?render:null;
  if(oldRender){
    render=function(){oldRender();updatePreview();};
    render();
  } else updatePreview();

  if(share){
    share.textContent='친구에게 결과 공유하기';
    share.insertAdjacentHTML('afterend','<p class="share-note">정답은 공개되지 않아요. 친구도 오늘 문제에 도전할 수 있어요.</p>');
  }
})();
