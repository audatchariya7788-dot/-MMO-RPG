(() => {
  const sets = {
    hero: {idle:['hero_idle1','hero_idle2'], walk:['hero_walk1','hero_walk2'], attack:['hero_attack1','hero_attack1'], hurt:['hero_hurt','hero_idle1'], dead:['hero_dead','hero_dead']},
    goblin: {idle:['goblin_idle1','goblin_idle2'], attack:['goblin_attack','goblin_idle1']},
    wolf: {idle:['wolf_idle1','wolf_idle2']},
    golem: {idle:['golem_idle1','golem_idle2']},
    knight: {idle:['knight_idle1','knight_idle2']}
  };
  let frame=0, mode='idle', timer;
  function setUse(el,id){const u=el?.querySelector('use'); if(u) u.setAttribute('href',`assets/animation-sprites.svg#${id}`)}
  function tick(){
    frame++;
    const hero=sets.hero[mode]||sets.hero.idle;
    document.querySelectorAll('.player-sprite,.sprite-hero').forEach(el=>setUse(el,hero[frame%hero.length]));
    const m=document.querySelector('#monsterImage');
    if(m){const key=m.querySelector('use')?.getAttribute('href')?.split('#').pop()||'goblin'; const type=key.includes('wolf')?'wolf':key.includes('golem')?'golem':key.includes('knight')?'knight':'goblin'; const arr=sets[type][mode]||sets[type].idle; setUse(m,arr[frame%arr.length]);}
  }
  function animateMode(next,duration=0){mode=next;if(duration){clearTimeout(timer);timer=setTimeout(()=>mode='idle',duration)}}
  window.mmaAnim={mode:animateMode};
  document.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)){mode='walk';clearTimeout(timer);timer=setTimeout(()=>mode='idle',180)}});
  window.addEventListener('load',()=>{const map=document.querySelector('#worldMap'); if(map){map.style.background='url("assets/greenvale-map.svg") center/cover'; map.querySelectorAll('.tile').forEach(t=>t.style.backgroundColor='transparent');} setInterval(tick,360);});
  document.addEventListener('click',e=>{if(e.target.closest('#attackBtn,#skillBtn'))animateMode('attack',500);if(e.target.closest('#healBtn,#potionBtn'))animateMode('hurt',500)});
})();