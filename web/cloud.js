import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.49.10';
const URL='https://ynstvmzhtzokvllrnjtn.supabase.co';
const KEY='sb_publishable_eUxIw3ssYv5FrrEu5DKYMw_rKO8N-J-';
const db=createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
const $=id=>document.getElementById(id),LOCAL='trafficreport-intakes-v1';
let user=null;
function status(msg){$('cloudStatus').textContent=msg}
async function refresh(){const {data,error}=await db.auth.getUser();user=error?null:data.user;$('cloudAccount').textContent=user?'로그인: '+user.email:'로그인하지 않았습니다.';$('cloudLogout').disabled=!user;$('cloudSync').disabled=!user;$('cloudLoad').disabled=!user;$('cloudUploadAudio').disabled=!user;return user}
function local(){try{return JSON.parse(localStorage.getItem(LOCAL)||'[]')}catch{return[]}}
function payload(x){const dt=new Date(x.at);if(!Number.isFinite(dt.getTime()))throw Error('사건 발생시각을 확인하십시오.');return{id:x.id,occurred_at:dt.toISOString(),latitude:x.lat||null,longitude:x.lon||null,gps_accuracy_m:x.accuracy||null,road_address:x.road||'',jibun_address:x.jibun||'',verified_place:x.place||'',incident_type:x.type||'교통위반',vehicle_plate:x.plate||'',transcript:x.transcript||'',report_draft:x.draft||''}}
function record(x){const d=new Date(x.occurred_at);const localAt=new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,19);return{id:x.id,at:localAt,lat:x.latitude??'',lon:x.longitude??'',accuracy:x.gps_accuracy_m??'',road:x.road_address??'',jibun:x.jibun_address??'',place:x.verified_place??'',type:x.incident_type??'',plate:x.vehicle_plate??'',transcript:x.transcript??'',draft:x.report_draft??'',updatedAt:x.updated_at}}
async function sync(){if(!await refresh())throw Error('먼저 로그인하십시오.');const items=local();let n=0;for(const x of items){const {error}=await db.rpc('trafficreport_upsert_incident',{payload:payload(x)});if(error)throw Error(x.id+': '+error.message);n++}status('클라우드 저장 완료: '+n+'건. 다른 기기에서는 클라우드 불러오기를 실행하십시오.')}
async function pull(){if(!await refresh())throw Error('먼저 로그인하십시오.');const {data,error}=await db.rpc('trafficreport_list_incidents');if(error)throw error;const all=local(),ids=new Set(all.map(x=>x.id));let n=0;for(const x of data||[]){if(!ids.has(x.id)){all.push(record(x));n++}}localStorage.setItem(LOCAL,JSON.stringify(all));window.renderIntake?.();status('클라우드에서 '+n+'건을 추가했습니다. 같은 사건의 로컬 수정 내용은 덮어쓰지 않았습니다.')}
function audio(id){return new Promise((resolve,reject)=>{const q=indexedDB.open('trafficreport-audio-v1',1);q.onsuccess=()=>{const d=q.result,t=d.transaction('audio','readonly'),g=t.objectStore('audio').get(id);g.onsuccess=()=>{resolve(g.result?.blob||null);d.close()};g.onerror=()=>reject(g.error)};q.onerror=()=>reject(q.error)})}
async function upload(){if(!await refresh())throw Error('먼저 로그인하십시오.');const id=window.trafficreportActiveId?.();if(!id)throw Error('사전등록 사건을 먼저 선택하십시오.');const blob=await audio(id);if(!blob)throw Error('이 사건에 저장된 음성 녹음이 없습니다.');const path=user.id+'/'+id+'/original.'+(blob.type.includes('mp4')?'m4a':blob.type.includes('ogg')?'ogg':'webm');const {error}=await db.storage.from('trafficreport-evidence').upload(path,blob,{contentType:blob.type||'audio/webm',upsert:true});if(error)throw error;const x=local().find(x=>x.id===id);if(x){const p=payload(x);p.audio_object_path=path;const r=await db.rpc('trafficreport_upsert_incident',{payload:p});if(r.error)throw r.error}status('음성 원본을 비공개 클라우드 저장소에 업로드했습니다.')}
async function run(f){try{status('처리 중...');await f()}catch(e){status('실패: '+e.message)}}
$('cloudLogin').onclick=()=>run(async()=>{const email=$('cloudEmail').value.trim(),password=$('cloudPassword').value;if(!email||!password)throw Error('이메일과 비밀번호를 입력하십시오.');const {error}=await db.auth.signInWithPassword({email,password});$('cloudPassword').value='';if(error)throw error;await refresh();status('로그인 완료')});
$('cloudSignup').onclick=()=>run(async()=>{const email=$('cloudEmail').value.trim(),password=$('cloudPassword').value;if(password.length<8)throw Error('비밀번호는 8자 이상 입력하십시오.');const {data,error}=await db.auth.signUp({email,password});$('cloudPassword').value='';if(error)throw error;await refresh();status(data.session?'가입 및 로그인 완료':'가입 요청 완료. 이메일 인증 후 로그인하십시오.')});
$('cloudLogout').onclick=()=>run(async()=>{const {error}=await db.auth.signOut();if(error)throw error;await refresh();status('로그아웃했습니다. 기기에 남은 기록은 자동 삭제되지 않습니다.')});
$('cloudSync').onclick=()=>run(sync);$('cloudLoad').onclick=()=>run(pull);$('cloudUploadAudio').onclick=()=>run(upload);

window.trafficreportReverseGeocode=async(lat,lon)=>{
 const {data:{session}}=await db.auth.getSession();
 if(!session?.access_token)throw Error('주소 자동 변환을 사용하려면 먼저 클라우드 계정에 로그인하십시오.');
 const r=await fetch(URL+'/functions/v1/trafficreport-reverse-geocode',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token,'apikey':KEY},body:JSON.stringify({lat:Number(lat),lon:Number(lon)})});
 const j=await r.json();if(!r.ok)throw Error(j.error||'주소 조회 실패');return j;
};
db.auth.onAuthStateChange(()=>{refresh().catch(()=>{})});refresh().catch(e=>status(e.message));