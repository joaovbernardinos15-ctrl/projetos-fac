(() => {
  const parametros = new URLSearchParams(window.location.search);
  const id = parametros.get("id");
  const filme = id ? Store.filmes.buscarPorId(id) : null;

  const titulo = document.getElementById("filmeTitulo");
  const metadados = document.getElementById("filmeMetadados");
  const classificacao = document.getElementById("filmeClassificacao");
  const sinopse = document.getElementById("filmeSinopse");
  const playerPoster = document.getElementById("filmePlayerPoster");
  const indisponivel = document.getElementById("filmeIndisponivel");
  const estadoTitulo = document.getElementById("filmeEstadoTitulo");
  const estadoMensagem = document.getElementById("filmeEstadoMensagem");
  const falha = document.getElementById("filmeFalha");
  const falhaMensagem = document.getElementById("filmeFalhaMensagem");
  const tentarNovamente = document.getElementById("filmeTentarNovamente");
  const carregarVideo = document.getElementById("filmeCarregarVideo");
  const video = document.getElementById("filmeVideo");
  const playerStatus = document.getElementById("filmePlayerStatus");

  function exibirIndisponibilidade(tituloMensagem, mensagem) {
    estadoTitulo.textContent = tituloMensagem;
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
    return;
  }

  const classificacaoTexto = filme.classificacao === "L"
    ? "Livre"
    : `${filme.classificacao} anos`;

  titulo.textContent = filme.titulo;
  metadados.textContent = [filme.genero, filme.ano].filter(Boolean).join(" · ");
  classificacao.textContent = `Classificação indicativa: ${classificacaoTexto}`;
  sinopse.textContent = filme.sinopse || "Sinopse não informada.";
  if (filme.poster) {
    playerPoster.src = filme.poster;
    playerPoster.hidden = false;
  }
  document.title = `${filme.titulo} - Cinemark`;

  if (!filme.emCartaz) {
    exibirIndisponibilidade("Filme indisponível", "Este título não está mais disponível no catálogo.");
    return;
  }

  if (!filme.fonteVideo) {
    exibirIndisponibilidade("Conteúdo temporariamente indisponível", "Este filme ainda não possui uma fonte de vídeo autorizada.");
    return;
  }

  const validacaoFonte = Store.filmes.validarFonteVideo(filme.fonteVideo);
  if (!validacaoFonte.ok) {
    exibirIndisponibilidade("Fonte de vídeo inválida", validacaoFonte.erro);
    return;
  }

  function carregarFonte() {
    falha.hidden = true;
    playerStatus.hidden = true;
    carregarVideo.hidden = true;
    video.hidden = false;
    video.src = filme.fonteVideo;
    video.load();
  }

  carregarVideo.hidden = false;
  carregarVideo.addEventListener("click", carregarFonte);
  tentarNovamente.addEventListener("click", carregarFonte);

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
})();
