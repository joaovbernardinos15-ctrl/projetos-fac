(() => {
  const catalogo = window.CATALOGO_LANCHES;
  const parametros = new URLSearchParams(window.location.search);
  const categoria = parametros.get("categoria");
  const nome = parametros.get("item");
  const produto = catalogo[categoria]?.itens?.[nome];
  const campoQuantidade = document.getElementById("quantidade");
  const listaCarrinho = document.getElementById("itensCarrinho");
  const formatoMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  if (produto) {
    document.title = `Cinemark - ${nome}`;
    document.getElementById("produtoCategoria").textContent = categoria;
    document.getElementById("produtoNome").textContent = nome;
    document.getElementById("produtoDescricao").textContent = produto.descricao;
    document.getElementById("produtoPreco").textContent = formatoMoeda.format(produto.preco);
    document.getElementById("voltarCategoria").href = `lanches.html#categoria-${categoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}`;
  } else {
    document.getElementById("produtoNome").textContent = "Produto não encontrado";
    document.getElementById("produtoDescricao").textContent = "Volte ao cardápio e escolha um item disponível.";
    document.getElementById("produtoPreco").textContent = "";
    campoQuantidade.disabled = true;
    document.getElementById("adicionarCarrinho").disabled = true;
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
      quantidade.setAttribute("aria-label", `Quantidade de ${item.nome}`);
      quantidade.addEventListener("change", () => {
        const novaQuantidade = Math.min(99, Math.max(0, Number(quantidade.value) || 0));
        Store.carrinho.atualizarQuantidade(item.id, novaQuantidade);
        renderizarCarrinho();
      });

      const remover = document.createElement("button");
      remover.className = "remover-item";
      remover.type = "button";
      remover.setAttribute("aria-label", `Remover ${item.nome} do carrinho`);
      remover.innerHTML = '<i class="fa-solid fa-trash-can" aria-hidden="true"></i>';
      remover.addEventListener("click", () => {
        Store.carrinho.remover(item.id);
        renderizarCarrinho();
      });

      controles.append(quantidade, remover);
      linha.append(titulo, preco, controles);
      listaCarrinho.append(linha);
    });

    document.getElementById("quantidadeCarrinho").textContent = `${totalUnidades} ${totalUnidades === 1 ? "item" : "itens"}`;
    document.getElementById("totalCarrinho").textContent = formatoMoeda.format(total);
    document.getElementById("carrinhoVazio").hidden = itens.length > 0;
    document.getElementById("finalizarCompra").disabled = itens.length === 0;
  }

  document.getElementById("adicionarCarrinho").addEventListener("click", () => {
    const quantidade = Math.min(99, Math.max(1, Number(campoQuantidade.value) || 1));
    campoQuantidade.value = quantidade;
    Store.carrinho.adicionar({
      id: `${categoria}:${nome}`,
      categoria,
      nome,
      preco: produto.preco
    }, quantidade);
    document.getElementById("mensagemCompra").textContent = `${nome} adicionado ao carrinho.`;
    document.getElementById("mensagemFinalizacao").textContent = "";
    renderizarCarrinho();
  });

  document.getElementById("finalizarCompra").addEventListener("click", () => {
    Store.carrinho.limpar();
    renderizarCarrinho();
    document.getElementById("mensagemFinalizacao").textContent = "Compra demonstrativa concluída. Obrigado!";
    document.getElementById("mensagemCompra").textContent = "";
  });

  renderizarCarrinho();
})();