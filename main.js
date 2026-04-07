const $ = id => document.getElementById(id);
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const TEXTURES = {
    color: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bump: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
    water: 'https://unpkg.com/three-globe/example/img/earth-water.png',
    clouds: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
};

const POIS = [
    { id: 'poi-beringia', title: 'Beringia Land Bridge', desc: 'Migration route to the Americas.', lat: 65.0, lng: -168.0, minYear: -30000, maxYear: -11000 },
    { id: 'poi-doggerland', title: 'Doggerland', desc: 'Connected UK to Mainland Europe.', lat: 54.0, lng: 3.0, minYear: -100000, maxYear: -6500 },
    { id: 'poi-storegga', title: 'Storegga Slide', desc: 'Mega-tsunami wipes out remaining Doggerland.', lat: 64.0, lng: 5.0, minYear: -6500, maxYear: -6000 },
    { id: 'poi-sahul', title: 'Sahul Continent', desc: 'Australia & New Guinea connected.', lat: -10.0, lng: 135.0, minYear: -100000, maxYear: -8000 },
    { id: 'poi-sundaland', title: 'Sundaland', desc: 'Lush Ice Age subcontinent twice the size of India.', lat: 0.0, lng: 110.0, minYear: -50000, maxYear: -10000 },
    { id: 'poi-green-sahara', title: 'Green Sahara', desc: 'Lush savanna during the Holocene Optimum.', lat: 20.0, lng: 10.0, minYear: -9000, maxYear: -3000 },
    { id: 'poi-megachad', title: 'Lake Mega-Chad', desc: 'Massive inland freshwater lake.', lat: 15.0, lng: 16.0, minYear: -9000, maxYear: -4000 },
    { id: 'poi-agassiz', title: 'Glacial Lake Agassiz', desc: 'Massive freshwater melt lake in North America.', lat: 52.0, lng: -95.0, minYear: -13000, maxYear: -8500 },
    { id: 'poi-lahontan', title: 'Lakes Lahontan & Bonneville', desc: 'Giant inland lakes covering Nevada/Utah.', lat: 40.0, lng: -115.0, minYear: -25000, maxYear: -10000 },
    { id: 'poi-toba', title: 'Toba Supereruption', desc: 'Volcanic winter causes genetic bottleneck.', lat: 2.6, lng: 98.8, minYear: -80000, maxYear: -70000 },
    { id: 'poi-panama', title: 'Isthmus of Panama Formed', desc: 'Closes Atlantic-Pacific currents, triggering Ice Ages.', lat: 9.0, lng: -80.0, minYear: -6000000, maxYear: -3000000 },
    { id: 'poi-messinian', title: 'Messinian Salinity Crisis', desc: 'Mediterranean evaporated into salt flats.', lat: 35.0, lng: 15.0, minYear: -6000000, maxYear: -5330000 },
    { id: 'poi-tamanrasset', title: 'Tamanrasset River System', desc: 'Massive river flowing through a lush Sahara.', lat: 20.0, lng: -10.0, minYear: -9000, maxYear: -3000 },
    { id: 'poi-sarasvati', title: 'Sarasvati River', desc: 'Ancient Vedic river that dried up as the climate shifted.', lat: 28.0, lng: 72.0, minYear: -100000, maxYear: -4000 }
];

const ROUTES = [
    { name: 'Migration to Americas', color: 0xef4444, path: [[65, -165], [60, -135], [50, -115], [35, -105], [15, -95], [-10, -75], [-30, -65]] },
    { name: 'European Expansion', color: 0x3b82f6, path: [[10, 38], [25, 35], [35, 38], [42, 25], [48, 15], [45, 0]] },
    { name: 'Out of Africa', color: 0x22c55e, path: [[-5, 35], [12, 43], [15, 52], [24, 64], [20, 75], [15, 82], [22, 90], [15, 96], [0, 105], [-10, 135]] }
];

