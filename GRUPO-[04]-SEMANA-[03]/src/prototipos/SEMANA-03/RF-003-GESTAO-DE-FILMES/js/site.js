/* =========================================================
   CINEMARK — SITE PÚBLICO (site.js)
   Antigo java.js. Depende de js/store.js.
   Carrosséis controlados pelo JavaScript + Bootstrap.
   A estrutura original do projeto foi preservada.
   ========================================================= */

const FILMES_POR_PAGINA = 4;

/* =========================================================
   BANNERS
   ========================================================= */

const banners = [
  {
    imagem: "./img/banner-cinemark-club-black_1255x495.png",
    alt: "Cinemark Club Black"
  },
  {
    imagem: "./img/banner-viva-historias-incriveis_1255x495.png",
    alt: "Viva histórias incríveis"
  },
  {
    imagem: "./img/banner-diversao-para-todos_1255x495.png",
    alt: "Diversão para todos"
  },
  {
    imagem: "./img/banner-tudo-na-palma-da-mao_1255x495.png",
    alt: "Tudo na palma da sua mão"
  },
  {
    imagem: "./img/banner-segunda-e-dia-de-cinemark_1255x495.png",
    alt: "Segunda é dia de Cinemark"
  },
  {
    imagem: "./img/banner-combos-para-todos-os-gostos_1255x495.png",
    alt: "Combos para todos os gostos"
  },
  {
    imagem: "./img/banner-filmes-assistir_1255x495.png",
    alt: "Filmes para assistir"
  },
  {
    imagem: "./img/banner-presenteie-com-experiencias-incriveis_1255x495.png",
    alt: "Presenteie com experiências incríveis"
  },
  {
    imagem: "./img/banner-mais-conforto-mais-diversao_1255x495.png",
    alt: "Mais conforto, mais diversão"
  }
];

/* =========================================================
   ELEMENTOS
   ========================================================= */

const heroCarousel = document.getElementById("heroCarousel");
const heroIndicators = document.getElementById("heroIndicators");
const heroCarouselInner = document.getElementById("heroCarouselInner");

const filmesCarousel = document.getElementById("filmesCarousel");
const filmesCarouselInner = document.getElementById("filmesCarouselInner");
const filmesPrevBtn = document.getElementById("filmesPrevBtn");
const filmesNextBtn = document.getElementById("filmesNextBtn");

/* =========================================================
   HERO
   ========================================================= */

function renderizarBanners() {
  if (!heroIndicators || !heroCarouselInner) return;

  heroIndicators.innerHTML = banners.map((_, index) => `
    <button
      type="button"
      data-bs-target="#heroCarousel"
      data-bs-slide-to="${index}"
      class="${index === 0 ? "active" : ""}"
      ${index === 0 ? 'aria-current="true"' : ""}
      aria-label="Ir para o banner ${index + 1}">
    </button>
  `).join("");

  heroCarouselInner.innerHTML = banners.map((banner, index) => `
    <div class="carousel-item ${index === 0 ? "active" : ""}">
      <a href="#" aria-label="${banner.alt}">
        <img
          src="${banner.imagem}"
          alt="${banner.alt}"
          loading="${index === 0 ? "eager" : "lazy"}">
      </a>
    </div>
  `).join("");
}

function iniciarHeroCarousel() {
  if (!heroCarousel || typeof bootstrap === "undefined") return;

  new bootstrap.Carousel(heroCarousel, {
    interval: 6000,
    pause: "hover",
    touch: true,
    wrap: true
  });
}

/* =========================================================
   FILMES
   ========================================================= */

/*
 * READ (RF03): os cards do carrossel vêm da camada de dados
 * (js/store.js), e não mais de uma lista fixa aqui dentro.
 * É por isso que um filme cadastrado no painel do admin
 * aparece na home sem precisar mexer no código.
 */
const filmes = Store.filmes
  .listar()
  .filter((filme) => filme.emCartaz)
  .sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"))
  .map((filme) => ({
    titulo: filme.titulo,
    genero: filme.genero,
    duracao: filme.ano,
    classificacao: filme.classificacao,
    poster: filme.poster
  }));

