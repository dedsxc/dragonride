const $=id=>document.getElementById(id);
let cur="*",bi=0;
let favs=JSON.parse(localStorage.favs||"[]"),list=JSON.parse(localStorage.list||"[]");
const save=()=>{localStorage.favs=JSON.stringify(favs);localStorage.list=JSON.stringify(list);$("fc").textContent=favs.length;$("cc").textContent=list.length};
const C=["*","frames","bikes","wheels","power"];
const fm=x=>x.cur=="€"?x.p.toLocaleString("fr-FR")+" €":"$"+x.p.toLocaleString("en-US");
const fo=x=>x.cur=="€"?x.o.toLocaleString("fr-FR")+" €":"$"+x.o.toLocaleString("en-US");
const disc=x=>x.o?Math.round((1-x.p/x.o)*100):0;
const BAN=[{k:"b1",img:"photo-1517649763962-0c623066013b",c:"frames"},{k:"b2",img:"photo-1507035895480-2b3156c31fc8",c:"wheels"},{k:"b3",img:"photo-1541625602330-2277a4c46182",c:"power"}];
function card(x){const d=disc(x),f=favs.includes(x.id);return `<div class="card" onclick="openP(${x.id})"><div class="ph"><img loading="lazy" src="${x.img}" alt="">${d?`<span class="off">-${d}%</span>`:""}<button class="fav ${f?"on":""}" onclick="event.stopPropagation();tf(${x.id})">${f?"♥":"♡"}</button></div><div class="in"><h3>${x.n}</h3><div class="pr"><b>${fm(x)}</b>${x.o?`<s>${fo(x)}</s>`:""}</div><div class="tags"><span class="tg">≈ ${x.eq}</span><span class="tg g">✓ ${t("shopd")}</span></div><div class="store">${x.b} ›</div></div><button class="add" onclick="event.stopPropagation();al(${x.id},this)">+</button></div>`}
function render(){
$("cats").innerHTML=[...C,"fav"].map(c=>`<button class="${c==cur?"on":""}" onclick="cur='${c}';draw();go()">${c=="*"?t("all"):t(c)}</button>`).join("");
$("sidecats").innerHTML=C.slice(1).map(c=>`<a onclick="cur='${c}';draw();go()">${t(c)}<span>${P.filter(x=>x.c==c).length}</span></a>`).join("");
ban();
const IM={frames:"photo-1532298229144-0ec0c57515c7",bikes:"photo-1485965120184-e220f721d03e",wheels:"photo-1507035895480-2b3156c31fc8",power:"photo-1541625602330-2277a4c46182"};const ui=i=>`https://images.unsplash.com/${i}?w=300&q=60`;
const cheap=[...P].sort((a,b)=>a.p-b.p)[0];
$("tiles").innerHTML=`<div class="tile"><h3>${t("tl1")}</h3><div class="q4">${C.slice(1).map(c=>`<a onclick="cur='${c}';draw();go()"><img src="${ui(IM[c])}" alt="">${t(c)}</a>`).join("")}</div><a class="lk" onclick="cur='*';draw();go()">${t("seeall")}</a></div>
<div class="tile"><h3>${t("tl2")}</h3><div class="one" onclick="openP(${cheap.id})" style="cursor:pointer"><img src="${cheap.img}" alt=""></div><div><span class="big">${fm(cheap)}</span><div class="note">${cheap.n}</div></div></div>
<div class="tile"><h3>${t("tl3")}</h3><div class="q4">${Object.keys(BR).slice(0,4).map(k=>{const x=P.find(p=>p.b==k);return `<a onclick="q.value='${k}';cur='*';draw();go()"><img src="${x?x.img:ui(IM.frames)}" alt="">${k}</a>`}).join("")}</div><a class="lk" onclick="document.getElementById('brands').scrollIntoView({behavior:'smooth'})">${t("seeall")}</a></div>
<div class="tile" style="background:linear-gradient(135deg,var(--o),var(--o2));color:#fff"><h3>${t("pt")}</h3><p style="opacity:.9">${t("pp")}</p><div class="big" style="color:#fff" id="cd2"></div><a class="btn" style="background:#fff;color:var(--o);margin-top:auto;justify-content:center" href="#deals">${t("pb")}</a></div>`;
$("circ").innerHTML=Object.keys(BR).map(k=>{const x=P.find(p=>p.b==k);return `<a onclick="q.value='${k}';cur='*';draw();go()"><img src="${x?x.img:ui(IM.frames)}" alt="">${k}</a>`}).concat(C.slice(1).map(c=>`<a onclick="cur='${c}';draw();go()"><img src="${ui(IM[c])}" alt="">${t(c)}</a>`)).join("");
$("rows").innerHTML=C.slice(1).filter(c=>P.some(x=>x.c==c)).map(c=>`<div class="w sec"><div class="rowbox"><div class="sh"><h2>${t("best")} ${t(c).toLowerCase()}</h2><a onclick="cur='${c}';draw();go()" style="cursor:pointer">${t("seeall")}</a></div><div class="row">${P.filter(x=>x.c==c).map(card).join("")}</div></div></div>`).join("");
const rv=JSON.parse(localStorage.rv||"[]").map(i=>P.find(p=>p.id==i)).filter(Boolean);$("rv").style.display=rv.length?"":"none";$("rvr").innerHTML=rv.map(card).join("");
$("flash").innerHTML=P.filter(x=>x.o).concat(P.filter(x=>!x.o).slice(0,3)).map(card).join("");
$("brands").innerHTML=Object.entries(BR).map(([k,[col,loc]])=>{const n=P.filter(x=>x.b==k).length;return `<div class="brand" onclick="q.value='${k}';cur='*';draw();go()"><div class="lg" style="background:${col}">${k[0]}</div><b>${k}</b><small>${loc} · ${n?n+" "+t("prods"):t("soon")}</small></div>`}).join("");
draw();save()}
function draw(){const s=(q.value||"").toLowerCase().trim();
let r=P.filter(x=>(cur=="*"||(cur=="fav"?favs.includes(x.id):x.c==cur))&&(x.n+" "+x.b+" "+x.eq+" "+t(x.c)).toLowerCase().includes(s));
const so=$("sort").value;if(so=="asc")r.sort((a,b)=>a.p-b.p);if(so=="desc")r.sort((a,b)=>b.p-a.p);if(so=="disc")r.sort((a,b)=>disc(b)-disc(a));
$("cnt").textContent=r.length+" "+t("res");$("grid").innerHTML=r.map(card).join("")||`<div class="empty">${t("empty")}</div>`;
document.querySelectorAll("#cats button").forEach((b,i)=>b.classList.toggle("on",[...C,"fav"][i]==cur))}
function go(){$("all").scrollIntoView({behavior:"smooth"})}
function tf(id){favs=favs.includes(id)?favs.filter(i=>i!=id):[...favs,id];save();render()}
function al(id,el){if(!list.includes(id))list.push(id);save();if(el){el.textContent="✓";setTimeout(()=>el.textContent="+",900)}}
function openP(id){const x=P.find(p=>p.id==id),d=disc(x);let r=JSON.parse(localStorage.rv||"[]").filter(i=>i!=id);r.unshift(id);localStorage.rv=JSON.stringify(r.slice(0,8));$("pbx").innerHTML=`<button class="x" onclick="closeAll()">✕</button><img src="${x.img}" alt=""><div class="in"><span class="store">${x.b} · ${t(x.c)}</span><h2>${x.n}</h2><div class="pr"><b>${fm(x)}</b>${x.o?`<s>${fo(x)}</s> <span class="off" style="position:static">-${d}%</span>`:""}</div><div class="tags"><span class="tg">${t("alt")} ${x.eq}</span><span class="tg g">✓ ${t("shopd")}</span></div><ul class="spec">${x.s.map(s=>`<li>${s}</li>`).join("")}</ul><div class="ship">${t("ship")}</div><div class="acts"><a class="btn" href="${x.src}" target="_blank" rel="noopener">${t("buy")} →</a><button class="btn dk" onclick="al(${x.id});this.textContent=t('added')">${list.includes(x.id)?t("added"):t("addl")}</button></div><p class="note">${t("chk")} · <a href="${x.src}" target="_blank" rel="noopener">${t("srcl")}</a></p></div>`;$("pm").classList.add("on");$("ov").classList.add("on");document.body.style.overflow="hidden"}
function openCart(){const it=list.map(i=>P.find(p=>p.id==i)).filter(Boolean);
$("cl").innerHTML=it.map(x=>`<div class="ci"><img src="${x.img}" alt=""><div><b>${x.n}</b>${fm(x)}<br><a href="${x.src}" target="_blank" rel="noopener">${t("open")} ↗</a></div><button onclick="list=list.filter(i=>i!=${x.id});save();openCart()">✕</button></div>`).join("")||`<p class="note" style="padding:20px 0">${t("emptyc")}</p>`;
const us=it.filter(x=>x.cur=="$").reduce((a,x)=>a+x.p,0),eu=it.filter(x=>x.cur=="€").reduce((a,x)=>a+x.p,0);
$("cft").innerHTML=it.length?`<div style="display:flex;justify-content:space-between"><span>${t("tot")}</span><b>${[us?"$"+us.toLocaleString("en-US"):"",eu?eu.toLocaleString("fr-FR")+" €":""].filter(Boolean).join(" + ")}</b></div>`:"";
$("cart").classList.add("on");$("ov").classList.add("on")}
function closeAll(){if($("pm").classList.contains("on"))render();["pm","ov","cart"].forEach(i=>$(i).classList.remove("on"));document.body.style.overflow=""}
addEventListener("keydown",e=>e.key=="Escape"&&closeAll());
const q=$("q");
function ban(){const b=BAN[bi];$("ban").style.backgroundImage=`url(https://images.unsplash.com/${b.img}?w=1800&q=75)`;$("ban").innerHTML=`<div><small>DragonRide</small><h1>${t(b.k+"t")}</h1><p>${t(b.k+"p")}</p><a class="btn" onclick="cur='${b.c}';draw();go()">${t("shop")} →</a></div><div class="dots">${BAN.map((_,i)=>`<i class="${i==bi?"on":""}" onclick="bi=${i};ban()"></i>`).join("")}</div>`}
setInterval(()=>{bi=(bi+1)%BAN.length;ban()},6000);
function tick(){const d=new Date("2026-11-11T00:00:00+08:00")-Date.now();if(d<0){$("cd").innerHTML="";return}const p=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60].map(n=>String(n).padStart(2,"0"));$("cd").innerHTML=`<b>${p[0]}${t("dd")}</b><b>${p[1]}</b>:<b>${p[2]}</b>:<b>${p[3]}</b>`;const c2=$("cd2");if(c2)c2.textContent=`J-${+p[0]}`}
setInterval(tick,1000);
applyLang();render();tick();