const CLIMATE_DATA = [
    { y: 2026, t: 0.0, s: 0.0 }, { y: 1900, t: -1.0, s: -0.2 }, { y: 0, t: -1.2, s: -0.5 }, { y: -6000, t: 0.5, s: -2.0 },
    { y: -10000, t: -1.0, s: -35.0 }, { y: -11500, t: -1.5, s: -50.0 }, { y: -12000, t: -4.5, s: -65.0 }, { y: -14000, t: -2.0, s: -85.0 },
    { y: -20000, t: -6.5, s: -120.0 }, { y: -30000, t: -5.0, s: -100.0 }, { y: -60000, t: -4.5, s: -80.0 }, { y: -74000, t: -7.5, s: -75.0 },
    { y: -80000, t: -5.0, s: -60.0 }, { y: -100000, t: -2.0, s: -30.0 }, { y: -3000000, t: +2.5, s: 0.0 }, { y: -6000000, t: +3.0, s: 0.0 }
];

const TIME_SCALE = [{ v: 0, y: -6000000 }, { v: 150, y: -100000 }, { v: 400, y: -20000 }, { v: 700, y: -10000 }, { v: 1000, y: 2026 }];

function sliderToYear(val) { for (let i = 0; i < TIME_SCALE.length - 1; i++) { if (val >= TIME_SCALE[i].v && val <= TIME_SCALE[i + 1].v) return TIME_SCALE[i].y + ((val - TIME_SCALE[i].v) / (TIME_SCALE[i + 1].v - TIME_SCALE[i].v)) * (TIME_SCALE[i + 1].y - TIME_SCALE[i].y); } return 2026; }
function yearToSlider(year) { for (let i = 0; i < TIME_SCALE.length - 1; i++) { if (year >= TIME_SCALE[i].y && year <= TIME_SCALE[i + 1].y) return TIME_SCALE[i].v + ((year - TIME_SCALE[i].y) / (TIME_SCALE[i + 1].y - TIME_SCALE[i].y)) * (TIME_SCALE[i + 1].v - TIME_SCALE[i].v); } return 1000; }
function getClimate(year) { if (year >= CLIMATE_DATA[0].y) return CLIMATE_DATA[0]; if (year <= CLIMATE_DATA[CLIMATE_DATA.length - 1].y) return CLIMATE_DATA[CLIMATE_DATA.length - 1]; for (let i = 0; i < CLIMATE_DATA.length - 1; i++) { const d1 = CLIMATE_DATA[i], d2 = CLIMATE_DATA[i + 1]; if (year <= d1.y && year > d2.y) { const t = (1 - Math.cos(((year - d2.y) / (d1.y - d2.y)) * Math.PI)) / 2; return { t: d2.t + (d1.t - d2.t) * t, s: d2.s + (d1.s - d2.s) * t }; } } return CLIMATE_DATA[0]; }

// --- N-BODY GRAVITATIONAL INTEGRATOR ---
class NBodyPhysics {
    constructor() {
        this.G = 0.0001; this.dt = 0.5; this.hist = []; this.eMin = 100; this.eMax = 100;
        this.bodies = { s: { m: 10000, p: new THREE.Vector2(0, 0), v: new THREE.Vector2(0, 0) }, e: { m: 1, p: new THREE.Vector2(100, 0), v: new THREE.Vector2(0, 1.0) }, j: { m: 317, p: new THREE.Vector2(520, 0), v: new THREE.Vector2(0, 0.43) } };
    }
    step() {
        const { s, e, j } = this.bodies;
        let rS = new THREE.Vector2().subVectors(s.p, e.p), fS = rS.clone().normalize().multiplyScalar((this.G * s.m * e.m) / rS.lengthSq());
        let rJ = new THREE.Vector2().subVectors(j.p, e.p), fJ = rJ.clone().normalize().multiplyScalar((this.G * j.m * e.m) / rJ.lengthSq());
        e.v.add(new THREE.Vector2().addVectors(fS, fJ).multiplyScalar(this.dt / e.m));
        e.p.add(e.v.clone().multiplyScalar(this.dt));

        let rSJ = new THREE.Vector2().subVectors(s.p, j.p), fSJ = rSJ.clone().normalize().multiplyScalar((this.G * s.m * j.m) / rSJ.lengthSq());
        j.v.add(fSJ.multiplyScalar(this.dt / j.m));
        j.p.add(j.v.clone().multiplyScalar(this.dt));

        let cR = e.p.length(); this.eMin = Math.min(this.eMin, cR); this.eMax = Math.max(this.eMax, cR);
        this.hist.push(cR);
        if (this.hist.length > 600) { this.hist.shift(); this.eMin = Math.min(...this.hist); this.eMax = Math.max(...this.hist); }
    }
    getEcc() { const e = (this.eMax - this.eMin) / (this.eMax + this.eMin); return isNaN(e) ? 0.016 : e; }
}
const physicsEngine = new NBodyPhysics();

