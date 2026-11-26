if (window.lucide) {
    lucide.createIcons()
}

const ano = document.getElementById("anoAtualRegistro")

let anoAtual = new Date().getFullYear()

ano.textContent = `${anoAtual}`

const botaoMenu = document.querySelector(".botaoMenuCelular")
const divMenu = document.querySelector(".menuSuspensoCelular")
const linksMenu = document.querySelectorAll("#areaMenuMobile a")

function abrirFecharMenu() {
    divMenu.classList.toggle("abrir")
    botaoMenu.classList.toggle("aberto")
}

function fecharMenu() {
    divMenu.classList.remove("abrir")
    botaoMenu.classList.remove("aberto")
}

botaoMenu.addEventListener("click", abrirFecharMenu)

linksMenu.forEach(link => {
    link.addEventListener("click", fecharMenu)
})


function iniciarCarrosselFamosos() {
    const secao = document.getElementById("famosos")

    if (!secao) return

    const slides = secao.querySelectorAll(".famoso")
    const botoes = secao.querySelectorAll(".famosos__btn")

    const intervalo = 4000
    const tempoTrava = 1100

    const movimentoReduzido = matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches

    let atual = 0
    let direcao = 1
    let timer = null
    let travado = false
    let visivel = false

    function trocarSlide(destino, direcao) {
        if (destino === atual || travado) return

        travado = true

        setTimeout(() => {
            travado = false
        }, tempoTrava)

        const slideAtual = slides[atual]
        const proximoSlide = slides[destino]

        proximoSlide.classList.remove("out-left", "out-right")

        if (direcao > 0) {
            proximoSlide.classList.add("sem-transicao", "from-right")
        } else {
            proximoSlide.classList.add("sem-transicao", "from-left")
        }

        void proximoSlide.offsetWidth

        proximoSlide.classList.remove(
            "sem-transicao",
            "from-right",
            "from-left"
        )

        proximoSlide.classList.add("is-active")
        slideAtual.classList.remove("is-active")

        if (direcao > 0) {
            slideAtual.classList.add("out-left")
        } else {
            slideAtual.classList.add("out-right")
        }
        atual = destino
    }

    function proximoSlideAutomatico() {

        let destino = atual + direcao

        if (destino >= slides.length) {
            direcao = -1
            destino = atual - 1
        }

        if (destino < 0) {
            direcao = 1
            destino = atual + 1
        }

        trocarSlide(destino, direcao)
    }

    function pararCarrossel() {
        clearInterval(timer)
        timer = null
    }

    function iniciarCarrossel() {

        pararCarrossel()

        if (movimentoReduzido) return
        if (slides.length < 2) return
        if (!visivel || document.hidden) return

        timer = setInterval(proximoSlideAutomatico, intervalo)
    }

    function navegarSlide(direcaoEscolhida) {

        if (slides.length < 2) return

        let destino = atual + direcaoEscolhida

        if (destino >= slides.length) {
            destino = 0
        }

        if (destino < 0) {
            destino = slides.length - 1
        }

        trocarSlide(destino, direcaoEscolhida)

        direcao = direcaoEscolhida

        iniciarCarrossel()
    }

    botoes.forEach(botao => {

        botao.addEventListener("click", () => {

            const direcaoEscolhida = Number(botao.dataset.dir)

            navegarSlide(direcaoEscolhida)

        })

    })

    const observador = new IntersectionObserver((entradas) => {

        const entrada = entradas[0]

        visivel = entrada.isIntersecting

        if (visivel) {
            iniciarCarrossel()
        } else {
            pararCarrossel()
        }

    }, { threshold: 0.4 })

    observador.observe(secao)

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            pararCarrossel()
        } else {
            iniciarCarrossel()
        }

    })

    document.addEventListener("keydown", evento => {

        if (!visivel) return

        if (evento.key === "ArrowRight") {
            navegarSlide(1)
        }

        if (evento.key === "ArrowLeft") {
            navegarSlide(-1)
        }

    })

    let posicaoInicial = null

    secao.addEventListener("touchstart", evento => {

        posicaoInicial = evento.touches[0].clientX

    }, { passive: true })

    secao.addEventListener("touchend", evento => {

        if (posicaoInicial === null) return

        const posicaoFinal = evento.changedTouches[0].clientX

        const distancia = posicaoFinal - posicaoInicial

        if (Math.abs(distancia) > 50) {

            if (distancia < 0) {
                navegarSlide(1)
            } else {
                navegarSlide(-1)
            }

        }
        posicaoInicial = null
    })

    if (slides.length > 0) {
        slides[0].classList.add("is-active")
    }
}
iniciarCarrosselFamosos()

