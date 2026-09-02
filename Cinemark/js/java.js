/* =========================================================
   CINEMARK — FILMES INDEX
   Carrosséis controlados pelo JavaScript + Bootstrap.
   A estrutura original do projeto foi preservada.
   ========================================================= */

const FILMES_POR_PAGINA = 4;

const posters = [
    "./img/MoviePoster-11e62ed3-b0b0-42ae-97b8-54b881bc2bee.png",
    "./img/MoviePoster-1d439958-eb6d-4749-bd17-16e3caff4ce4.png",
    "./img/MoviePoster-36bc59f8-4d4f-41c9-aee9-dc6cee2a9784.png",
    "./img/MoviePoster-39a47201-3b75-4d07-b96a-02610d9885a9.png",
    "./img/MoviePoster-4a554ccc-f36c-4236-9d02-90c364e40816.png",
    "./img/MoviePoster-4b578907-005f-4257-9448-684e6f52b1c4.png",
    "./img/MoviePoster-532e35b5-8c6a-4b0b-9f57-e40d06d35940.png",
    "./img/MoviePoster-6ae2213a-1124-4e3b-94c0-9b0480aa6b82.png",
    "./img/MoviePoster-6bba3710-5068-4f38-8597-2271a4271b2a.png",
    "./img/MoviePoster-75453a35-a69e-43bc-b312-b1d6a30cbfe7.png",
    "./img/MoviePoster-7b391aed-202c-47c4-81f8-426cca8ff7d4.png",
    "./img/MoviePoster-8270e450-9ede-4618-a15d-5f67292667cb.png",
    "./img/MoviePoster-8ad878d5-f2a3-46d4-9f34-b07cf40b1541.png",
    "./img/MoviePoster-908f3c4f-27e4-4e30-a057-ad6fb93992d5.png",
    "./img/MoviePoster-94f73a7f-62a1-44cb-a01a-2e32eaa87efc.png",
    "./img/MoviePoster-9acd854c-c1cd-43ab-a1ca-db1cebbcae2c.png",
    "./img/MoviePoster-a200868f-990a-4c7f-a725-c30d0a388997.png"
];

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
 * Os posters novos são carregados automaticamente da pasta img.
 * Enquanto o cadastro completo dos filmes não estiver definido,
 * usamos os arquivos como origem dos cards sem alterar o HTML.
 */
const filmes = posters.map((poster, index) => ({
  titulo: `Filme ${String(index + 1).padStart(2, "0")}`,
  genero: "Em cartaz",
  duracao: "—",
  classificacao: "L",
  poster
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
   Só é executado quando pagefilmes.html está aberto.
   ========================================================= */

const paginaFilmes = document.getElementById("pageFilmesApp");

if (paginaFilmes) {
  const filmesCatalogo = [
    {
      titulo: "A Odisseia",
      genero: "Ação",
      ano: "2026",
      classificacao: "14",
      poster: "./img/MoviePoster-8ad878d5-f2a3-46d4-9f34-b07cf40b1541.png"
    },
    {
      titulo: "Cansei de Ser Nerd",
      genero: "Comédia",
      ano: "2026",
      classificacao: "12",
      poster: "./img/MoviePoster-7b391aed-202c-47c4-81f8-426cca8ff7d4.png"
    },
    {
      titulo: "Colegas e o Herdeiro",
      genero: "Comédia",
      ano: "2026",
      classificacao: "12",
      poster: "./img/MoviePoster-4b578907-005f-4257-9448-684e6f52b1c4.png"
    },
    {
      titulo: "Coyote vs. Acme",
      genero: "Comédia",
      ano: "2026",
      classificacao: "L",
      poster: "./img/MoviePoster-908f3c4f-27e4-4e30-a057-ad6fb93992d5.png"
    },
    {
      titulo: "Homem-Aranha: Um Novo Dia",
      genero: "Ação",
      ano: "2026",
      classificacao: "12",
      poster: "./img/MoviePoster-11e62ed3-b0b0-42ae-97b8-54b881bc2bee.png"
    },
    {
      titulo: "Michael",
      genero: "Drama",
      ano: "2026",
      classificacao: "12",
      poster: "./img/MoviePoster-39a47201-3b75-4d07-b96a-02610d9885a9.png"
    },
    {
      titulo: "Muito Prazer",
      genero: "Comédia",
      ano: "2026",
      classificacao: "12",
      poster: "./img/MoviePoster-532e35b5-8c6a-4b0b-9f57-e40d06d35940.png"
    },
    {
      titulo: "O Advogado do Diabo",
      genero: "Drama",
      ano: "2026",
      classificacao: "16",
      poster: "./img/MoviePoster-4a554ccc-f36c-4236-9d02-90c364e40816.png"
    },
    {
      titulo: "O Fim da Rua",
      genero: "Drama",
      ano: "2026",
      classificacao: "12",
      poster: "./img/MoviePoster-6ae2213a-1124-4e3b-94c0-9b0480aa6b82.png"
    },
    {
      titulo: "O Gênio do Crime",
      genero: "Comédia",
      ano: "2026",
      classificacao: "12",
      poster: "./img/MoviePoster-1d439958-eb6d-4749-bd17-16e3caff4ce4.png"
    },
    {
      titulo: "Ponto Sem Retorno",
      genero: "Ação",
      ano: "2026",
      classificacao: "12",
      poster: "./img/MoviePoster-6bba3710-5068-4f38-8597-2271a4271b2a.png"
    },
    {
      titulo: "Patrulha Canina: Uma Aventura Dino",
      genero: "Ficção",
      ano: "2026",
      classificacao: "L",
      poster: "./img/MoviePoster-94f73a7f-62a1-44cb-a01a-2e32eaa87efc.png"
    },
    {
      titulo: "Só Por Uma Noite",
      genero: "Drama",
      ano: "2026",
      classificacao: "12",
      poster: "./img/MoviePoster-75453a35-a69e-43bc-b312-b1d6a30cbfe7.png"
    },
    {
      titulo: "Sobrenatural: Agora Entre Nós",
      genero: "Terror",
      ano: "2026",
      classificacao: "14",
      poster: "./img/MoviePoster-36bc59f8-4d4f-41c9-aee9-dc6cee2a9784.png"
    },
    {
      titulo: "Túmulo dos Vagalumes",
      genero: "Animação",
      ano: "2026",
      classificacao: "12",
      poster: "./img/MoviePoster-8270e450-9ede-4618-a15d-5f67292667cb.png"
    },
    {
      titulo: "Vingadores",
      genero: "Ação",
      ano: "2026",
      classificacao: "12",
      poster: "./img/MoviePoster-9acd854c-c1cd-43ab-a1ca-db1cebbcae2c.png"
    },
    {
      titulo: "(Des)Controle",
      genero: "Drama",
      ano: "2026",
      classificacao: "14",
      poster: "./img/MoviePoster-a200868f-990a-4c7f-a725-c30d0a388997.png"
    }
  ];

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