function latLngToVec(lat, lng, r) { const phi = (90 - lat) * (Math.PI / 180), theta = (lng + 180) * (Math.PI / 180); return new THREE.Vector3(-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)); }

const container = $('canvas-container');
const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3.5);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.minDistance = 1.05; controls.maxDistance = 10; controls.enablePan = false;

let loaded = 0, texs = {}, earthMat, earthG, cloudG, earthM, cloudM, celestial, sunM, atmosM, atmosG, migG, migM;
const loader = new THREE.TextureLoader(); loader.crossOrigin = "Anonymous";
for (let k in TEXTURES) texs[k] = loader.load(TEXTURES[k], () => { loaded++; $('loading-text').innerText = `Syncing data... ${Math.round((loaded / 4) * 100)}%`; if (loaded === 4) { initEarth(); setTimeout(() => { $('loading').style.opacity = '0'; setTimeout(() => $('loading').style.display = 'none', 1000); }, 500); } });

const eVS = `varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition; void main(){ vUv=uv; vNormal=normalize((modelMatrix*vec4(normal,0.0)).xyz); vPosition=(modelMatrix*vec4(position,1.0)).xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const eFS = `
    uniform sampler2D tColor; uniform sampler2D tBump; uniform sampler2D tWater; uniform float uYear; uniform float uMonth; uniform float uTempDelta; uniform float uSeaLevelDrop; uniform vec3 uSunPosition; uniform float uIs2D; uniform float uViewMode; uniform float uHoloceneOptimum; uniform float uTobaAsh; uniform float uTime;
    varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
    
    vec3 mod289(vec3 x){ return x-floor(x*(1.0/289.0))*289.0; } vec2 mod289(vec2 x){ return x-floor(x*(1.0/289.0))*289.0; } vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v){ const vec4 C=vec4(0.2113248,0.366025,-0.57735,0.02439); vec2 i=floor(v+dot(v,C.yy)), x0=v-i+dot(i,C.xx), i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.); vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i); vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.)); vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m*m*m; vec3 x=2.0*fract(p*C.www)-1.0, h=abs(x)-0.5, ox=floor(x+0.5), a0=x-ox; m*=1.7928-0.8537*(a0*a0+h*h); vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.0*dot(m,g); }
    vec2 curl(vec2 uv){ float e=0.01, dx=(snoise(uv+vec2(e,0.))-snoise(uv-vec2(e,0.)))/(2.*e), dy=(snoise(uv+vec2(0.,e))-snoise(uv-vec2(0.,e)))/(2.*e); return vec2(dy,-dx); }
    
    void main() {
        float df=clamp(-uYear/6000000.0,0.0,1.0)*0.018; vec2 uv=vUv;
        uv.x-=(1.0-smoothstep(0.2,0.4,vUv.x))*df; uv.x+=smoothstep(0.4,0.6,vUv.x)*df;
        uv.y+=smoothstep(0.68,0.73,vUv.x)*(1.0-smoothstep(0.75,0.78,vUv.x))*smoothstep(0.5,0.6,vUv.y)*(1.0-smoothstep(0.7,0.75,vUv.y))*df*1.5;
        
        vec4 bc=texture2D(tColor,uv); float el=texture2D(tBump,uv).r; float wm=texture2D(tWater,uv).r; if(el>0.02) wm=0.0;
        float nd=1.0-smoothstep(0.05,0.35,bc.g), dm=pow(clamp(nd+snoise(uv*400.0)*0.01,0.0,1.0),2.0)*6000.0;
        if(uYear<=-3000000.0 && (smoothstep(0.26,0.27,uv.x)-smoothstep(0.29,0.30,uv.x))*(smoothstep(0.53,0.54,uv.y)-smoothstep(0.57,0.58,uv.y))>0.5 && el<0.1){ wm=1.0; dm=500.0; }
        
        vec3 col=bc.rgb; vec3 dN=vNormal;
        if(wm>0.5 && uIs2D<0.5){ vec2 flow=clamp(curl(uv*20.0+uTime*0.05)*0.01,-1.0,1.0); dN=normalize(vNormal+vec3(flow.x,flow.y,0.)*0.5); col+=vec3(0.,max(0.,flow.x),max(0.,flow.y))*0.1; }
        
        bool land=(wm>0.5 && dm<uSeaLevelDrop);
        float iceT=0.88-((-uTempDelta+(pow(el,2.5)*12.))/6.5)*0.38+((uv.y-0.5>0.0)?-sin((uMonth/12.0)*6.28)*0.06:sin((uMonth/12.0)*6.28)*0.06);
        bool ice=(abs(uv.y-0.5)*2.0)+snoise(uv*50.0)*0.05>iceT;
        
        float lake=0.0, riv=0.0;
        if(uHoloceneOptimum>0.0){ 
            lake=(1.0-smoothstep(0.005,0.015,length(vec2((uv.x-0.544)*2.0,uv.y-0.583))+snoise(uv*400.0)*0.004))*uHoloceneOptimum; 
            vec2 pa=uv+(vec2(snoise(uv*80.),snoise(uv*80.+42.))*0.0015)-vec2(0.513,0.627), ba=vec2(-0.058,-0.016); 
            float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.), rw=0.0003+0.0009*sin(h*3.14); 
            riv=max(riv,(1.0-smoothstep(rw*0.2,rw,length(pa-ba*h)))*(1.0-smoothstep(mix(0.15,0.03,h)-0.02,mix(0.15,0.03,h)+0.02,el))*uHoloceneOptimum); 
        }
        float sa=smoothstep(-2000.0,-4000.0,uYear)*(1.0-smoothstep(-100000.0,-110000.0,uYear));
        if(sa>0.0){ 
            vec2 pa=uv+(vec2(snoise(uv*100.),snoise(uv*100.+84.))*0.0015)-vec2(0.709,0.676), ba=vec2(-0.023,-0.046); 
            float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.), rw=0.0004+0.0012*h; 
            riv=max(riv,clamp((1.0-smoothstep(rw*0.2,rw,length(pa-ba*h)))*(1.0-smoothstep(mix(0.3,0.04,h)-0.02,mix(0.3,0.04,h)+0.02,el))*sa,0.,1.)); 
        }
        
        bool mess=(uYear<=-5330000.0 && wm>0.5 && (smoothstep(0.485,0.487,uv.x)-smoothstep(0.60,0.61,uv.x))*(smoothstep(0.66,0.67,uv.y)-smoothstep(0.76,0.77,uv.y))*(1.0-(smoothstep(0.57,0.58,uv.x)*smoothstep(0.73,0.74,uv.y)))>0.5);
        float spec=0.0, inS=(smoothstep(0.46,0.48,uv.x)-smoothstep(0.56,0.58,uv.x))*(smoothstep(0.53,0.56,uv.y)-smoothstep(0.66,0.69,uv.y));
        
        if(inS>0.0 && uHoloceneOptimum>0.0 && wm<0.5 && lake<0.5 && riv<0.5) col=mix(col,mix(col,vec3(0.25,0.38,0.15),snoise(uv*200.0)*0.5+0.5),inS*uHoloceneOptimum*0.8);
        if(ice){ col=mix(col,vec3(0.8,0.9,1.0)*(0.85+snoise(uv*100.0)*0.15),0.9); spec=0.4; }
        else if(mess){ col=mix(bc.rgb,vec3(0.9,0.85,0.8)+snoise(uv*500.0)*0.1,0.95); spec=0.05; land=true; }
        else if(lake>0.5||riv>0.5){ col=mix(bc.rgb,vec3(0.05,0.35,0.45),0.95); spec=0.6; }
        else if(land){ col=mix(bc.rgb,vec3(0.5,0.45,0.3),0.9); spec=0.02; }
        else if(wm>0.5){ spec=0.8; }
        else{ float dF=clamp(-uTempDelta/6.5,0.0,1.0)*(1.0-inS*uHoloceneOptimum)*(1.0-(smoothstep(0.72,0.74,uv.x)-smoothstep(0.85,0.87,uv.x))*(smoothstep(0.42,0.44,uv.y)-smoothstep(0.56,0.58,uv.y))); col=mix(col,vec3(0.6,0.5,0.3),dF*0.4); }
        
        vec3 L=normalize(uSunPosition-vPosition); float dif=(uIs2D>0.5)?1.0:max(dot(dN,L),0.0); vec3 lit=col*(0.1+dif*0.9);
        if(uIs2D<0.5){ 
            vec3 R=reflect(-L,dN); lit+=vec3(1.0,0.9,0.8)*pow(max(dot(normalize(cameraPosition-vPosition),R),0.0),32.0)*spec*dif; 
            float dN_L=dot(dN,L); vec3 rim=mix(vec3(1.,0.4,0.1),vec3(0.2,0.5,1.0),smoothstep(0.,0.3,dN_L)); 
            rim=mix(rim,vec3(0.6,0.7,0.8),clamp(-uTempDelta/6.5,0.,1.)*0.4); rim=mix(rim,vec3(0.5,0.2,0.1),uTobaAsh); 
            lit+=rim*smoothstep(0.6,1.0,1.0-max(dot(normalize(cameraPosition-vPosition),dN),0.0))*0.5*max(dN_L+0.1,0.0); 
        }
        if(uViewMode>0.5) lit=(wm>0.5)?((dm<120.0)?mix(vec3(0,1,1),vec3(0,0.3,0.8),dm/120.0):mix(vec3(0,0.2,0.6),vec3(0),(dm-120.0)/5880.0)):vec3(0.05+el*0.25);
        gl_FragColor=vec4(lit,1.0);
    }
