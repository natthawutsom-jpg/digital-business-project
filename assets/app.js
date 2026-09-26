const u=JSON.parse(localStorage.materialUser||'null');
if(!u) location='login.html';
const KEY={materials:'materialInventory',requests:'materialRequests',notices:'materialNotices'};
const seed=[
 {id:'MAT-00001',name:'กระดาษ A4',cat:'สำนักงาน',unit:'รีม',stock:120,min:20},
 {id:'MAT-00002',name:'ปากกาลูกลื่น',cat:'สำนักงาน',unit:'ด้าม',stock:50,min:15},
 {id:'MAT-00003',name:'แฟ้มเอกสาร',cat:'สำนักงาน',unit:'แฟ้ม',stock:35,min:10},
 {id:'MAT-00004',name:'หมึกพิมพ์',cat:'คอมพิวเตอร์',unit:'ตลับ',stock:8,min:5},
 {id:'MAT-00005',name:'สาย LAN Cat6',cat:'คอมพิวเตอร์',unit:'เส้น',stock:160,min:30},
 {id:'MAT-00006',name:'น้ำยาทำความสะอาด',cat:'ทำความสะอาด',unit:'ขวด',stock:6,min:10},
 {id:'MAT-00007',name:'SSD 500GB',cat:'คอมพิวเตอร์',unit:'ลูก',stock:24,min:8},
 {id:'MAT-00008',name:'เมาส์ USB',cat:'คอมพิวเตอร์',unit:'ตัว',stock:75,min:20}
];
function getMaterials(){let x=JSON.parse(localStorage[KEY.materials]||'null');if(!x){x=seed;localStorage[KEY.materials]=JSON.stringify(x)}return x}
function saveMaterials(x){localStorage[KEY.materials]=JSON.stringify(x)}
function getRequests(){return JSON.parse(localStorage[KEY.requests]||'[]')}
function saveRequests(x){localStorage[KEY.requests]=JSON.stringify(x)}
function getNotices(){return JSON.parse(localStorage[KEY.notices]||'[]')}
function saveNotices(x){localStorage[KEY.notices]=JSON.stringify(x)}
function status(m){return m.stock<=0?'หมด':m.stock<=m.min?'ใกล้หมด':'มีสต็อก'}
function logout(){localStorage.removeItem('materialUser');location='login.html'}
function toast(t){let x=document.getElementById('toast');if(!x)return; x.textContent=t;x.className='toast show';setTimeout(()=>x.className='toast',2500)}
function setup(){document.querySelectorAll('#userName').forEach(x=>x.textContent=u.name);document.querySelectorAll('#roleName').forEach(x=>x.textContent=u.roleName);document.querySelectorAll('nav a').forEach(a=>{if(a.getAttribute('href')===location.pathname.split('/').pop())a.classList.add('active')});document.querySelectorAll('.requester').forEach(x=>{if(u.role!=='requester')x.style.display='none'});document.querySelectorAll('.stock').forEach(x=>{if(u.role!=='stock')x.style.display='none'});document.querySelectorAll('.requester-page').forEach(x=>{if(u.role!=='requester')x.innerHTML='<div class="panel"><h2>ไม่มีสิทธิ์เข้าถึง</h2><p>หน้านี้สำหรับผู้เบิกเท่านั้น</p></div>'});document.querySelectorAll('.stock-page').forEach(x=>{if(u.role!=='stock')x.innerHTML='<div class="panel"><h2>ไม่มีสิทธิ์เข้าถึง</h2><p>หน้านี้สำหรับผู้ควบคุมสต็อกเท่านั้น</p></div>'})}
function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function makeDoc(req){
  if(!req){toast('ไม่พบข้อมูลใบเบิก');return}
  if(typeof html2pdf==='undefined'){
    toast('กำลังโหลดระบบสร้าง PDF กรุณาลองใหม่อีกครั้ง');
    return;
  }
  const rows=req.items.map((i,n)=>`<tr><td class="center">${n+1}</td><td>${esc(i.id)}</td><td>${esc(i.name)}</td><td class="center">${i.qty}</td><td class="center">${esc(i.unit)}</td></tr>`).join('');
  const statusClass=req.status==='อนุมัติแล้ว'?'approved':req.status==='ไม่อนุมัติ'?'rejected':'pending';
  const html=`<div id="pdfDoc" class="official-doc">
    <div class="doc-header">
      <div class="brand-mark">มทร.ศรีวิชัย</div>
      <div class="org">มหาวิทยาลัยเทคโนโลยีราชมงคลศรีวิชัย</div>
      <div class="college">วิทยาลัยรัตภูมิ</div>
      <div class="doc-title">ใบเบิกวัสดุ</div>
      <div class="doc-subtitle">งานพัสดุ วิทยาลัยรัตภูมิ</div>
    </div>
    <div class="doc-meta-grid">
      <div><b>เลขที่ใบเบิก</b><span>${esc(req.id)}</span></div>
      <div><b>วันที่ขอเบิก</b><span>${esc(req.createdAt)}</span></div>
      <div><b>ผู้ขอเบิก</b><span>${esc(req.requesterName)}</span></div>
      <div><b>หน่วยงาน/สังกัด</b><span>วิทยาลัยรัตภูมิ</span></div>
      <div><b>สถานะ</b><span class="status ${statusClass}">${esc(req.status)}</span></div>
      <div><b>กำหนดรับวัสดุ</b><span>${esc(req.pickupAt||'-')}</span></div>
    </div>
    <div class="section-title">รายละเอียดวัสดุที่ขอเบิก</div>
    <table class="doc-table"><thead><tr><th>ลำดับ</th><th>รหัสวัสดุ</th><th>รายการวัสดุ</th><th>จำนวน</th><th>หน่วย</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="reason"><b>วัตถุประสงค์/เหตุผลในการเบิก</b><div>${esc(req.reason||'-')}</div></div>
    <div class="note"><b>หมายเหตุ</b><div>${esc(req.response||'เอกสารฉบับนี้จัดทำจากระบบเบิกจ่ายวัสดุของวิทยาลัยรัตภูมิ')}</div></div>
    <div class="signature-grid">
      <div class="signature"><div>ลงชื่อ ........................................................</div><div>( ${esc(req.requesterName)} )</div><div>ผู้ขอเบิกวัสดุ</div><div class="date-line">วันที่ ............ / ............ / ............</div></div>
      <div class="signature"><div>ลงชื่อ ........................................................</div><div>( ${esc(req.approverName||'........................................')} )</div><div>ผู้ควบคุมสต็อก / เจ้าหน้าที่พัสดุ</div><div class="date-line">วันที่ ............ / ............ / ............</div></div>
    </div>
    <div class="footer">เอกสารนี้จัดทำจากระบบเบิกจ่ายวัสดุสำหรับงานพัสดุ ภายในวิทยาลัยรัตภูมิ</div>
  </div>`;
  const holder=document.createElement('div');
  holder.innerHTML=html;
  holder.style.position='fixed';holder.style.left='-10000px';holder.style.top='0';holder.style.width='794px';holder.style.background='#fff';holder.style.zIndex='-1';
  document.body.appendChild(holder);
  const opt={margin:[10,10,10,10],filename:`ใบเบิกวัสดุ_${req.id}.pdf`,image:{type:'jpeg',quality:0.98},html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff'},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}};
  html2pdf().set(opt).from(holder.querySelector('#pdfDoc')).save().then(()=>{holder.remove();toast('ดาวน์โหลดใบเบิกวัสดุเป็น PDF เรียบร้อยแล้ว')}).catch(()=>{holder.remove();toast('ไม่สามารถสร้าง PDF ได้ กรุณาลองใหม่')});
}
function notify(requestId,text){let n=getNotices();n.unshift({id:Date.now(),requestId,text,to:'requester',createdAt:new Date().toLocaleString('th-TH')});saveNotices(n)}
document.addEventListener('DOMContentLoaded',setup);
