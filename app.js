(() => {
  'use strict';
  const game=document.getElementById('stadtbus-game'), status=document.getElementById('board-status'), body=document.getElementById('scores');
  const api=window.SURFER_CONFIG.apiBase.replace(/\/$/,'');
  const send=data=>game.contentWindow?.postMessage(data,location.origin === 'null' ? '*' : location.origin);
  let visible=false, active=null, requestVersion=0, currentScoreId=null;
  const notify=()=>send({type:'reisewelt-game-visibility',visible:visible&&!document.hidden});
  game.addEventListener('load',notify);document.addEventListener('visibilitychange',notify);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&entry.intersectionRatio>=.2;notify();},{threshold:[0,.2]}).observe(game);
  async function request(path,options={}){
    const response=await fetch(api+path,{...options,signal:AbortSignal.timeout(12000),credentials:'omit'});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.error||'Der Rekordspeicher ist gerade nicht erreichbar. Bitte später erneut versuchen.');
    return data;
  }
  const post=(path,data)=>request(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  async function loadScores(){
    const version=++requestVersion;status.textContent='Rekorde werden geladen …';
    try{
      const data=await request('/api/scores');if(version!==requestVersion)return;
      const rows=document.createDocumentFragment();
      data.scores.forEach((score,index)=>{const row=document.createElement('tr');if(score.id===currentScoreId)row.classList.add('current');
        [String(index+1).padStart(2,'0'),score.name,new Intl.NumberFormat('de-CH').format(score.distance)+' m',new Intl.NumberFormat('de-CH').format(score.coins)].forEach((value,i)=>{const cell=document.createElement('td');cell.textContent=value;cell.className=i===0?'rank':i>1?'number':'';row.appendChild(cell);});rows.appendChild(row);});
      body.replaceChildren(rows);status.textContent=data.scores.length?'':'Noch keine Rekorde. Die erste Runde gehört dir!';
    }catch(error){if(version===requestVersion)status.textContent='Die Bestenliste ist gerade nicht erreichbar. '+(body.children.length?'Die zuletzt geladenen Rekorde bleiben sichtbar.':'Bitte gleich noch einmal aktualisieren.');}
  }
  window.addEventListener('message',async event=>{
    if(event.source!==game.contentWindow||event.origin!==location.origin||!event.data)return;
    const data=event.data;
    if(data.type==='surfer-run-start'){
      const run={id:data.runId,result:null,saving:false,saved:null,session:null,error:null};active=run;
      run.registration=post('/api/session',{}).then(session=>{run.session=session;}).catch(error=>{run.error=error;});
    }else if(data.type==='surfer-run-end'&&active?.id===data.runId){active.result={distance:data.distance,coins:data.coins,defeated:data.defeated};
    }else if(data.type==='surfer-score-submit'&&active?.id===data.runId&&active.result){
      const run=active;if(run.saving)return;run.saving=true;
      try{
        await run.registration;if(!run.session)throw new Error('Für diese Runde konnte keine Online-Verbindung hergestellt werden. Starte bitte eine neue Runde, sobald die Verbindung wieder da ist.');
        const saved=run.saved||await post('/api/scores',{...run.session,...run.result,name:data.name});
        run.saved=saved;currentScoreId=saved.id;
        if(active===run)send({type:'surfer-score-result',runId:run.id,ok:true,message:'Gespeichert! Die besten 20 Runden stehen in der Rangliste.'});
        loadScores();
      }catch(error){if(active===run)send({type:'surfer-score-result',runId:run.id,ok:false,message:error.message||'Speichern fehlgeschlagen. Bitte erneut versuchen.'});}
      finally{run.saving=false;}
    }
  });
  document.getElementById('refresh-ranks').addEventListener('click',loadScores);
  document.getElementById('fullscreen').addEventListener('click',async()=>{
    const arcade=document.getElementById('spiel');
    try{if(document.fullscreenElement)await document.exitFullscreen();else if(arcade.requestFullscreen)await arcade.requestFullscreen();else {arcade.scrollIntoView({block:'start'});game.focus();}}catch{game.focus();}
  });
  document.addEventListener('fullscreenchange',()=>{document.getElementById('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Vollbild verlassen':'Spiel im Vollbild öffnen');});
  loadScores();
})();