`;

const aVS = `varying vec3 vN; varying vec3 vP; void main(){ vN=normalize(normalMatrix*normal); vP=(modelMatrix*vec4(position,1.0)).xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const aFS = `
    uniform vec3 uSunPosition; uniform float uTempDelta; uniform float uTobaAsh; uniform vec3 cameraPos; varying vec3 vN; varying vec3 vP;
    void main(){ 
        vec3 vD=normalize(cameraPosition-vP), lD=normalize(uSunPosition-vP); float fr=clamp(1.0-dot(vD,vN),0.,1.), oD=0.0; 
        for(int i=0;i<8;i++){ oD+=exp(-(float(i)*0.05*fr)/0.08)*0.05; } 
        vec3 rC=vec3(0.1,0.3,0.7)*oD; float dN=dot(vN,lD); 
        vec3 sC=vec3(1.,0.4,0.1)*(smoothstep(-0.15,0.15,dN)-smoothstep(0.1,0.4,dN))*oD*2.0; 
        rC=mix(rC,vec3(0.5)*oD,clamp(-uTempDelta/6.5,0.,1.)*0.5); 
        if(uTobaAsh>0.) rC=mix(rC,vec3(0.4,0.1,0.05)*oD*2.0,uTobaAsh); 
        gl_FragColor=vec4(rC+sC, clamp(oD*2.0*smoothstep(-0.2,0.5,dN),0.,1.)); 
    }
`;

function initEarth() {
    earthMat = new THREE.ShaderMaterial({ vertexShader: eVS, fragmentShader: eFS, uniforms: { tColor: { value: texs.color }, tBump: { value: texs.bump }, tWater: { value: texs.water }, uYear: { value: 2026 }, uMonth: { value: 4 }, uTempDelta: { value: 0 }, uSeaLevelDrop: { value: 0 }, uSunPosition: { value: new THREE.Vector3() }, uIs2D: { value: 0 }, uViewMode: { value: 0 }, uHoloceneOptimum: { value: 0 }, uTobaAsh: { value: 0 }, uTime: { value: 0 } } });
    earthG = new THREE.Mesh(new THREE.SphereGeometry(1, 256, 256), earthMat); scene.add(earthG);
    earthM = new THREE.Mesh(new THREE.PlaneGeometry(4, 2, 256, 256), earthMat); earthM.visible = false; scene.add(earthM);
    atmosM = new THREE.ShaderMaterial({ vertexShader: aVS, fragmentShader: aFS, uniforms: { uSunPosition: { value: new THREE.Vector3() }, uTempDelta: { value: 0 }, uTobaAsh: { value: 0 }, cameraPos: { value: camera.position } }, transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false });
    atmosG = new THREE.Mesh(new THREE.SphereGeometry(1.04, 64, 64), atmosM); scene.add(atmosG);

    let pois = $('poi-container');
    POIS.forEach(p => { const e = document.createElement('div'); e.className = 'poi-marker'; e.innerHTML = `<div class="poi-dot"></div><div class="poi-label"><strong>${p.title}</strong><br/>${p.desc}</div>`; pois.appendChild(e); p.el = e; p.vec = latLngToVec(p.lat, p.lng, 1.02); });

    migG = new THREE.Group(); migM = new THREE.Group(); scene.add(migG); scene.add(migM); migG.visible = migM.visible = false;
    ROUTES.forEach(r => {
        let pg = [], pm = []; r.path.forEach(c => { pg.push(latLngToVec(c[0], c[1], 1.005)); pm.push(new THREE.Vector3((c[1] / 180) * 2., (c[0] / 90) * 1., 0.01)); });
        const mat = new THREE.LineBasicMaterial({ color: r.color, transparent: true, opacity: 0.8, linewidth: 2 });
        migG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(pg).getPoints(50)), mat));
        migM.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(pm).getPoints(50)), mat));
    });

    celestial = new THREE.Group(); celestial.rotation.x = 23.5 * (Math.PI / 180); scene.add(celestial);
    const stars = new Float32Array(12000); for (let i = 0; i < 12000; i += 3) { let r = 100, th = 2 * Math.PI * Math.random(), ph = Math.acos(2 * Math.random() - 1); stars[i] = r * Math.sin(ph) * Math.cos(th); stars[i + 1] = r * Math.sin(ph) * Math.sin(th); stars[i + 2] = r * Math.cos(ph); }
    const sGeo = new THREE.BufferGeometry(); sGeo.setAttribute('position', new THREE.BufferAttribute(stars, 3)); celestial.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ size: 0.1, color: 0xffffff, transparent: true, opacity: 0.8 })));
    sunLightPivot = new THREE.Group(); celestial.add(sunLightPivot); sunM = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffea00 })); sunM.position.set(95, 0, 0); sunLightPivot.add(sunM); const sl = new THREE.DirectionalLight(0xffffff, 1.2); sl.position.set(50, 0, 0); sunLightPivot.add(sl);

    const cm = new THREE.MeshLambertMaterial({ map: texs.clouds, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false });
    cloudG = new THREE.Mesh(new THREE.SphereGeometry(1.015, 64, 64), cm); scene.add(cloudG); cloudM = new THREE.Mesh(new THREE.PlaneGeometry(4, 2, 64, 64), cm); cloudM.position.z = 0.05; cloudM.visible = false; scene.add(cloudM);

    let lt = 0; function animate(t) {
        requestAnimationFrame(animate); const dt = (t - lt) * 0.001; lt = t; physicsEngine.step();
        const zf = is2DView ? Math.max(0.005, Math.pow(camera.position.distanceTo(controls.target) / 2.8, 2)) : Math.max(0.015, Math.pow(Math.max(0.01, camera.position.distanceTo(controls.target) - 1.0) / 2.5, 1.5));
        controls.rotateSpeed = controls.panSpeed = zf * 0.6; controls.zoomSpeed = Math.max(0.15, zf * 1.5);
        if (isSpinning && !is2DView) { earthG.rotation.y += 0.05 * dt; cloudG.rotation.y += 0.06 * dt; migG.rotation.y += 0.05 * dt; }
        if (is2DView) { controls.target.x = Math.max(-2, Math.min(2, controls.target.x)); controls.target.y = Math.max(-1, Math.min(1, controls.target.y)); }

        const yr = sliderToYear(parseFloat($('slider-year').value));
        POIS.forEach(p => {
            if (yr <= p.maxYear && yr >= p.minYear) {
                let tv = new THREE.Vector3(), s = false;
                if (is2DView) { tv.set((p.lng / 180) * 2, (p.lat / 90) * 1, 0).applyMatrix4(earthM.matrixWorld); s = true; }
                else { tv.copy(p.vec).applyMatrix4(earthG.matrixWorld); if (new THREE.Vector3().subVectors(camera.position, tv).dot(tv.clone().normalize()) > 0) s = true; }
                if (s) { tv.project(camera); if (tv.z < 1.0) { p.el.style.left = `${(tv.x * .5 + .5) * window.innerWidth}px`; p.el.style.top = `${(tv.y * -.5 + .5) * window.innerHeight}px`; p.el.style.display = 'block'; setTimeout(() => p.el.style.opacity = '1', 10); return; } }
            }
            p.el.style.opacity = '0'; setTimeout(() => p.el.style.display = 'none', 300);
        });

        if (cloudG) {
            const cl = getClimate(yr), ash = Math.exp(-Math.pow((yr + 74000) / 2000, 2));
            cm.opacity = Math.min(1.0, 0.6 - (Math.max(0, -cl.t / 6.5) * 0.2) + (ash * 0.3)); cm.color.setRGB(1 - ash * .7, 1 - ash * .7, 1 - ash * .7);
            earthMat.uniforms.uTobaAsh.value = ash; earthMat.uniforms.uTime.value = t * 0.001;
            atmosM.uniforms.uTobaAsh.value = ash; atmosM.uniforms.uTempDelta.value = cl.t; atmosM.uniforms.cameraPos.value.copy(camera.position);
        }
        if (sunM) { let wp = new THREE.Vector3(); sunM.getWorldPosition(wp); earthMat.uniforms.uSunPosition.value.copy(wp); atmosM.uniforms.uSunPosition.value.copy(wp); }
        renderer.render(scene, camera);
    } animate(0);

    setInterval(() => { const e = physicsEngine.getEcc(); $('data-ecc').innerText = e.toFixed(4); $('bar-ecc').style.width = ((e - 0.0034) / 0.0546) * 100 + "%"; }, 100);
    updateSimulation();
}

