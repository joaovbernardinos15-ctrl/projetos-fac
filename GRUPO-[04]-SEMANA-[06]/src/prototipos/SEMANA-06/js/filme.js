(() => {
  const DURACAO_SESSAO_DEMONSTRATIVA_MINUTOS = 120;
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
  const acaoTexto = document.getElementById("filmeAcaoTexto");
  const assistirEmCasa = document.getElementById("filmeAssistirEmCasa");
  const video = document.getElementById("filmeVideo");
  const youtubeFrame = document.getElementById("filmeYouTube");
  const youtubeLink = document.getElementById("filmeYouTubeLink");
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
    document.getElementById("horariosFilme").hidden = true;
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
    document.getElementById("horariosFilme").hidden = true;
    return;
  }

  const idYouTube = Store.filmes.obterIdYouTube(filme.fonteVideo);
  const validacaoFonte = Store.filmes.validarFonteVideo(filme.fonteVideo);

  function carregarFonte() {
    falha.hidden = true;
    playerStatus.hidden = true;
    carregarVideo.hidden = true;
    if (idYouTube) {
      video.hidden = true;
      youtubeFrame.src = `https://www.youtube.com/embed/${encodeURIComponent(idYouTube)}`;
      youtubeFrame.hidden = false;
      youtubeLink.href = `https://www.youtube.com/watch?v=${encodeURIComponent(idYouTube)}`;
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
        document.getElementById("filmePlayerRegiao").scrollIntoView({ behavior: "smooth", block: "center" });
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

  const salasCinema = [
    {
      cinema: "Boulevard Tatuapé",
      salas: [
        { numero: 2, horarios: ["14:30", "16:40", "19:00", "21:20"] }
      ]
    },
    {
      cinema: "Raposo Shopping",
      salas: [
        { numero: 1, horarios: ["14:40", "16:50", "19:00", "21:20"] },
        { numero: 2, horarios: ["15:50", "18:00", "20:10", "22:20"] }
      ]
    }
  ];
  const diasSessoes = document.getElementById("diasSessoes");
  const listaSessoes = document.getElementById("listaSessoes");
  const filtroTipo = document.getElementById("filtroTipoSessao");
  const filtroIdioma = document.getElementById("filtroIdiomaSessao");
  const painelAssentos = document.getElementById("painelAssentos");
  const sessaoSelecionada = document.getElementById("sessaoSelecionada");
  const gradeAssentos = document.getElementById("gradeAssentos");
  const confirmarReserva = document.getElementById("confirmarReserva");
  const reservaStatus = document.getElementById("reservaStatus");
  const reservaAssistirEmCasa = document.getElementById("reservaAssistirEmCasa");
  const nomeComprador = document.getElementById("nomeComprador");
  const comprovanteReserva = document.getElementById("comprovanteReserva");
  const imprimirComprovante = document.getElementById("imprimirComprovante");
  const assentosSelecionados = new Set();
  const sessoesPorId = new Map();
  let diaSelecionado = 0;
  let sessaoAtual = null;

  function dataLocal(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  const datas = Array.from({ length: 5 }, (_, indice) => {
    const data = new Date();
    data.setHours(12, 0, 0, 0);
    data.setDate(data.getDate() + indice);
    return {
      chave: dataLocal(data),
      data,
      dia: new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(data).replace(".", ""),
      dataCurta: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(data).replace(".", "")
    };
  });

  function montarSessoes(dia) {
    sessoesPorId.clear();
    return salasCinema.map((cinema, cinemaIndice) => ({
      ...cinema,
      sessoes: cinema.salas.flatMap((sala) => sala.horarios.map((horario, horarioIndice) => {
        const inicio = new Date(`${datas[dia].chave}T${horario}:00`);
        const fim = new Date(inicio.getTime() + DURACAO_SESSAO_DEMONSTRATIVA_MINUTOS * 60 * 1000);
        const agora = Date.now();
        const encerrada = agora >= fim.getTime();
        const emAndamento = agora >= inicio.getTime() && !encerrada;
        const sessao = {
          id: `${filme.id}|${datas[dia].chave}|${cinemaIndice}|${sala.numero}|${horario}`,
          filmeId: filme.id,
          cinema: cinema.cinema,
          sala: sala.numero,
          data: datas[dia].chave,
          horario,
          terminaEm: fim.toISOString(),
          encerrada,
          emAndamento,
          tipo: cinemaIndice === 1 && horarioIndice === 3 ? "3D" : "2D",
          idioma: horarioIndice % 2 === 0 ? "Dublado" : "Original",
          esgotada: !encerrada && dia === 0 && cinemaIndice === 0 && horario === "21:20"
        };
        sessoesPorId.set(sessao.id, sessao);
        return sessao;
      }))
    }));
  }

  function renderizarDias() {
    diasSessoes.innerHTML = datas.map((dia, indice) => `
      <button
        class="dia-sessao"
        type="button"
        role="tab"
        aria-selected="${indice === diaSelecionado}"
        aria-controls="listaSessoes"
        data-dia="${indice}">
        <strong>${indice === 0 ? "Hoje" : dia.dia}</strong>
        <span>${dia.dataCurta}</span>
      </button>
    `).join("");
  }

  function renderizarSessoes() {
    const sessoes = montarSessoes(diaSelecionado);
    const tipo = filtroTipo.value;
    const idioma = filtroIdioma.value;
    const cinemasComSessoes = sessoes.map((cinema) => ({
      ...cinema,
      sessoes: cinema.sessoes.filter((sessao) =>
        (tipo === "Todos" || sessao.tipo === tipo) &&
        (idioma === "Todos" || sessao.idioma === idioma)
      )
    })).filter((cinema) => cinema.sessoes.length);

    if (!cinemasComSessoes.length) {
      listaSessoes.innerHTML = '<p class="sem-sessoes">Não há sessões que correspondam aos filtros escolhidos.</p>';
      painelAssentos.hidden = true;
      return;
    }

    listaSessoes.innerHTML = cinemasComSessoes.map((cinema) => {
      const grupos = new Map();
      cinema.sessoes.forEach((sessao) => {
        const chave = `${sessao.sala}|${sessao.tipo}|${sessao.idioma}`;
        if (!grupos.has(chave)) grupos.set(chave, []);
        grupos.get(chave).push(sessao);
      });

      return `
        <section class="cinema-sessoes" aria-label="Sessões no ${cinema.cinema}">
          <h3>${cinema.cinema}</h3>
          <p>Local e sessões demonstrativos</p>
          ${[...grupos.values()].map((grupo) => `
            <div class="grupo-sessoes">
              <h4>${grupo[0].tipo} · ${grupo[0].idioma} · Sala ${grupo[0].sala}</h4>
              <div class="horarios-botoes">
                ${grupo.map((sessao) => `
                  <button
                    class="horario-sessao ${sessao.esgotada ? "sessao-esgotada" : ""} ${sessao.encerrada ? "sessao-encerrada" : ""}"
                    type="button"
                    data-sessao-id="${encodeURIComponent(sessao.id)}">
                    <span>${diaSelecionado === 0 ? "Hoje" : datas[diaSelecionado].dia}, ${datas[diaSelecionado].dataCurta}</span>
                    <strong>${sessao.horario}</strong>
                    ${sessao.encerrada ? '<span class="horario-encerrado">Sessão encerrada · assentos liberados</span>' : ""}
                    ${sessao.emAndamento ? '<span class="horario-encerrado">Sessão em andamento</span>' : ""}
                    ${sessao.esgotada ? '<span class="horario-esgotado">Sessão esgotada</span>' : ""}
                  </button>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </section>
      `;
    }).join("");
  }

  function atualizarEstadoSessoes() {
    const estadosAnteriores = new Map(
      [...sessoesPorId].map(([id, sessao]) => [id, `${sessao.encerrada}:${sessao.emAndamento}`])
    );
    const sessaoSelecionadaId = sessaoAtual?.id;
    const sessoes = montarSessoes(diaSelecionado).flatMap((cinema) => cinema.sessoes);
    const houveMudanca = sessoes.some((sessao) =>
      estadosAnteriores.get(sessao.id) !== `${sessao.encerrada}:${sessao.emAndamento}`
    );
    if (!houveMudanca) return;

    renderizarSessoes();
    const sessaoAtualizada = sessaoSelecionadaId && sessoesPorId.get(sessaoSelecionadaId);
    if (sessaoAtualizada) renderizarAssentos(sessaoAtualizada);
  }

  window.setInterval(atualizarEstadoSessoes, 60_000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) atualizarEstadoSessoes();
  });

  function exibirOpcaoTrailer() {
    reservaAssistirEmCasa.hidden = !idYouTube;
    if (idYouTube) {
      reservaAssistirEmCasa.onclick = () => {
        carregarFonte();
        document.getElementById("filmePlayerRegiao").scrollIntoView({ behavior: "smooth", block: "center" });
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

    const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long"
    }).format(new Date(`${sessao.data}T12:00:00`));
    sessaoSelecionada.textContent = `${sessao.cinema} · Sala ${sessao.sala} · ${dataFormatada} às ${sessao.horario} · ${sessao.tipo} ${sessao.idioma}`;

    if (sessao.encerrada || sessao.emAndamento) {
      confirmarReserva.hidden = true;
      nomeComprador.disabled = true;
      const lugaresReservados = new Set(Store.reservas.lugaresReservados(sessao.id));
      const ocupadosDemo = new Set(["A1", "A2", "B4"]);
      const assentos = [];
      for (const fila of ["A", "B", "C", "D", "E"]) {
        for (let numero = 1; numero <= 8; numero += 1) {
          const lugar = `${fila}${numero}`;
          const ocupado = sessao.emAndamento && (ocupadosDemo.has(lugar) || lugaresReservados.has(lugar));
          const botao = document.createElement("button");
          botao.className = sessao.encerrada ? "assento assento-liberado" : "assento";
          botao.type = "button";
          botao.textContent = lugar;
          botao.setAttribute("aria-label", sessao.encerrada
            ? `Assento ${lugar}, livre após o encerramento da sessão`
            : `Assento ${lugar}${ocupado ? ", ocupado" : ", livre, sessão em andamento"}`);
          botao.setAttribute("aria-pressed", "false");
          botao.disabled = true;
          botao.dataset.lugar = lugar;
          assentos.push(botao);
        }
      }
      gradeAssentos.replaceChildren(...assentos);
      mostrarStatus(sessao.encerrada
        ? "Sessão encerrada. Todos os assentos foram liberados; escolha uma próxima sessão para reservar."
        : "Sessão em andamento. Não é possível comprar assentos agora; eles serão liberados ao término.",
      "");
      return;
    }

    if (sessao.esgotada) {
      gradeAssentos.replaceChildren();
      mostrarStatus("Esta sessão demonstrativa está esgotada. Escolha outro horário.", "erro");
      exibirOpcaoTrailer();
      return;
    }

    const lugaresReservados = new Set(Store.reservas.lugaresReservados(sessao.id));
    const ocupadosDemo = new Set(["A1", "A2", "B4"]);
    const assentos = [];
    for (const fila of ["A", "B", "C", "D", "E"]) {
      for (let numero = 1; numero <= 8; numero += 1) {
        const lugar = `${fila}${numero}`;
        const ocupado = ocupadosDemo.has(lugar) || lugaresReservados.has(lugar);
        const botao = document.createElement("button");
        botao.className = "assento";
        botao.type = "button";
        botao.textContent = lugar;
        botao.setAttribute("aria-label", `Assento ${lugar}${ocupado ? ", ocupado" : ", livre"}`);
        botao.setAttribute("aria-pressed", "false");
        botao.disabled = ocupado;
        botao.dataset.lugar = lugar;
        assentos.push(botao);
      }
    }
    gradeAssentos.replaceChildren(...assentos);
    mostrarStatus("Selecione um ou mais assentos. Nenhuma cobrança será realizada.", "");
  }

  diasSessoes.addEventListener("click", (event) => {
    const botao = event.target.closest("[data-dia]");
    if (!botao) return;
    diaSelecionado = Number(botao.dataset.dia);
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

  listaSessoes.addEventListener("click", (event) => {
    const botao = event.target.closest("[data-sessao-id]");
    if (!botao) return;
    const sessao = sessoesPorId.get(decodeURIComponent(botao.dataset.sessaoId));
    if (sessao) renderizarAssentos(sessao);
    painelAssentos.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  gradeAssentos.addEventListener("click", (event) => {
    const botao = event.target.closest("[data-lugar]");
    if (!botao || botao.disabled) return;

    const lugar = botao.dataset.lugar;
    if (assentosSelecionados.has(lugar)) {
      assentosSelecionados.delete(lugar);
      botao.setAttribute("aria-pressed", "false");
    } else {
      assentosSelecionados.add(lugar);
      botao.setAttribute("aria-pressed", "true");
    }
    confirmarReserva.disabled = assentosSelecionados.size === 0 || !nomeComprador.value.trim();
    mostrarStatus(
      assentosSelecionados.size
        ? `Assentos selecionados: ${[...assentosSelecionados].join(", ")}.`
        : "Selecione um ou mais assentos.",
      ""
    );
  });

  nomeComprador.addEventListener("input", () => {
    confirmarReserva.disabled = assentosSelecionados.size === 0 || !nomeComprador.value.trim();
  });

  confirmarReserva.addEventListener("click", () => {
    const alvo = sessaoAtual;
    if (!alvo) {
      mostrarStatus("Não foi possível identificar a sessão selecionada. Escolha o horário novamente.", "erro");
      exibirOpcaoTrailer();
      return;
    }

    if (!nomeComprador.value.trim()) {
      mostrarStatus("Informe seu nome para gerar o comprovante.", "erro");
      nomeComprador.focus();
      return;
    }

    const resultado = Store.reservas.reservar({
      sessaoId: alvo.id,
      filmeId: filme.id,
      filmeTitulo: filme.titulo,
      clienteNome: nomeComprador.value,
      cinema: alvo.cinema,
      sala: alvo.sala,
      data: alvo.data,
      horario: alvo.horario,
      terminaEm: alvo.terminaEm,
      lugares: [...assentosSelecionados]
    });

    if (!resultado.ok) {
      mostrarStatus(`Não foi possível concluir a reserva: ${resultado.erro}`, "erro");
      exibirOpcaoTrailer();
      return;
    }

    confirmarReserva.hidden = true;
    nomeComprador.disabled = true;
    [...gradeAssentos.querySelectorAll("[data-lugar]")].forEach((assento) => {
      if (assentosSelecionados.has(assento.dataset.lugar)) {
        assento.disabled = true;
        assento.setAttribute("aria-label", `Assento ${assento.dataset.lugar}, reservado`);
      }
    });
    document.getElementById("comprovanteCodigo").textContent = resultado.dado.codigo;
    document.getElementById("comprovanteCliente").textContent = resultado.dado.clienteNome;
    document.getElementById("comprovanteFilme").textContent = resultado.dado.filmeTitulo;
    document.getElementById("comprovanteCinema").textContent = `${resultado.dado.cinema} · Sala ${resultado.dado.sala}`;
    document.getElementById("comprovanteSessao").textContent =
      `${new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(new Date(`${resultado.dado.data}T12:00:00`))} às ${resultado.dado.horario} · ${alvo.tipo} ${alvo.idioma}`;
    document.getElementById("comprovanteAssentos").textContent = resultado.dado.lugares.join(", ");
    comprovanteReserva.hidden = false;
    mostrarStatus("Compra demonstrativa registrada. Apresente os dados abaixo ao atendente; não houve cobrança e isto não é um ingresso real.", "sucesso");
    assentosSelecionados.clear();
  });

  imprimirComprovante.addEventListener("click", () => {
    document.body.classList.add("imprimindo-comprovante");
    window.addEventListener("afterprint", () => {
      document.body.classList.remove("imprimindo-comprovante");
    }, { once: true });
    window.print();
  });

  renderizarDias();
  renderizarSessoes();
})();
