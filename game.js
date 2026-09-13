const puzzles = [
  { answer:"열쇠", clues:["문","자물쇠","비밀"], hint:"없으면 열기 어렵습니다." },
  { answer:"우산", clues:["비","손잡이","접다"], hint:"젖지 않게 도와줍니다." },
  { answer:"도서관", clues:["책","대출","조용함"], hint:"많은 자료를 빌려볼 수 있는 공간입니다." },
  { answer:"신호등", clues:["빨강","노랑","초록"], hint:"길에서 멈춤과 진행을 알려줍니다." },
  { answer:"냉장고", clues:["차갑다","주방","보관"], hint:"음식을 오래 보관할 때 씁니다." },
  { answer:"달력", clues:["날짜","월","약속"], hint:"일정을 확인할 때 자주 봅니다." },
  { answer:"지도", clues:["길","방향","위치"], hint:"낯선 곳에서 목적지를 찾을 때 유용합니다." },
  { answer:"영수증", clues:["결제","금액","증빙"], hint:"무엇을 얼마에 샀는지 보여줍니다." },
  { answer:"엘리베이터", clues:["층","버튼","문"], hint:"건물 안에서 위아래로 이동합니다." },
  { answer:"배터리", clues:["충전","전기","잔량"], hint:"전자기기가 작동할 에너지를 저장합니다." },
  { answer:"거울", clues:["반사","얼굴","유리"], hint:"내 모습을 확인할 때 씁니다." },
  { answer:"체온계", clues:["온도","열","측정"], hint:"몸 상태를 숫자로 확인하는 도구입니다." }
];

const $ = (s) => document.querySelector(s);
const stateKey = "threeCluesStateV1";

function getKoreaDayIndex(){
  const now = new Date();
  const kst = new Date(now.toLocaleString("en-US",{timeZone:"Asia/Seoul"}));
  const start = new Date("2026-09-14T00:00:00+09:00");
  const diff = Math.floor((kst - start) / 86400000);
  return Math.max(0,diff);
}
const dayIndex = getKoreaDayIndex();
const puzzle = puzzles[dayIndex % puzzles.length];

let state = JSON.parse(localStorage.getItem(stateKey) || "{}");
state.stats ||= {wins:0,streak:0,lastWinDay:null};
state.days ||= {};
state.days[dayIndex] ||= {tries:0,revealed:2,won:false};
const today = state.days[dayIndex];

function save(){ localStorage.setItem(stateKey, JSON.stringify(state)); }

function normalize(v){
  return v.trim().replace(/\s+/g,"").toLowerCase();
}

function render(){
  $("#dayBadge").textContent = `DAY ${dayIndex + 1}`;
  $("#clues").innerHTML = "";
  puzzle.clues.forEach((clue,i)=>{
    const d=document.createElement("div");
    d.className="clue"+(i<today.revealed?"":" locked");
    d.textContent = i<today.revealed ? clue : "단서 잠김";
    $("#clues").appendChild(d);
  });
  $("#tries").textContent=today.tries;
  $("#streak").textContent=state.stats.streak;
  $("#wins").textContent=state.stats.wins;
  $("#hintBtn").disabled=today.revealed>=3 || today.won;
  $("#answerInput").disabled=today.won;
  if(today.won) showResult(false);
}

function win(){
  today.won=true;
  const prev = state.stats.lastWinDay;
  if(prev !== dayIndex){
    state.stats.wins += 1;
    state.stats.streak = prev === dayIndex - 1 ? state.stats.streak + 1 : 1;
    state.stats.lastWinDay = dayIndex;
  }
  save();
  $("#feedback").textContent="정답! 오늘의 문제를 해결했어요.";
  showResult(true);
  render();
}

function showResult(scroll=true){
  $("#resultCard").classList.remove("hidden");
  $("#resultTitle").textContent=`정답: ${puzzle.answer}`;
  $("#resultCopy").textContent=`${today.tries}번의 시도 만에 성공 · 연속 ${state.stats.streak}일`;
  if(scroll) $("#resultCard").scrollIntoView({behavior:"smooth",block:"center"});
}

$("#answerForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  if(today.won) return;
  const v=$("#answerInput").value;
  if(!v.trim()) return;
  today.tries += 1;
  if(normalize(v)===normalize(puzzle.answer)){
    win();
  }else{
    $("#feedback").textContent="아직 아니에요. 단서 사이의 연결고리를 떠올려보세요.";
    $("#answerInput").select();
    save(); render();
  }
});

$("#hintBtn").addEventListener("click",()=>{
  if(today.revealed<3){
    today.revealed += 1;
    $("#feedback").textContent = today.revealed===3 ? `힌트: ${puzzle.hint}` : "새 단서가 열렸어요.";
    save(); render();
  }
});

$("#shareBtn").addEventListener("click", async ()=>{
  const text=`세잇단서 DAY ${dayIndex+1}\n${"●".repeat(Math.min(today.tries,6))} ${today.tries}번 만에 성공\n연속 ${state.stats.streak}일`;
  try{
    if(navigator.share) await navigator.share({title:"세잇단서",text});
    else { await navigator.clipboard.writeText(text); alert("결과를 복사했어요."); }
  }catch(e){}
});

const modal=$("#modal");
function openModal(title,html){
  $("#modalTitle").textContent=title;
  $("#modalBody").innerHTML=html;
  modal.showModal();
}
$("#helpBtn").onclick=()=>openModal("게임 방법",`
  <p>매일 세 개의 단서가 하나의 정답을 가리킵니다.</p>
  <p>처음에는 일부 단서만 공개되며, 필요하면 추가 단서를 열 수 있습니다. 정답은 하루에 하나입니다.</p>
  <p>기록은 이 기기의 브라우저에만 저장됩니다.</p>`);
$("#privacyBtn").onclick=()=>openModal("개인정보 안내",`
  <p>현재 버전은 회원가입, 이름, 이메일, 전화번호 등 개인정보를 수집하지 않습니다.</p>
  <p>게임 기록은 브라우저의 localStorage에만 저장되며 서버로 전송하지 않습니다.</p>
  <p>향후 광고·분석 도구를 추가할 경우 실제 사용 도구에 맞춰 개인정보처리방침과 쿠키 안내를 별도로 업데이트해야 합니다.</p>`);
$("#legalBtn").onclick=()=>openModal("권리 안내",`
  <p>본 서비스의 이름, 화면 구성, 문구, 문제 데이터와 소스코드는 독자적으로 작성되었습니다.</p>
  <p>타 게임의 로고, 화면 캡처, 문제 데이터, 캐릭터, 음악, 이미지 또는 고유 문구를 사용하지 않습니다.</p>
  <p>정식 출시 전 서비스명에 대한 상표 선행검색을 권장합니다.</p>`);
$("#closeModal").onclick=()=>modal.close();
modal.addEventListener("click",(e)=>{ if(e.target===modal) modal.close(); });

render();
