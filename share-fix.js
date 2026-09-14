(()=>{
  const share=document.querySelector('#share');
  if(!share) return;

  const rank=()=>{
    if(typeof t==='undefined') return '-';
    if(t.score>=95) return 'S';
    if(t.score>=80) return 'A';
    if(t.score>=60) return 'B';
    return 'C';
  };

  const buildText=()=>{
    if(typeof t==='undefined'||!t.won) return '';
    const used=Math.min(5,Math.max(2,t.revealed||2));
    const cells=Array.from({length:5},(_,i)=>i<used?'■':'□').join('');
    const streak=(typeof s!=='undefined'&&s.stats)?s.stats.streak:0;
    const day=(typeof di!=='undefined')?di+1:'';
    return [
      `세잇단서 DAY ${day}`,
      `${rank()}등급 · ${t.score}점`,
      `${cells} ${used}/5 단서`,
      streak>1?`🔥 ${streak}일 연속 성공`:'',
      '',
      '오늘의 단어를 맞혀보세요 👇',
      'https://studio-on-lab.github.io/three-clues-game/'
    ].filter(Boolean).join('\n');
  };

  share.onclick=async()=>{
    const text=buildText();
    if(!text) return;
    try{
      if(navigator.share){
        await navigator.share({title:'세잇단서',text});
        return;
      }
      await navigator.clipboard.writeText(text);
      const old=share.textContent;
      share.textContent='결과가 복사됐어요!';
      setTimeout(()=>share.textContent=old,1800);
    }catch(err){
      if(err&&err.name==='AbortError') return;
      try{
        const area=document.createElement('textarea');
        area.value=text; area.style.position='fixed'; area.style.opacity='0';
        document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
        const old=share.textContent;
        share.textContent='결과가 복사됐어요!';
        setTimeout(()=>share.textContent=old,1800);
      }catch(_){
        alert('공유에 실패했어요. 잠시 후 다시 시도해 주세요.');
      }
    }
  };
})();
