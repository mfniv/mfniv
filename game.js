const cellSize = 40;
const mapData = [
  "111111111111111",
  "100000000000001",
  "101111111110101",
  "101000001000101",
  "101011101011101",
  "101000001000001",
  "101111111111101",
  "100000000000001",
  "111111111111111"
];

const width = mapData[0].length;
const height = mapData.length;
const gameEl = document.getElementById('game');
const overlayEl = document.getElementById('overlay');
const coffeeCountEl = document.getElementById('coffeeCount');
const stealthEl = document.getElementById('stealth');

let coffees = [
  {x:2,y:1, taken:false},
  {x:6,y:2, taken:false},
  {x:4,y:4, taken:false},
  {x:10,y:5, taken:false},
  {x:13,y:7, taken:false}
];

let player = {x:1, y:1};
let stealth = 5;
let collected = 0;

let npcs = [
  {x:8,y:3,dir:'left',lastSeen:0},
  {x:12,y:6,dir:'up',lastSeen:0}
];

function createCell(x,y,cls) {
  const d = document.createElement('div');
  d.className = 'cell '+cls;
  d.style.left = x*cellSize+'px';
  d.style.top = y*cellSize+'px';
  gameEl.appendChild(d);
  return d;
}

function buildMap() {
  gameEl.style.width = width * cellSize + 'px';
  gameEl.style.height = height * cellSize + 'px';
  for(let y=0;y<height;y++){
    for(let x=0;x<width;x++){
      if(mapData[y][x]==='1') createCell(x,y,'wall');
    }
  }
}

const playerEl = createCell(player.x, player.y, '');
playerEl.id = 'player';

const npcEls = npcs.map(n=>{
  return createCell(n.x,n.y,'npc');
});

const coffeeEls = coffees.map(c=>createCell(c.x,c.y,'coffee'));

function movePlayer(dx,dy){
  const nx = player.x+dx;
  const ny = player.y+dy;
  if(mapData[ny][nx]==='0'){
    player.x=nx; player.y=ny;
    playerEl.style.left = nx*cellSize+'px';
    playerEl.style.top = ny*cellSize+'px';
  }
}

document.addEventListener('keydown',e=>{
  if(e.key==='ArrowUp') movePlayer(0,-1);
  if(e.key==='ArrowDown') movePlayer(0,1);
  if(e.key==='ArrowLeft') movePlayer(-1,0);
  if(e.key==='ArrowRight') movePlayer(1,0);
});

document.getElementById('up').onclick=()=>movePlayer(0,-1);
document.getElementById('down').onclick=()=>movePlayer(0,1);
document.getElementById('left').onclick=()=>movePlayer(-1,0);
document.getElementById('right').onclick=()=>movePlayer(1,0);

function npcMove(npc,el){
  const dirs = [
    {dx:0,dy:-1,dir:'up'},
    {dx:0,dy:1,dir:'down'},
    {dx:-1,dy:0,dir:'left'},
    {dx:1,dy:0,dir:'right'}
  ];
  const d = dirs[Math.floor(Math.random()*dirs.length)];
  const nx = npc.x+d.dx; const ny = npc.y+d.dy;
  if(mapData[ny][nx]==='0'){
    npc.x=nx; npc.y=ny; npc.dir=d.dir;
    el.style.left=nx*cellSize+'px';
    el.style.top=ny*cellSize+'px';
  } else {
    npc.dir=d.dir;
  }
}

function inFOV(npc){
  const range = 3;
  const dx = player.x-npc.x;
  const dy = player.y-npc.y;
  if(Math.abs(dx)>range || Math.abs(dy)>range) return false;
  switch(npc.dir){
    case 'up':
      return dy<0 && Math.abs(dx)<= (range - Math.abs(dy));
    case 'down':
      return dy>0 && Math.abs(dx)<= (range - Math.abs(dy));
    case 'left':
      return dx<0 && Math.abs(dy)<= (range - Math.abs(dx));
    case 'right':
      return dx>0 && Math.abs(dy)<= (range - Math.abs(dx));
  }
}

function gameLoop(){
  const now = Date.now();
  npcEls.forEach((el,i)=>{
    if(Math.random()<0.3) npcMove(npcs[i],el);
    if(inFOV(npcs[i]) && now-npcs[i].lastSeen>1000){
      stealth--; stealthEl.textContent=stealth;
      npcs[i].lastSeen=now;
    }
  });

  coffees.forEach((c,idx)=>{
    if(!c.taken && c.x===player.x && c.y===player.y){
      c.taken=true;
      coffeeEls[idx].style.display='none';
      collected++; coffeeCountEl.textContent=collected;
    }
  });

  if(collected===coffees.length || stealth<=0){
    overlayEl.style.display='flex';
    overlayEl.innerHTML = collected===coffees.length ?
      `You collected all coffees! Stealth left: ${stealth}`:
      `You were caught! Coffees collected: ${collected}`;
    clearInterval(loop);
  }
}

buildMap();
const loop = setInterval(gameLoop,400);
