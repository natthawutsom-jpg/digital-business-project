function showSection(id){
  const el=document.getElementById(id);
  if(el){el.scrollIntoView({behavior:"smooth",block:"start"});}
  document.querySelectorAll(".nav-item").forEach(a=>a.classList.remove("active"));
  const link=document.querySelector(`.nav-item[href="#${id}"]`);
  if(link) link.classList.add("active");
}
function selectMaterial(name){
  document.getElementById("materialSelect").value=name;
  showSection("request");
}
function filterMaterials(){
  const q=document.getElementById("search").value.toLowerCase();
  document.querySelectorAll(".material-card").forEach(card=>{
    card.style.display=card.dataset.name.toLowerCase().includes(q)?"block":"none";
  });
}
function submitRequest(e){
  e.preventDefault();
  const toast=document.getElementById("toast");
  toast.textContent="ส่งคำขอเบิกเรียบร้อยแล้ว (ข้อมูลตัวอย่าง)";
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2500);
}
function toggleSidebar(){document.querySelector(".sidebar").classList.toggle("open")}
document.querySelectorAll(".nav-item").forEach(a=>{
  a.addEventListener("click",()=>document.querySelector(".sidebar").classList.remove("open"));
});
