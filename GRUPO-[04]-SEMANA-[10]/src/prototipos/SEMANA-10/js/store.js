/* =========================================================
   CINEMARK — CAMADA DE DADOS (store.js)

   Como o protótipo não tem back-end, a persistência é feita
   no localStorage do navegador. Este arquivo concentra TODAS
   as operações de CRUD para que as telas só cuidem da
   interface.

   Coleções:
     - usuarios  -> RF: cadastro, consulta, edição e exclusão
     - filmes    -> RF03: gestão de filmes (CRUD completo)
     - sessao    -> usuário logado no momento

   OBS. acadêmica: a senha é guardada em texto puro apenas
   porque é um protótipo de front-end. Em produção isso vai
   para o back-end com hash (bcrypt/argon2).
   ========================================================= */

const Store = (() => {
  const CHAVES = {
    usuarios: "cinemark:usuarios",
    filmes: "cinemark:filmes",
    sessao: "cinemark:sessao",
    carrinho: "cinemark:carrinho",
    reservas: "cinemark:reservas",
    assentosLiberados: "cinemark:assentosLiberados",
    mensagens: "cinemark:mensagens",
    pedidos: "cinemark:pedidos",
    assinaturas: "cinemark:assinaturas",
    recuperacoes: "cinemark:recuperacoes"
  };
  const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PRECOS_INGRESSO_DEMONSTRATIVOS = Object.freeze({ inteira: 3600, meia: 1800 });

  /* Catálogo de planos (valores em reais). O desconto é aplicado
     automaticamente nas reservas de ingressos e nos pedidos da loja. */
  const PLANOS = Object.freeze([
    {
      id: "lite",
      nome: "Lite",
      preco: 24.9,
      descontoIngressos: 0,
      descontoLoja: 0,
      beneficios: ["Pré-venda de ingressos", "Pontos no programa de fidelidade", "Ofertas da semana por e-mail"]
    },
    {
      id: "plus",
      nome: "Plus",
      preco: 49.9,
      descontoIngressos: 10,
      descontoLoja: 5,
      beneficios: ["10% de desconto nos ingressos", "5% de desconto na loja", "Pré-venda de ingressos", "Pontos em dobro no programa de fidelidade"]
    },
    {
      id: "ultra",
      nome: "Ultra",
      preco: 89.9,
      descontoIngressos: 20,
      descontoLoja: 10,
      beneficios: ["20% de desconto nos ingressos", "10% de desconto na loja", "Pré-venda exclusiva e acesso antecipado", "Pontos em triplo no programa de fidelidade"]
    }
  ]);

  /* ---------- utilitários ---------- */

  function ler(chave, padrao) {
    try {
      const bruto = localStorage.getItem(chave);
      return bruto ? JSON.parse(bruto) : padrao;
    } catch (erro) {
      console.error("Falha ao ler", chave, erro);
      return padrao;
    }
  }

  function gravar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
  }

  function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function normalizar(texto) {
    return String(texto ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function validarFonteVideo(fonte) {
    const valor = String(fonte ?? "").trim();
    if (!valor) return { ok: true, erro: "" };

    if (valor.startsWith("//")) {
      return { ok: false, erro: "Use um caminho relativo ou um endereço HTTPS para o vídeo." };
    }

    if (/^[a-z][a-z\d+.-]*:/i.test(valor)) {
      try {
        if (new URL(valor).protocol === "https:") return { ok: true, erro: "" };
      } catch {
        return { ok: false, erro: "O endereço do vídeo é inválido." };
      }

      return { ok: false, erro: "Endereços externos de vídeo devem usar HTTPS." };
    }

    try {
      const base = new URL(window.location.href);
      const destino = new URL(valor, base);
      if (destino.protocol === base.protocol && destino.origin === base.origin) {
        return { ok: true, erro: "" };
      }
    } catch {
      return { ok: false, erro: "O caminho do vídeo é inválido." };
    }

    return { ok: false, erro: "Use um caminho relativo ou um endereço HTTPS para o vídeo." };
  }

  function obterIdYouTube(fonte) {
    try {
      const url = new URL(String(fonte ?? ""));
      if (url.protocol !== "https:" || (url.port && url.port !== "443")) return null;

      let id = null;
      if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)) {
        if (url.pathname === "/watch") {
          id = url.searchParams.get("v");
        } else {
          id = url.pathname.match(/^\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})\/?$/)?.[1] ?? null;
        }
      } else if (["youtu.be", "www.youtu.be"].includes(url.hostname)) {
        id = url.pathname.slice(1).split("/")[0];
      }

      return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    } catch {
      return null;
    }
  }

  /* ---------- seed (dados iniciais) ---------- */

  const FILMES_INICIAIS = [
    { titulo: "A Odisseia", genero: "Ação", ano: "2026", classificacao: "14", poster: "src/img/MoviePoster-8ad878d5-f2a3-46d4-9f34-b07cf40b1541.png", fonteVideo: "https://youtu.be/fF9hQP0vht8" },
    { titulo: "Cansei de Ser Nerd", genero: "Comédia", ano: "2026", classificacao: "12", poster: "src/img/MoviePoster-7b391aed-202c-47c4-81f8-426cca8ff7d4.png", fonteVideo: "https://youtu.be/kPZho9jxzu8" },
    { titulo: "Colegas e o Herdeiro", genero: "Comédia", ano: "2026", classificacao: "12", poster: "src/img/MoviePoster-4b578907-005f-4257-9448-684e6f52b1c4.png", fonteVideo: "https://youtu.be/ceOilC14SSc" },
    { titulo: "Coyote vs. Acme", genero: "Comédia", ano: "2026", classificacao: "L", poster: "src/img/MoviePoster-908f3c4f-27e4-4e30-a057-ad6fb93992d5.png", fonteVideo: "https://youtu.be/0yGrVVFNKF4" },
    { titulo: "Homem-Aranha: Um Novo Dia", genero: "Ação", ano: "2026", classificacao: "12", poster: "src/img/MoviePoster-11e62ed3-b0b0-42ae-97b8-54b881bc2bee.png", fonteVideo: "https://youtu.be/PlulyWs1kS4" },
    { titulo: "Michael", genero: "Drama", ano: "2026", classificacao: "12", poster: "src/img/MoviePoster-39a47201-3b75-4d07-b96a-02610d9885a9.png", fonteVideo: "https://youtu.be/mbtgEE6rkxw" },
    { titulo: "Muito Prazer", genero: "Comédia", ano: "2026", classificacao: "12", poster: "src/img/MoviePoster-532e35b5-8c6a-4b0b-9f57-e40d06d35940.png", fonteVideo: "https://youtu.be/bt9n5pL40QM" },
    { titulo: "O Advogado do Diabo", genero: "Drama", ano: "2026", classificacao: "16", poster: "src/img/MoviePoster-4a554ccc-f36c-4236-9d02-90c364e40816.png" },
    { titulo: "O Fim da Rua", genero: "Drama", ano: "2026", classificacao: "12", poster: "src/img/MoviePoster-6ae2213a-1124-4e3b-94c0-9b0480aa6b82.png", fonteVideo: "https://youtu.be/NtVXvlgaIUQ" },
    { titulo: "O Gênio do Crime", genero: "Comédia", ano: "2026", classificacao: "12", poster: "src/img/MoviePoster-1d439958-eb6d-4749-bd17-16e3caff4ce4.png", fonteVideo: "https://youtu.be/fU7JkJyw4oo" },
    { titulo: "Ponto Sem Retorno", genero: "Ação", ano: "2026", classificacao: "12", poster: "src/img/MoviePoster-6bba3710-5068-4f38-8597-2271a4271b2a.png", fonteVideo: "https://youtu.be/EpDrdWcksg4" },
    { titulo: "Patrulha Canina: Uma Aventura Dino", genero: "Ficção", ano: "2026", classificacao: "L", poster: "src/img/MoviePoster-94f73a7f-62a1-44cb-a01a-2e32eaa87efc.png", fonteVideo: "https://youtu.be/BID0gu1ROD8" },
    { titulo: "Só Por Uma Noite", genero: "Drama", ano: "2026", classificacao: "12", poster: "src/img/MoviePoster-75453a35-a69e-43bc-b312-b1d6a30cbfe7.png", fonteVideo: "https://youtu.be/5QtZALyr3kw" },
    { titulo: "Sobrenatural: Agora Entre Nós", genero: "Terror", ano: "2026", classificacao: "14", poster: "src/img/MoviePoster-36bc59f8-4d4f-41c9-aee9-dc6cee2a9784.png", fonteVideo: "https://youtu.be/L8GzoyjEgwI" },
    { titulo: "Túmulo dos Vagalumes", genero: "Animação", ano: "2026", classificacao: "12", poster: "src/img/MoviePoster-8270e450-9ede-4618-a15d-5f67292667cb.png", fonteVideo: "https://youtu.be/lhlh7JVcTt8" },
    { titulo: "Vingadores", genero: "Ação", ano: "2026", classificacao: "12", poster: "src/img/MoviePoster-9acd854c-c1cd-43ab-a1ca-db1cebbcae2c.png" },
    { titulo: "(Des)Controle", genero: "Drama", ano: "2026", classificacao: "14", poster: "src/img/MoviePoster-a200868f-990a-4c7f-a725-c30d0a388997.png", fonteVideo: "https://youtu.be/o_wJLMmqRt0" }
  ];

  const ADMIN_INICIAL = {
    nome: "Gerente de Conteúdo",
    email: "admin@cinemark.com",
    senha: "admin123",
    perfil: "admin"
  };

  function migrarCaminhosDeImagem() {
    // Migra registros gravados pelo protótipo multi-página ("./img/...")
    // para os caminhos do gerador ("src/img/...").
    try {
      const filmes = ler(CHAVES.filmes, []);
      let mudou = false;
      filmes.forEach((filme) => {
        if (typeof filme.poster === "string" && filme.poster) {
          let novo = filme.poster
            .replace(/^\.\/img\//, "src/img/")
            .replace(/^img\//, "src/img/");
          for (const [antigo, atual] of [
            ["ChatGPT%20Image%2017%20de%20set.%20de%202026,%2016_03_56.png", "categoria-combos.png"],
            ["ChatGPT%20Image%2017%20de%20set.%20de%202026,%2016_04_25.png", "categoria-bebidas.png"],
            ["ChatGPT%20Image%2017%20de%20set.%20de%202026,%2016_04_29.png", "categoria-doces.png"],
            ["ChatGPT%20Image%2017%20de%20set.%20de%202026,%2016_04_36.png", "categoria-pipoca.png"],
            ["ChatGPT%20Image%2017%20de%20set.%20de%202026,%2016_04_40.png", "categoria-salgados.png"]
          ]) {
            novo = novo.split(antigo).join(atual);
          }
          if (novo !== filme.poster) { filme.poster = novo; mudou = true; }
        }
      });
      if (mudou) gravar(CHAVES.filmes, filmes);
    } catch (erro) {
      console.error("Falha ao migrar imagens", erro);
    }
  }

  function semearMensagensDemonstracao() {
    if (localStorage.getItem(CHAVES.mensagens)) return;
    const agora = Date.now();
    gravar(CHAVES.mensagens, [
      {
        id: gerarId(),
        nome: "Maria Souza",
        email: "maria.souza@example.com",
        assunto: "Horários de sábado",
        mensagem: "Olá! Quais são os horários das sessões dubladas no sábado? Quero levar minha família para assistir um filme em cartaz.",
        lida: false,
        respondida: false,
        resposta: "",
        criadaEm: new Date(agora - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: gerarId(),
        nome: "Carlos Lima",
        email: "carlos.lima@example.com",
        assunto: "Elogio ao atendimento",
        mensagem: "Parabéns pelo site! Consegui comprar meus ingressos e escolher os assentos sem dificuldade. O comprovante com o código ficou bem claro.",
        lida: true,
        respondida: true,
        resposta: "Olá, Carlos! Obrigado pelo retorno. Ficamos felizes que a compra tenha funcionado bem para você.",
        criadaEm: new Date(agora - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lidaEm: new Date(agora - 4 * 24 * 60 * 60 * 1000).toISOString(),
        respondidaEm: new Date(agora - 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);
  }

  function semear() {
    if (!localStorage.getItem(CHAVES.filmes)) {
      gravar(
        CHAVES.filmes,
        FILMES_INICIAIS.map((filme) => ({
          id: gerarId(),
          sinopse: "",
          emCartaz: true,
          ...filme
        }))
      );
    }

    const filmes = ler(CHAVES.filmes, []);
    const trailersIniciais = new Map(FILMES_INICIAIS
      .filter((filme) => filme.fonteVideo)
      .map((filme) => [normalizar(filme.titulo), filme.fonteVideo]));
    let catalogoAtualizado = false;
    filmes.forEach((filme) => {
      const fonteVideo = trailersIniciais.get(normalizar(filme.titulo));
      if (fonteVideo && !filme.fonteVideo) {
        filme.fonteVideo = fonteVideo;
        catalogoAtualizado = true;
      }
    });
    if (catalogoAtualizado) gravar(CHAVES.filmes, filmes);

    const usuarios = ler(CHAVES.usuarios, []);
    const temAdmin = usuarios.some((usuario) => usuario.perfil === "admin");

    if (!temAdmin) {
      usuarios.push({
        id: gerarId(),
        criadoEm: new Date().toISOString(),
        ...ADMIN_INICIAL
      });
      gravar(CHAVES.usuarios, usuarios);
    }

    migrarCaminhosDeImagem();
    semearMensagensDemonstracao();
  }

  /* =========================================================
     USUÁRIOS — CRUD
     ========================================================= */

  const usuarios = {
    // READ (todos)
    listar() {
      return ler(CHAVES.usuarios, []);
    },

    // READ (um)
    buscarPorId(id) {
      return this.listar().find((usuario) => usuario.id === id) || null;
    },

    buscarPorEmail(email) {
      const alvo = normalizar(email);
      return this.listar().find((usuario) => normalizar(usuario.email) === alvo) || null;
    },

    // CREATE
    criar({ nome, email, senha, perfil = "cliente", criadoPor = null }) {
      const nomeLimpo = String(nome ?? "").trim();
      const emailLimpo = String(email ?? "").trim().toLowerCase();

      if (!nomeLimpo || !emailLimpo || !senha) {
        return { ok: false, erro: "Preencha nome, e-mail e senha." };
      }

      if (!EMAIL_VALIDO.test(emailLimpo)) {
        return { ok: false, erro: "Informe um e-mail válido." };
      }

      if (!["cliente", "admin"].includes(perfil)) {
        return { ok: false, erro: "O perfil informado é inválido." };
      }

      if (senha.length < 8) {
        return { ok: false, erro: "A senha precisa ter no mínimo 8 caracteres." };
      }

      if (this.buscarPorEmail(emailLimpo)) {
        return { ok: false, erro: "Já existe uma conta com esse e-mail." };
      }

      const novo = {
        id: gerarId(),
        nome: nomeLimpo,
        email: emailLimpo,
        senha,
        perfil,
        criadoPor: perfil === "admin" ? criadoPor : null,
        criadoEm: new Date().toISOString()
      };

      const lista = this.listar();
      lista.push(novo);
      gravar(CHAVES.usuarios, lista);

      return { ok: true, dado: novo };
    },

    // UPDATE
    atualizar(id, dados, { atorId = null } = {}) {
      const lista = this.listar();
      const indice = lista.findIndex((usuario) => usuario.id === id);

      if (indice === -1) {
        return { ok: false, erro: "Usuário não encontrado." };
      }

      const nomeLimpo = dados.nome === undefined
        ? String(lista[indice].nome ?? "").trim()
        : String(dados.nome ?? "").trim();
      const emailLimpo = dados.email === undefined
        ? String(lista[indice].email ?? "").trim().toLowerCase()
        : String(dados.email ?? "").trim().toLowerCase();

      if (!nomeLimpo || !emailLimpo) {
        return { ok: false, erro: "Nome e e-mail são obrigatórios." };
      }

      if (!EMAIL_VALIDO.test(emailLimpo)) {
        return { ok: false, erro: "Informe um e-mail válido." };
      }

      const existente = lista.find(
        (usuario) => normalizar(usuario.email) === normalizar(emailLimpo) && usuario.id !== id
      );
      if (existente) {
        return { ok: false, erro: "Esse e-mail já está em uso por outra conta." };
      }

      const usuarioAtual = lista[indice];
      const ator = lista.find((usuario) => usuario.id === atorId && usuario.perfil === "admin");
      const promovendoAdministrador = usuarioAtual.perfil !== "admin" && dados.perfil === "admin";
      const rebaixandoAdministrador = usuarioAtual.perfil === "admin" && dados.perfil === "cliente";

      if (dados.perfil !== undefined && !["cliente", "admin"].includes(dados.perfil)) {
        return { ok: false, erro: "O perfil informado é inválido." };
      }

      if (promovendoAdministrador && !ator) {
        return { ok: false, erro: "Somente um administrador pode promover uma conta." };
      }

      if (rebaixandoAdministrador) {
        if (lista.filter((usuario) => usuario.perfil === "admin").length <= 1) {
          return { ok: false, erro: "Não é possível rebaixar o último administrador do sistema." };
        }

        if (!ator || atorId === id || usuarioAtual.criadoPor !== atorId) {
          return { ok: false, erro: "Somente o administrador que cadastrou esta conta pode rebaixá-la." };
        }
      }

      if (dados.senha !== undefined && dados.senha !== "" && dados.senha.length < 8) {
        return { ok: false, erro: "A nova senha precisa ter no mínimo 8 caracteres." };
      }

      const atualizado = { ...lista[indice] };

      if (dados.nome !== undefined) atualizado.nome = nomeLimpo;
      if (dados.email !== undefined) atualizado.email = emailLimpo;
      if (dados.perfil !== undefined) atualizado.perfil = dados.perfil;
      if (dados.senha) atualizado.senha = dados.senha;
      if (promovendoAdministrador) atualizado.criadoPor = atorId;
      if (rebaixandoAdministrador) atualizado.criadoPor = null;

      atualizado.atualizadoEm = new Date().toISOString();

      lista[indice] = atualizado;
      gravar(CHAVES.usuarios, lista);

      // Mantém a sessão coerente com o registro editado
      const sessao = Store.sessao.atual();
      if (sessao && sessao.id === id) {
        Store.sessao.abrir(atualizado);
      }

      return { ok: true, dado: atualizado };
    },

    // DELETE
    excluir(id) {
      const lista = this.listar();
      const alvo = lista.find((usuario) => usuario.id === id);

      if (!alvo) {
        return { ok: false, erro: "Usuário não encontrado." };
      }

      const admins = lista.filter((usuario) => usuario.perfil === "admin");
      if (alvo.perfil === "admin" && admins.length === 1) {
        return { ok: false, erro: "Não é possível excluir o último administrador do sistema." };
      }

      gravar(CHAVES.usuarios, lista.filter((usuario) => usuario.id !== id));

      const sessao = Store.sessao.atual();
      if (sessao && sessao.id === id) {
        Store.sessao.encerrar();
      }

      return { ok: true };
    },

    autenticar(email, senha) {
      const usuario = this.buscarPorEmail(email);

      if (!usuario || usuario.senha !== senha) {
        return { ok: false, erro: "E-mail ou senha incorretos." };
      }

      Store.sessao.abrir(usuario);
      return { ok: true, dado: usuario };
    }
  };

  /* =========================================================
     FILMES — CRUD (RF03)
     ========================================================= */

  const filmes = {
    // READ (todos)
    listar() {
      return ler(CHAVES.filmes, []);
    },

    // READ (um)
    buscarPorId(id) {
      return this.listar().find((filme) => filme.id === id) || null;
    },

    validarFonteVideo,
    obterIdYouTube,

    // CREATE
    criar({ titulo, genero, ano, classificacao, poster, sinopse = "", fonteVideo = "", emCartaz = true }) {
      if (!titulo || !genero || !ano || !classificacao) {
        return { ok: false, erro: "Título, gênero, ano e classificação são obrigatórios." };
      }

      const validacaoFonte = validarFonteVideo(fonteVideo);
      if (!validacaoFonte.ok) return { ok: false, erro: validacaoFonte.erro };

      const duplicado = this.listar().some(
        (filme) => normalizar(filme.titulo) === normalizar(titulo)
      );

      if (duplicado) {
        return { ok: false, erro: "Já existe um filme cadastrado com esse título." };
      }

      const novo = {
        id: gerarId(),
        titulo: titulo.trim(),
        genero: genero.trim(),
        ano: String(ano).trim(),
        classificacao: String(classificacao).trim(),
        poster: poster?.trim() || "",
        sinopse: sinopse.trim(),
        fonteVideo: String(fonteVideo ?? "").trim(),
        emCartaz: Boolean(emCartaz),
        criadoEm: new Date().toISOString()
      };

      const lista = this.listar();
      lista.push(novo);
      gravar(CHAVES.filmes, lista);

      return { ok: true, dado: novo };
    },

    // UPDATE
    atualizar(id, dados) {
      const lista = this.listar();
      const indice = lista.findIndex((filme) => filme.id === id);

      if (indice === -1) {
        return { ok: false, erro: "Filme não encontrado." };
      }

      if (dados.fonteVideo !== undefined) {
        const validacaoFonte = validarFonteVideo(dados.fonteVideo);
        if (!validacaoFonte.ok) return { ok: false, erro: validacaoFonte.erro };
        dados = { ...dados, fonteVideo: String(dados.fonteVideo ?? "").trim() };
      }

      if (dados.titulo) {
        const duplicado = lista.some(
          (filme) => filme.id !== id && normalizar(filme.titulo) === normalizar(dados.titulo)
        );
        if (duplicado) {
          return { ok: false, erro: "Já existe outro filme com esse título." };
        }
      }

      const atualizado = {
        ...lista[indice],
        ...dados,
        id: lista[indice].id,
        atualizadoEm: new Date().toISOString()
      };

      lista[indice] = atualizado;
      gravar(CHAVES.filmes, lista);

      return { ok: true, dado: atualizado };
    },

    // DELETE
    excluir(id) {
      const lista = this.listar();

      if (!lista.some((filme) => filme.id === id)) {
        return { ok: false, erro: "Filme não encontrado." };
      }

      gravar(CHAVES.filmes, lista.filter((filme) => filme.id !== id));
      return { ok: true };
    },

    generos() {
      return [...new Set(this.listar().map((filme) => filme.genero))].sort((a, b) =>
        a.localeCompare(b, "pt-BR")
      );
    }
  };

  /* =========================================================
     SESSÃO
     ========================================================= */

  const sessao = {
    abrir(usuario) {
      gravar(CHAVES.sessao, {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      });
    },

    atual() {
      return ler(CHAVES.sessao, null);
    },

    encerrar() {
      localStorage.removeItem(CHAVES.sessao);
    },

    ehAdmin() {
      return this.atual()?.perfil === "admin";
    },

    // Redireciona quem não tem permissão para ver a página
    exigirLogin(destino = "login.html") {
      if (!this.atual()) {
        window.location.href = destino;
        return false;
      }
      return true;
    },

    exigirAdmin(destino = "login.html") {
      if (!this.ehAdmin()) {
        window.location.href = destino;
        return false;
      }
      return true;
    }
  };

  const carrinho = {
    listar() {
      return ler(CHAVES.carrinho, []);
    },

    adicionar(produto, quantidade = 1) {
      const itens = this.listar();
      const existente = itens.find((item) => item.id === produto.id);

      if (existente) {
        existente.quantidade += quantidade;
      } else {
        itens.push({ ...produto, quantidade });
      }

      gravar(CHAVES.carrinho, itens);
      return itens;
    },

    atualizarQuantidade(id, quantidade) {
      const itens = this.listar()
        .map((item) => item.id === id ? { ...item, quantidade } : item)
        .filter((item) => item.quantidade > 0);
      gravar(CHAVES.carrinho, itens);
      return itens;
    },

    remover(id) {
      const itens = this.listar().filter((item) => item.id !== id);
      gravar(CHAVES.carrinho, itens);
      return itens;
    },

    limpar() {
      gravar(CHAVES.carrinho, []);
    }
  };

  const reservas = {
    precosDemonstrativos() {
      return { ...PRECOS_INGRESSO_DEMONSTRATIVOS };
    },

    listar() {
      return ler(CHAVES.reservas, []);
    },

    assentosLiberados(sessaoId) {
      const registros = ler(CHAVES.assentosLiberados, []);
      return (Array.isArray(registros) ? registros : [])
        .filter((registro) => registro && registro.sessaoId === sessaoId)
        .map((registro) => registro.lugar);
    },

    liberarAssento({ sessaoId, lugar, data, horario }) {
      const administrador = sessao.atual();
      if (!administrador || administrador.perfil !== "admin") {
        return { ok: false, erro: "Somente um administrador pode liberar assentos." };
      }
      if (!sessaoId || !/^[A-E][1-8]$/.test(lugar)) {
        return { ok: false, erro: "Sessão ou assento inválido." };
      }
      const inicio = new Date(`${data}T${horario}:00`).getTime();
      if (!Number.isFinite(inicio) || inicio <= Date.now()) {
        return { ok: false, erro: "Só é possível liberar assentos antes do início da sessão." };
      }

      const registros = ler(CHAVES.assentosLiberados, []);
      const liberados = Array.isArray(registros) ? registros : [];
      if (liberados.some((registro) =>
        registro && registro.sessaoId === sessaoId && registro.lugar === lugar
      )) {
        return { ok: true };
      }
      liberados.push({
        sessaoId,
        lugar,
        liberadoEm: new Date().toISOString(),
        liberadoPor: administrador.id
      });
      gravar(CHAVES.assentosLiberados, liberados);
      return { ok: true };
    },

    horarioFim(reserva) {
      const horarioDefinido = reserva.terminaEm ? Date.parse(reserva.terminaEm) : NaN;
      if (Number.isFinite(horarioDefinido)) return horarioDefinido;

      const inicio = new Date(`${reserva.data}T${reserva.horario}:00`);
      return Number.isNaN(inicio.getTime()) ? 0 : inicio.getTime() + 2 * 60 * 60 * 1000;
    },

    lugaresReservados(sessaoId) {
      const liberados = new Set(this.assentosLiberados(sessaoId));
      return this.listar()
        .filter((reserva) => reserva.sessaoId === sessaoId && !reserva.canceladaEm && this.horarioFim(reserva) > Date.now())
        .flatMap((reserva) => reserva.lugares.filter((lugar) => !liberados.has(lugar)));
    },

    // Reservas de um usuário (as antigas, sem usuarioId, são ligadas pelo e-mail).
    listarPorUsuario(usuarioId, email) {
      const alvoEmail = normalizar(email);
      return this.listar()
        .filter((reserva) =>
          (usuarioId && reserva.usuarioId === usuarioId) ||
          (alvoEmail && normalizar(reserva.email) === alvoEmail))
        .sort((a, b) => new Date(b.criadaEm) - new Date(a.criadaEm));
    },

    // Desconto de ingressos da assinatura ativa (0 quando não há).
    descontoPara(usuarioId) {
      if (!usuarioId || typeof assinaturas === "undefined") return { percentual: 0, plano: null };
      const ativa = assinaturas.ativaPara(usuarioId);
      if (!ativa) return { percentual: 0, plano: null };
      const plano = PLANOS.find((p) => p.id === ativa.planoId);
      return { percentual: plano ? plano.descontoIngressos : 0, plano: plano ? plano.nome : null };
    },

    // Cancela uma reserva futura e libera os assentos (mantém o histórico).
    cancelar(id, { usuarioId = null } = {}) {
      const lista = this.listar();
      const indice = lista.findIndex((reserva) => reserva.id === id);
      if (indice === -1) {
        return { ok: false, erro: "Reserva não encontrada." };
      }
      const reserva = lista[indice];
      if (usuarioId && reserva.usuarioId && reserva.usuarioId !== usuarioId) {
        return { ok: false, erro: "Esta reserva pertence a outra conta." };
      }
      if (reserva.canceladaEm) {
        return { ok: false, erro: "Esta reserva já foi cancelada." };
      }
      if (this.horarioFim(reserva) <= Date.now()) {
        return { ok: false, erro: "Esta sessão já terminou e não pode mais ser cancelada." };
      }
      lista[indice] = { ...reserva, canceladaEm: new Date().toISOString() };
      gravar(CHAVES.reservas, lista);
      return { ok: true, dado: lista[indice] };
    },

    reservar({
      sessaoId, filmeId, filmeTitulo, clienteNome, cinema, sala, data, horario, terminaEm, lugares, tipoIngresso,
      usuarioId = null, email = ""
    }) {
      if (!sessaoId || !filmeId || !Array.isArray(lugares) || lugares.length === 0) {
        return { ok: false, erro: "Selecione pelo menos um assento disponível." };
      }
      if (!Object.prototype.hasOwnProperty.call(PRECOS_INGRESSO_DEMONSTRATIVOS, tipoIngresso)) {
        return { ok: false, erro: "Selecione um tipo de ingresso válido." };
      }
      if (!String(clienteNome ?? "").trim()) {
        return { ok: false, erro: "Informe o nome para o comprovante." };
      }
      if (!Number.isFinite(Date.parse(terminaEm)) || Date.parse(terminaEm) <= Date.now()) {
        return { ok: false, erro: "Esta sessão já terminou. Os assentos foram liberados para outras sessões." };
      }
      const inicio = new Date(`${data}T${horario}:00`).getTime();
      if (!Number.isFinite(inicio) || inicio <= Date.now()) {
        return { ok: false, erro: "Esta sessão já começou e não aceita novas reservas." };
      }

      const lugaresValidos = lugares.every((lugar) => /^[A-E][1-8]$/.test(lugar));
      if (!lugaresValidos || new Set(lugares).size !== lugares.length) {
        return { ok: false, erro: "A seleção de assentos é inválida." };
      }

      const lista = this.listar();
      const jaReservados = new Set(this.lugaresReservados(sessaoId));
      const indisponiveis = lugares.filter((lugar) => jaReservados.has(lugar));
      if (indisponiveis.length) {
        return {
          ok: false,
          erro: `Os assentos ${indisponiveis.join(", ")} acabaram de ser reservados. Escolha outros lugares ou horários.`
        };
      }

      const desconto = this.descontoPara(usuarioId);
      const reserva = {
        id: gerarId(),
        codigo: gerarId().slice(-8).toUpperCase(),
        sessaoId,
        filmeId,
        filmeTitulo,
        clienteNome: String(clienteNome).trim(),
        usuarioId: usuarioId || null,
        email: String(email ?? "").trim().toLowerCase(),
        cinema,
        sala,
        data,
        horario,
        terminaEm,
        lugares,
        tipoIngresso,
        valorIngressoCentavos: PRECOS_INGRESSO_DEMONSTRATIVOS[tipoIngresso],
        descontoPercentual: desconto.percentual,
        planoTitulo: desconto.plano,
        valorTotalCentavos: Math.round(
          PRECOS_INGRESSO_DEMONSTRATIVOS[tipoIngresso] * lugares.length *
          (1 - desconto.percentual / 100)),
        criadaEm: new Date().toISOString()
      };
      const liberados = ler(CHAVES.assentosLiberados, []);
      if (Array.isArray(liberados)) {
        gravar(CHAVES.assentosLiberados, liberados.filter((registro) =>
          !registro || registro.sessaoId !== sessaoId || !lugares.includes(registro.lugar)
        ));
      }
      lista.push(reserva);
      gravar(CHAVES.reservas, lista);
      return { ok: true, dado: reserva };
    }
  };

  /* =========================================================
     MENSAGENS DE CONTATO — RF-009 (caixa de entrada do admin)
     O visitante envia pela página de contato; o admin lê,
     marca como lida/respondida e exclui pelo painel.
     ========================================================= */

  const mensagens = {
    // READ (todas, mais recentes primeiro)
    listar() {
      return ler(CHAVES.mensagens, []).sort(
        (a, b) => new Date(b.criadaEm) - new Date(a.criadaEm)
      );
    },

    buscarPorId(id) {
      return this.listar().find((mensagem) => mensagem.id === id) || null;
    },

    // Mensagens enviadas por um e-mail (para "Minhas mensagens")
    listarPorEmail(email) {
      const alvo = normalizar(email);
      return this.listar().filter(
        (mensagem) => normalizar(mensagem.email) === alvo
      );
    },

    naoLidas() {
      return this.listar().filter((mensagem) => !mensagem.lida).length;
    },

    // CREATE (página de contato)
    criar({ nome, email, assunto, mensagem }) {
      const nomeLimpo = String(nome ?? "").trim();
      const emailLimpo = String(email ?? "").trim().toLowerCase();
      const assuntoLimpo = String(assunto ?? "").trim();
      const textoLimpo = String(mensagem ?? "").trim();

      if (!nomeLimpo || !emailLimpo || !assuntoLimpo || !textoLimpo) {
        return { ok: false, erro: "Preencha nome, e-mail, assunto e mensagem." };
      }

      if (!EMAIL_VALIDO.test(emailLimpo)) {
        return { ok: false, erro: "Informe um e-mail válido." };
      }

      if (assuntoLimpo.length < 3) {
        return { ok: false, erro: "O assunto precisa ter pelo menos 3 caracteres." };
      }

      if (textoLimpo.length < 10) {
        return { ok: false, erro: "A mensagem precisa ter pelo menos 10 caracteres." };
      }

      const nova = {
        id: gerarId(),
        nome: nomeLimpo,
        email: emailLimpo,
        assunto: assuntoLimpo,
        mensagem: textoLimpo,
        lida: false,
        respondida: false,
        resposta: "",
        criadaEm: new Date().toISOString()
      };

      const lista = ler(CHAVES.mensagens, []);
      lista.push(nova);
      gravar(CHAVES.mensagens, lista);

      return { ok: true, dado: nova };
    },

    // UPDATE parcial (lida / respondida / resposta)
    atualizar(id, dados) {
      const lista = ler(CHAVES.mensagens, []);
      const indice = lista.findIndex((mensagem) => mensagem.id === id);

      if (indice === -1) {
        return { ok: false, erro: "Mensagem não encontrada." };
      }

      const atualizada = { ...lista[indice] };

      if (dados.lida !== undefined) {
        atualizada.lida = Boolean(dados.lida);
        if (atualizada.lida && !atualizada.lidaEm) {
          atualizada.lidaEm = new Date().toISOString();
        }
        if (!atualizada.lida) delete atualizada.lidaEm;
      }

      if (dados.resposta !== undefined) {
        atualizada.resposta = String(dados.resposta ?? "").trim();
      }

      if (dados.respondida !== undefined) {
        atualizada.respondida = Boolean(dados.respondida);
        if (atualizada.respondida) {
          atualizada.lida = true;
          if (!atualizada.lidaEm) atualizada.lidaEm = new Date().toISOString();
          atualizada.respondidaEm = new Date().toISOString();
        } else {
          delete atualizada.respondidaEm;
        }
      }

      lista[indice] = atualizada;
      gravar(CHAVES.mensagens, lista);

      return { ok: true, dado: atualizada };
    },

    marcarLida(id, lida = true) {
      return this.atualizar(id, { lida });
    },

    responder(id, resposta) {
      const texto = String(resposta ?? "").trim();
      if (!texto) {
        return { ok: false, erro: "Escreva a resposta antes de marcar como respondida." };
      }
      return this.atualizar(id, { resposta: texto, respondida: true });
    },

    // DELETE (uma)
    excluir(id) {
      const lista = ler(CHAVES.mensagens, []);

      if (!lista.some((mensagem) => mensagem.id === id)) {
        return { ok: false, erro: "Mensagem não encontrada." };
      }

      gravar(CHAVES.mensagens, lista.filter((mensagem) => mensagem.id !== id));
      return { ok: true };
    }
  };

  /* =========================================================
     PEDIDOS DA LOJA — checkout, histórico e gestão
     Pagamento simulado no front-end (TCC sem back-end): os dados
     do cartão nunca são armazenados — só o método e, no caso do
     cartão, os últimos 4 dígitos para identificação.
     ========================================================= */

  const pedidos = {
    listar() {
      return ler(CHAVES.pedidos, []).sort(
        (a, b) => new Date(b.criadaEm) - new Date(a.criadaEm)
      );
    },

    buscarPorCodigo(codigo) {
      const alvo = normalizar(codigo);
      return this.listar().find((pedido) => normalizar(pedido.codigo) === alvo) || null;
    },

    listarPorUsuario(usuarioId, email) {
      const alvoEmail = normalizar(email);
      return this.listar().filter((pedido) =>
        (usuarioId && pedido.usuarioId === usuarioId) ||
        (alvoEmail && normalizar(pedido.email) === alvoEmail));
    },

    descontoPara(usuarioId) {
      if (!usuarioId || typeof assinaturas === "undefined") return { percentual: 0, plano: null };
      const ativa = assinaturas.ativaPara(usuarioId);
      if (!ativa) return { percentual: 0, plano: null };
      const plano = PLANOS.find((p) => p.id === ativa.planoId);
      return { percentual: plano ? plano.descontoLoja : 0, plano: plano ? plano.nome : null };
    },

    criar({ itens, clienteNome, email, usuarioId = null, pagamento, unidade }) {
      const nomeLimpo = String(clienteNome ?? "").trim();
      const emailLimpo = String(email ?? "").trim().toLowerCase();
      const lista = Array.isArray(itens) ? itens : [];

      if (!lista.length) {
        return { ok: false, erro: "Seu carrinho está vazio." };
      }
      if (!nomeLimpo) {
        return { ok: false, erro: "Informe o nome de quem vai retirar o pedido." };
      }
      if (!EMAIL_VALIDO.test(emailLimpo)) {
        return { ok: false, erro: "Informe um e-mail válido para o pedido." };
      }
      const metodo = pagamento?.metodo;
      if (!["balcao", "pix", "cartao"].includes(metodo)) {
        return { ok: false, erro: "Escolha uma forma de pagamento." };
      }
      if (metodo === "cartao") {
        const numero = String(pagamento.numero ?? "").replace(/\D/g, "");
        if (numero.length < 13 || numero.length > 19) {
          return { ok: false, erro: "O número do cartão é inválido." };
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(String(pagamento.validade ?? ""))) {
          return { ok: false, erro: "A validade do cartão é inválida. Use o formato MM/AA." };
        }
        if (!/^\d{3,4}$/.test(String(pagamento.cvv ?? ""))) {
          return { ok: false, erro: "O código de segurança do cartão é inválido." };
        }
        if (!String(pagamento.titular ?? "").trim()) {
          return { ok: false, erro: "Informe o nome impresso no cartão." };
        }
      }

      const desconto = this.descontoPara(usuarioId);
      const itensPedido = lista.map((item) => ({
        nome: String(item.nome ?? "").trim(),
        categoria: String(item.categoria ?? "").trim(),
        tamanho: String(item.tamanho ?? "").trim(),
        precoCentavos: Math.round(Number(item.preco) * 100) || 0,
        quantidade: Math.min(99, Math.max(1, Number(item.quantidade) || 1))
      }));
      const subtotal = itensPedido.reduce((soma, item) => soma + item.precoCentavos * item.quantidade, 0);

      const pedido = {
        id: gerarId(),
        codigo: gerarId().slice(-8).toUpperCase(),
        itens: itensPedido,
        subtotalCentavos: subtotal,
        descontoPercentual: desconto.percentual,
        planoTitulo: desconto.plano,
        totalCentavos: Math.round(subtotal * (1 - desconto.percentual / 100)),
        clienteNome: nomeLimpo,
        email: emailLimpo,
        usuarioId: usuarioId || null,
        unidade: String(unidade ?? "Balcão do cinema").trim(),
        pagamento: {
          metodo,
          ultimos4: metodo === "cartao" ? String(pagamento.numero).replace(/\D/g, "").slice(-4) : null
        },
        status: "confirmado",
        criadaEm: new Date().toISOString()
      };

      const todos = ler(CHAVES.pedidos, []);
      todos.push(pedido);
      gravar(CHAVES.pedidos, todos);
      return { ok: true, dado: pedido };
    },

    atualizarStatus(id, status, { atorAdmin = false } = {}) {
      const validos = ["confirmado", "pronto", "entregue", "cancelado"];
      if (!validos.includes(status)) {
        return { ok: false, erro: "Status inválido." };
      }
      if (!atorAdmin) {
        return { ok: false, erro: "Somente a equipe pode alterar o status do pedido." };
      }
      const todos = ler(CHAVES.pedidos, []);
      const indice = todos.findIndex((pedido) => pedido.id === id);
      if (indice === -1) {
        return { ok: false, erro: "Pedido não encontrado." };
      }
      todos[indice] = { ...todos[indice], status, atualizadoEm: new Date().toISOString() };
      gravar(CHAVES.pedidos, todos);
      return { ok: true, dado: todos[indice] };
    },

    cancelar(id, { usuarioId = null } = {}) {
      const todos = ler(CHAVES.pedidos, []);
      const indice = todos.findIndex((pedido) => pedido.id === id);
      if (indice === -1) {
        return { ok: false, erro: "Pedido não encontrado." };
      }
      const pedido = todos[indice];
      if (usuarioId && pedido.usuarioId && pedido.usuarioId !== usuarioId) {
        return { ok: false, erro: "Este pedido pertence a outra conta." };
      }
      if (pedido.status !== "confirmado") {
        return { ok: false, erro: "Este pedido já está em preparo e não pode mais ser cancelado." };
      }
      todos[indice] = { ...pedido, status: "cancelado", atualizadoEm: new Date().toISOString() };
      gravar(CHAVES.pedidos, todos);
      return { ok: true, dado: todos[indice] };
    }
  };

  /* =========================================================
     ASSINATURAS — planos Lite / Plus / Ultra
     A cobrança é simulada no front-end (TCC sem back-end):
     valida os dados do pagamento, registra a assinatura com
     30 dias de validade e aplica os descontos do plano.
     ========================================================= */

  const assinaturas = {
    planos() {
      return PLANOS.map((plano) => ({ ...plano, beneficios: [...plano.beneficios] }));
    },

    buscarPlano(id) {
      return PLANOS.find((plano) => plano.id === id) || null;
    },

    listar() {
      return ler(CHAVES.assinaturas, []).sort(
        (a, b) => new Date(b.criadaEm) - new Date(a.criadaEm)
      );
    },

    listarPorUsuario(usuarioId) {
      return this.listar().filter((assinatura) => assinatura.usuarioId === usuarioId);
    },

    ativaPara(usuarioId) {
      if (!usuarioId) return null;
      const agora = Date.now();
      return this.listarPorUsuario(usuarioId).find(
        (assinatura) => assinatura.status === "ativa" && Date.parse(assinatura.fimEm) > agora
      ) || null;
    },

    assinar({ usuarioId, planoId, pagamento }) {
      if (!usuarioId) {
        return { ok: false, erro: "Entre na sua conta para assinar um plano." };
      }
      const plano = this.buscarPlano(planoId);
      if (!plano) {
        return { ok: false, erro: "Plano inválido." };
      }
      const metodo = pagamento?.metodo;
      if (!["pix", "cartao"].includes(metodo)) {
        return { ok: false, erro: "Escolha uma forma de pagamento." };
      }
      if (metodo === "cartao") {
        const numero = String(pagamento.numero ?? "").replace(/\D/g, "");
        if (numero.length < 13 || numero.length > 19) {
          return { ok: false, erro: "O número do cartão é inválido." };
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(String(pagamento.validade ?? ""))) {
          return { ok: false, erro: "A validade do cartão é inválida. Use o formato MM/AA." };
        }
        if (!/^\d{3,4}$/.test(String(pagamento.cvv ?? ""))) {
          return { ok: false, erro: "O código de segurança do cartão é inválido." };
        }
        if (!String(pagamento.titular ?? "").trim()) {
          return { ok: false, erro: "Informe o nome impresso no cartão." };
        }
      }

      const agora = new Date();
      const fim = new Date(agora.getTime() + 30 * 24 * 60 * 60 * 1000);
      const todos = ler(CHAVES.assinaturas, []);
      // Assinatura anterior é encerrada ao trocar de plano.
      todos.forEach((assinatura) => {
        if (assinatura.usuarioId === usuarioId && assinatura.status === "ativa") {
          assinatura.status = "substituida";
          assinatura.atualizadoEm = agora.toISOString();
        }
      });
      const nova = {
        id: gerarId(),
        codigo: gerarId().slice(-8).toUpperCase(),
        usuarioId,
        planoId: plano.id,
        planoNome: plano.nome,
        precoCentavos: Math.round(plano.preco * 100),
        pagamento: {
          metodo,
          ultimos4: metodo === "cartao" ? String(pagamento.numero).replace(/\D/g, "").slice(-4) : null
        },
        status: "ativa",
        inicioEm: agora.toISOString(),
        fimEm: fim.toISOString(),
        criadaEm: agora.toISOString()
      };
      todos.push(nova);
      gravar(CHAVES.assinaturas, todos);
      return { ok: true, dado: nova };
    },

    cancelar(usuarioId) {
      const todos = ler(CHAVES.assinaturas, []);
      const ativa = todos.find(
        (assinatura) => assinatura.usuarioId === usuarioId && assinatura.status === "ativa"
      );
      if (!ativa) {
        return { ok: false, erro: "Você não tem uma assinatura ativa." };
      }
      ativa.status = "cancelada";
      ativa.atualizadoEm = new Date().toISOString();
      gravar(CHAVES.assinaturas, todos);
      return { ok: true, dado: ativa };
    }
  };

  /* =========================================================
     RECUPERAÇÃO DE SENHA — código com validade curta
     Sem back-end não há envio de e-mail: o código é exibido
     na tela como "e-mail simulado" para concluir o fluxo.
     ========================================================= */

  const CODIGO_RECUPERACAO_MINUTOS = 15;

  function gerarCodigoRecuperacao(email) {
    const usuario = usuarios.buscarPorEmail(email);
    if (!usuario) {
      return { ok: false, erro: "Não encontramos nenhuma conta com esse e-mail." };
    }
    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    const registros = ler(CHAVES.recuperacoes, []).filter(
      (registro) => Date.parse(registro.expiraEm) > Date.now()
    );
    registros.push({
      email: usuario.email,
      codigo,
      tentativas: 0,
      expiraEm: new Date(Date.now() + CODIGO_RECUPERACAO_MINUTOS * 60 * 1000).toISOString(),
      criadaEm: new Date().toISOString()
    });
    gravar(CHAVES.recuperacoes, registros);
    return { ok: true, dado: { email: usuario.email, codigo, expiraEm: registros[registros.length - 1].expiraEm } };
  }

  function redefinirSenha(email, codigo, novaSenha) {
    const registros = ler(CHAVES.recuperacoes, []);
    const indice = registros.map((registro) => normalizar(registro.email)).lastIndexOf(normalizar(email));
    if (indice === -1) {
      return { ok: false, erro: "Solicite um novo código de recuperação." };
    }
    const registro = registros[indice];
    if (Date.parse(registro.expiraEm) <= Date.now()) {
      gravar(CHAVES.recuperacoes, registros.filter((_, i) => i !== indice));
      return { ok: false, erro: "O código expirou. Solicite um novo código." };
    }
    registro.tentativas += 1;
    if (registro.tentativas > 5) {
      gravar(CHAVES.recuperacoes, registros.filter((_, i) => i !== indice));
      return { ok: false, erro: "Muitas tentativas. Solicite um novo código." };
    }
    if (registro.codigo !== String(codigo ?? "").trim()) {
      gravar(CHAVES.recuperacoes, registros);
      return { ok: false, erro: "Código incorreto. Confira e tente de novo." };
    }
    if (!novaSenha || novaSenha.length < 8) {
      gravar(CHAVES.recuperacoes, registros);
      return { ok: false, erro: "A nova senha precisa ter no mínimo 8 caracteres." };
    }
    const usuario = usuarios.buscarPorEmail(email);
    if (!usuario) {
      return { ok: false, erro: "Conta não encontrada." };
    }
    const resultado = usuarios.atualizar(usuario.id, { senha: novaSenha });
    if (!resultado.ok) return resultado;
    gravar(CHAVES.recuperacoes, registros.filter((_, i) => i !== indice));
    return { ok: true };
  }

  /* ---------- reset (útil para apresentação/banca) ---------- */

  function restaurarPadrao() {
    localStorage.removeItem(CHAVES.filmes);
    localStorage.removeItem(CHAVES.usuarios);
    localStorage.removeItem(CHAVES.sessao);
    localStorage.removeItem(CHAVES.reservas);
    localStorage.removeItem(CHAVES.assentosLiberados);
    localStorage.removeItem(CHAVES.mensagens);
    localStorage.removeItem(CHAVES.pedidos);
    localStorage.removeItem(CHAVES.assinaturas);
    localStorage.removeItem(CHAVES.recuperacoes);
    semear();
  }

  semear();

  return { usuarios, filmes, sessao, carrinho, reservas, mensagens, pedidos, assinaturas, gerarCodigoRecuperacao, redefinirSenha, restaurarPadrao, normalizar, CHAVES };
})();
