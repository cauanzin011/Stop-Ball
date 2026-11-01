if (window.lucide){
  lucide.createIcons()
}

const ano = document.getElementById("anoAtualRegistro")
let anoAtual = new Date().getFullYear()
ano.textContent = `${anoAtual}`

const botaoMenu = document.querySelector(".botaoMenuCelular")
const barrasMenu = document.querySelector(".iconeMenuAbrir")
const fecharMenu = document.querySelector(".iconeMenuFechar")
const divMenu = document.querySelector(".menuSuspensoCelular")

botaoMenu.addEventListener("click", () =>{
  divMenu.classList.toggle("abrir");
  botaoMenu.classList.toggle("aberto");
})

const links = document.querySelectorAll("#areaMenuMobile a")

links.forEach((linkClicado) => {
  linkClicado.addEventListener("click", () => {
    divMenu.classList.remove("abrir");
    botaoMenu.classList.remove("aberto");
  })
})