function criarCardFilme(filme) {
  return `
    <article class="movie-poster-card">
      <span class="watch-badge">ASSISTA AGORA</span>

      <img
        src="${filme.poster}"
        alt="${filme.titulo}"
        loading="lazy">

      <div class="movie-poster-info">
        <h5>${filme.titulo.toUpperCase()}</h5>

        <div class="movie-meta">
          <span>${filme.genero} · ${filme.duracao}</span>
          <span class="rating-badge rating-${filme.classificacao}">
            ${filme.classificacao}
          </span>
        </div>
      </div>
    </article>
  `;
}

function dividirEmPaginas(lista, tamanho) {
  const paginas = [];

  for (let i = 0; i < lista.length; i += tamanho) {
    paginas.push(lista.slice(i, i + tamanho));
  }

  return paginas;
}

function renderizarFilmes() {
  if (!filmesCarouselInner) return;

  const paginas = dividirEmPaginas(filmes, FILMES_POR_PAGINA);

  filmesCarouselInner.innerHTML = paginas.map((pagina, index) => `
    <div class="carousel-item ${index === 0 ? "active" : ""}">
      <div class="movie-poster-row">
        ${pagina.map(criarCardFilme).join("")}
      </div>
    </div>
  `).join("");
}

function atualizarSetasFilmes() {
  if (!filmesCarouselInner || !filmesPrevBtn || !filmesNextBtn) return;

  const itens = [...filmesCarouselInner.querySelectorAll(".carousel-item")];
  const indiceAtual = itens.findIndex(item => item.classList.contains("active"));
  const ultimoIndice = itens.length - 1;

  const noInicio = indiceAtual <= 0;
  const noFim = indiceAtual >= ultimoIndice;

  filmesPrevBtn.disabled = noInicio;
  filmesNextBtn.disabled = noFim;

  filmesPrevBtn.classList.toggle("disabled", noInicio);
  filmesNextBtn.classList.toggle("disabled", noFim);
}

function iniciarFilmesCarousel() {
  if (!filmesCarousel || typeof bootstrap === "undefined") return;

  renderizarFilmes();

  const carousel = new bootstrap.Carousel(filmesCarousel, {
    interval: false,
    wrap: false,
    touch: true
  });

  filmesPrevBtn?.addEventListener("click", () => {
    carousel.prev();
  });

  filmesNextBtn?.addEventListener("click", () => {
    carousel.next();
  });

  filmesCarousel.addEventListener("slid.bs.carousel", atualizarSetasFilmes);

  atualizarSetasFilmes();
}

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderizarBanners();
  iniciarHeroCarousel();
  iniciarFilmesCarousel();
});


/* =========================================================
   PÁGINA DE FILMES — BUSCA + GÊNERO + ALFABETO
   Só é executado quando filmes.html está aberto.
   ========================================================= */

const paginaFilmes = document.getElementById("pageFilmesApp");

