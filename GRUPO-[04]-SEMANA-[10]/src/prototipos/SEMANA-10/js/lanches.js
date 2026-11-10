(() => {
  const catalogo = window.CATALOGO_LANCHES;
  const atalhos = document.getElementById("atalhosCardapio");
  const conteudo = document.getElementById("categoriasCardapio");
  const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  function criarIcone(nome) {
    const icone = document.createElement("i");
    icone.className = `fa-solid ${nome}`;
    icone.setAttribute("aria-hidden", "true");
    return icone;
  }

  function criarSlug(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  Object.entries(catalogo).forEach(([categoria, dados]) => {
    const idCategoria = `categoria-${criarSlug(categoria)}`;
    const atalho = document.createElement("a");
    atalho.href = `#${idCategoria}`;
    atalho.append(criarIcone(dados.icone), document.createTextNode(categoria));
    atalhos.append(atalho);

    const secao = document.createElement("section");
    secao.className = "menu-categoria";
    secao.id = idCategoria;

    const cabecalho = document.createElement("header");
    cabecalho.className = "menu-categoria-cabecalho";

    const imagem = document.createElement(dados.imagem ? "img" : "div");
    imagem.className = "menu-categoria-imagem";
    if (dados.imagem) {
      imagem.src = dados.imagem;
      imagem.alt = dados.alt;
      imagem.loading = "lazy";
    } else {
      imagem.classList.add("menu-categoria-icone");
      imagem.setAttribute("aria-hidden", "true");
      imagem.append(criarIcone(dados.icone));
    }

    const titulo = document.createElement("div");
    titulo.className = "menu-categoria-titulo";

    const etiqueta = document.createElement("span");
    etiqueta.className = "menu-categoria-etiqueta";
    etiqueta.append(criarIcone(dados.icone), document.createTextNode(categoria));

    const heading = document.createElement("h2");
    heading.textContent = categoria;

    const descricao = document.createElement("p");
    descricao.textContent = dados.descricao;

    titulo.append(etiqueta, heading, descricao);
    cabecalho.append(imagem, titulo);

    const produtos = document.createElement("div");
    produtos.className = "menu-produtos";

    Object.entries(dados.itens).forEach(([nome, produto]) => {
      const opcoes = Array.isArray(produto.opcoes) ? produto.opcoes : [];
      const precoInicial = opcoes[0]?.preco ?? produto.preco;
      const tamanhos = opcoes.length
        ? opcoes.map((opcao) => opcao.tamanho).join(" · ")
        : produto.tamanho;
      const precoAcessivel = opcoes.length
        ? `a partir de ${moeda.format(precoInicial)}`
        : moeda.format(precoInicial);
      const link = document.createElement("a");
      link.className = "menu-produto";
      link.href = `comprar.html?${new URLSearchParams({ categoria, item: nome })}`;
      link.setAttribute("aria-label", `Ver ${nome}, ${tamanhos}, ${precoAcessivel}`);

      const nomeProduto = document.createElement("h3");
      nomeProduto.textContent = nome;

      const tamanhoProduto = document.createElement("span");
      tamanhoProduto.className = "menu-produto-tamanho";
      tamanhoProduto.textContent = tamanhos;

      const descricaoProduto = document.createElement("p");
      descricaoProduto.textContent = produto.descricao;

      const rodape = document.createElement("span");
      rodape.className = "menu-produto-rodape";

      const preco = document.createElement("strong");
      preco.textContent = opcoes.length
        ? `A partir de ${moeda.format(precoInicial)}`
        : moeda.format(precoInicial);

      const chamada = document.createElement("span");
      chamada.className = "menu-produto-comprar";
      chamada.append(document.createTextNode("Comprar "), criarIcone("fa-arrow-right"));

      rodape.append(preco, chamada);
      link.append(nomeProduto, tamanhoProduto, descricaoProduto, rodape);
      produtos.append(link);
    });

    secao.append(cabecalho, produtos);
    conteudo.append(secao);
  });
})();