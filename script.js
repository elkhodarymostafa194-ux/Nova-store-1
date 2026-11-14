// عدّل رقم واتساب إلى رقمك بصيغة دولية بدون + أو مسافات (مثال مصر: 2010xxxxxxx)
const STORE_WHATSAPP = "201000000000";
const SHIPPING_FEE = 60;
const FREE_SHIPPING_FROM = 1000;
const products = [
 {id:1,name:"سماعة لاسلكية Pro",category:"tech",categoryName:"تكنولوجيا",price:650,oldPrice:800,emoji:"🎧",tag:"الأكثر طلبًا"},
 {id:2,name:"ساعة Smart Fit",category:"tech",categoryName:"تكنولوجيا",price:890,oldPrice:1050,emoji:"⌚",tag:"عرض خاص"},
 {id:3,name:"شنطة كروس أنيقة",category:"style",categoryName:"ستايل",price:420,oldPrice:0,emoji:"👜",tag:"جديد"},
 {id:4,name:"نظارة Urban",category:"style",categoryName:"ستايل",price:350,oldPrice:450,emoji:"🕶️",tag:"خصم"},
 {id:5,name:"باور بانك 20000",category:"tech",categoryName:"تكنولوجيا",price:720,oldPrice:0,emoji:"🔋",tag:"عملي"},
 {id:6,name:"محفظة جلد",category:"accessories",categoryName:"إكسسوارات",price:280,oldPrice:0,emoji:"👛",tag:"اختيار مميز"},
 {id:7,name:"كفر موبايل Premium",category:"accessories",categoryName:"إكسسوارات",price:160,oldPrice:200,emoji:"📱",tag:"سعر مميز"},
 {id:8,name:"حامل موبايل مكتبي",category:"accessories",categoryName:"إكسسوارات",price:190,oldPrice:0,emoji:"🪄",tag:"مفيد يوميًا"}
];
let cart = [];
let activeCategory = "all";
const $ = id => document.getElementById(id);
const money = n => `${n.toLocaleString("en-US")} ج.م`;
function renderProducts(){
 const q=$("searchInput").value.trim().toLowerCase();
 const shown=products.filter(p=>(activeCategory==="all"||p.category===activeCategory)&&p.name.toLowerCase().includes(q));
 $("productGrid").innerHTML=shown.length?shown.map(p=>`<article class="product-card"><div class="product-image"><span>${p.emoji}</span><b class="product-tag">${p.tag}</b></div><div class="product-info"><span class="product-category">${p.categoryName}</span><h3>${p.name}</h3><div class="product-bottom"><div class="price">${money(p.price)} ${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:""}</div><button class="add-btn" onclick="addToCart(${p.id})">+ أضف للسلة</button></div></div></article>`).join(""):`<p style="color:#aaa">مفيش منتجات مطابقة للبحث.</p>`;
}
function addToCart(id){const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});renderCart();toast("اتضاف المنتج للسلة بنجاح");}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);renderCart();}
function removeItem(id){cart=cart.filter(x=>x.id!==id);renderCart();}
function subtotal(){return cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);}
function shipping(){return subtotal()===0||subtotal()>=FREE_SHIPPING_FROM?0:SHIPPING_FEE;}
function renderCart(){
 $("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
 $("cartItems").innerHTML=cart.length?cart.map(x=>{const p=products.find(a=>a.id===x.id);return `<div class="cart-row"><div class="cart-emoji">${p.emoji}</div><div class="cart-row-info"><b>${p.name}</b><small>${money(p.price)}</small><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div><button class="remove" onclick="removeItem(${p.id})">حذف</button></div>`}).join(""):`<div class="empty-cart"><span style="font-size:42px">🛍️</span><b>السلة لسه فاضية</b><span>اختار منتجاتك وارجع هنا.</span></div>`;
 $("subtotal").textContent=money(subtotal());
 $("shipping").textContent=cart.length?(shipping()===0?"مجاني":money(shipping())):"يُحدد عند التأكيد";
 $("checkoutTotal").textContent=money(subtotal()+shipping());
}
function openCart(){$("cartDrawer").classList.add("open");$("overlay").classList.add("show");}
function closeCart(){$("cartDrawer").classList.remove("open");$("overlay").classList.remove("show");}
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2200);}
$("openCart").onclick=openCart;$("closeCart").onclick=closeCart;$("overlay").onclick=closeCart;
$("checkoutBtn").onclick=()=>{if(!cart.length){toast("السلة فاضية، أضف منتج الأول");return;}closeCart();$("checkoutModal").classList.add("show");};
$("closeCheckout").onclick=()=>$("checkoutModal").classList.remove("show");
$("searchInput").addEventListener("input",renderProducts);
$("categoryFilter").addEventListener("change",e=>{activeCategory=e.target.value;document.querySelectorAll(".pill").forEach(b=>b.classList.toggle("active",b.dataset.category===activeCategory));renderProducts();});
document.querySelectorAll(".pill").forEach(b=>b.addEventListener("click",()=>{activeCategory=b.dataset.category;$("categoryFilter").value=activeCategory;document.querySelectorAll(".pill").forEach(x=>x.classList.toggle("active",x===b));renderProducts();}));
$("paymentMethod").addEventListener("change",e=>{const v=e.target.value;$("paymentNote").textContent=v==="الدفع عند الاستلام"?"هتدفع قيمة الطلب عند استلامه.":v==="تحويل فودافون كاش"?"بعد تأكيد الطلب، تواصل مع المتجر للحصول على رقم التحويل وإرسال إثبات الدفع.":"بعد تأكيد الطلب، تواصل مع المتجر للحصول على بيانات InstaPay وإرسال إثبات الدفع.";});
$("checkoutForm").addEventListener("submit",e=>{
 e.preventDefault();if(!cart.length)return;
 const f=new FormData(e.target);const name=f.get("name"),phone=f.get("phone"),address=f.get("address"),gov=f.get("governorate"),payment=f.get("payment");
 const lines=cart.map(x=>{const p=products.find(a=>a.id===x.id);return `• ${p.name} × ${x.qty} = ${money(p.price*x.qty)}`;}).join("\n");
 const total=subtotal()+shipping();
 const message=`طلب جديد من Nova Store%0Aالاسم: ${encodeURIComponent(name)}%0Aالموبايل: ${encodeURIComponent(phone)}%0Aالمحافظة: ${encodeURIComponent(gov)}%0Aالعنوان: ${encodeURIComponent(address)}%0Aطريقة الدفع: ${encodeURIComponent(payment)}%0A%0Aالمنتجات:%0A${encodeURIComponent(lines)}%0A%0Aالشحن: ${shipping()===0?"مجاني":money(shipping())}%0Aالإجمالي: ${money(total)}`;
 if(STORE_WHATSAPP==="201000000000"){toast("عدّل رقم واتساب المتجر داخل script.js أولًا");return;}
 window.open(`https://wa.me/${STORE_WHATSAPP}?text=${message}`,"_blank");
 $("checkoutModal").classList.remove("show");e.target.reset();cart=[];renderCart();toast("تم تجهيز الطلب — أرسله من واتساب لإتمامه.");
});
$("contactWhatsApp").href=`https://wa.me/${STORE_WHATSAPP}`;
$("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
