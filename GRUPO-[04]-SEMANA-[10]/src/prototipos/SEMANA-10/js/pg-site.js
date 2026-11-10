/* =========================================================
   CINEMARK — PÁGINAS DO SITE (pg-site.js)
   Início (destaque + carrossel), catálogo com filtros e
   detalhe do filme com player, sessões e reserva de
   assentos. Adaptado do protótipo (site.js + filme.js).
   ========================================================= */

(() => {
  const FILMES_POR_PAGINA = 4;

  /* ---------- util ---------- */

  function badgeVideo(filme) {
    const valida = Boolean(filme.fonteVideo) &&
      Store.filmes.validarFonteVideo(filme.fonteVideo).ok;
    const ehYouTube = Boolean(Store.filmes.obterIdYouTube(filme.fonteVideo));
    return { valida, rotulo: ehYouTube ? "TRAILER DISPONÍVEL" : "VÍDEO CADASTRADO" };
  }

  function cardFilme(filme, maiusculo) {
    const video = badgeVideo(filme);
    const titulo = maiusculo ? String(filme.titulo).toUpperCase() : filme.titulo;
    const classeRating = filme.classificacao === "L" ? "livre" : filme.classificacao;
    return (
      '<article class="movie-poster-card">' +
      '<a class="movie-card-link" href="#/filme?id=' + encodeURIComponent(filme.id) + '&sessoes=1" ' +
      'aria-label="Consultar sessões e comprar ingresso para ' + App.esc(filme.titulo) + '">' +
      '<span class="watch-badge">' + (video.valida ? video.rotulo : "SEM VÍDEO") + "</span>" +
      '<img src="' + App.esc(App.assetUrl(filme.poster || "img/Logo.jpeg")) + '" ' +
      'alt="Pôster de ' + App.esc(filme.titulo) + '" loading="lazy">' +
      '<div class="movie-poster-info">' +
      "<h5>" + App.esc(titulo) + "</h5>" +
      '<div class="movie-meta">' +
      "<span>" + App.esc(filme.genero) + " · " + App.esc(filme.ano) + "</span>" +
      '<span class="rating-badge rating-' + App.esc(classeRating) + '">' + App.esc(filme.classificacao) + "</span>" +
      "</div>" +
      '<span class="filme-detalhes-link">Ver sessões e comprar ingresso</span>' +
      "</div></a></article>"
    );
  }

  /* =========================================================
     INÍCIO
     ========================================================= */

  function renderHome() {
    App.$("app").innerHTML =
      '<main class="streaming-home">' +
      '<section class="streaming-hero" aria-labelledby="destaqueTitulo">' +
      '<a class="streaming-hero-poster-link" id="destaquePosterLink" href="#/filmes" aria-label="Abrir tela de reprodução do destaque">' +
      '<img class="streaming-hero-poster" id="destaquePoster" src="img/Logo.jpeg" alt="" fetchpriority="high">' +
      "</a>" +
      '<div class="streaming-hero-content">' +
      '<p class="streaming-kicker"><span></span> CINEMARK · EM DESTAQUE</p>' +
      "<h1 id=\"destaqueTitulo\">Descubra seu próximo filme</h1>" +
      '<p class="streaming-description" id="destaqueDescricao">Histórias para aproveitar no seu ritmo.</p>' +
      '<div class="streaming-meta" id="destaqueMeta" aria-label="Informações do filme"></div>' +
      '<div class="streaming-actions">' +
      '<a class="streaming-primary" id="destaqueAssistir" href="#/filmes" hidden>' +
      '<i class="fa-solid fa-play" aria-hidden="true"></i> Assistir destaque</a>' +
      '<a class="streaming-primary" href="#/filmes"><i class="fa-solid fa-film" aria-hidden="true"></i> Explorar filmes</a>' +
      '<a class="streaming-secondary" href="#/loja"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> Ir para a loja</a>' +
      "</div></div></section>" +

      '<section class="em-cartaz" aria-labelledby="tituloCatalogoHome">' +
      '<div class="em-cartaz-header"><div>' +
      '<p class="shelf-kicker">SEU PRÓXIMO PLAY</p>' +
      "<h2 id=\"tituloCatalogoHome\">Filmes para descobrir</h2>" +
      "</div>" +
      '<div class="em-cartaz-arrows">' +
      '<button id="filmesPrevBtn" class="arrow-btn" type="button" aria-label="Filmes anteriores">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6" /></svg>' +
      "</button>" +
      '<button id="filmesNextBtn" class="arrow-btn" type="button" aria-label="Próximos filmes">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" /></svg>' +
      "</button></div></div>" +
      '<div id="filmesCarousel" class="carousel slide"><div id="filmesCarouselInner" class="carousel-inner"></div></div>' +
      '<p id="filmesHomeVazio" class="filmes-home-vazio" hidden>' +
      'Ainda não há filmes em destaque. <a href="#/filmes">Acesse o catálogo completo</a> ou ' +
      '<a href="#/loja">visite a loja</a>.</p>' +
      "</section>" +

      '<section class="loja-chamada" aria-labelledby="lojaChamadaTitulo">' +
      '<div class="loja-chamada-icone" aria-hidden="true"><i class="fa-solid fa-popcorn"></i></div>' +
      "<div>" +
      '<p class="shelf-kicker">UMA BOA SESSÃO TAMBÉM TEM SABOR</p>' +
      "<h2 id=\"lojaChamadaTitulo\">Prepare seus favoritos</h2>" +
      "<p>Pipocas, bebidas, doces e combos para acompanhar seu filme.</p>" +
      "</div>" +
      '<a href="#/loja">Explorar loja <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' +
      "</section></main>" +
      '<footer class="home-footer">' +
      '<a class="home-footer-brand" href="#/" aria-label="Cinemark - página inicial">CINEMARK</a>' +
      '<nav aria-label="Navegação do rodapé"><a href="#/filmes">Filmes</a><a href="#/loja">Loja</a><a href="#/ingressos">Meus ingressos</a><a href="#/ajuda">Ajuda</a><a href="#/contato">Contato</a></nav>' +
      "<p>© 2026 Cinemark. Todos os direitos reservados.</p></footer>";

    const filmes = Store.filmes.listar()
      .filter((f) => f.emCartaz)
      .sort((a, b) => String(a.titulo).localeCompare(String(b.titulo), "pt-BR"));

    // Destaque = primeiro do catálogo em cartaz
    const destaque = filmes[0];
    const poster = App.$("destaquePoster");
    if (destaque && poster) {
      const link = App.$("destaquePosterLink");
      link.href = "#/filme?id=" + encodeURIComponent(destaque.id);
      link.setAttribute("aria-label", "Abrir tela de reprodução de " + destaque.titulo);
      poster.src = App.assetUrl(destaque.poster || "img/Logo.jpeg");
      poster.alt = "Pôster de " + destaque.titulo;
      App.$("destaqueTitulo").textContent = destaque.titulo;
      App.$("destaqueDescricao").textContent =
        destaque.sinopse || (destaque.genero + " · uma história para descobrir no catálogo.");
      const meta = App.$("destaqueMeta");
      meta.replaceChildren();
      [destaque.genero, destaque.ano,
        "Classificação " + (destaque.classificacao === "L" ? "Livre" : destaque.classificacao + " anos")]
        .filter(Boolean)
        .forEach((info) => {
          const item = document.createElement("span");
          item.textContent = info;
          meta.append(item);
        });
      const assistir = App.$("destaqueAssistir");
      assistir.href = "#/filme?id=" + encodeURIComponent(destaque.id);
      assistir.hidden = false;
      document.querySelector(".streaming-hero")?.addEventListener("click", (event) => {
        if (!(event.target instanceof Element) || event.target.closest("a, button")) return;
        App.nav("#/filme?id=" + encodeURIComponent(destaque.id));
      });
    }

    // Carrossel
    const inner = App.$("filmesCarouselInner");
    const vazio = App.$("filmesHomeVazio");
    const carrossel = App.$("filmesCarousel");
    const semFilmes = filmes.length === 0;
    if (carrossel) carrossel.hidden = semFilmes;
    if (vazio) vazio.hidden = !semFilmes;
    if (!semFilmes && inner) {
      const paginas = [];
      for (let i = 0; i < filmes.length; i += FILMES_POR_PAGINA) {
        paginas.push(filmes.slice(i, i + FILMES_POR_PAGINA));
      }
      inner.innerHTML = paginas.map((pagina, index) =>
        '<div class="carousel-item' + (index === 0 ? " active" : "") + '">' +
        '<div class="movie-poster-row">' + pagina.map((f) => cardFilme(f, true)).join("") + "</div></div>"
      ).join("");

      const prev = App.$("filmesPrevBtn");
      const next = App.$("filmesNextBtn");
      if (typeof bootstrap !== "undefined" && carrossel) {
        const instancia = new bootstrap.Carousel(carrossel, { interval: false, wrap: false, touch: true });
        prev?.addEventListener("click", () => instancia.prev());
        next?.addEventListener("click", () => instancia.next());
        const atualizar = () => {
          const itens = [...inner.querySelectorAll(".carousel-item")];
          const atual = itens.findIndex((el) => el.classList.contains("active"));
          const noInicio = atual <= 0;
          const noFim = atual >= itens.length - 1;
          if (prev) { prev.disabled = noInicio; prev.classList.toggle("disabled", noInicio); }
          if (next) { next.disabled = noFim; next.classList.toggle("disabled", noFim); }
        };
        carrossel.addEventListener("slid.bs.carousel", atualizar);
        atualizar();
      } else {
        // Sem Bootstrap: mostra a primeira página com rolagem simples.
        if (prev) prev.hidden = true;
        if (next) next.hidden = true;
      }
    }
  }

  /* =========================================================
     FILMES (catálogo + filtros)
     ========================================================= */

  function renderFilmes() {
    App.$("app").innerHTML =
      '<main id="pageFilmesApp" class="filmes-section"><div class="filmes-container">' +
      '<header class="filmes-topo"><div>' +
      '<span class="filmes-kicker">CINEMARK</span><h1>Filmes</h1>' +
      "<p>Encontre seu próximo filme de forma rápida e fácil.</p></div>" +
      '<div class="filmes-contador"><strong id="filmesResultadoCount">0</strong><span>filmes encontrados</span></div>' +
      "</header>" +
      '<div class="busca-field"><span class="busca-icon" aria-hidden="true">⌕</span>' +
      '<input id="buscaFilme" type="search" placeholder="Buscar por nome do filme..." autocomplete="off" aria-label="Buscar por nome do filme">' +
      '<button id="limparBusca" type="button" class="limpar-busca" hidden aria-label="Limpar busca">×</button></div>' +
      '<section class="catalogo-panel">' +
      '<div class="filtro-grupo"><h2>Gênero</h2><div id="generoFiltros" class="genero-filtros"></div></div>' +
      '<div class="filtro-grupo filtro-alfabeto"><h2>Encontre pela letra</h2><div id="letraFiltros" class="letra-filtros"></div></div>' +
      '<div id="filmesGrid" class="filmes-grid" aria-live="polite"></div>' +
      '<div id="filmesSemResultado" class="filmes-sem-resultado" hidden>' +
      '<div class="sem-resultado-icon">⌕</div><h3>Nenhum filme encontrado</h3>' +
      "<p>Tente outro nome, gênero ou letra.</p>" +
      '<button id="limparFiltrosVazio" type="button">Limpar filtros</button></div>' +
      '<button id="limparFiltros" type="button" class="limpar-filtros">Limpar filtros</button>' +
      "</section></div></main>" +
      '<footer class="site-footer">© 2026 Cinemark — todos os direitos reservados.<nav class="rodape-links" aria-label="Links do rodapé"><a href="#/ajuda">Ajuda</a><a href="#/contato">Contato</a><a href="#/ingressos">Meus ingressos</a></nav></footer>';

    const filmesCatalogo = Store.filmes.listar().filter((f) => f.emCartaz);
    const grid = App.$("filmesGrid");
    const buscaInput = App.$("buscaFilme");
    const limparBusca = App.$("limparBusca");
    const generoFiltros = App.$("generoFiltros");
    const letraFiltros = App.$("letraFiltros");
    const limparFiltros = App.$("limparFiltros");
    const limparFiltrosVazio = App.$("limparFiltrosVazio");
    const contador = App.$("filmesResultadoCount");
    const semResultado = App.$("filmesSemResultado");

    let generoSelecionado = "Todos";
    let letraSelecionada = "Todos";
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const generos = ["Todos", ...new Set(filmesCatalogo.map((f) => f.genero))];

    const normalizar = (t) => String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const primeiraLetra = (titulo) => normalizar(titulo).charAt(0).toUpperCase();

    generoFiltros.innerHTML = generos.map((g) =>
      '<button type="button" class="genero-btn' + (g === "Todos" ? " ativo" : "") + '" data-genero="' + App.esc(g) + '">' + App.esc(g) + "</button>"
    ).join("");

    letraFiltros.innerHTML =
      '<button type="button" class="letra-btn ativo" data-letra="Todos">Todos</button>' +
      alfabeto.map((letra) => {
        const existe = filmesCatalogo.some((f) => primeiraLetra(f.titulo) === letra);
        return '<button type="button" class="letra-btn' + (existe ? "" : " indisponivel") + '" data-letra="' + letra + '"' +
          (existe ? "" : " disabled") + ' aria-label="Filmes com a letra ' + letra + '">' + letra + "</button>";
      }).join("");

    function obterFiltrados() {
      const busca = normalizar(buscaInput.value);
      return filmesCatalogo
        .filter((f) => {
          const okBusca = !busca ||
            normalizar(f.titulo).includes(busca) || normalizar(f.genero).includes(busca);
          const okGenero = generoSelecionado === "Todos" || f.genero === generoSelecionado;
          const okLetra = letraSelecionada === "Todos" || primeiraLetra(f.titulo) === letraSelecionada;
          return okBusca && okGenero && okLetra;
        })
        .sort((a, b) => String(a.titulo).localeCompare(String(b.titulo), "pt-BR"));
    }

    function renderizar() {
      const lista = obterFiltrados();
      grid.innerHTML = lista.map((f) => cardFilme(f, false)).join("");
      contador.textContent = lista.length;
      grid.hidden = lista.length === 0;
      semResultado.hidden = lista.length > 0;
      limparBusca.hidden = buscaInput.value.length === 0;
    }

    function atualizarBotoes() {
      generoFiltros.querySelectorAll("[data-genero]").forEach((b) =>
        b.classList.toggle("ativo", b.dataset.genero === generoSelecionado));
      letraFiltros.querySelectorAll("[data-letra]").forEach((b) =>
        b.classList.toggle("ativo", b.dataset.letra === letraSelecionada));
    }

    generoFiltros.addEventListener("click", (e) => {
      const b = e.target.closest("[data-genero]");
      if (!b) return;
      generoSelecionado = b.dataset.genero;
      atualizarBotoes();
      renderizar();
    });
    letraFiltros.addEventListener("click", (e) => {
      const b = e.target.closest("[data-letra]");
      if (!b || b.disabled) return;
      letraSelecionada = b.dataset.letra;
      atualizarBotoes();
      renderizar();
    });
    buscaInput.addEventListener("input", renderizar);
    limparBusca.addEventListener("click", () => { buscaInput.value = ""; buscaInput.focus(); renderizar(); });
    function limparTudo() {
      buscaInput.value = "";
      generoSelecionado = "Todos";
      letraSelecionada = "Todos";
      atualizarBotoes();
      renderizar();
      buscaInput.focus();
    }
    limparFiltros.addEventListener("click", limparTudo);
    limparFiltrosVazio.addEventListener("click", limparTudo);
    renderizar();
  }

  /* =========================================================
     FILME (detalhe + player + sessões + assentos)
     ========================================================= */

  function renderFilme(query) {
    const id = query.get("id");
    const filme = id ? Store.filmes.buscarPorId(id) : null;

    App.$("app").innerHTML =
      '<main class="filme-detalhe-main">' +
      '<a class="voltar-catalogo" href="#/filmes"><span aria-hidden="true">&larr;</span> Voltar ao catálogo</a>' +
      '<section class="filme-detalhe-conteudo" aria-labelledby="filmeTitulo">' +
      '<div id="filmePlayerRegiao" class="filme-player-regiao">' +
      '<img id="filmePlayerPoster" class="filme-player-poster" alt="" hidden>' +
      '<div id="filmeIndisponivel" class="filme-estado" role="status" hidden>' +
      '<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>' +
      '<h2 id="filmeEstadoTitulo">Conteúdo temporariamente indisponível</h2>' +
      '<p id="filmeEstadoMensagem">Este filme ainda não possui uma fonte de vídeo autorizada.</p>' +
      '<a class="filme-botao-secundario" href="#/filmes">Voltar ao catálogo</a></div>' +
      '<div id="filmeFalha" class="filme-estado filme-estado-erro" role="alert" hidden>' +
      '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>' +
      '<p id="filmeFalhaMensagem">Não foi possível carregar o vídeo.</p>' +
      '<button id="filmeTentarNovamente" class="filme-botao-secundario" type="button">Tentar novamente</button></div>' +
      '<video id="filmeVideo" controls playsinline preload="metadata" aria-label="Player do filme" hidden></video>' +
      '<iframe id="filmeYouTube" title="Trailer do filme no YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen hidden></iframe>' +
      '<a id="filmeYouTubeLink" class="filme-youtube-link" target="_blank" rel="noopener noreferrer" hidden>Abrir trailer no YouTube</a>' +
      '<p id="filmePlayerStatus" class="filme-player-status" aria-live="polite" hidden></p>' +
      '<button id="filmeCarregarVideo" class="filme-botao-principal" type="button" hidden>' +
      '<i class="fa-solid fa-play" aria-hidden="true"></i> <span id="filmeAcaoTexto">Assistir</span></button>' +
      "</div>" +
      '<div class="filme-detalhe-texto">' +
      '<p class="filme-detalhe-kicker">CINEMARK · FILMES</p>' +
      "<h1 id=\"filmeTitulo\">Carregando filme...</h1>" +
      '<p id="filmeMetadados" class="filme-metadados"></p>' +
      '<p id="filmeClassificacao" class="filme-classificacao"></p>' +
      '<div class="filme-sinopse"><h2>Sinopse</h2><p id="filmeSinopse">Detalhes do filme.</p></div>' +
      '<button id="filmeAssistirEmCasa" class="filme-botao-secundario filme-assistir-casa" type="button" hidden>' +
      '<i class="fa-solid fa-house" aria-hidden="true"></i> Assistir trailer em casa</button>' +
      '<button id="verSessoesFilme" class="filme-botao-principal" type="button" hidden>' +
      '<i class="fa-solid fa-ticket" aria-hidden="true"></i> Ver sessões e comprar ingresso</button>' +
      "</div></section>" +

      '<section id="horariosFilme" class="horarios-filme" aria-labelledby="horariosTitulo">' +
      '<div class="horarios-cabecalho"><div>' +
      '<p class="filme-detalhe-kicker">CINEMARK · SESSÕES</p>' +
      "<h2 id=\"horariosTitulo\">Horários</h2></div>" +
      '<span class="horarios-demonstrativos">Sessões e preços</span></div>' +
      '<div id="diasSessoes" class="dias-sessoes" role="tablist" aria-label="Dias disponíveis"></div>' +
      '<div class="filtros-sessoes">' +
      '<label><span>Tipo de sessão</span><select id="filtroTipoSessao"><option>Todos</option><option>2D</option><option>3D</option></select></label>' +
      '<label><span>Idioma</span><select id="filtroIdiomaSessao"><option>Todos</option><option>Dublado</option><option>Original</option></select></label>' +
      "</div>" +
      '<div id="listaSessoes" class="lista-sessoes" aria-live="polite"></div>' +
      '<section id="painelAssentos" class="painel-assentos" aria-labelledby="assentosTitulo" hidden>' +
      "<div>" +
      '<p class="filme-detalhe-kicker">COMPRA DE INGRESSOS</p>' +
      "<h3 id=\"assentosTitulo\">Escolha seus assentos</h3>" +
      '<p id="sessaoSelecionada" class="sessao-selecionada"></p></div>' +
      '<div class="tela-cinema" aria-hidden="true">TELA</div>' +
      '<p id="adminAssentosAjuda" class="admin-assentos-ajuda" hidden>Admin: clique em um assento ocupado para liberá-lo nesta sessão, se necessário.</p>' +
      '<div id="gradeAssentos" class="grade-assentos" aria-label="Assentos disponíveis"></div>' +
      '<div class="legenda-assentos" aria-label="Legenda dos assentos">' +
      "<span><i class=\"assento-legenda\"></i> Livre</span>" +
      "<span><i class=\"assento-legenda selecionado\"></i> Selecionado</span>" +
      "<span><i class=\"assento-legenda ocupado\"></i> Ocupado</span></div>" +
      '<div class="resumo-ingresso"><label for="tipoIngresso">Tipo de ingresso' +
      '<select id="tipoIngresso"><option value="inteira">Inteira</option><option value="meia">Meia-entrada</option></select></label>' +
      '<p id="precoIngressos" class="preco-ingressos" aria-live="polite"></p>' +
      '<p class="preco-aviso">O pagamento é feito na bilheteria do cinema.</p></div>' +
      '<label class="nome-comprador" for="nomeComprador">Nome para o comprovante' +
      '<input id="nomeComprador" name="nomeComprador" type="text" maxlength="80" autocomplete="name" required></label>' +
      '<button id="confirmarReserva" class="filme-botao-principal" type="button" disabled>Confirmar reserva</button>' +
      '<p id="reservaStatus" class="reserva-status" role="status" aria-live="polite"></p>' +
      '<button id="reservaAssistirEmCasa" class="filme-botao-secundario" type="button" hidden>Assistir trailer em casa</button>' +
      '<article id="comprovanteReserva" class="comprovante-reserva" aria-labelledby="comprovanteTitulo" hidden>' +
      '<p class="filme-detalhe-kicker">COMPROVANTE DE RESERVA</p>' +
      "<h3 id=\"comprovanteTitulo\">Reserva confirmada</h3>" +
      '<p id="comprovanteAviso" class="comprovante-aviso">Apresente este código na bilheteria para retirar seus ingressos. Chegue com 30 minutos de antecedência.</p>' +
      '<div id="comprovanteQr" class="comprovante-qr" aria-label="QR Code da reserva"></div>' +
      '<dl class="comprovante-dados">' +
      "<div><dt>Código</dt><dd id=\"comprovanteCodigo\"></dd></div>" +
      "<div><dt>Cliente</dt><dd id=\"comprovanteCliente\"></dd></div>" +
      "<div><dt>Filme</dt><dd id=\"comprovanteFilme\"></dd></div>" +
      "<div><dt>Cinema</dt><dd id=\"comprovanteCinema\"></dd></div>" +
      "<div><dt>Sessão</dt><dd id=\"comprovanteSessao\"></dd></div>" +
      "<div><dt>Assentos</dt><dd id=\"comprovanteAssentos\"></dd></div>" +
      "<div><dt>Tipo de ingresso</dt><dd id=\"comprovanteTipoIngresso\"></dd></div>" +
      "<div><dt>Valor por ingresso</dt><dd id=\"comprovanteValorIngresso\"></dd></div>" +
      '<div id="comprovanteDescontoLinha" hidden><dt>Desconto do plano</dt><dd id="comprovanteDesconto"></dd></div>' +
      "<div><dt>Total</dt><dd id=\"comprovanteValorTotal\"></dd></div>" +
      "</dl>" +
      '<p class="comprovante-acoes"><a id="verMeusIngressos" class="filme-botao-principal" href="#/ingressos">Ver meus ingressos</a> ' +
      '<button id="imprimirComprovante" class="filme-botao-secundario" type="button">Imprimir comprovante</button></p>' +
      "</article></section></section></main>" +
      '<footer class="site-footer">© 2026 Cinemark — todos os direitos reservados.<nav class="rodape-links" aria-label="Links do rodapé"><a href="#/ajuda">Ajuda</a><a href="#/contato">Contato</a><a href="#/ingressos">Meus ingressos</a></nav></footer>';

    const titulo = App.$("filmeTitulo");
    const metadados = App.$("filmeMetadados");
    const classificacao = App.$("filmeClassificacao");
    const sinopse = App.$("filmeSinopse");
    const playerPoster = App.$("filmePlayerPoster");
    const indisponivel = App.$("filmeIndisponivel");
    const estadoTitulo = App.$("filmeEstadoTitulo");
    const estadoMensagem = App.$("filmeEstadoMensagem");
    const falha = App.$("filmeFalha");
    const falhaMensagem = App.$("filmeFalhaMensagem");
    const tentarNovamente = App.$("filmeTentarNovamente");
    const carregarVideo = App.$("filmeCarregarVideo");
    const acaoTexto = App.$("filmeAcaoTexto");
    const assistirEmCasa = App.$("filmeAssistirEmCasa");
    const verSessoes = App.$("verSessoesFilme");
    const video = App.$("filmeVideo");
    const youtubeFrame = App.$("filmeYouTube");
    const youtubeLink = App.$("filmeYouTubeLink");
    const playerStatus = App.$("filmePlayerStatus");

    function exibirIndisponibilidade(tituloMsg, mensagem) {
      estadoTitulo.textContent = tituloMsg;
      estadoMensagem.textContent = mensagem;
      indisponivel.hidden = false;
      carregarVideo.hidden = true;
    }

    if (!filme) {
      titulo.textContent = "Filme não encontrado";
      metadados.textContent = "";
      classificacao.hidden = true;
      sinopse.textContent = "O título solicitado não está disponível.";
      document.title = "Filme não encontrado - Cinemark";
      exibirIndisponibilidade("Título não disponível", "Este filme não foi encontrado no catálogo.");
      App.$("horariosFilme").hidden = true;
      return;
    }

    const classificacaoTexto = filme.classificacao === "L" ? "Livre" : filme.classificacao + " anos";
    titulo.textContent = filme.titulo;
    metadados.textContent = [filme.genero, filme.ano].filter(Boolean).join(" · ");
    classificacao.textContent = "Classificação indicativa: " + classificacaoTexto;
    sinopse.textContent = filme.sinopse || "Sinopse não informada.";
    if (filme.poster) {
      playerPoster.src = App.assetUrl(filme.poster);
      playerPoster.alt = "Pôster de " + filme.titulo;
      playerPoster.hidden = false;
    }
    document.title = filme.titulo + " - Cinemark";

    if (!filme.emCartaz) {
      exibirIndisponibilidade("Filme indisponível", "Este título não está mais disponível no catálogo.");
      App.$("horariosFilme").hidden = true;
      return;
    }

    const idYouTube = Store.filmes.obterIdYouTube(filme.fonteVideo);
    const validacaoFonte = Store.filmes.validarFonteVideo(filme.fonteVideo);

    verSessoes.hidden = false;
    verSessoes.addEventListener("click", () => {
      App.$("horariosFilme").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    function carregarFonte() {
      falha.hidden = true;
      playerStatus.hidden = true;
      carregarVideo.hidden = true;
      if (idYouTube) {
        video.hidden = true;
        youtubeFrame.src = "https://www.youtube.com/embed/" + encodeURIComponent(idYouTube);
        youtubeFrame.hidden = false;
        youtubeLink.href = "https://www.youtube.com/watch?v=" + encodeURIComponent(idYouTube);
        youtubeLink.hidden = false;
        playerStatus.textContent = "Trailer oficial incorporado do YouTube.";
        playerStatus.hidden = false;
        return;
      }
      youtubeFrame.hidden = true;
      youtubeFrame.removeAttribute("src");
      youtubeLink.hidden = true;
      video.hidden = false;
      video.src = filme.fonteVideo;
      video.load();
    }

    if (!filme.fonteVideo) {
      exibirIndisponibilidade("Trailer indisponível", "Este filme ainda não possui uma fonte de vídeo autorizada para assistir em casa.");
    } else if (!validacaoFonte.ok) {
      exibirIndisponibilidade("Fonte de vídeo inválida", validacaoFonte.erro);
    } else {
      if (idYouTube) {
        acaoTexto.textContent = "Assistir trailer";
        assistirEmCasa.hidden = false;
        assistirEmCasa.addEventListener("click", () => {
          carregarFonte();
          App.$("filmePlayerRegiao").scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
      carregarVideo.hidden = false;
      carregarVideo.addEventListener("click", carregarFonte);
      tentarNovamente.addEventListener("click", carregarFonte);
    }

    video.addEventListener("loadedmetadata", () => {
      playerStatus.textContent = "Vídeo carregado. Use os controles para iniciar a reprodução.";
      playerStatus.hidden = false;
    });
    video.addEventListener("error", () => {
      video.hidden = true;
      playerStatus.hidden = true;
      falhaMensagem.textContent = "Não foi possível carregar o vídeo. Verifique a fonte ou tente novamente.";
      falha.hidden = false;
      carregarVideo.hidden = true;
    });

    /* ----- sessões demonstrativas ----- */

    const DURACAO_SESSAO_MIN = 120;
    const salasCinema = [
      { cinema: "Boulevard Tatuapé", salas: [{ numero: 2, horarios: ["14:30", "16:40", "19:00", "21:20"] }] },
      {
        cinema: "Raposo Shopping",
        salas: [
          { numero: 1, horarios: ["14:40", "16:50", "19:00", "21:20"] },
          { numero: 2, horarios: ["15:50", "18:00", "20:10", "22:20"] }
        ]
      }
    ];

    const diasSessoes = App.$("diasSessoes");
    const listaSessoes = App.$("listaSessoes");
    const filtroTipo = App.$("filtroTipoSessao");
    const filtroIdioma = App.$("filtroIdiomaSessao");
    const painelAssentos = App.$("painelAssentos");
    const sessaoSelecionada = App.$("sessaoSelecionada");
    const gradeAssentos = App.$("gradeAssentos");
    const adminAssentosAjuda = App.$("adminAssentosAjuda");
    const tipoIngresso = App.$("tipoIngresso");
    const precoIngressos = App.$("precoIngressos");
    const confirmarReserva = App.$("confirmarReserva");
    const reservaStatus = App.$("reservaStatus");
    const reservaAssistirEmCasa = App.$("reservaAssistirEmCasa");
    const nomeComprador = App.$("nomeComprador");
    const comprovanteReserva = App.$("comprovanteReserva");
    const ehAdmin = Store.sessao.ehAdmin();
    const assentosSelecionados = new Set();
    const sessoesPorId = new Map();
    const precosIngressos = Store.reservas.precosDemonstrativos();
    let diaSelecionado = 0;
    let sessaoAtual = null;

    function atualizarResumoIngresso() {
      const valorUnitario = precosIngressos[tipoIngresso.value];
      const conta = Store.sessao.atual();
      const desconto = Store.reservas.descontoPara(conta?.id);
      const qtd = assentosSelecionados.size;
      const total = Math.round(valorUnitario * qtd * (1 - desconto.percentual / 100));
      const textoDesconto = desconto.percentual
        ? " · desconto " + desconto.percentual + "% (" + desconto.plano + ")"
        : "";
      precoIngressos.textContent = qtd
        ? qtd + " " + (qtd === 1 ? "ingresso" : "ingressos") + " × " + App.fmtBRL(valorUnitario) + " = " + App.fmtBRL(total) + textoDesconto
        : "Ingresso " + (tipoIngresso.value === "meia" ? "meia-entrada" : "inteira") + ": " + App.fmtBRL(valorUnitario) + textoDesconto + " · selecione assentos para ver o total.";
    }

    function dataLocal(d) {
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }

    const datas = Array.from({ length: 5 }, (_, i) => {
      const d = new Date();
      d.setHours(12, 0, 0, 0);
      d.setDate(d.getDate() + i);
      return {
        chave: dataLocal(d),
        data: d,
        dia: new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(d).replace(".", ""),
        dataCurta: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(d).replace(".", "")
      };
    });

    function montarSessoes(dia) {
      sessoesPorId.clear();
      return salasCinema.map((cinema, ci) => ({
        ...cinema,
        sessoes: cinema.salas.flatMap((sala) => sala.horarios.map((horario, hi) => {
          const inicio = new Date(datas[dia].chave + "T" + horario + ":00");
          const fim = new Date(inicio.getTime() + DURACAO_SESSAO_MIN * 60 * 1000);
          const agora = Date.now();
          const encerrada = agora >= fim.getTime();
          const emAndamento = agora >= inicio.getTime() && !encerrada;
          const sessao = {
            id: filme.id + "|" + datas[dia].chave + "|" + ci + "|" + sala.numero + "|" + horario,
            filmeId: filme.id,
            cinema: cinema.cinema,
            sala: sala.numero,
            data: datas[dia].chave,
            horario,
            terminaEm: fim.toISOString(),
            encerrada,
            emAndamento,
            tipo: ci === 1 && hi === 3 ? "3D" : "2D",
            idioma: hi % 2 === 0 ? "Dublado" : "Original",
            esgotada: !encerrada && dia === 0 && ci === 0 && horario === "21:20"
          };
          sessoesPorId.set(sessao.id, sessao);
          return sessao;
        }))
      }));
    }

    function renderizarDias() {
      diasSessoes.innerHTML = datas.map((dia, i) =>
        '<button class="dia-sessao" type="button" role="tab" aria-selected="' + (i === diaSelecionado) + '" ' +
        'aria-controls="listaSessoes" data-dia="' + i + '"><strong>' + (i === 0 ? "Hoje" : App.esc(dia.dia)) + "</strong>" +
        "<span>" + App.esc(dia.dataCurta) + "</span></button>"
      ).join("");
    }

    function renderizarSessoes() {
      const sessoes = montarSessoes(diaSelecionado);
      const tipo = filtroTipo.value;
      const idioma = filtroIdioma.value;
      const cinemas = sessoes.map((c) => ({
        ...c,
        sessoes: c.sessoes.filter((s) =>
          (tipo === "Todos" || s.tipo === tipo) && (idioma === "Todos" || s.idioma === idioma))
      })).filter((c) => c.sessoes.length);

      if (!cinemas.length) {
        listaSessoes.innerHTML = '<p class="sem-sessoes">Não há sessões que correspondam aos filtros escolhidos.</p>';
        painelAssentos.hidden = true;
        return;
      }

      listaSessoes.innerHTML = cinemas.map((cinema) => {
        const grupos = new Map();
        cinema.sessoes.forEach((s) => {
          const chave = s.sala + "|" + s.tipo + "|" + s.idioma;
          if (!grupos.has(chave)) grupos.set(chave, []);
          grupos.get(chave).push(s);
        });
        return '<section class="cinema-sessoes" aria-label="Sessões no ' + App.esc(cinema.cinema) + '">' +
          "<h3>" + App.esc(cinema.cinema) + "</h3><p>Salas e horários desta unidade</p>" +
          [...grupos.values()].map((grupo) =>
            '<div class="grupo-sessoes"><h4>' + grupo[0].tipo + " · " + grupo[0].idioma + " · Sala " + grupo[0].sala + "</h4>" +
            '<div class="horarios-botoes">' + grupo.map((s) =>
              '<button class="horario-sessao' + (s.esgotada ? " sessao-esgotada" : "") + (s.encerrada ? " sessao-encerrada" : "") + '" ' +
              'type="button" data-sessao-id="' + encodeURIComponent(s.id) + '">' +
              "<span>" + (diaSelecionado === 0 ? "Hoje" : App.esc(datas[diaSelecionado].dia)) + ", " + App.esc(datas[diaSelecionado].dataCurta) + "</span>" +
              "<strong>" + s.horario + "</strong>" +
              '<span class="preco-sessao">Inteira ' + App.fmtBRL(precosIngressos.inteira) + " · Meia " + App.fmtBRL(precosIngressos.meia) + "</span>" +
              (s.encerrada ? '<span class="horario-encerrado">Sessão encerrada · assentos liberados</span>' : "") +
              (s.emAndamento ? '<span class="horario-encerrado">Sessão em andamento</span>' : "") +
              (s.esgotada ? '<span class="horario-esgotado">Sessão esgotada</span>' : "") +
              "</button>"
            ).join("") + "</div></div>"
          ).join("") + "</section>";
      }).join("");
    }

    function exibirOpcaoTrailer() {
      reservaAssistirEmCasa.hidden = !idYouTube;
      if (idYouTube) {
        reservaAssistirEmCasa.onclick = () => {
          carregarFonte();
          App.$("filmePlayerRegiao").scrollIntoView({ behavior: "smooth", block: "center" });
        };
      }
    }

    function mostrarStatus(mensagem, tipo) {
      reservaStatus.textContent = mensagem;
      reservaStatus.dataset.erro = tipo === "erro";
      reservaStatus.dataset.sucesso = tipo === "sucesso";
    }

    function renderizarAssentos(sessao) {
      sessaoAtual = sessao;
      assentosSelecionados.clear();
      painelAssentos.hidden = false;
      comprovanteReserva.hidden = true;
      nomeComprador.disabled = false;
      reservaStatus.textContent = "";
      delete reservaStatus.dataset.erro;
      delete reservaStatus.dataset.sucesso;
      reservaAssistirEmCasa.hidden = true;
      confirmarReserva.disabled = true;
      confirmarReserva.hidden = sessao.esgotada;
      adminAssentosAjuda.hidden = true;
      atualizarResumoIngresso();

      const dataFmt = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long", day: "2-digit", month: "long"
      }).format(new Date(sessao.data + "T12:00:00"));
      sessaoSelecionada.textContent =
        sessao.cinema + " · Sala " + sessao.sala + " · " + dataFmt + " às " + sessao.horario + " · " + sessao.tipo + " " + sessao.idioma;

      if (sessao.encerrada || sessao.emAndamento) {
        confirmarReserva.hidden = true;
        nomeComprador.disabled = true;
        const reservados = new Set(Store.reservas.lugaresReservados(sessao.id));
        const demo = new Set(["A1", "A2", "B4"]);
        const botoes = [];
        for (const fila of ["A", "B", "C", "D", "E"]) {
          for (let n = 1; n <= 8; n++) {
            const lugar = fila + n;
            const ocupado = sessao.emAndamento && (demo.has(lugar) || reservados.has(lugar));
            const b = document.createElement("button");
            b.className = sessao.encerrada ? "assento assento-liberado" : "assento";
            b.type = "button";
            b.textContent = lugar;
            b.setAttribute("aria-pressed", "false");
            b.disabled = true;
            botoes.push(b);
          }
        }
        gradeAssentos.replaceChildren(...botoes);
        mostrarStatus(sessao.encerrada
          ? "Sessão encerrada. Todos os assentos foram liberados; escolha uma próxima sessão para reservar."
          : "Sessão em andamento. Não é possível comprar assentos agora; eles serão liberados ao término.", "");
        return;
      }

      if (sessao.esgotada) {
        gradeAssentos.replaceChildren();
        mostrarStatus("Esta sessão está esgotada. Escolha outro horário.", "erro");
        exibirOpcaoTrailer();
        return;
      }

      const reservados = new Set(Store.reservas.lugaresReservados(sessao.id));
      const liberados = new Set(Store.reservas.assentosLiberados(sessao.id));
      const demo = new Set(["A1", "A2", "B4"]);
      adminAssentosAjuda.hidden = !ehAdmin;
      const botoes = [];
      for (const fila of ["A", "B", "C", "D", "E"]) {
        for (let n = 1; n <= 8; n++) {
          const lugar = fila + n;
          const ocupado = !liberados.has(lugar) && (demo.has(lugar) || reservados.has(lugar));
          const b = document.createElement("button");
          b.className = "assento" + (ocupado && ehAdmin ? " assento-ocupado-admin" : "");
          b.type = "button";
          b.textContent = lugar;
          b.setAttribute("aria-label", "Assento " + lugar + (ocupado
            ? (ehAdmin ? ", ocupado, clique para liberar" : ", ocupado") : ", livre"));
          b.setAttribute("aria-pressed", "false");
          b.disabled = ocupado && !ehAdmin;
          b.dataset.lugar = lugar;
          b.dataset.ocupado = String(ocupado);
          if (ocupado && ehAdmin) b.title = "Liberar este assento para a sessão";
          botoes.push(b);
        }
      }
      gradeAssentos.replaceChildren(...botoes);
      mostrarStatus("Selecione um ou mais assentos. O pagamento é feito na bilheteria.", "");
    }

    diasSessoes.addEventListener("click", (e) => {
      const b = e.target.closest("[data-dia]");
      if (!b) return;
      diaSelecionado = Number(b.dataset.dia);
      sessaoAtual = null;
      renderizarDias();
      renderizarSessoes();
      painelAssentos.hidden = true;
    });

    function aplicarFiltros() {
      sessaoAtual = null;
      painelAssentos.hidden = true;
      renderizarSessoes();
    }
    filtroTipo.addEventListener("change", aplicarFiltros);
    filtroIdioma.addEventListener("change", aplicarFiltros);
    tipoIngresso.addEventListener("change", atualizarResumoIngresso);

    listaSessoes.addEventListener("click", (e) => {
      const b = e.target.closest("[data-sessao-id]");
      if (!b) return;
      const sessao = sessoesPorId.get(decodeURIComponent(b.dataset.sessaoId));
      if (sessao) renderizarAssentos(sessao);
      painelAssentos.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    gradeAssentos.addEventListener("click", (e) => {
      const b = e.target.closest("[data-lugar]");
      if (!b || b.disabled) return;
      const lugar = b.dataset.lugar;
      if (b.dataset.ocupado === "true") {
        const resultado = Store.reservas.liberarAssento({
          sessaoId: sessaoAtual.id, lugar,
          data: sessaoAtual.data, horario: sessaoAtual.horario
        });
        if (!resultado.ok) {
          mostrarStatus(resultado.erro, "erro");
          return;
        }
        renderizarAssentos(sessaoAtual);
        mostrarStatus("Assento " + lugar + " liberado pelo administrador para esta sessão.", "sucesso");
        return;
      }
      if (assentosSelecionados.has(lugar)) {
        assentosSelecionados.delete(lugar);
        b.setAttribute("aria-pressed", "false");
        b.classList.remove("selecionado");
      } else {
        assentosSelecionados.add(lugar);
        b.setAttribute("aria-pressed", "true");
        b.classList.add("selecionado");
      }
      atualizarResumoIngresso();
      confirmarReserva.disabled = assentosSelecionados.size === 0 || !nomeComprador.value.trim();
      mostrarStatus(assentosSelecionados.size
        ? "Assentos selecionados: " + [...assentosSelecionados].join(", ") + "."
        : "Selecione um ou mais assentos.", "");
    });

    nomeComprador.addEventListener("input", () => {
      confirmarReserva.disabled = assentosSelecionados.size === 0 || !nomeComprador.value.trim();
    });

    const contaReserva = Store.sessao.atual();
    if (contaReserva && !nomeComprador.value) {
      nomeComprador.value = contaReserva.nome || "";
    }

    confirmarReserva.addEventListener("click", () => {
      const alvo = sessaoAtual;
      if (!alvo) {
        mostrarStatus("Não foi possível identificar a sessão selecionada. Escolha o horário novamente.", "erro");
        exibirOpcaoTrailer();
        return;
      }
      const conta = Store.sessao.atual();
      if (!conta) {
        mostrarStatus("Entre na sua conta para concluir a reserva.", "erro");
        setTimeout(() => App.nav("#/login"), 1200);
        return;
      }
      if (!nomeComprador.value.trim()) {
        mostrarStatus("Informe seu nome para gerar o comprovante.", "erro");
        nomeComprador.focus();
        return;
      }
      const resultado = Store.reservas.reservar({
        sessaoId: alvo.id, filmeId: filme.id, filmeTitulo: filme.titulo,
        clienteNome: nomeComprador.value, cinema: alvo.cinema, sala: alvo.sala,
        data: alvo.data, horario: alvo.horario, terminaEm: alvo.terminaEm,
        lugares: [...assentosSelecionados], tipoIngresso: tipoIngresso.value,
        usuarioId: conta.id, email: conta.email
      });
      if (!resultado.ok) {
        mostrarStatus("Não foi possível concluir a reserva: " + resultado.erro, "erro");
        exibirOpcaoTrailer();
        return;
      }
      confirmarReserva.hidden = true;
      nomeComprador.disabled = true;
      [...gradeAssentos.querySelectorAll("[data-lugar]")].forEach((a) => {
        if (assentosSelecionados.has(a.dataset.lugar)) {
          a.disabled = true;
          a.setAttribute("aria-label", "Assento " + a.dataset.lugar + ", reservado");
        }
      });
      App.$("comprovanteCodigo").textContent = resultado.dado.codigo;
      App.$("comprovanteCliente").textContent = resultado.dado.clienteNome;
      App.$("comprovanteFilme").textContent = resultado.dado.filmeTitulo;
      App.$("comprovanteCinema").textContent = resultado.dado.cinema + " · Sala " + resultado.dado.sala;
      App.$("comprovanteSessao").textContent =
        new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" })
          .format(new Date(resultado.dado.data + "T12:00:00")) +
        " às " + resultado.dado.horario + " · " + alvo.tipo + " " + alvo.idioma;
      App.$("comprovanteAssentos").textContent = resultado.dado.lugares.join(", ");
      App.$("comprovanteTipoIngresso").textContent =
        resultado.dado.tipoIngresso === "meia" ? "Meia-entrada" : "Inteira";
      App.$("comprovanteValorIngresso").textContent = App.fmtBRL(resultado.dado.valorIngressoCentavos);
      const linhaDesconto = App.$("comprovanteDescontoLinha");
      if (resultado.dado.descontoPercentual) {
        App.$("comprovanteDesconto").textContent =
          resultado.dado.descontoPercentual + "% (" + resultado.dado.planoTitulo + ")";
        linhaDesconto.hidden = false;
      } else {
        linhaDesconto.hidden = true;
      }
      App.$("comprovanteValorTotal").textContent = App.fmtBRL(resultado.dado.valorTotalCentavos);
      App.qr(App.$("comprovanteQr"), resultado.dado.codigo, 128);
      comprovanteReserva.hidden = false;
      comprovanteReserva.scrollIntoView({ behavior: "smooth", block: "nearest" });
      mostrarStatus("Reserva confirmada! O código também está em Meus ingressos.", "sucesso");
      assentosSelecionados.clear();
      atualizarResumoIngresso();
    });

    App.$("imprimirComprovante").addEventListener("click", () => {
      document.body.classList.add("imprimindo-comprovante");
      window.addEventListener("afterprint", () => {
        document.body.classList.remove("imprimindo-comprovante");
      }, { once: true });
      window.print();
    });

    renderizarDias();
    renderizarSessoes();

    if (query.get("sessoes") === "1") {
      setTimeout(() => App.$("horariosFilme")?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }

  Pages.home = { render: renderHome };
  Pages.filmes = { render: renderFilmes };
  Pages.filme = { render: renderFilme };
})();
