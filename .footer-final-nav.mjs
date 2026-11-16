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

for(const[width,height]of[[1440,1100],[390,844]]){
await cmd('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<640});await cmd('Page.navigate',{url:'http://localhost:3001'});await sleep(3000);
await run('document.documentElement.style.scrollBehavior="auto";scrollTo(0,document.querySelector("#contact").getBoundingClientRect().top+scrollY)');await sleep(700);
await run('[...document.querySelectorAll("#contact a")].find(a=>a.textContent.includes("START A PROJECT")).click()');await sleep(1200);console.log('cta-visible',width,await run('(()=>{const r=document.querySelector("#contact-form").getBoundingClientRect();return{hash:location.hash,top:r.top,bottom:r.bottom,viewport:innerHeight,visible:r.top>=0&&r.bottom<=innerHeight}})()'));
}
console.log('errors',errors);
}finally{socket?.close();child.kill();}