function updateSimulation() {
    const yr = sliderToYear(parseFloat($('slider-year').value)), mo = parseFloat($('slider-month').value), cl = getClimate(yr);
    $('display-year').innerText = yr < 0 ? Math.abs(Math.round(yr)).toLocaleString() + " BCE" : Math.round(yr).toLocaleString() + " CE"; $('display-month').innerText = MONTHS[mo - 1];
    const tilt = 23.3 + Math.sin(((yr - 2000) / 41000) * Math.PI * 2) * 1.2, pr = Math.abs(yr % 25772) / 25772 * 100;
    $('data-tilt').innerText = tilt.toFixed(2) + "°"; $('bar-tilt').style.width = ((tilt - 22.1) / 2.4) * 100 + "%"; $('data-prec').innerText = pr.toFixed(1) + "%"; $('bar-prec').style.width = pr + "%";
    if (celestial) { celestial.rotation.x = tilt * (Math.PI / 180); celestial.rotation.y = (yr - 2000) / 25772 * Math.PI * 2; sunLightPivot.rotation.y = ((mo - 1) / 12) * Math.PI * 2; }
    if (earthMat) { earthMat.uniforms.uYear.value = yr; earthMat.uniforms.uMonth.value = mo; earthMat.uniforms.uTempDelta.value = cl.t; earthMat.uniforms.uSeaLevelDrop.value = Math.abs(cl.s); earthMat.uniforms.uHoloceneOptimum.value = (yr < -2000 && yr > -10000) ? 1.0 - Math.abs(yr + 6000) / 4000 : 0; }
    $('data-temp').innerText = (cl.t > 0 ? "+" : "") + cl.t.toFixed(1) + " °C"; $('data-sea').innerText = cl.s.toFixed(1) + " m"; $('data-ice-bar').style.width = Math.min(Math.max(10 + Math.max(0, -cl.t) * 2.3 + Math.sin((mo / 12) * Math.PI * 2) * 1.5, 0), 100) + "%";
}

