(() => {
  const monsterSets={goblin:{idle:['goblin_idle1','goblin_idle2'],attack:['goblin_attack','goblin_idle1']},wolf:{idle:['wolf_idle1','wolf_idle2']},golem:{idle:['golem_idle1','golem_idle2']},knight:{idle:['knight_idle1','knight_idle2']}};
  const classSprites={Warrior:'warrior_idle',Ranger:'ranger_idle',Mage:'mage_idle',Assassin:'assassin_idle'};
  const classModels={Warrior:'warrior',Ranger:'ranger',Mage:'mage',Assassin:'assassin'};
  let frame=0,mode='idle',timer;
  function setUse(el,id,source){const u=el?.querySelector('use');if(u)u.setAttribute('href',`${source}#${id}`)}
  function tick(){
    frame++;
    const cls=localStorage.getItem('mma-rpg-class')||'Warrior';
    const model=classModels[cls]||'warrior',sprite=classSprites[cls]||'warrior_idle';
    document.querySelectorAll('.sprite-hero,.character-sprite').forEach(el=>{setUse(el,model,'assets/hero-class-models.svg');el.classList.remove('hero-mode-idle','hero-mode-attack','hero-mode-hurt','hero-mode-dead');el.classList.add(`hero-mode-${mode}`)});
    document.querySelectorAll('.player-sprite').forEach(el=>setUse(el,sprite,'assets/sprite-sheet-32.svg'));
    const m=document.querySelector('#monsterImage');
    if(m){const key=m.querySelector('use')?.getAttribute('href')?.split('#').pop()||'goblin',type=key.includes('wolf')?'wolf':key.includes('golem')?'golem':key.includes('knight')?'knight':'goblin',arr=(monsterSets[type]?.[mode]||monsterSets[type]?.idle||['goblin_idle1']);setUse(m,arr[frame%arr.length],'assets/animation-sprites.svg')}
  }
  function animateMode(next,duration=0){mode=next;if(duration){clearTimeout(timer);timer=setTimeout(()=>mode='idle',duration)}}
  window.mmaAnim={mode:animateMode};
  document.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)){mode='walk';clearTimeout(timer);timer=setTimeout(()=>mode='idle',180)}});
  window.addEventListener('load',()=>{const map=document.querySelector('#worldMap');if(map){map.style.background='url("assets/greenvale-map.svg") center/cover';map.querySelectorAll('.tile').forEach(t=>t.style.backgroundColor='transparent')}setInterval(tick,360)});
  document.addEventListener('click',e=>{if(e.target.closest('#attackBtn,#skillBtn'))animateMode('attack',500);if(e.target.closest('#healBtn,#potionBtn'))animateMode('hurt',500)});
})();