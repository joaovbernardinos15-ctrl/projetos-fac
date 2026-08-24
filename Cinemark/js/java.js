/* =========================================================
   1. DADOS DOS FILMES
   Pra adicionar um filme novo, só copiar um objeto abaixo,
   colar antes do "];" e trocar os valores.
   classificacao pode ser: "L", "6", "10", "12", "14", "16", "18"
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
  }
];

/* =========================================================
   2. REFERÊNCIAS AOS ELEMENTOS DA PÁGINA
   ========================================================= */
const track = document.getElementById('cartazTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Quantos cards "completos" o carrossel deve pular por clique.
// Precisa bater com o número usado no CSS (calc(...) / 4.15)
const CARDS_POR_PAGINA = 4;

/* =========================================================
   3. FUNÇÕES
   ========================================================= */

// Transforma o array "filmes" em HTML e injeta dentro da track
function renderFilmes() {
  track.innerHTML = filmes.map(filme => `
    <div class="movie-poster-card">
      <span class="watch-badge">ASSISTA AGORA</span>
      <img src="${filme.poster}" alt="${filme.titulo}" />
      <div class="movie-poster-info">
        <h5>${filme.titulo.toUpperCase()}</h5>
        <div class="movie-meta">
          <span>${filme.genero} · ${filme.duracao}</span>
          <span class="rating-badge rating-${filme.classificacao === 'L' ? 'livre' : filme.classificacao}">${filme.classificacao}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Calcula quanto o carrossel deve andar a cada clique.
// Agora anda uma "página" inteira (4 cards + os gaps entre eles),
// em vez de andar 1 card por vez.
function getScrollStep() {
  const card = track.querySelector('.movie-poster-card');
  if (!card) return 0;
  const cardWidth = card.getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  return (cardWidth + gap) * CARDS_POR_PAGINA;
}

// Desabilita a seta esquerda no início e a direita no fim do carrossel
function updateArrows() {
  const maxScroll = track.scrollWidth - track.clientWidth - 1;
  prevBtn.disabled = track.scrollLeft <= 0;
  nextBtn.disabled = track.scrollLeft >= maxScroll;
}

/* =========================================================
   4. EVENTOS
   ========================================================= */
nextBtn.addEventListener('click', () => {
  track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
});

prevBtn.addEventListener('click', () => {
  track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
});

track.addEventListener('scroll', updateArrows);
window.addEventListener('resize', updateArrows);

/* =========================================================
   5. EXECUÇÃO
   Ordem importa: primeiro renderiza os cards, só depois
   calcula o scroll deles.
   ========================================================= */
renderFilmes();
updateArrows();


/* =========================================================
   HERO BANNER (marketing / promoções)
   Mesma lógica do carrossel de filmes, mas aqui só existe
   1 slide visível por vez, com bolinhas indicadoras (dots)
   e o carrossel "roda" (do último slide volta pro primeiro).
   ========================================================= */

// 1. DADOS DOS BANNERS
// Pra adicionar um banner novo, só copiar um objeto abaixo,
// colar antes do "];" e trocar a imagem/alt/link.
const banners = [
  {
    imagem: "./img/banner-club-black.png",
    alt: "Cinemark Club Black: 2 ingressos todo mês e até 25% off no snack bar",
    link: "#"
  }
  // Exemplo de como adicionar outro banner:
  // {
  //   imagem: "./img/banner-promocao-terca.png",
  //   alt: "Terça é dia de ingresso com desconto",
  //   link: "#"
  // },
];

// 2. REFERÊNCIAS AOS ELEMENTOS DA PÁGINA
const heroTrack = document.getElementById('heroTrack');
const heroPrevBtn = document.getElementById('heroPrevBtn');
const heroNextBtn = document.getElementById('heroNextBtn');
const heroDotsContainer = document.getElementById('heroDots');

let heroIndex = 0; // qual slide está sendo mostrado agora

// 3. FUNÇÕES

// Transforma o array "banners" em HTML e injeta dentro da track
function renderBanners() {
  heroTrack.innerHTML = banners.map(banner => `
    <a class="hero-slide" href="${banner.link}">
      <img src="${banner.imagem}" alt="${banner.alt}" />
    </a>
  `).join('');
}

// Cria uma bolinha (dot) pra cada banner
function renderDots() {
  heroDotsContainer.innerHTML = banners.map((_, i) => `
    <button class="hero-dot" data-index="${i}" aria-label="Ir para o slide ${i + 1}"></button>
  `).join('');

  // Clicar numa bolinha leva direto pro slide correspondente
  heroDotsContainer.querySelectorAll('.hero-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(Number(dot.dataset.index));
    });
  });
}

// Marca visualmente qual bolinha está ativa
function updateDots() {
  heroDotsContainer.querySelectorAll('.hero-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === heroIndex);
  });
}

// Rola o carrossel até o slide de índice "index"
function goToSlide(index) {
  heroIndex = index;
  const slideWidth = heroTrack.clientWidth;
  heroTrack.scrollTo({ left: slideWidth * heroIndex, behavior: 'smooth' });
  updateDots();
}

// Avança 1 slide; se estiver no último, volta pro primeiro
function nextSlide() {
  const proximo = (heroIndex + 1) % banners.length;
  goToSlide(proximo);
}

// Volta 1 slide; se estiver no primeiro, vai pro último
function prevSlide() {
  const anterior = (heroIndex - 1 + banners.length) % banners.length;
  goToSlide(anterior);
}

// 4. EVENTOS
heroNextBtn.addEventListener('click', nextSlide);
heroPrevBtn.addEventListener('click', prevSlide);

// Se o usuário arrastar o carrossel manualmente (touch/scroll),
// atualiza qual bolinha deve ficar ativa
heroTrack.addEventListener('scroll', () => {
  const slideWidth = heroTrack.clientWidth;
  heroIndex = Math.round(heroTrack.scrollLeft / slideWidth);
  updateDots();
});

// 5. EXECUÇÃO
renderBanners();
renderDots();
updateDots();

// Autoplay: troca de slide sozinho a cada 6 segundos.
// Se não quiser autoplay, é só apagar este bloco.
setInterval(() => {
  nextSlide();
}, 6000);