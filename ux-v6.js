(()=>{
  const result=document.querySelector('#result');
  const stats=document.querySelector('.stats');
  const app=document.querySelector('.app');
  if(!result||!stats||!app||typeof t==='undefined'||typeof s==='undefined') return;

  const reward=document.createElement('section');
  reward.id='rewardCard';
  reward.className='card reward-card';
  stats.insertAdjacentElement('afterend',reward);

  function grade(score){
    if(score>=95) return ['S','두 단서 해결'];
    if(score>=80) return ['A','빠른 추리'];
    if(score>=60) return ['B','좋은 추리'];
    return ['C','끝까지 해결'];
  }

  function nextMilestone(streak){
    const marks=[3,7,14,30,50,100];
    return marks.find(v=>v>streak)||null;
  }

  function renderReward(){
    const streak=Number(s.stats?.streak||0);
    const wins=Number(s.stats?.wins||0);
    const score=Number(t.score||0);
    const [rank,label]=grade(score);
    const next=nextMilestone(streak);
    const pct=next?Math.min(100,Math.round((streak/next)*100)):100;
    const remaining=next?next-streak:0;

    reward.innerHTML=`
      <div class="reward-head"><div><small>연속 기록</small><strong>🔥 ${streak}일</strong></div><div class="rank-badge ${t.won?'':'dim'}">${t.won?rank:'-'}</div></div>
      <div class="streak-track"><span style="width:${pct}%"></span></div>
      <p>${next?`다음 배지까지 <b>${remaining}일</b> · ${next}일 연속 성공 도전`:'100일 연속 기록 달성!'}</p>
      <div class="reward-mini"><span>누적 성공 <b>${wins}</b></span><span>${t.won?`${label} · ${score}점`:'오늘 문제를 풀면 등급이 표시돼요'}</span></div>`;
  }

  function addResultGrade(){
    if(!t.won) return;
    let box=document.querySelector('#resultGrade');
    if(!box){box=document.createElement('div');box.id='resultGrade';result.querySelector('#resultText').insertAdjacentElement('afterend',box);}
    const [rank,label]=grade(t.score||0);
    box.innerHTML=`<span class="result-rank">${rank}</span><div><b>${label}</b><small>단서 ${t.revealed}/5 · 오답 ${Math.max(0,t.tries-1)}회</small></div>`;
  }

  const oldRender=typeof render==='function'?render:null;
  if(oldRender){
    render=function(){oldRender();renderReward();addResultGrade();};
    render();
  } else {renderReward();addResultGrade();}

  setInterval(renderReward,1000);
})();
