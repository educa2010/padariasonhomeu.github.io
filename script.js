const produtos = [
  { id: 1, nome: "Pão Francês", preco: 0.5, cat: "paes", img: "https://i.imgur.com/2cOaJ.png" },
  { id: 2, nome: "Pão de Queijo", preco: 1.5, cat: "paes", img: "https://i.imgur.com/XYV5b.png" },
  { id: 3, nome: "Bolo de Chocolate", preco: 15, cat: "bolos", img: "https://i.imgur.com/ZF6s192.png" },
  { id: 4, nome: "Bolo de Cenoura", preco: 14, cat: "bolos", img: "https://i.imgur.com/7Xx1r.png" },
  { id: 5, nome: "Café", preco: 4, cat: "bebidas", img: "https://i.imgur.com/eSbm.png" },
  { id: 6, nome: "Suco Natural", preco: 6, cat: "bebidas", img: "https://i.imgur.com/lp0J.png" }
];

let carrinho = [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

function showSection(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("ativo"));
  document.getElementById(id).classList.add("ativo");
  if(id==="admin") renderAdmin();
  if(id==="carrinho") renderCarrinho();
}

/* Renderizar produtos */
function renderProdutos(){
  produtos.forEach(p=>{
    document.getElementById(p.cat).innerHTML += `
      <div class="card">
        <img src="${p.img}" alt="${p.nome}">
        <div class="info">
          <h3>${p.nome}</h3>
          <p>R$ ${p.preco.toFixed(2)}</p>
          <input type="number" min="1" value="1" id="qtd_${p.id}">
          <button onclick="addCarrinho(${p.id})">Adicionar</button>
        </div>
      </div>
    `;
  });
}

/* Adicionar ao carrinho */
function addCarrinho(id){
  const quantidade = Number(document.getElementById(`qtd_${id}`).value);
  if(quantidade < 1) return alert("Quantidade inválida");

  let item = carrinho.find(i=>i.id===id);
  if(item) item.qtd += quantidade;
  else carrinho.push({...produtos.find(p=>p.id===id), qtd: quantidade});

  renderCarrinho();
  showToast();
}

/* Renderizar carrinho */
function renderCarrinho(){
  const div = document.getElementById("cartItems");
  div.innerHTML = "";
  let total=0;
  carrinho.forEach(i=>{
    total += i.preco*i.qtd;
    div.innerHTML += `<p>${i.nome} x${i.qtd} - R$ ${(i.preco*i.qtd).toFixed(2)}</p>`;
  });
  document.getElementById("cartTotal").innerText = "Total: R$ " + total.toFixed(2);
}

/* Toast */
function showToast(){
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2000);
}

/* Finalizar pedido */
function finalizarPedido(){
  if(!carrinho.length) return alert("Carrinho vazio");

  const codigo = Math.floor(10000 + Math.random()*90000);
  const pedido = {
    codigo,
    itens: carrinho,
    status: "Recebido",
    pagamento: document.getElementById("pagamento").value
  };

  pedidos.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  window.open(`https://wa.me/5516993699410?text=Pedido ${codigo} realizado`, "_blank");
  carrinho = [];
  renderCarrinho();
  alert(`Pedido criado! Código: ${codigo}`);
}

/* Acompanhar pedido */
function buscarPedido(){
  const codigo = Number(document.getElementById("codigoPedido").value);
  const pedido = pedidos.find(p=>p.codigo===codigo);
  const res = document.getElementById("resultadoPedido");
  res.innerHTML = pedido
    ? `Status: <span class="status ${pedido.status}">${pedido.status}</span>`
    : "Pedido não encontrado";
}

/* Admin */
function renderAdmin(){
  const div = document.getElementById("adminPedidos");
  div.innerHTML = "";
  pedidos.forEach((p,i)=>{
    div.innerHTML += `
      <div style="margin-bottom:.8rem">
        Pedido ${p.codigo}
        <select onchange="alterarStatus(${i},this.value)">
          <option ${p.status==="Recebido"?"selected":""}>Recebido</option>
          <option ${p.status==="Preparo"?"selected":""}>Preparo</option>
          <option ${p.status==="Pronto"?"selected":""}>Pronto</option>
          <option ${p.status==="Finalizado"?"selected":""}>Finalizado</option>
        </select>
      </div>
    `;
  });
}

function alterarStatus(i,status){
  pedidos[i].status = status;
  localStorage.setItem("pedidos",JSON.stringify(pedidos));
}

/* Inicializar */
renderProdutos();
