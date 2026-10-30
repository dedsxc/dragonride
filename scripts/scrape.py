#!/usr/bin/env python3
"""Récupère les catalogues officiels (Shopify) et met à jour data.js + history.json.
Lancé chaque jour par GitHub Actions. history.json garde un point de prix par jour et par produit."""
import json,re,html,datetime,urllib.request,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC={"Winspace":"https://www.winspace.cc","Yoeleo":"https://www.yoeleobike.com","ICAN":"https://icancycling.com"}
BR={"Winspace":["#111","Xiamen"],"Yoeleo":["#c53030","Xiamen"],"ICAN":["#6b46c1","Shenzhen"]}
SKIP=r'bearing|valve|hanger|grommet|end cap|freehub|worry|size|dropdown|^eu |heiwu|spoke|bolt|sticker|gift|insurance|shipping|tire|tyre|bottle|seatpost|seat post|fork|spacer|derailleur|skewer|axle'
def cat(t,pt):
  s=(t+" "+pt).lower()
  if re.search(SKIP,s):return None
  if re.search(r'handlebar|cockpit|crank|stem',s):return "parts"
  if re.search(r'frameset|frame\b|frame only|bundle',s) and not re.search(r'build|di2|axs|mechanic|12s',s):return "frames"
  if re.search(r'bike|build|di2|axs|105|ultegra|dura|mechanic|12s|erx',s):return "bikes"
  if re.search(r'wheel|gryper|grapid|cs50|cs60|gen \d|aero \d|\bg\d\d|pie \d|ultra \d|fl\d\d|xc \d|vortex|\bsat\b|\bd\d\b',s):return "wheels"
  if re.search(r'^(tt5|m6|t1600|slc|g3|g5|c5|zen|r1\d|g21|flyee|graro|a\d)',s.strip()):return "frames"
  return None
def specs(b):
  t=[html.unescape(re.sub('<[^>]+>','',x)).strip() for x in re.findall(r'<li[^>]*>(.*?)</li>',b or '',re.S)]
  return [x for x in t if 4<len(x)<90][:5]
def get(u):
  r=urllib.request.Request(u,headers={"User-Agent":"Mozilla/5.0"});return json.load(urllib.request.urlopen(r,timeout=40))
today=datetime.date.today().isoformat()
hp=os.path.join(ROOT,"history.json")
H=json.load(open(hp)) if os.path.exists(hp) else {}
out=[];i=1
for br,base in SRC.items():
  try:prods=get(base+"/products.json?limit=250")["products"]
  except Exception as e:print("skip",br,e);continue
  seen=set();n=0
  for p in prods:
    v=p['variants'][0];pr=float(v['price'])
    if pr<50 or not p['images']:continue
    t=re.sub(r'\s+',' ',p['title']).strip()
    if re.search(r'\b(AU|UK|EU|US)\b|PRE-ORDER|copy',t):continue
    c=cat(t,p.get('product_type',''))
    if not c:continue
    # fusion des variantes de couleur
    k=re.sub(r' (bundle|frameset)$','',re.sub(r'\b(prism blue|artisan black|panda purple|champagne|matt black|bright black)\b','',t.lower())).strip()
    if k in seen:continue
    seen.add(k)
    o=v.get('compare_at_price');o=float(o) if o and float(o)>pr else None
    url=f"{base}/products/{p['handle']}"
    h=H.setdefault(url,[])
    if h and h[-1][0]==today:h[-1][1]=round(pr)
    else:h.append([today,round(pr)])
    out.append(dict(id=i,n=t,b=br,c=c,p=round(pr),o=round(o) if o else None,cur="$",
      img=p['images'][0]['src'].split('?')[0]+"?width=600",
      imgs=[x['src'].split('?')[0]+"?width=900" for x in p['images'][:5]],
      s=specs(p.get('body_html')),src=url,h=h[-60:]));i+=1;n+=1
    if n>=30:break
if not out:raise SystemExit("aucun produit récupéré, data.js conservé")
json.dump(H,open(hp,"w"),separators=(",",":"))
open(os.path.join(ROOT,"data.js"),"w").write(f"// Généré par scripts/scrape.py le {today} depuis les boutiques officielles. Prix USD. h = historique [date, prix].\nconst UPDATED={json.dumps(today)};\nconst P={json.dumps(out,ensure_ascii=False)};\nconst BR={json.dumps(BR)};\n")
print(len(out),"produits,",sum(len(v) for v in H.values()),"points d'historique")
