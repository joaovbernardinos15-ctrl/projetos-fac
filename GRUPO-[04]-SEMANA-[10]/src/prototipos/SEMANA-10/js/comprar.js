(() => {
  const catalogo = window.CATALOGO_LANCHES;
  const parametros = new URLSearchParams(window.location.search);
  const categoria = parametros.get("categoria");
  const nome = parametros.get("item");
  const produto = catalogo[categoria]?.itens?.[nome];
  const campoQuantidade = document.getElementById("quantidade");
  const listaCarrinho = document.getElementById("itensCarrinho");
  const formatoMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const opcoesVariantes = Array.isArray(produto?.opcoes) ? produto.opcoes : [];
  const varianteGrupo = document.getElementById("varianteCompraGrupo");
  const varianteSelect = document.getElementById("varianteCompra");
  const produtoDescricao = document.getElementById("produtoDescricao");
  const produtoPreco = document.getElementById("produtoPreco");
  const contaAutenticada = ["cliente", "admin"].includes(Store.sessao.atual()?.perfil);
  let varianteSelecionada = opcoesVariantes[0] || null;

  if (produto) {
    document.title = `Cinemark - ${nome}`;
    document.getElementById("produtoCategoria").textContent = categoria;
    document.getElementById("produtoNome").textContent = nome;
    if (opcoesVariantes.length) {
      varianteGrupo.hidden = false;
      varianteSelect.replaceChildren(...opcoesVariantes.map((opcao) => {
        const item = document.createElement("option");
        item.value = opcao.id;
        item.textContent = `${opcao.tamanho} · ${formatoMoeda.format(opcao.preco)}`;
        return item;
      }));
      varianteSelect.disabled = !contaAutenticada;
      varianteSelect.addEventListener("change", () => {
        varianteSelecionada = opcoesVariantes.find((opcao) => opcao.id === varianteSelect.value);
        atualizarDetalheProduto();
      });
    }
    atualizarDetalheProduto();
    document.getElementById("voltarCategoria").href = `lanches.html#categoria-${categoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}`;
    campoQuantidade.disabled = !contaAutenticada;
    document.getElementById("adicionarCarrinho").disabled = !contaAutenticada;
    document.getElementById("loginCompraAviso").hidden = contaAutenticada;
  } else {
    document.getElementById("produtoNome").textContent = "Produto não encontrado";
    produtoDescricao.textContent = "Volte ao cardápio e escolha um item disponível.";
    produtoPreco.textContent = "";
    campoQuantidade.disabled = true;
    document.getElementById("adicionarCarrinho").disabled = true;
  }

  function atualizarDetalheProduto() {
    if (!produto) return;
    const tamanho = varianteSelecionada?.tamanho || produto.tamanho;
    const preco = varianteSelecionada?.preco ?? produto.preco;
    produtoDescricao.textContent = `${tamanho ? `${tamanho} · ` : ""}${produto.descricao}`;
    produtoPreco.textContent = formatoMoeda.format(preco);
  }

  function renderizarCarrinho() {
    const itens = Store.carrinho.listar();
    const totalUnidades = itens.reduce((soma, item) => soma + item.quantidade, 0);
    const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

    listaCarrinho.replaceChildren();
    itens.forEach((item) => {
      const linha = document.createElement("li");
      linha.className = "item-carrinho";

      const titulo = document.createElement("strong");
      titulo.textContent = `${item.nome} · ${item.categoria}`;

      const detalhe = document.createElement("span");
      detalhe.className = "item-carrinho-detalhe";
      detalhe.textContent = item.tamanho || "";

      const preco = document.createElement("span");
      preco.className = "item-carrinho-preco";
      preco.textContent = formatoMoeda.format(item.preco * item.quantidade);

      const controles = document.createElement("div");
      controles.className = "item-carrinho-controles";

      const quantidade = document.createElement("input");
      quantidade.className = "quantidade-item";
      quantidade.type = "number";
      quantidade.min = "0";
      quantidade.max = "99";
      quantidade.value = item.quantidade;
      quantidade.disabled = !contaAutenticada;
      quantidade.setAttribute("aria-label", `Quantidade de ${item.nome}`);
      quantidade.addEventListener("change", () => {
        const novaQuantidade = Math.min(99, Math.max(0, Number(quantidade.value) || 0));
        Store.carrinho.atualizarQuantidade(item.id, novaQuantidade);
        renderizarCarrinho();
      });

      const remover = document.createElement("button");
      remover.className = "remover-item";
      remover.type = "button";
      remover.disabled = !contaAutenticada;
      remover.setAttribute("aria-label", `Remover ${item.nome} do carrinho`);
      remover.innerHTML = '<i class="fa-solid fa-trash-can" aria-hidden="true"></i>';
      remover.addEventListener("click", () => {
        Store.carrinho.remover(item.id);
        renderizarCarrinho();
      });

      controles.append(quantidade, remover);
      linha.append(titulo, preco, detalhe, controles);
      listaCarrinho.append(linha);
    });

    document.getElementById("quantidadeCarrinho").textContent = `${totalUnidades} ${totalUnidades === 1 ? "item" : "itens"}`;
    document.getElementById("totalCarrinho").textContent = formatoMoeda.format(total);
    document.getElementById("carrinhoVazio").hidden = itens.length > 0;
    document.getElementById("finalizarCompra").disabled = itens.length === 0 || !contaAutenticada;
    document.getElementById("loginCarrinhoAviso").hidden = contaAutenticada;
  }

  document.getElementById("adicionarCarrinho").addEventListener("click", () => {
    if (!contaAutenticada) return;
    const quantidade = Math.min(99, Math.max(1, Number(campoQuantidade.value) || 1));
    campoQuantidade.value = quantidade;
    const preco = varianteSelecionada?.preco ?? produto.preco;
    const tamanho = varianteSelecionada?.tamanho || produto.tamanho || "";
    Store.carrinho.adicionar({
      id: `${categoria}:${nome}:${varianteSelecionada?.id || "padrao"}`,
      categoria,
      nome,
      preco,
      tamanho,
      descricao: produto.descricao
    }, quantidade);
    document.getElementById("mensagemCompra").textContent =
      `${nome}${tamanho ? ` (${tamanho})` : ""} adicionado ao carrinho.`;
    document.getElementById("mensagemFinalizacao").textContent = "";
    renderizarCarrinho();
  });

  document.getElementById("finalizarCompra").addEventListener("click", () => {
    if (!contaAutenticada) return;
    Store.carrinho.limpar();
    renderizarCarrinho();
    document.getElementById("mensagemFinalizacao").textContent = "Compra demonstrativa concluída. Obrigado!";
    document.getElementById("mensagemCompra").textContent = "";
  });

  renderizarCarrinho();
})();