if (paginaFilmes) {
  // READ (RF03): catálogo completo vindo do Store
  const filmesCatalogo = Store.filmes.listar();

  const grid = document.getElementById("filmesGrid");
  const buscaInput = document.getElementById("buscaFilme");
  const limparBusca = document.getElementById("limparBusca");
  const generoFiltros = document.getElementById("generoFiltros");
  const letraFiltros = document.getElementById("letraFiltros");
  const limparFiltros = document.getElementById("limparFiltros");
  const limparFiltrosVazio = document.getElementById("limparFiltrosVazio");
  const contador = document.getElementById("filmesResultadoCount");
  const semResultado = document.getElementById("filmesSemResultado");

  let generoSelecionado = "Todos";
  let letraSelecionada = "Todos";

  const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const generos = ["Todos", ...new Set(filmesCatalogo.map((filme) => filme.genero))];

  function normalizar(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function primeiraLetra(titulo) {
    const normalizado = normalizar(titulo);
    return normalizado.charAt(0).toUpperCase();
  }

  function criarBotoesGenero() {
    generoFiltros.innerHTML = generos.map((genero) => `
      <button
        type="button"
        class="genero-btn ${genero === "Todos" ? "ativo" : ""}"
        data-genero="${genero}">
        ${genero}
      </button>
    `).join("");
  }

  function criarBotoesAlfabeto() {
    letraFiltros.innerHTML = `
      <button
        type="button"
        class="letra-btn ativo"
        data-letra="Todos">
        Todos
      </button>

      ${alfabeto.map((letra) => {
        const existe = filmesCatalogo.some(
          (filme) => primeiraLetra(filme.titulo) === letra
        );

        return `
          <button
            type="button"
            class="letra-btn ${existe ? "" : "indisponivel"}"
            data-letra="${letra}"
            ${existe ? "" : "disabled"}
            aria-label="Filmes com a letra ${letra}">
            ${letra}
          </button>
        `;
      }).join("")}
    `;
  }

  function criarCard(filme) {
    const classeRating = filme.classificacao === "L"
      ? "livre"
      : filme.classificacao;

    return `
      <article class="movie-poster-card">
        <img
          src="${filme.poster}"
          alt="${filme.titulo}"
          loading="lazy">

        <div class="watch-badge">ASSISTA AGORA</div>

        <div class="movie-poster-info">
          <h5>${filme.titulo}</h5>

          <div class="movie-meta">
            <span>${filme.genero}</span>
            <span class="rating-badge rating-${classeRating}">
              ${filme.classificacao}
            </span>
          </div>
        </div>
      </article>
    `;
  }

  function obterFilmesFiltrados() {
    const busca = normalizar(buscaInput.value);

    return filmesCatalogo
      .filter((filme) => {
        const correspondeBusca =
          !busca ||
          normalizar(filme.titulo).includes(busca) ||
          normalizar(filme.genero).includes(busca);

        const correspondeGenero =
          generoSelecionado === "Todos" ||
          filme.genero === generoSelecionado;

        const correspondeLetra =
          letraSelecionada === "Todos" ||
          primeiraLetra(filme.titulo) === letraSelecionada;

        return correspondeBusca && correspondeGenero && correspondeLetra;
      })
      .sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
  }

  function renderizarFilmes() {
    const resultado = obterFilmesFiltrados();

    grid.innerHTML = resultado.map(criarCard).join("");

    contador.textContent = resultado.length;

    grid.hidden = resultado.length === 0;
    semResultado.hidden = resultado.length > 0;

    limparBusca.hidden = buscaInput.value.length === 0;
  }

  function atualizarBotoes() {
    generoFiltros.querySelectorAll("[data-genero]").forEach((botao) => {
      botao.classList.toggle(
        "ativo",
        botao.dataset.genero === generoSelecionado
      );
    });

    letraFiltros.querySelectorAll("[data-letra]").forEach((botao) => {
      botao.classList.toggle(
        "ativo",
        botao.dataset.letra === letraSelecionada
      );
    });
  }

  function aplicarFiltros() {
    atualizarBotoes();
    renderizarFilmes();
  }

  generoFiltros.addEventListener("click", (event) => {
    const botao = event.target.closest("[data-genero]");
    if (!botao) return;

    generoSelecionado = botao.dataset.genero;
    aplicarFiltros();
  });

  letraFiltros.addEventListener("click", (event) => {
    const botao = event.target.closest("[data-letra]");
    if (!botao || botao.disabled) return;

    letraSelecionada = botao.dataset.letra;
    aplicarFiltros();
  });

  buscaInput.addEventListener("input", renderizarFilmes);

  limparBusca.addEventListener("click", () => {
    buscaInput.value = "";
    buscaInput.focus();
    renderizarFilmes();
  });

  function limparTodosFiltros() {
    buscaInput.value = "";
    generoSelecionado = "Todos";
    letraSelecionada = "Todos";
    aplicarFiltros();
    buscaInput.focus();
  }

  limparFiltros.addEventListener("click", limparTodosFiltros);
  limparFiltrosVazio.addEventListener("click", limparTodosFiltros);

  criarBotoesGenero();
  criarBotoesAlfabeto();
  renderizarFilmes();
}
