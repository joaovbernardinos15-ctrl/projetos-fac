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
    sessao: "cinemark:sessao"
  };

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

  /* ---------- seed (dados iniciais) ---------- */

  const FILMES_INICIAIS = [
    { titulo: "A Odisseia", genero: "Ação", ano: "2026", classificacao: "14", poster: "./img/MoviePoster-8ad878d5-f2a3-46d4-9f34-b07cf40b1541.png" },
    { titulo: "Cansei de Ser Nerd", genero: "Comédia", ano: "2026", classificacao: "12", poster: "./img/MoviePoster-7b391aed-202c-47c4-81f8-426cca8ff7d4.png" },
    { titulo: "Colegas e o Herdeiro", genero: "Comédia", ano: "2026", classificacao: "12", poster: "./img/MoviePoster-4b578907-005f-4257-9448-684e6f52b1c4.png" },
    { titulo: "Coyote vs. Acme", genero: "Comédia", ano: "2026", classificacao: "L", poster: "./img/MoviePoster-908f3c4f-27e4-4e30-a057-ad6fb93992d5.png" },
    { titulo: "Homem-Aranha: Um Novo Dia", genero: "Ação", ano: "2026", classificacao: "12", poster: "./img/MoviePoster-11e62ed3-b0b0-42ae-97b8-54b881bc2bee.png" },
    { titulo: "Michael", genero: "Drama", ano: "2026", classificacao: "12", poster: "./img/MoviePoster-39a47201-3b75-4d07-b96a-02610d9885a9.png" },
    { titulo: "Muito Prazer", genero: "Comédia", ano: "2026", classificacao: "12", poster: "./img/MoviePoster-532e35b5-8c6a-4b0b-9f57-e40d06d35940.png" },
    { titulo: "O Advogado do Diabo", genero: "Drama", ano: "2026", classificacao: "16", poster: "./img/MoviePoster-4a554ccc-f36c-4236-9d02-90c364e40816.png" },
    { titulo: "O Fim da Rua", genero: "Drama", ano: "2026", classificacao: "12", poster: "./img/MoviePoster-6ae2213a-1124-4e3b-94c0-9b0480aa6b82.png" },
    { titulo: "O Gênio do Crime", genero: "Comédia", ano: "2026", classificacao: "12", poster: "./img/MoviePoster-1d439958-eb6d-4749-bd17-16e3caff4ce4.png" },
    { titulo: "Ponto Sem Retorno", genero: "Ação", ano: "2026", classificacao: "12", poster: "./img/MoviePoster-6bba3710-5068-4f38-8597-2271a4271b2a.png" },
    { titulo: "Patrulha Canina: Uma Aventura Dino", genero: "Ficção", ano: "2026", classificacao: "L", poster: "./img/MoviePoster-94f73a7f-62a1-44cb-a01a-2e32eaa87efc.png" },
    { titulo: "Só Por Uma Noite", genero: "Drama", ano: "2026", classificacao: "12", poster: "./img/MoviePoster-75453a35-a69e-43bc-b312-b1d6a30cbfe7.png" },
    { titulo: "Sobrenatural: Agora Entre Nós", genero: "Terror", ano: "2026", classificacao: "14", poster: "./img/MoviePoster-36bc59f8-4d4f-41c9-aee9-dc6cee2a9784.png" },
    { titulo: "Túmulo dos Vagalumes", genero: "Animação", ano: "2026", classificacao: "12", poster: "./img/MoviePoster-8270e450-9ede-4618-a15d-5f67292667cb.png" },
    { titulo: "Vingadores", genero: "Ação", ano: "2026", classificacao: "12", poster: "./img/MoviePoster-9acd854c-c1cd-43ab-a1ca-db1cebbcae2c.png" },
    { titulo: "(Des)Controle", genero: "Drama", ano: "2026", classificacao: "14", poster: "./img/MoviePoster-a200868f-990a-4c7f-a725-c30d0a388997.png" }
  ];

  const ADMIN_INICIAL = {
    nome: "Gerente de Conteúdo",
    email: "admin@cinemark.com",
    senha: "admin123",
    perfil: "admin"
  };

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
    criar({ nome, email, senha, perfil = "cliente" }) {
      if (!nome || !email || !senha) {
        return { ok: false, erro: "Preencha nome, e-mail e senha." };
      }

      if (senha.length < 8) {
        return { ok: false, erro: "A senha precisa ter no mínimo 8 caracteres." };
      }

      if (this.buscarPorEmail(email)) {
        return { ok: false, erro: "Já existe uma conta com esse e-mail." };
      }

      const novo = {
        id: gerarId(),
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
        perfil,
        criadoEm: new Date().toISOString()
      };

      const lista = this.listar();
      lista.push(novo);
      gravar(CHAVES.usuarios, lista);

      return { ok: true, dado: novo };
    },

    // UPDATE
    atualizar(id, dados) {
      const lista = this.listar();
      const indice = lista.findIndex((usuario) => usuario.id === id);

      if (indice === -1) {
        return { ok: false, erro: "Usuário não encontrado." };
      }

      if (dados.email) {
        const existente = this.buscarPorEmail(dados.email);
        if (existente && existente.id !== id) {
          return { ok: false, erro: "Esse e-mail já está em uso por outra conta." };
        }
      }

      if (dados.senha !== undefined && dados.senha !== "" && dados.senha.length < 8) {
        return { ok: false, erro: "A nova senha precisa ter no mínimo 8 caracteres." };
      }

      const atualizado = { ...lista[indice] };

      if (dados.nome !== undefined) atualizado.nome = dados.nome.trim();
      if (dados.email !== undefined) atualizado.email = dados.email.trim().toLowerCase();
      if (dados.perfil !== undefined) atualizado.perfil = dados.perfil;
      if (dados.senha) atualizado.senha = dados.senha;

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

    // CREATE
    criar({ titulo, genero, ano, classificacao, poster, sinopse = "", emCartaz = true }) {
      if (!titulo || !genero || !ano || !classificacao) {
        return { ok: false, erro: "Título, gênero, ano e classificação são obrigatórios." };
      }

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

  /* ---------- reset (útil para apresentação/banca) ---------- */

  function restaurarPadrao() {
    localStorage.removeItem(CHAVES.filmes);
    localStorage.removeItem(CHAVES.usuarios);
    localStorage.removeItem(CHAVES.sessao);
    semear();
  }

  semear();

  return { usuarios, filmes, sessao, restaurarPadrao, normalizar, CHAVES };
})();
