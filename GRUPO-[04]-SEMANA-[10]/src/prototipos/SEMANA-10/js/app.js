/* =========================================================
   CINEMARK — NÚCLEO SPA (app.js)
   Roteamento por hash (#/...), navbar dinâmica e utilidades
   compartilhadas pelas páginas (pg-site / pg-loja / pg-conta).
   O conteúdo e as regras de negócio vêm do Store + protótipo.
   ========================================================= */

const Pages = {};

const App = (() => {
  const $ = (id) => document.getElementById(id);
  const assetBase = new URL("../img/", document.currentScript.src);

  function esc(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  function assetUrl(caminho) {
    const valor = String(caminho ?? "").trim().replace(/\\/g, "/");
    if (!valor || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(valor)) return valor;
    const arquivo = valor.replace(/^(?:\.\/|\/)?(?:src\/)?img\//i, "");
    return new URL(arquivo, assetBase).href;
  }

  const fmtBRL = (centavos) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format((Number(centavos) || 0) / 100);

  const fmtMoeda = (valor) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(valor) || 0);

  function formatarData(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function parseHash() {
    const bruto = window.location.hash || "#/";
    const semCerquilha = bruto.slice(1); // "/filme?id=x"
    const [caminho, queryString] = semCerquilha.split("?");
    return {
      caminho: caminho || "/",
      query: new URLSearchParams(queryString || "")
    };
  }

  function nav(destino) {
    if (window.location.hash === destino) {
      route();
    } else {
      window.location.hash = destino;
    }
  }

  let toastTimeout;
  function toast(mensagem) {
    const el = $("toastGlobal");
    if (!el) return;
    el.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> ' + esc(mensagem);
    el.classList.add("visivel");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => el.classList.remove("visivel"), 3400);
  }

  /* QR Code de ingressos/pedidos (lib qrcodejs via CDN, com
     alternativa em texto quando a lib não carrega). */
  function qr(el, texto, tamanho = 132) {
    if (!el) return;
    el.innerHTML = "";
    const codigo = String(texto ?? "");
    if (typeof window.QRCode !== "undefined") {
      try {
        new window.QRCode(el, {
          text: codigo,
          width: tamanho,
          height: tamanho,
          colorDark: "#111111",
          colorLight: "#ffffff",
          correctLevel: window.QRCode.CorrectLevel.M
        });
        const img = el.querySelector("img");
        if (img) img.alt = "QR Code " + codigo;
        return;
      } catch (erro) {
        console.error("Falha ao gerar QR Code", erro);
      }
    }
    const alt = document.createElement("p");
    alt.className = "qr-alternativo";
    alt.textContent = codigo;
    el.append(alt);
  }

  function fecharMenuMobile() {
    const menu = $("navbarNav");
    if (menu && menu.classList.contains("show") && typeof bootstrap !== "undefined") {
      bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  }

  function marcarNavAtivo(grupo) {
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const ativo = link.dataset.nav === grupo;
      link.classList.toggle("active", ativo);
      if (ativo) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  /* Navbar conforme sessão (visitante / cliente / admin) — igual ao nav.js. */
  function renderNavConta() {
    const container = $("navConta");
    if (!container || typeof Store === "undefined") return;

    const usuario = Store.sessao.atual();

    if (!usuario) {
      container.classList.remove("dropdown");
      container.innerHTML =
        '<a class="nav-link nav-conta-entrar" href="#/login">' +
        '<i class="fa-solid fa-right-to-bracket"></i> Entrar</a>';
      return;
    }

    const primeiroNome = esc(String(usuario.nome || "Conta").split(" ")[0]);
    const ehAdmin = usuario.perfil === "admin";

    container.innerHTML =
      '<button type="button" class="nav-link dropdown-toggle nav-conta-logado" data-bs-toggle="dropdown" aria-expanded="false">' +
      '<i class="fa-solid fa-circle-user"></i> ' + primeiroNome +
      (ehAdmin ? ' <span class="badge-admin">ADMIN</span>' : "") +
      "</button>" +
      '<ul class="dropdown-menu dropdown-menu-end dropdown-cinemark">' +
      '<li class="dropdown-header">' + esc(usuario.email) + "</li>" +
      '<li><hr class="dropdown-divider"></li>' +
      (ehAdmin
        ? '<li><a class="dropdown-item" href="#/admin"><i class="fa-solid fa-gauge-high"></i> Administração</a></li>'
        : "") +
      '<li><a class="dropdown-item" href="#/perfil"><i class="fa-solid fa-id-card"></i> Meu perfil</a></li>' +
      '<li><a class="dropdown-item" href="#/ingressos"><i class="fa-solid fa-ticket"></i> Meus ingressos</a></li>' +
      '<li><hr class="dropdown-divider"></li>' +
      '<li><button type="button" class="dropdown-item" id="btnSair">' +
      '<i class="fa-solid fa-arrow-right-from-bracket"></i> Sair</button></li>' +
      "</ul>";

    $("btnSair")?.addEventListener("click", () => {
      Store.sessao.encerrar();
      renderNavConta();
      nav("#/");
      toast("Sessão encerrada.");
    });
  }

  function exigirLogin() {
    if (!Store.sessao.atual()) {
      nav("#/login");
      return false;
    }
    return true;
  }

  function exigirAdmin() {
    if (!Store.sessao.ehAdmin()) {
      nav("#/login");
      return false;
    }
    return true;
  }

  const ROTAS = {
    "/": { pagina: "home", grupo: "inicio", titulo: "Cinemark - Início", corpo: "home-page" },
    "/filmes": { pagina: "filmes", grupo: "filmes", titulo: "Cinemark - Filmes", corpo: "filmes-page" },
    "/filme": { pagina: "filme", grupo: "filmes", titulo: "Filme - Cinemark", corpo: "filme-detalhe-page" },
    "/loja": { pagina: "loja", grupo: "loja", titulo: "Cinemark - Loja", corpo: "contato-page lanches-page" },
    "/lanche": { pagina: "lanche", grupo: "loja", titulo: "Cinemark - Lanche", corpo: "contato-page lanche-detalhe-page" },
    "/comprar": { pagina: "comprar", grupo: "loja", titulo: "Cinemark - Comprar lanche", corpo: "contato-page comprar-page" },
    "/contato": { pagina: "contato", grupo: "contato", titulo: "Cinemark - Contato", corpo: "contato-page" },
    "/ajuda": { pagina: "ajuda", grupo: "contato", titulo: "Cinemark - Ajuda", corpo: "contato-page" },
    "/ingressos": { pagina: "ingressos", grupo: "", titulo: "Cinemark - Meus ingressos", corpo: "admin-page", auth: "login" },
    "/assinar": { pagina: "assinar", grupo: "", titulo: "Cinemark - Assinar plano", corpo: "contato-page comprar-page", auth: "login" },
    "/login": { pagina: "login", grupo: "", titulo: "Cinemark - Login", corpo: "" },
    "/perfil": { pagina: "perfil", grupo: "", titulo: "Cinemark - Meu perfil", corpo: "admin-page", auth: "login" },
    "/admin": { pagina: "admin", grupo: "", titulo: "Cinemark - Administração", corpo: "admin-page", auth: "admin" }
  };

  function route() {
    const { caminho, query } = parseHash();
    const rota = ROTAS[caminho] || ROTAS["/"];
    const pagina = Pages[rota.pagina];

    if (rota.auth === "login" && !Store.sessao.atual()) return nav("#/login");
    if (rota.auth === "admin" && !Store.sessao.ehAdmin()) return nav("#/login");

    document.body.className = rota.corpo;
    document.title = rota.titulo;
    marcarNavAtivo(rota.grupo);
    renderNavConta();
    fecharMenuMobile();
    window.scrollTo(0, 0);

    if (!pagina) return;
    try {
      pagina.render(query);
    } catch (erro) {
      console.error("Falha ao renderizar " + rota.pagina, erro);
      $("app").innerHTML =
        '<div class="contato-wrap"><section class="contato-card">' +
        "<h2>Algo saiu errado</h2>" +
        "<p>Não foi possível carregar esta página. Tente voltar ao início.</p>" +
        '<p><a class="streaming-secondary" href="#/">Voltar ao início</a></p>' +
        "</section></div>";
    }
  }

  function start() {
    window.addEventListener("hashchange", route);
    route();
  }

  return {
    $, esc, assetUrl, fmtBRL, fmtMoeda, formatarData, parseHash, nav,
    toast, qr, exigirLogin, exigirAdmin, renderNavConta, marcarNavAtivo,
    fecharMenuMobile, route, start
  };
})();

window.App = App;
window.Pages = Pages;
