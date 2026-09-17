/* =========================================================
   CINEMARK — NAVBAR DINÂMICA (nav.js)

   Preenche o item <li id="navConta"> de acordo com quem está
   logado. É isso que faz o link "Administração" existir só
   para quem tem perfil de administrador.

   Depende de: js/store.js (precisa vir ANTES deste arquivo)
   ========================================================= */

(() => {
  const container = document.getElementById("navConta");
  if (!container || typeof Store === "undefined") return;

  const usuario = Store.sessao.atual();

  /* ---------- visitante ---------- */

  if (!usuario) {
    container.classList.remove("dropdown");
    container.innerHTML = `
      <a class="nav-link nav-conta-entrar" href="login.html">
        <i class="fa-solid fa-right-to-bracket"></i> Entrar
      </a>
    `;
    return;
  }

  /* ---------- logado (cliente ou admin) ---------- */

  const primeiroNome = usuario.nome.split(" ")[0];
  const ehAdmin = usuario.perfil === "admin";

  container.innerHTML = `
    <a class="nav-link dropdown-toggle nav-conta-logado" href="#" role="button"
       data-bs-toggle="dropdown" aria-expanded="false">
      <i class="fa-solid fa-circle-user"></i> ${primeiroNome}
      ${ehAdmin ? '<span class="badge-admin">ADMIN</span>' : ""}
    </a>

    <ul class="dropdown-menu dropdown-menu-end dropdown-cinemark">
      <li class="dropdown-header">${usuario.email}</li>
      <li><hr class="dropdown-divider"></li>

      ${ehAdmin ? `
        <li>
          <a class="dropdown-item" href="admin.html">
            <i class="fa-solid fa-gauge-high"></i> Administração
          </a>
        </li>
      ` : ""}

      <li>
        <a class="dropdown-item" href="perfil.html">
          <i class="fa-solid fa-id-card"></i> Meu perfil
        </a>
      </li>

      <li><hr class="dropdown-divider"></li>

      <li>
        <button type="button" class="dropdown-item" id="btnSair">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Sair
        </button>
      </li>
    </ul>
  `;

  document.getElementById("btnSair")?.addEventListener("click", () => {
    Store.sessao.encerrar();
    window.location.href = "index.html";
  });
})();