function iniciarAnatomiaCamisa() {

    const raiz = document.getElementById("anatomiaCamisa")

    if (!raiz) return

    const pontos = raiz.querySelectorAll(".ponto")
    const foto = raiz.querySelector(".anatomia__foto")

    raiz.classList.add("anatomia--pronta")

    const observador = new IntersectionObserver((entradas, observador) => {

        const entrada = entradas[0]

        if (entrada.isIntersecting) {

            raiz.classList.add("ativo")

            observador.disconnect()

        }

    }, { threshold: 0.35 })

    if (foto) {
        observador.observe(foto)
    }

    function fecharPontos() {
        pontos.forEach(ponto => {

            ponto.classList.remove("is-open")

            const botao = ponto.querySelector(".ponto__botao")

            botao.setAttribute("aria-expanded", "false")
        })
    }

    pontos.forEach(ponto => {
        const botao = ponto.querySelector(".ponto__botao")

        botao.addEventListener("click", evento => {
            evento.stopPropagation()

            if (evento.pointerType === "mouse") return

            const estaAberto = ponto.classList.contains("is-open")

            fecharPontos()

            if (!estaAberto) {

                ponto.classList.add("is-open")

                botao.setAttribute("aria-expanded", "true")

            }
        })
    })

    document.addEventListener("click", fecharPontos)

    document.addEventListener("keydown", evento => {

        if (evento.key === "Escape") {
            fecharPontos()
        }
    })

    if (location.hash === "#calibrar") {
        if (!foto) return
        const aviso = document.createElement("div")

        aviso.className = "anatomia__calibrar"
        aviso.textContent = "Clique na foto para ver --x e --y"

        foto.append(aviso)

        foto.addEventListener("click", evento => {
            if (evento.target.closest(".ponto")) return

            const dimensoes = foto.getBoundingClientRect()

            const posicaoX = (
                (evento.clientX - dimensoes.left) / dimensoes.width * 100
            ).toFixed(1)

            const posicaoY = (
                (evento.clientY - dimensoes.top) / dimensoes.height * 100
            ).toFixed(1)

            aviso.textContent = `--x:${posicaoX}%; --y:${posicaoY}%`
        })
    }
}
iniciarAnatomiaCamisa()

function iniciarAbasProdutos() {
    const raiz = document.getElementById("linhasProdutos")

    if (!raiz) return

    const abas = raiz.querySelectorAll('[role="tab"]')
    const paineis = raiz.querySelectorAll('[role="tabpanel"]')
    const listaAbas = raiz.querySelector('[role="tablist"]')

    function abrirAba(indice, focar) {

        abas.forEach((aba, i) => {
            const ativa = indice === i

            aba.setAttribute("aria-selected", ativa)

            aba.tabIndex = ativa ? 0 : -1

            paineis[i].hidden = !ativa
        })

        if (focar) {
            abas[indice].focus()
        }
    }

    abas.forEach((aba, indice) => {

        aba.addEventListener("click", () => {
            abrirAba(indice, false)
        })
    })

    listaAbas.addEventListener("keydown", evento => {
        const indiceAtual = Array.from(abas).indexOf(document.activeElement)

        if (indiceAtual < 0 || abas.length === 0) return
        let proximoIndice = indiceAtual

        if (evento.key === "ArrowRight") {
            proximoIndice = (indiceAtual + 1) % abas.length
        }
        if (evento.key === "ArrowLeft") {
            proximoIndice = (indiceAtual - 1 + abas.length) % abas.length
        }
        if (evento.key === "Home") {
            proximoIndice = 0
        }
        if (evento.key === "End") {
            proximoIndice = abas.length - 1
        }
        if (proximoIndice !== indiceAtual) {
            evento.preventDefault()

            abrirAba(proximoIndice, true)
        }
    })
}
iniciarAbasProdutos()