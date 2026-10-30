const U=id=>`https://images.unsplash.com/${id}?w=700&q=70`;
const P=[
{n:"Elves Falath Pro 50",b:"Elves",c:"Roues",p:899,r:2400,eq:"Zipp 404",img:U("photo-1485965120184-e220f721d03e"),s:["Carbone T1100, 50 mm","1 285 g la paire","Moyeux à cliquets 36T","Garantie 2 ans"]},
{n:"Winspace T1500",b:"Winspace",c:"Cadres",p:1690,r:5500,eq:"Specialized Tarmac SL7",img:U("photo-1532298229144-0ec0c57515c7"),s:["Cadre 780 g","Câblage intégré","Pneus jusqu'à 32 mm","UCI approuvé"]},
{n:"Magene P505",b:"Magene",c:"Capteurs",p:459,r:1100,eq:"Quarq DZero",img:U("photo-1541625602330-2277a4c46182"),s:["Pédalier double face","Précision ±1,5 %","ANT+ / Bluetooth","Autonomie 300 h"]},
{n:"Yoeleo SAT C50",b:"Yoeleo",c:"Roues",p:749,r:2000,eq:"Enve SES 4.5",img:U("photo-1507035895480-2b3156c31fc8"),s:["Carbone, 50 mm","1 390 g","Moyeux DT 240","Tubeless ready"]},
{n:"Ryet Aero Saddle",b:"Ryet",c:"Selles",p:69,r:290,eq:"Fizik Antares Adaptive",img:U("photo-1571068316344-75bc76f77890"),s:["Impression 3D","Rails carbone","165 g","Largeurs 143 / 155"]},
{n:"LTWOO eR9",b:"LTWOO",c:"Groupes",p:599,r:2300,eq:"Shimano Ultegra Di2",img:U("photo-1511994298241-608e28f14fde"),s:["Électronique sans fil 12v","Freins hydrauliques","Batterie 1 000 km","Compatible Shimano HG"]},
{n:"ICAN A9",b:"ICAN",c:"Cadres",p:1199,r:4200,eq:"Canyon Aeroad",img:U("photo-1505705694340-019e1e335916"),s:["Cadre aéro 980 g","Cintre intégré","Disques 160 mm","Livraison mondiale"]},
{n:"Magene L508",b:"Magene",c:"Accessoires",p:79,r:199,eq:"Garmin Varia",img:U("photo-1558981403-c5f9899a28bc"),s:["Radar arrière + feu","Détection jusqu'à 140 m","Autonomie 10 h","Garmin / Wahoo"]}];
const cats=["Tous",...new Set(P.map(x=>x.c))];let cur="Tous";
const F=document.getElementById("filters"),G=document.getElementById("grid");
function draw(){F.innerHTML=cats.map(c=>`<button class="${c==cur?'on':''}" onclick="cur='${c}';draw()">${c}</button>`).join("");
G.innerHTML=P.map((x,i)=>[x,i]).filter(([x])=>cur=="Tous"||x.c==cur).map(([x,i])=>`<div class="card" onclick="open_(${i})"><img loading="lazy" src="${x.img}" alt="${x.n}"><div class="in"><small>${x.b.toUpperCase()}</small><h3>${x.n}</h3><div class="row"><span class="price">${x.p} €</span><span class="save">-${Math.round(100-x.p/x.r*100)}% vs ${x.eq}</span></div></div></div>`).join("")}
function open_(i){const x=P[i];document.getElementById("mbox").innerHTML=`<img src="${x.img}"><div class="in"><small style="color:var(--red)">${x.b} · ${x.c}</small><h2>${x.n}</h2><p style="color:var(--mut)">Alternative à <b>${x.eq}</b> (${x.r} €). Vous économisez <b style="color:#34c759">${x.r-x.p} €</b>.</p><ul>${x.s.map(s=>`<li>${s}</li>`).join("")}</ul><a class="btn" href="#">Voir l'offre officielle → ${x.p} €</a></div>`;document.getElementById("modal").classList.add("on")}
const B={Elves:"Roues et cadres haut de gamme, Taiwan",Winspace:"Cadres carbone de course, Xiamen",Magene:"Capteurs et électronique, Shanghai",Yoeleo:"Roues carbone, Xiamen",Ryet:"Selles imprimées en 3D",LTWOO:"Groupes de transmission",ICAN:"Cadres en vente directe, Shenzhen"};
document.getElementById("brands").innerHTML=Object.entries(B).map(([k,v])=>`<div class="brand"><b>${k}</b><p>${v}</p></div>`).join("");
draw();
const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add("vis")),{threshold:.1});document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
