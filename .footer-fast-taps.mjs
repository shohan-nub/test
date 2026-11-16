import {spawn} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const child=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--mute-audio','--no-first-run','--remote-debugging-port=9229','--user-data-dir=C:/Users/MRB/AppData/Local/Temp/sparklab-footer-verify','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let socket,id=0,formMode='success';const pending=new Map(),errors=[],requests=[];
const cmd=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;pending.set(key,{resolve,reject});socket.send(JSON.stringify({id:key,method,params}));});
const run=async expression=>{const r=await cmd('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.result.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails));return r.result.result.value;};
const video=()=>run(`(()=>{const v=document.querySelector('.project-showreel'),b=document.querySelector('[aria-label$="showreel sound"]');return{muted:v.muted,volume:v.volume,time:v.currentTime,duration:v.duration,paused:v.paused,loop:v.loop,autoplay:v.autoplay,inline:v.playsInline,controls:v.controls,ready:v.readyState,same:window.originalVideo===v,pressed:b.getAttribute('aria-pressed'),audioBytes:v.webkitAudioDecodedByteCount,events:window.videoEvents}})()`);
const click=async(x,y,count=1)=>{await cmd('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:count});await cmd('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:count});};
const double=async(x,y)=>{await click(x,y);await sleep(50);await click(x,y,2);};
try{
  let tabs;for(let i=0;i<40;i++){try{tabs=await(await fetch('http://localhost:9229/json')).json();break;}catch{await sleep(150);}}
  socket=new WebSocket(tabs[0].webSocketDebuggerUrl);await new Promise(r=>socket.addEventListener('open',r,{once:true}));
  socket.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args.map(a=>a.value??a.description).join(' '));if(m.method==='Fetch.requestPaused'){requests.push(m.params.request.postData);void cmd('Fetch.fulfillRequest',{requestId:m.params.requestId,responseCode:formMode==='success'?200:503,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:Buffer.from(JSON.stringify(formMode==='success'?{success:true}:{error:'Test delivery unavailable.'})).toString('base64')});}const p=pending.get(m.id);if(p){pending.delete(m.id);if(m.error)p.reject(m.error);else p.resolve(m);}});
  await cmd('Page.enable');await cmd('Runtime.enable');await cmd('Fetch.enable',{patterns:[{urlPattern:'*/api/contact',requestStage:'Request'}]});

for(const[width,height]of[[1440,1100],[390,844],[320,768]]){
await cmd('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<640});await cmd('Emulation.setTouchEmulationEnabled',{enabled:width<640});await cmd('Page.navigate',{url:'http://localhost:3001'});await sleep(3200);
const range=await run('(()=>{document.documentElement.style.scrollBehavior="auto";window.originalVideo=document.querySelector(".project-showreel");window.videoEvents={};const s=document.querySelector(".experiences"),p=s.parentElement;return{start:p.getBoundingClientRect().top+scrollY,distance:p.offsetHeight-s.offsetHeight}})()');await run('scrollTo(0,'+(range.start+range.distance*.98)+')');await sleep(850);
const point=await run('(()=>{const r=document.querySelector("button[aria-label*=showreel]").getBoundingClientRect();return{x:r.x+48,y:r.y+r.height/2}})()');
if(width<640){
for(const expected of [false,true]){await cmd('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await cmd('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(100);const state=await video();console.log('quick-tap',width,{expected,muted:state.muted,paused:state.paused,same:state.same,time:state.time});if(state.muted!==expected||state.paused||!state.same)throw Error('Touch toggle failed');}
}else{await double(point.x,point.y);await sleep(150);const state=await video();console.log('desktop-button-double',state);if(state.muted||state.paused||!state.same)throw Error('Double button toggle failed');}
}
console.log('errors',errors);
}finally{socket?.close();child.kill();}
