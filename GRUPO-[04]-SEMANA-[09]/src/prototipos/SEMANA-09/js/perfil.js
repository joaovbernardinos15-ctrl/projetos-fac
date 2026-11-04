/* =========================================================
   CINEMARK — MEU PERFIL (perfil.js)

   Aqui o próprio usuário faz o UPDATE e o DELETE da conta
   dele, sem precisar de um administrador. É o que fecha o
   requisito "excluir o perfil".
   ========================================================= */

(() => {
  if (!Store.sessao.exigirLogin("login.html")) return;

  const $ = (id) => document.getElementById(id);

  const sessao = Store.sessao.atual();
  const usuario = Store.usuarios.buscarPorId(sessao.id);

  // Sessão apontando para um usuário que não existe mais.
  if (!usuario) {
    Store.sessao.encerrar();
    window.location.href = "login.html";
    return;
  }

  let timeoutToast;

  function avisar(mensagem) {
    const toast = $("toastAdm");
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${mensagem}`;
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

  /* ---------- READ: preenche a tela ---------- */

  function preencher(dados) {
    const iniciais = dados.nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toUpperCase())
      .join("");

    $("perfilIniciais").textContent = iniciais || "?";
    $("perfilNomeTopo").textContent = dados.nome;
    $("perfilNome").value = dados.nome;
    $("perfilEmail").value = dados.email;
    $("perfilDesde").textContent = dados.criadoEm
      ? new Date(dados.criadoEm).toLocaleDateString("pt-BR")
      : "—";

    const etiqueta = $("perfilEtiqueta");
    const ehAdmin = dados.perfil === "admin";

    etiqueta.textContent = ehAdmin ? "ADMINISTRADOR" : "CLIENTE";
    etiqueta.className = `etiqueta ${ehAdmin ? "etiqueta-admin" : "etiqueta-cliente"}`;
    $("linkAdmin").hidden = !ehAdmin;
  }

  preencher(usuario);

  /* ---------- UPDATE ---------- */

  $("btnSalvarPerfil").addEventListener("click", () => {
    const dados = {
      nome: $("perfilNome").value,
      email: $("perfilEmail").value
    };

    const novaSenha = $("perfilSenha").value;
    if (novaSenha) dados.senha = novaSenha;

    if (!dados.nome.trim()) {
      mostrarErro($("erroPerfil"), "O nome não pode ficar em branco.");
      return;
    }

    const resultado = Store.usuarios.atualizar(usuario.id, dados);

    if (!resultado.ok) {
      mostrarErro($("erroPerfil"), resultado.erro);
      return;
    }

    esconderErro($("erroPerfil"));
    $("perfilSenha").value = "";
    preencher(resultado.dado);
    avisar("Dados atualizados com sucesso.");
  });

  /* ---------- DELETE ---------- */

  const modalExcluir = new bootstrap.Modal($("modalExcluirConta"));

  $("btnExcluirConta").addEventListener("click", () => {
    esconderErro($("erroExcluirConta"));
    $("confirmacaoTexto").value = "";
    modalExcluir.show();
  });

  $("btnConfirmarExclusaoConta").addEventListener("click", () => {
    if ($("confirmacaoTexto").value.trim().toUpperCase() !== "EXCLUIR") {
      mostrarErro($("erroExcluirConta"), 'Digite EXCLUIR para confirmar.');
      return;
    }

    // O Store impede que o último administrador se apague.
    const resultado = Store.usuarios.excluir(usuario.id);

    if (!resultado.ok) {
      mostrarErro($("erroExcluirConta"), resultado.erro);
      return;
    }

    // excluir() já encerra a sessão do usuário removido.
    window.location.href = "index.html";
  });

  /* ---------- Sair ---------- */

  $("btnSair").addEventListener("click", () => {
    Store.sessao.encerrar();
    window.location.href = "index.html";
  });
})();