$('slider-year').addEventListener('input', updateSimulation); $('slider-month').addEventListener('input', updateSimulation);
document.querySelectorAll('.preset-btn').forEach(b => b.addEventListener('click', e => { $('slider-year').value = yearToSlider(parseFloat(e.target.getAttribute('data-year'))); updateSimulation(); }));
$('toggle-spin').addEventListener('click', e => { isSpinning = !isSpinning; e.target.innerText = isSpinning ? "Pause Spin" : "Resume Spin"; e.target.classList.toggle('bg-red-500/50', !isSpinning); });
$('toggle-clouds').addEventListener('click', e => { isCloudsVisible = !isCloudsVisible; cloudGlobe.visible = cloudMap.visible = isCloudsVisible; if (atmosG) atmosG.visible = isCloudsVisible && !is2DView; e.target.classList.toggle('bg-red-500/50', !isCloudsVisible); });
$('toggle-astro').addEventListener('click', e => { isAstroVisible = !isAstroVisible; celestial.visible = isAstroVisible; e.target.classList.toggle('bg-red-500/50', !isAstroVisible); });
$('toggle-ui').addEventListener('click', e => { isUIVisible = !isUIVisible; $('bottom-controls').classList.toggle('opacity-0', !isUIVisible); $('era-box').classList.toggle('opacity-0', !isUIVisible); e.target.classList.toggle('bg-blue-500/50', !isUIVisible); });
$('toggle-migration').addEventListener('click', e => { isMigrationVisible = !isMigrationVisible; migG.visible = isMigrationVisible && !is2DView; migM.visible = isMigrationVisible && is2DView; e.target.classList.toggle('bg-red-500/50', isMigrationVisible); });
$('toggle-view').addEventListener('click', e => {
    is2DView = !is2DView; e.target.innerText = is2DView ? "3D Globe View" : "2D Map View"; earthG.visible = !is2DView; earthM.visible = is2DView;
    cloudG.visible = isCloudsVisible && !is2DView; cloudM.visible = isCloudsVisible && is2DView; if (atmosG) atmosG.visible = isCloudsVisible && !is2DView;
    migG.visible = isMigrationVisible && !is2DView; migM.visible = isMigrationVisible && is2DView;
    if (earthMat) earthMat.uniforms.uIs2D.value = is2DView ? 1 : 0; controls.enableRotate = !is2DView; controls.enablePan = is2DView; controls.mouseButtons.LEFT = is2DView ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE; camera.position.set(0, 0, is2DView ? 2.8 : 3.5); controls.target.set(0, 0, 0);
});
$('toggle-data').addEventListener('click', e => { isDataView = !isDataView; if (earthMat) earthMat.uniforms.uViewMode.value = isDataView ? 1 : 0; e.target.classList.toggle('bg-red-500/50', isDataView); });
window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });