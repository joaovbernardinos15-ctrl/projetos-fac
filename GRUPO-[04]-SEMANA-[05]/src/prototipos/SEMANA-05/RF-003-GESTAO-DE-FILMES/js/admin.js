/* =========================================================
   CINEMARK — PAINEL ADMINISTRATIVO (admin.js)

   Esta tela é só interface: quem grava, valida e apaga é o
   Store (js/store.js). Aqui ficam o desenho das tabelas, os
   filtros e a ligação dos botões com cada operação.

   Mapa das operações:
     CREATE -> Store.filmes.criar()     / Store.usuarios.criar()
     READ   -> Store.filmes.listar()    / Store.usuarios.listar()
     UPDATE -> Store.filmes.atualizar() / Store.usuarios.atualizar()
     DELETE -> Store.filmes.excluir()   / Store.usuarios.excluir()
   ========================================================= */

(() => {
  // Segunda checagem de permissão (a primeira está no <head> do HTML).
  if (!Store.sessao.exigirAdmin("login.html")) return;

  const logado = Store.sessao.atual();
  document.getElementById("admNome").textContent = logado.nome;

  /* =========================================================
     UTILITÁRIOS
     ========================================================= */

  const $ = (id) => document.getElementById(id);

  /* Evita que um título com < ou > quebre o HTML da tabela. */
  function escapar(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, (caractere) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[caractere]));
  }

  function formatarData(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("pt-BR");
  }

  let timeoutToast;

  function avisar(mensagem) {
    const toast = $("toastAdm");
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${escapar(mensagem)}`;
    toast.classList.add("visivel");

    clearTimeout(timeoutToast);
    timeoutToast = setTimeout(() => toast.classList.remove("visivel"), 3200);
  }

  function mostrarErro(elemento, mensagem) {
    elemento.textContent = mensagem;
    elemento.hidden = false;
  }

  function esconderErro(elemento) {
    elemento.textContent = "";
    elemento.hidden = true;
  }

  const modalFilme = new bootstrap.Modal($("modalFilme"));
  const modalUsuario = new bootstrap.Modal($("modalUsuario"));
  const modalExcluir = new bootstrap.Modal($("modalExcluir"));

  /* =========================================================
     INDICADORES
     ========================================================= */

  function atualizarIndicadores() {
    const filmes = Store.filmes.listar();
    const usuarios = Store.usuarios.listar();

    $("totalFilmes").textContent = filmes.length;
    $("totalCartaz").textContent = filmes.filter((filme) => filme.emCartaz).length;
    $("totalUsuarios").textContent = usuarios.length;
    $("totalAdmins").textContent = usuarios.filter((usuario) => usuario.perfil === "admin").length;
  }

  /* =========================================================
     FILMES — READ (listagem + busca + filtros)
     ========================================================= */

  function filmesFiltrados() {
    const busca = Store.normalizar($("buscaFilme").value);
    const genero = $("filtroGenero").value;
    const cartaz = $("filtroCartaz").value;

    return Store.filmes
      .listar()
      .filter((filme) => {
        const bateBusca =
          !busca ||
          Store.normalizar(filme.titulo).includes(busca) ||
          Store.normalizar(filme.genero).includes(busca);

        const bateGenero = !genero || filme.genero === genero;

        const bateCartaz =
          !cartaz ||
          (cartaz === "sim" && filme.emCartaz) ||
          (cartaz === "nao" && !filme.emCartaz);

        return bateBusca && bateGenero && bateCartaz;
      })
      .sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
  }

  function renderizarFilmes() {
    const lista = filmesFiltrados();
    const corpo = $("tabelaFilmes");

    corpo.innerHTML = lista.map((filme) => `
      <tr>
        <td>
          ${filme.poster
            ? `<img class="adm-poster" src="${escapar(filme.poster)}" alt="Pôster de ${escapar(filme.titulo)}">`
            : `<div class="adm-poster"></div>`}
        </td>
        <td><strong>${escapar(filme.titulo)}</strong></td>
        <td>${escapar(filme.genero)}</td>
        <td>${escapar(filme.ano)}</td>
        <td>${escapar(filme.classificacao)}</td>
        <td>
          <span class="etiqueta ${filme.emCartaz ? "etiqueta-cartaz" : "etiqueta-fora"}">
            ${filme.emCartaz ? "EM CARTAZ" : "FORA"}
          </span>
        </td>
        <td class="coluna-acoes">
          <div class="adm-acoes">
            <button type="button" class="adm-btn-icone" data-editar-filme="${filme.id}" title="Editar">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="adm-btn-icone excluir" data-excluir-filme="${filme.id}" title="Excluir">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join("");

    $("filmesVazio").hidden = lista.length > 0;
    atualizarIndicadores();
  }

  function preencherGeneros() {
    const generos = Store.filmes.generos();

    $("filtroGenero").innerHTML =
      `<option value="">Todos os gêneros</option>` +
      generos.map((genero) => `<option value="${escapar(genero)}">${escapar(genero)}</option>`).join("");

    $("listaGeneros").innerHTML =
      generos.map((genero) => `<option value="${escapar(genero)}">`).join("");
  }

  /* ---------- CREATE / UPDATE de filme ---------- */

  function abrirModalFilme(id) {
    esconderErro($("erroFilme"));
    preencherGeneros();

    const filme = id ? Store.filmes.buscarPorId(id) : null;

    $("tituloModalFilme").textContent = filme ? "Editar filme" : "Novo filme";
    $("filmeId").value = filme ? filme.id : "";
    $("filmeTitulo").value = filme ? filme.titulo : "";
    $("filmeGenero").value = filme ? filme.genero : "";
    $("filmeAno").value = filme ? filme.ano : new Date().getFullYear();
    $("filmeClassificacao").value = filme ? filme.classificacao : "L";
    $("filmePoster").value = filme ? filme.poster : "";
    $("filmeSinopse").value = filme ? filme.sinopse : "";
    $("filmeEmCartaz").checked = filme ? filme.emCartaz : true;

    modalFilme.show();
  }

  function salvarFilme() {
    const id = $("filmeId").value;

    const dados = {
      titulo: $("filmeTitulo").value,
      genero: $("filmeGenero").value,
      ano: $("filmeAno").value,
      classificacao: $("filmeClassificacao").value,
      poster: $("filmePoster").value,
      sinopse: $("filmeSinopse").value,
      emCartaz: $("filmeEmCartaz").checked
    };

    // Mesmo formulário para as duas operações: com id é UPDATE, sem id é CREATE.
    const resultado = id
      ? Store.filmes.atualizar(id, dados)
      : Store.filmes.criar(dados);

    if (!resultado.ok) {
      mostrarErro($("erroFilme"), resultado.erro);
      return;
    }

    modalFilme.hide();
    preencherGeneros();
    renderizarFilmes();
    avisar(id ? "Filme atualizado com sucesso." : "Filme cadastrado com sucesso.");
  }

  /* =========================================================
     USUÁRIOS — READ (listagem + busca + filtros)
     ========================================================= */

  function usuariosFiltrados() {
    const busca = Store.normalizar($("buscaUsuario").value);
    const perfil = $("filtroPerfil").value;

    return Store.usuarios
      .listar()
      .filter((usuario) => {
        const bateBusca =
          !busca ||
          Store.normalizar(usuario.nome).includes(busca) ||
          Store.normalizar(usuario.email).includes(busca);

        const batePerfil = !perfil || usuario.perfil === perfil;

        return bateBusca && batePerfil;
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }

  function renderizarUsuarios() {
    const lista = usuariosFiltrados();
    const corpo = $("tabelaUsuarios");

    corpo.innerHTML = lista.map((usuario) => {
      const ehVoce = usuario.id === logado.id;

      return `
        <tr>
          <td>
            <strong>${escapar(usuario.nome)}</strong>
            ${ehVoce ? '<span class="form-ajuda">(você)</span>' : ""}
          </td>
          <td>${escapar(usuario.email)}</td>
          <td>
            <span class="etiqueta ${usuario.perfil === "admin" ? "etiqueta-admin" : "etiqueta-cliente"}">
              ${usuario.perfil === "admin" ? "ADMIN" : "CLIENTE"}
            </span>
          </td>
          <td>${formatarData(usuario.criadoEm)}</td>
          <td class="coluna-acoes">
            <div class="adm-acoes">
              <button type="button" class="adm-btn-icone" data-editar-usuario="${usuario.id}" title="Editar">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button type="button" class="adm-btn-icone excluir" data-excluir-usuario="${usuario.id}" title="Excluir">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    $("usuariosVazio").hidden = lista.length > 0;
    atualizarIndicadores();
  }

  /* ---------- CREATE / UPDATE de usuário ---------- */

  function abrirModalUsuario(id) {
    esconderErro($("erroUsuario"));

    const usuario = id ? Store.usuarios.buscarPorId(id) : null;

    $("tituloModalUsuario").textContent = usuario ? "Editar usuário" : "Novo usuário";
    $("usuarioId").value = usuario ? usuario.id : "";
    $("usuarioNome").value = usuario ? usuario.nome : "";
    $("usuarioEmail").value = usuario ? usuario.email : "";
    $("usuarioPerfil").value = usuario ? usuario.perfil : "cliente";
    $("usuarioSenha").value = "";
    $("ajudaSenha").textContent = usuario
      ? "Deixe em branco para manter a senha atual."
      : "Obrigatória, mínimo 8 caracteres.";

    modalUsuario.show();
  }

  function salvarUsuario() {
    const id = $("usuarioId").value;

    const dados = {
      nome: $("usuarioNome").value,
      email: $("usuarioEmail").value,
      perfil: $("usuarioPerfil").value,
      senha: $("usuarioSenha").value
    };

    let resultado;

    if (id) {
      // No UPDATE a senha em branco significa "não mexer".
      if (!dados.senha) delete dados.senha;
      resultado = Store.usuarios.atualizar(id, dados);
    } else {
      resultado = Store.usuarios.criar(dados);
    }

    if (!resultado.ok) {
      mostrarErro($("erroUsuario"), resultado.erro);
      return;
    }

    modalUsuario.hide();
    renderizarUsuarios();

    // Se o admin editou a si mesmo, o nome no topo precisa acompanhar.
    if (id === logado.id) {
      document.getElementById("admNome").textContent = resultado.dado.nome;
    }

    avisar(id ? "Usuário atualizado com sucesso." : "Usuário cadastrado com sucesso.");
  }

  /* =========================================================
     DELETE — um único modal de confirmação para os dois casos
     ========================================================= */

  let exclusaoPendente = null; // { tipo: "filme" | "usuario", id }

  function pedirConfirmacao(tipo, id) {
    esconderErro($("erroExcluir"));
    exclusaoPendente = { tipo, id };

    if (tipo === "filme") {
      const filme = Store.filmes.buscarPorId(id);
      $("textoExcluir").innerHTML = `Excluir o filme <strong>${escapar(filme.titulo)}</strong>?`;
    } else {
      const usuario = Store.usuarios.buscarPorId(id);
      $("textoExcluir").innerHTML = `Excluir a conta de <strong>${escapar(usuario.nome)}</strong>?`;
    }

    modalExcluir.show();
  }

  function confirmarExclusao() {
    if (!exclusaoPendente) return;

    const { tipo, id } = exclusaoPendente;
    const ehVoce = tipo === "usuario" && id === logado.id;

    const resultado = tipo === "filme"
      ? Store.filmes.excluir(id)
      : Store.usuarios.excluir(id);

    // O Store barra a exclusão do último administrador.
    if (!resultado.ok) {
      mostrarErro($("erroExcluir"), resultado.erro);
      return;
    }

    modalExcluir.hide();
    exclusaoPendente = null;

    // Admin que apagou a própria conta perde a sessão junto.
    if (ehVoce) {
      window.location.href = "index.html";
      return;
    }

    if (tipo === "filme") {
      preencherGeneros();
      renderizarFilmes();
      avisar("Filme excluído.");
    } else {
      renderizarUsuarios();
      avisar("Usuário excluído.");
    }
  }

  /* =========================================================
     EVENTOS
     ========================================================= */

  // Abas
  document.querySelectorAll(".adm-aba").forEach((aba) => {
    aba.addEventListener("click", () => {
      document.querySelectorAll(".adm-aba").forEach((outra) => {
        outra.classList.toggle("ativa", outra === aba);
      });

      document.querySelectorAll(".adm-painel").forEach((painel) => {
        painel.hidden = painel.dataset.painel !== aba.dataset.aba;
      });
    });
  });

  // Filmes
  $("buscaFilme").addEventListener("input", renderizarFilmes);
  $("filtroGenero").addEventListener("change", renderizarFilmes);
  $("filtroCartaz").addEventListener("change", renderizarFilmes);
  $("btnNovoFilme").addEventListener("click", () => abrirModalFilme(null));
  $("btnSalvarFilme").addEventListener("click", salvarFilme);

  $("tabelaFilmes").addEventListener("click", (evento) => {
    const editar = evento.target.closest("[data-editar-filme]");
    if (editar) return abrirModalFilme(editar.dataset.editarFilme);

    const excluir = evento.target.closest("[data-excluir-filme]");
    if (excluir) return pedirConfirmacao("filme", excluir.dataset.excluirFilme);
  });

  // Usuários
  $("buscaUsuario").addEventListener("input", renderizarUsuarios);
  $("filtroPerfil").addEventListener("change", renderizarUsuarios);
  $("btnNovoUsuario").addEventListener("click", () => abrirModalUsuario(null));
  $("btnSalvarUsuario").addEventListener("click", salvarUsuario);

  $("tabelaUsuarios").addEventListener("click", (evento) => {
    const editar = evento.target.closest("[data-editar-usuario]");
    if (editar) return abrirModalUsuario(editar.dataset.editarUsuario);

    const excluir = evento.target.closest("[data-excluir-usuario]");
    if (excluir) return pedirConfirmacao("usuario", excluir.dataset.excluirUsuario);
  });

  // Exclusão
  $("btnConfirmarExclusao").addEventListener("click", confirmarExclusao);

  // Topo
  $("btnSair").addEventListener("click", () => {
    Store.sessao.encerrar();
    window.location.href = "index.html";
  });

  $("btnRestaurar").addEventListener("click", () => {
    const confirmado = window.confirm(
      "Isso apaga os filmes e usuários cadastrados e volta tudo ao estado inicial. Continuar?"
    );

    if (!confirmado) return;

    Store.restaurarPadrao();
    window.location.href = "login.html";
  });

  /* =========================================================
     INICIALIZAÇÃO
     ========================================================= */

  preencherGeneros();
  renderizarFilmes();
  renderizarUsuarios();
})();
