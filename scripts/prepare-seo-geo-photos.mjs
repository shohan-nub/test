// Real photographic source material. Final WebPs are built locally, never hotlinked.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { prepareScreens } from './create-seo-geo-screens.mjs';

export const photos = [
  { file: 'seo-strategy', id: 7670739, photographer: 'alleksana', page: 'laptop-and-notebook-on-a-desk-7670739', interface: 'seo-strategy.svg' },
  { file: 'geo-optimization', id: 6611962, photographer: 'Tima Miroshnichenko', page: 'a-smartphone-with-blank-screen-on-a-wooden-table-6611962', interface: 'geo-mobile.svg', customInterface: true, textureSize: [780,1688] },
  { file: 'technical-seo', id: 2811648, photographer: 'Mateusz Dach', page: 'computer-set-on-table-2811648', interface: 'technical-seo.svg' },
  { file: 'ai-search', id: 6373021, photographer: 'KATRIN BOLOVTSOVA', page: 'digital-tablet-on-a-wooden-pedestal-6373021', interface: 'ai-search-tablet.svg', customInterface: true, textureSize: [1200,900], crop: {left:.3,top:.4,side:.7}, occlusion:{left:509,top:727,right:772,bottom:800} },
  { file: 'content-strategy', id: 6143824, photographer: 'cottonbro studio', page: 'woman-reading-magazine-6143824' },
  { file: 'ai-automation', id: 6466141, photographer: 'Sergei Starostin', page: 'network-servers-on-an-enclosure-6466141' },
  { file: 'analytics-growth', id: 8761311, photographer: 'Pavel Danilyuk', page: 'empty-seats-inside-a-conference-room-8761311', interface: 'analytics-presentation.svg', customInterface: true, textureSize: [1600,900], sourceWidth:4000, crop:{left:.275,top:.05,side:.375} },
];
const source = new URL('../design/seo-geo-showcase/', import.meta.url);
const output = new URL('../public/seo-geo-showcase/', import.meta.url);
// Measured screen corners (TL, TR, BR, BL) in each 1200px square crop.
const screens = [
  [[282,529],[825,529],[830,889],[280,889]],
  [[432,239],[772,241],[771,979],[431,978]],
  [[365,322],[820,339],[754,747],[319,665]],
  [[391,366],[895,368],[898,734],[379,728]],
  null,
  null,
  [[334,159],[974,160],[974,514],[333,514]],
];
// Inverse projective mapping keeps the interface attached to the real display.
function homography(quad, width, height) {
  const source = [[0,0],[width-1,0],[width-1,height-1],[0,height-1]];
  const rows = quad.flatMap(([x,y],i) => {
    const [u,v] = source[i];
    return [[x,y,1,0,0,0,-u*x,-u*y,u],[0,0,0,x,y,1,-v*x,-v*y,v]];
  });
  for (let i=0;i<8;i++) {
    let pivot=i;
    for(let j=i+1;j<8;j++) if(Math.abs(rows[j][i])>Math.abs(rows[pivot][i])) pivot=j;
    [rows[i],rows[pivot]]=[rows[pivot],rows[i]];
    const divisor=rows[i][i];
    for(let k=i;k<9;k++) rows[i][k]/=divisor;
    for(let j=0;j<8;j++) if(j!==i) { const factor=rows[j][i]; for(let k=i;k<9;k++) rows[j][k]-=factor*rows[i][k]; }
  }
  return rows.map(row=>row[8]);
}
async function displayTexture(photo, quad) {
  const [width,height]=photo.textureSize||[1600,1000];
  const {data,info} = await sharp(await readFile(new URL(photo.interface,photo.customInterface?source:output))).resize(width,height).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const h=homography(quad,info.width,info.height), result=Buffer.alloc(1200*1200*4);
  const minX=Math.floor(Math.min(...quad.map(p=>p[0]))), maxX=Math.ceil(Math.max(...quad.map(p=>p[0])));
  const minY=Math.floor(Math.min(...quad.map(p=>p[1]))), maxY=Math.ceil(Math.max(...quad.map(p=>p[1])));
  for(let y=minY;y<=maxY;y++) for(let x=minX;x<=maxX;x++) {
    const o=photo.occlusion;
    if(o&&x>=o.left&&x<=o.right&&y>=o.top&&y<=o.bottom) continue;
    const z=h[6]*x+h[7]*y+1, u=(h[0]*x+h[1]*y+h[2])/z, v=(h[3]*x+h[4]*y+h[5])/z;
    if(u<0||v<0||u>=info.width-1||v>=info.height-1) continue;
    const ix=Math.floor(u),iy=Math.floor(v),fx=u-ix,fy=v-iy,out=(y*1200+x)*4;
    const indices=[(iy*info.width+ix)*4,(iy*info.width+ix+1)*4,((iy+1)*info.width+ix)*4,((iy+1)*info.width+ix+1)*4];
    const weights=[(1-fx)*(1-fy),fx*(1-fy),(1-fx)*fy,fx*fy];
    // Gentle display falloff and a restrained glass reflection; no floating panels.
    const reflection=.025+.035*(1-u/info.width);
    for(let c=0;c<3;c++) result[out+c]=Math.min(255,indices.reduce((sum,p,i)=>sum+data[p+c]*weights[i],0)*.91+255*reflection);
    result[out+3]=Math.round(indices.reduce((sum,p,i)=>sum+data[p+3]*weights[i],0));
  }
  return sharp(result,{raw:{width:1200,height:1200,channels:4}}).png().toBuffer();
}
await mkdir(source, { recursive: true });
await prepareScreens(source);
await Promise.all(photos.map(async (photo,index) => {
  const path = new URL(`${photo.id}.jpg`, source);
  try { await readFile(path); }
  catch {
    const response = await fetch(`https://images.pexels.com/photos/${photo.id}/pexels-photo-${photo.id}.jpeg?auto=compress&cs=tinysrgb&w=${photo.sourceWidth||2000}`);
    if (!response.ok) throw Error(`Source ${photo.id}: ${response.status}`);
    await writeFile(path, Buffer.from(await response.arrayBuffer()));
  }
  let input=sharp(await readFile(path));
  if(photo.crop){const {width}=await input.metadata(),c=photo.crop;input=input.extract({left:Math.round(c.left*width),top:Math.round(c.top*width),width:Math.round(c.side*width),height:Math.round(c.side*width)});}
  const crop=await input.resize(1200,1200,{fit:'cover',position:photo.position||'centre'}).png().toBuffer();
  if(process.argv.includes('--preview-crops')){await writeFile(new URL(`../.variety-${photo.file}.png`,import.meta.url),crop);return;}
  const layers=photo.interface?[{input:await displayTexture(photo,screens[index])}]:[];
  await writeFile(new URL(`${photo.file}.webp`,output),await sharp(crop).composite(layers).modulate({brightness:1.035,saturation:.88}).recomb([[1.018,0,0],[0,1,0],[0,0,.978]]).webp({quality:93,effort:6}).toBuffer());
}));
if(process.argv.includes('--preview-crops')) process.exit(0);
await writeFile(new URL('ASSET-SOURCES.md',output),`# SEO/GEO photographic compositions\n\nSeven different real photographs, sourced from Pexels. Original source pages and photographer credits are listed below.\n\n| Local square WebP | Photographer | Original source |\n| --- | --- | --- |\n${photos.map(p=>`| ${p.file}.webp | ${p.photographer} | [Pexels ${p.id}](https://www.pexels.com/photo/${p.page}/) |`).join('\n')}\n\nLicensed under the [Pexels License](https://www.pexels.com/license/), which permits free website use and modification. No endorsement by photographers or depicted hardware brands is implied.\n\nProcessing: deliberate 1200 × 1200 square crops, custom hand-authored software interfaces perspective-matched inside appropriate physical screens, subtle display reflection and warm grading, WebP quality 93. Original photography remains genuine; no generative image tool was used for these delivered files.\n\nSubjects: SEO Strategy - one laptop; GEO Optimization - one smartphone; Technical SEO - a desktop workstation display; AI Search - a landscape tablet on a rustic pedestal; Content Strategy - printed editorial layouts, notebook and pencil; AI Automation - physical server racks and network cabling; Analytics & Growth - a large conference-room projection screen.\n\nThe retained laptop and desktop textures are seo-strategy.svg and technical-seo.svg in this folder. The portrait phone, landscape tablet and presentation textures are geo-mobile.svg, ai-search-tablet.svg and analytics-presentation.svg in design/seo-geo-showcase/, generated by scripts/create-seo-geo-screens.mjs. All five screen designs embed the exact uploaded public/Spark LAb Logo Design-01 (1).png in their application header or sidebar, preserving native logo proportions. The editorial photograph and server hardware have no added logo or watermark. Service titles and descriptions remain in HTML.\n\nRebuild assets with node scripts/prepare-seo-geo-photos.mjs. Source photos are cached in design/seo-geo-showcase/; the script can re-download missing sources. These are illustrative SparkLab product concepts, not screenshots of live customer results.\n`);
console.log('Prepared seven distinct subjects as square photographic WebPs.');

