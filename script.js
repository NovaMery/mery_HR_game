'use strict';
const $=id=>document.getElementById(id);
const BANK=window.HR_QUESTIONS||[];
const LEVELS=[
 {id:1,title:'HR Basics',sub:'HRM · human capital · VUCA/BANI',a:'#ffc4df',b:'#d7e8ff'},
 {id:2,title:'Het model van Ulrich',sub:'Vier rollen · acht competenties',a:'#c5f4e7',b:'#b5e0fc'},
 {id:3,title:'Strategisch management',sub:'SWOT · missie · visie · HR-fit',a:'#f79ab0',b:'#ffde8a'},
 {id:4,title:'HR-modellen',sub:'Michigan · Harvard · Employee Lifecycle',a:'#ddd2ff',b:'#f7cbe8'},
 {id:5,title:'Structuur & cultuur',sub:'Fresh@Work · BrightWay · Handy',a:'#c9ecc9',b:'#e0f0af'},
 {id:6,title:'Arbeidsmarkt & actoren',sub:'VDAB · RVA · overleg · IBO',a:'#b9e0ff',b:'#d4ecff'},
 {id:7,title:'Terminologie',sub:'HR-begrippen en afkortingen',a:'#ead2ff',b:'#ffcfe2'}
];
// v2 prevents old, mismatched answer data from earlier releases being restored.
const STORAGE='meryem-hr-game-v2';let saved={xp:0,reports:{},missed:{}};
try{const v=JSON.parse(localStorage.getItem(STORAGE)||'null');if(v&&typeof v==='object')saved={...saved,...v}}catch{}
const store=()=>{try{localStorage.setItem(STORAGE,JSON.stringify(saved))}catch{}};
const shuffled=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
let chapter=null,queue=[],idx=0,roundScore=0,roundResults=[],mistakes=[],selected=false,answerMap=[],correctStreak=0,wrongStreak=0,lastWrong=false,isReview=false;
let popupTimer=0,thinkingTimer=0,longTimer=0,veryLongTimer=0;
// Independent music and effect channels. Sound effects do not pause/change either track.
const calm=$('calmMusic'),rat=$('ratMusic');calm.volume=.12;rat.volume=.10;
let musicOn=true,musicActivated=false,phase='calm',phaseTimer=null;
const DURATIONS={calm:75000,rat:42000};
function switchMusic(newPhase){
 clearTimeout(phaseTimer);phaseTimer=null;phase=newPhase;
 calm.pause();rat.pause();if(!musicOn||!musicActivated)return;
 const track=phase==='calm'?calm:rat;
 track.currentTime=0;
 if(!document.hidden)track.play().catch(()=>{});
 phaseTimer=setTimeout(()=>switchMusic(phase==='calm'?'rat':'calm'),DURATIONS[phase]);
}
function beginMusic(){if(!musicOn)return; if(!musicActivated){musicActivated=true;switchMusic('calm')}else if(!phaseTimer){switchMusic(phase)}else if(!document.hidden)(phase==='calm'?calm:rat).play().catch(()=>{})}
$('musicBtn').onclick=()=>{musicOn=!musicOn;$('musicBtn').textContent=musicOn?'♫ Muziek aan':'♫ Muziek uit';$('musicBtn').setAttribute('aria-pressed',String(musicOn));if(musicOn)beginMusic();else{clearTimeout(phaseTimer);phaseTimer=null;calm.pause();rat.pause()}};
document.addEventListener('visibilitychange',()=>{if(document.hidden){calm.pause();rat.pause()}else if(musicOn&&musicActivated)(phase==='calm'?calm:rat).play().catch(()=>{})});
const SOUNDS={correct:'positive-win.mp3',wrong:'fahhhhhhhhhhhhhh.mp3',chapter:'chapter-jingle.mp3',obvious:'big-laugh.mp3',streak:'rizz.mp3',recover:'recover.mp3',comeback:'comeback.mp3',manyWrong:'wrong-streak.mp3',sad:'sad-cat.mp3',minute:'phone-ringing.mp3',twoMinutes:'GET OUT.mp3'};
function sfx(key,volume=.38){const file=SOUNDS[key];if(!file)return;const a=new Audio('assets/'+encodeURIComponent(file));a.volume=volume;a.play().catch(()=>{});a.addEventListener('ended',()=>{a.src=''}, {once:true})}
function hideMeme(){clearTimeout(popupTimer);$('memePopup').hidden=true}
function showMeme(src,text,duration=2700){hideMeme();$('memeImg').src='assets/'+src;$('memeCaption').textContent=text;$('memePopup').hidden=false;popupTimer=setTimeout(()=>{$('memePopup').hidden=true},duration)}
function clearThinking(){clearTimeout(thinkingTimer);clearTimeout(longTimer);clearTimeout(veryLongTimer)}
function startThinking(){clearThinking();thinkingTimer=setTimeout(()=>{if(!selected)showMeme('bear-helper.gif','Neem rustig je tijd.',2300)},14000);longTimer=setTimeout(()=>{if(!selected)sfx('minute',.23)},60000);veryLongTimer=setTimeout(()=>{if(!selected)sfx('twoMinutes',.22)},120000)}
function renderChapters(){
 $('chapterGrid').innerHTML='';
 for(const level of LEVELS){const count=BANK.filter(q=>q.chapter===level.id).length;const report=saved.reports[level.id];const btn=document.createElement('button');btn.className='chapter';btn.style.setProperty('--start',level.a);btn.style.setProperty('--end',level.b);btn.type='button';
 const badge=report?`<span class="best">Beste: ${report.best}%</span>`:'';
 btn.innerHTML=`<small>${level.id===7?'BONUS':`HOOFDSTUK 0${level.id}`}</small>${badge}<h3>${level.title}</h3><p>${level.sub} · ${count} vragen</p>`;
 btn.onclick=()=>start(level.id);$('chapterGrid').appendChild(btn)}
 $('totalXP').textContent=saved.xp+' XP';$('bankSize').textContent=BANK.length;
}
function switchView(view){$('welcome').hidden=view!=='select';$('selectView').hidden=view!=='select';$('quizView').hidden=view!=='quiz';$('resultView').hidden=view!=='result';window.scrollTo({top:0,behavior:'instant'})}
function start(id,review=false){
 chapter=id;document.body.dataset.chapter=id;isReview=review;roundResults=[];mistakes=[];idx=0;roundScore=0;correctStreak=0;wrongStreak=0;lastWrong=false;
 const all=BANK.filter(q=>q.chapter===id);
 const missedIds=new Set(saved.missed[id]||[]);
 queue=shuffled(review?all.filter(q=>missedIds.has(q.id)):all);
 if(!queue.length){queue=shuffled(all);isReview=false}
 $('chapterTitle').textContent=LEVELS[id-1].title;$('chapterLabel').textContent=isReview?'HERHALING VAN JE FOUTEN':id===7?'BONUSLEVEL':'HOOFDSTUK '+id;
 switchView('quiz');beginMusic();renderQuestion();
}
function renderQuestion(){
 hideMeme();clearThinking();
 if(idx>=queue.length){finish();return}
 selected=false;const q=queue[idx];
 $('questionCount').textContent=`${idx+1} / ${queue.length}`;$('roundScore').textContent=roundScore+' / '+(queue.length*10)+' punten';$('progressFill').style.width=`${idx/queue.length*100}%`;
 $('topicLabel').textContent=q.tag;$('questionText').textContent=q.question;
 $('feedback').hidden=true;$('nextBtn').disabled=true;$('nextBtn').innerHTML=(idx===queue.length-1?'Resultaat bekijken':'Volgende vraag')+' <span>→</span>';
 // The answer buttons are rebuilt from this exact question EVERY time. Never reuse stale options.
 const shuffledOptions=shuffled(q.options.map((label,original)=>({label,original})));
 answerMap=shuffledOptions;
 const area=$('answerOptions');area.replaceChildren();
 shuffledOptions.forEach((o,i)=>{const b=document.createElement('button');b.type='button';b.className='answer';b.dataset.index=String(i);const badge=document.createElement('span');badge.className='letter';badge.textContent='ABCD'[i];const label=document.createElement('span');label.textContent=o.label;b.append(badge,label);b.onclick=()=>choose(i);area.appendChild(b)});
 startThinking();
}
function choose(displayIndex){
 if(selected)return;
 const q=queue[idx],picked=answerMap[displayIndex];if(!q||!picked)return;
 selected=true;clearThinking();const correct=picked.original===q.answer;
 document.querySelectorAll('#answerOptions .answer').forEach((btn,i)=>{btn.disabled=true;if(answerMap[i].original===q.answer)btn.classList.add('correct');if(i===displayIndex&&!correct)btn.classList.add('wrong')});
 if(correct){roundScore+=10;saved.xp+=10;correctStreak++;const returning=lastWrong;wrongStreak=0;
   if(returning){sfx('recover',.25);showMeme('comeback-bear.jpg','Weer goed bezig.')}else if(correctStreak===3){sfx('streak',.25);showMeme('gang.png','Drie op een rij!')}else{ sfx('correct',.18);const images=['correct-cat-thumbs.png','correct-sketch-thumbs.png','panda-happy.png','correct-okay.png','streak-highfive.png','correct-getting-better.png'];showMeme(images[Math.floor(Math.random()*images.length)],'Juist antwoord.')}lastWrong=false;
 }else{correctStreak=0;wrongStreak++;lastWrong=true;mistakes.push(q.id);
    if(wrongStreak>=3){sfx('manyWrong',.28);showMeme(wrongStreak>=5?'side-eye-fish.jpg':'wrong-streak-face.jpg','Deze nemen we straks opnieuw.')}else if(q.question.toLowerCase().includes('vuCA'.toLowerCase())||q.question.toLowerCase().includes('wat betekent de')){sfx('obvious',.22);showMeme('obvious-mistake.png','Bijna. Kijk naar de uitleg.')}else{sfx('wrong',.23);showMeme(['wrong-side-eye.png','wrong-surprised.png'][Math.floor(Math.random()*2)],'Niet helemaal. Lees even waarom.')}}
 roundResults.push({id:q.id,tag:q.tag,correct});
 $('feedbackTitle').textContent=correct?'Juist!':'Dit was het juiste antwoord:';
 const correctText=q.options[q.answer];$('feedbackText').textContent=(correct?'':correctText+'. ')+q.explanation;
 $('feedback').hidden=false;$('nextBtn').disabled=false;$('roundScore').textContent=roundScore+' / '+(queue.length*10)+' punten';
 store();
}
function finish(){
 clearThinking();hideMeme();
 const total=roundResults.length,good=roundResults.filter(r=>r.correct).length,bad=total-good,pct=total?Math.round(good/total*100):0;
 const oldBest=saved.reports[chapter]?.best||0;
 saved.reports[chapter]={best:Math.max(oldBest,pct),last:pct,good,total};
 const known=new Set(saved.missed[chapter]||[]);
 // Answering a question correctly in any round removes it from weak points; wrong adds it back.
 for(const r of roundResults){if(r.correct)known.delete(r.id);else known.add(r.id)}
 saved.missed[chapter]=[...known];store();renderChapters();switchView('result');
 $('resultTitle').textContent=LEVELS[chapter-1].title;
 $('resultDescription').textContent=pct>=80?'Je kent dit hoofdstuk al behoorlijk goed.':pct>=60?'Goed gewerkt. Je kunt de fouten nog kort herhalen.':'Je weet nu welke begrippen je best nog oefent.';
 $('resultStats').innerHTML=`<div><b>${roundScore} / ${total*10}</b><small>Punten</small></div><div><b>${pct}%</b><small>Juist</small></div><div><b>${bad}</b><small>Fout</small></div>`;
 const topics={};for(const r of roundResults){if(!topics[r.tag])topics[r.tag]={wrong:0,total:0};topics[r.tag].total++;if(!r.correct)topics[r.tag].wrong++}
 const weak=Object.entries(topics).filter(([k,v])=>v.wrong>0).sort((a,b)=>b[1].wrong-a[1].wrong);
 $('weakTopics').replaceChildren();const h=document.createElement('h3');h.textContent='Jouw zwakke punten';$('weakTopics').appendChild(h);
 const p=document.createElement('p');p.textContent=weak.length?weak.map(([name,v])=>`${name}: ${v.wrong} fout`).join(' · '):'Geen fouten in deze ronde. Goed gedaan!';$('weakTopics').appendChild(p);
 $('retryBtn').hidden=!known.size;if(good===total&&total>0)sfx('chapter',.2);
}
$('nextBtn').onclick=()=>{if(!selected)return;idx++;renderQuestion()};
$('homeBtn').onclick=$('backBtn').onclick=$('chooseBtn').onclick=()=>{clearThinking();hideMeme();document.body.dataset.chapter=1;renderChapters();switchView('select')};
$('retryBtn').onclick=()=>start(chapter,true);$('repeatBtn').onclick=()=>start(chapter);
document.addEventListener('keydown',event=>{if($('quizView').hidden||event.altKey||event.ctrlKey||event.metaKey)return;if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;const n=Number(event.key);if(n>=1&&n<=4&&!selected)document.querySelector(`#answerOptions .answer[data-index="${n-1}"]`)?.click();if(event.key==='Enter'&&selected)$('nextBtn').click()});
renderChapters();switchView('select');
