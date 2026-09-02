/* =========================================================
   CINEMARK - CARROSSÉIS
   Os dados ficam aqui e o HTML continua responsável apenas
   pela estrutura das seções. O Bootstrap controla a animação.
   ========================================================= */

/* =========================================================
   1. FILMES EM CARTAZ
   ========================================================= */
const filmes = [
  {
    titulo: "Homem-Aranha: Um Novo Dia",
    genero: "Ação",
    duracao: "145m",
    classificacao: "12",
    poster: "./img/MoviePoster-11e62ed3-b0b0-42ae-97b8-54b881bc2bee.png"
  },
  {
    titulo: "A Odisseia",
    genero: "Aventura",
    duracao: "170m",
    classificacao: "14",
    poster: "./img/MoviePoster-8ad878d5-f2a3-46d4-9f34-b07cf40b1541.png"
  },
  {
    titulo: "Sobrenatural: Agora Entre Nós",
    genero: "Terror",
    duracao: "105m",
    classificacao: "14",
    poster: "./img/MoviePoster-36bc59f8-4d4f-41c9-aee9-dc6cee2a9784.png"
  },
  {
    titulo: "Patrulha Canina: Uma Aventura Dino",
    genero: "Animação",
    duracao: "90m",
    classificacao: "6",
    poster: "./img/MoviePoster-94f73a7f-62a1-44cb-a01a-2e32eaa87efc.png"
  },
  {
    titulo: "Só Por Uma Noite",
    genero: "Comédia",
    duracao: "105m",
    classificacao: "16",
    poster: "./img/MoviePoster-75453a35-a69e-43bc-b312-b1d6a30cbfe7.png"
  },
  {
    titulo: "O Fim da Rua",
    genero: "Terror",
    duracao: "99m",
    classificacao: "14",
    poster: "./img/MoviePoster-6ae2213a-1124-4e3b-94c0-9b0480aa6b82.png"
  },
  {
    titulo: "Colegas e o Herdeiro",
    genero: "Comédia",
    duracao: "85m",
    classificacao: "12",
    poster: "./img/MoviePoster-4b578907-005f-4257-9448-684e6f52b1c4.png"
  },
  {
    titulo: "Túmulo dos Vagalumes",
    genero: "Drama",
    duracao: "88m",
    classificacao: "12",
    poster: "./img/MoviePoster-8270e450-9ede-4618-a15d-5f67292667cb.png"
  },
  {
    titulo: "Nome do Filme",
    genero: "Gênero",
    duracao: "000m",
    classificacao: "L",
    poster: "./img/MoviePoster-1d439958-eb6d-4749-bd17-16e3caff4ce4.png"
  }
];

const FILMES_POR_PAGINA = 4;

const filmesCarouselInner = document.getElementById("filmesCarouselInner");
const filmesPrevBtn = document.getElementById("filmesPrevBtn");
const filmesNextBtn = document.getElementById("filmesNextBtn");

function criarCardFilme(filme) {
  const ratingClass = filme.classificacao === "L"
    ? "livre"
    : filme.classificacao;

  return `
    <article class="movie-poster-card">
      <span class="watch-badge">ASSISTA AGORA</span>

      <img
        src="${filme.poster}"
        alt="${filme.titulo}"
        loading="lazy"
      />

      <div class="movie-poster-info">
        <h5>${filme.titulo.toUpperCase()}</h5>

        <div class="movie-meta">
          <span>${filme.genero} · ${filme.duracao}</span>
          <span class="rating-badge rating-${ratingClass}">
            ${filme.classificacao}
          </span>
        </div>
      </div>
    </article>
  `;
}

function criarPaginasFilmes() {
  const paginas = [];

  for (let i = 0; i < filmes.length; i += FILMES_POR_PAGINA) {
    paginas.push(filmes.slice(i, i + FILMES_POR_PAGINA));
  }

  filmesCarouselInner.innerHTML = paginas
    .map((pagina, index) => `
      <div class="carousel-item ${index === 0 ? "active" : ""}">
        <div class="movie-poster-row">
          ${pagina.map(criarCardFilme).join("")}
        </div>
      </div>
    `)
    .join("");
}

function atualizarSetasFilmes() {
  const itens = filmesCarouselInner.querySelectorAll(".carousel-item");
  const indiceAtual = [...itens].findIndex(item =>
    item.classList.contains("active")
  );

  const ultimoIndice = itens.length - 1;

  filmesPrevBtn.disabled = indiceAtual <= 0;
  filmesNextBtn.disabled = indiceAtual >= ultimoIndice;

  filmesPrevBtn.classList.toggle("disabled", indiceAtual <= 0);
  filmesNextBtn.classList.toggle("disabled", indiceAtual >= ultimoIndice);
}

function iniciarCarouselFilmes() {
  criarPaginasFilmes();

  const carouselElement = document.getElementById("filmesCarousel");

  if (!carouselElement || !filmesCarouselInner) return;

  const carousel = new bootstrap.Carousel(carouselElement, {
    interval: false,
    wrap: false,
    touch: true
  });

  filmesPrevBtn.addEventListener("click", () => {
    carousel.prev();
  });

  filmesNextBtn.addEventListener("click", () => {
    carousel.next();
  });

  carouselElement.addEventListener("slid.bs.carousel", atualizarSetasFilmes);

  atualizarSetasFilmes();
}

/* =========================================================
   2. BANNERS / HERO
   ========================================================= */
const banners = [
  {
    imagem: "./img/banner-cinemark-club-black_1255x495.png",
    alt: "Cinemark Club Black: 2 ingressos todo mês e até 25% off no snack bar"
  },
  {
    imagem: "./img/banner-viva-historias-incriveis_1255x495.png",
    alt: "Viva histórias incríveis nas telas"
  },
  {
    imagem: "./img/banner-diversao-para-todos_1255x495.png",
    alt: "Diversão para todos os momentos"
  },
  {
    imagem: "./img/banner-tudo-na-palma-da-mao_1255x495.png",
    alt: "Tudo na palma da sua mão: baixe o app da Cinemark"
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
    alt: "Filmes que você precisa assistir"
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

const heroCarousel = document.getElementById("heroCarousel");
const heroIndicators = document.getElementById("heroIndicators");
const heroCarouselInner = document.getElementById("heroCarouselInner");

function criarBanners() {
  heroIndicators.innerHTML = banners
    .map((_, index) => `
      <button
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide-to="${index}"
        class="${index === 0 ? "active" : ""}"
        ${index === 0 ? 'aria-current="true"' : ""}
        aria-label="Slide ${index + 1}"
      ></button>
    `)
    .join("");

  heroCarouselInner.innerHTML = banners
    .map((banner, index) => `
      <div class="carousel-item ${index === 0 ? "active" : ""}">
        <a href="#">
          <img
            src="${banner.imagem}"
            alt="${banner.alt}"
            loading="${index === 0 ? "eager" : "lazy"}"
          />
        </a>
      </div>
    `)
    .join("");
}

function iniciarCarouselHero() {
  criarBanners();

  if (!heroCarousel) return;

  new bootstrap.Carousel(heroCarousel, {
    interval: 6000,
    ride: "carousel",
    pause: "hover",
    touch: true,
    wrap: true
  });
}

/* =========================================================
   3. INICIALIZAÇÃO
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  iniciarCarouselHero();
  iniciarCarouselFilmes();
});
