/* =========================================================
   CINEMARK — LOJA (pg-loja.js)
   Cardápio, detalhe da categoria e compra com carrinho.
   Adaptado do protótipo (lanches.js + comprar.js + menu-data).
   ========================================================= */

(() => {
  function slug(texto) {
    return String(texto)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");
  }

  /* =========================================================
     LOJA (cardápio completo)
     ========================================================= */

  function renderLoja() {
    const catalogo = window.CATALOGO_LANCHES;

    App.$("app").innerHTML =
      '<header class="contato-hero lanches-hero">' +
      '<span class="lanches-kicker"><i class="fa-solid fa-utensils" aria-hidden="true"></i> LOJA CINEMARK</span>' +
      "<h1>Lanches e brinquedos</h1>" +
      "<p>Escolha algo para acompanhar o filme ou levar a diversão para casa.</p>" +
      '<button class="lanches-hero-cta" id="explorarCardapio" type="button">Explorar cardápio <i class="fa-solid fa-arrow-down" aria-hidden="true"></i></button>' +
      '<div class="lanches-hero-destaques" aria-label="Destaques da loja">' +
      "<span><i class=\"fa-solid fa-bowl-food\" aria-hidden=\"true\"></i> Clássicos do cinema</span>" +
      "<span><i class=\"fa-solid fa-box-open\" aria-hidden=\"true\"></i> Combos para compartilhar</span>" +
      "<span><i class=\"fa-solid fa-puzzle-piece\" aria-hidden=\"true\"></i> Diversão para levar</span>" +
      "</div></header>" +
      '<main class="cardapio-shell"><section class="cardapio">' +
      '<nav class="cardapio-categorias" id="atalhosCardapio" aria-label="Categorias do cardápio"></nav>' +
      '<div class="cardapio-categorias-lista" id="categoriasCardapio"></div>' +
      '<p class="cardapio-nota">Preços válidos para retirada no balcão do cinema.</p>' +
      "</section></main>" +
      '<footer class="site-footer">© 2026 Cinemark. Todos os direitos reservados.<nav class="rodape-links" aria-label="Links do rodapé"><a href="#/ajuda">Ajuda</a><a href="#/contato">Contato</a><a href="#/ingressos">Meus ingressos</a></nav></footer>';

    const atalhos = App.$("atalhosCardapio");
    const conteudo = App.$("categoriasCardapio");

    Object.entries(catalogo).forEach(([categoria, dados]) => {
      const idCategoria = "categoria-" + slug(categoria);
      const atalho = document.createElement("button");
      atalho.type = "button";
      atalho.className = "cardapio-atalho";
      atalho.innerHTML = '<i class="fa-solid ' + dados.icone + '" aria-hidden="true"></i> ' + App.esc(categoria);
      atalho.setAttribute("aria-label", "Ir para " + categoria);
      atalho.addEventListener("click", () => {
        App.$("app").querySelector("#" + CSS.escape(idCategoria))
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      atalhos.append(atalho);

      const secao = document.createElement("section");
      secao.className = "menu-categoria";
      secao.id = idCategoria;

      const imagemHtml = dados.imagem
        ? '<img class="menu-categoria-imagem" src="' + App.esc(App.assetUrl(dados.imagem)) + '" alt="' + App.esc(dados.alt) + '" loading="lazy">'
        : '<div class="menu-categoria-imagem menu-categoria-icone" aria-hidden="true"><i class="fa-solid ' + dados.icone + '"></i></div>';

      let produtosHtml = "";
      Object.entries(dados.itens).forEach(([nome, produto]) => {
        const opcoes = Array.isArray(produto.opcoes) ? produto.opcoes : [];
        const precoInicial = opcoes[0]?.preco ?? produto.preco;
        const tamanhos = opcoes.length
          ? opcoes.map((o) => o.tamanho).join(" · ")
          : produto.tamanho;
        const precoTexto = opcoes.length
          ? "A partir de " + App.fmtMoeda(precoInicial)
          : App.fmtMoeda(precoInicial);
        produtosHtml +=
          '<a class="menu-produto" href="#/comprar?categoria=' + encodeURIComponent(categoria) + "&item=" + encodeURIComponent(nome) + '" ' +
          'aria-label="Ver ' + App.esc(nome) + ", " + App.esc(tamanhos) + ", " + App.esc(precoTexto) + '">' +
          "<h3>" + App.esc(nome) + "</h3>" +
          '<span class="menu-produto-tamanho">' + App.esc(tamanhos) + "</span>" +
          "<p>" + App.esc(produto.descricao) + "</p>" +
          '<span class="menu-produto-rodape"><strong>' + App.esc(precoTexto) + "</strong>" +
          '<span class="menu-produto-comprar">Comprar <i class="fa-solid fa-arrow-right"></i></span></span></a>';
      });

      secao.innerHTML =
        '<header class="menu-categoria-cabecalho">' + imagemHtml +
        '<div class="menu-categoria-titulo">' +
        '<span class="menu-categoria-etiqueta"><i class="fa-solid ' + dados.icone + '" aria-hidden="true"></i> ' + App.esc(categoria) + "</span>" +
        "<h2>" + App.esc(categoria) + "</h2><p>" + App.esc(dados.descricao) + "</p>" +
        '<p><a class="menu-ver-categoria" href="#/lanche?cat=' + encodeURIComponent(categoria) + '">Ver página de ' + App.esc(categoria.toLowerCase()) + ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></p>' +
        "</div></header>" +
        '<div class="menu-produtos">' + produtosHtml + "</div>";

      conteudo.append(secao);
    });

    App.$("explorarCardapio")?.addEventListener("click", () => {
      atalhos.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* =========================================================
     LANCHE (detalhe da categoria: pipoca, bebidas, ...)
     Textos das páginas de categoria do protótipo.
     ========================================================= */

  const CATEGORIA_INFO = {
    Pipoca: {
      titulo: "Pipoca",
      subtitulo: "O clássico que não pode faltar na sessão.",
      chamada: "Pipoca para todos os gostos",
      descricao: "Escolha sua versão favorita e deixe a experiência no cinema ainda mais completa.",
      icone: "fa-bowl-food"
    },
    Bebidas: {
      titulo: "Bebidas",
      subtitulo: "Refresque sua sessão com a bebida ideal.",
      chamada: "Refresque sua sessão",
      descricao: "Encontre opções para acompanhar sua pipoca, seu filme e sua companhia.",
      icone: "fa-mug-hot"
    },
    Combos: {
      titulo: "Combos",
      subtitulo: "Junte seus favoritos e aproveite mais a sua sessão.",
      chamada: "Combos para compartilhar",
      descricao: "Uma combinação prática de sabores para tornar o cinema ainda mais especial.",
      icone: "fa-box-open"
    },
    Doces: {
      titulo: "Doces",
      subtitulo: "Finalize a sessão com um toque doce.",
      chamada: "Um toque doce",
      descricao: "Pequenos prazeres para acompanhar os melhores momentos do filme.",
      icone: "fa-candy-cane"
    },
    Salgados: {
      titulo: "Salgados",
      subtitulo: "Opções quentinhas para acompanhar a sessão.",
      chamada: "Quentinhos do cinema",
      descricao: "Escolha entre clássicos salgados e compartilhe um momento delicioso.",
      icone: "fa-hotdog"
    },
    Brinquedos: {
      titulo: "Brinquedos",
      subtitulo: "Leve a diversão para casa.",
      chamada: "Diversão para levar",
      descricao: "Brinquedos e lembranças para guardar, colecionar ou presentear.",
      icone: "fa-puzzle-piece"
    }
  };

  function renderLanche(query) {
    const catalogo = window.CATALOGO_LANCHES;
    const categoria = query.get("cat") || "Pipoca";
    const dados = catalogo[categoria];
    const info = CATEGORIA_INFO[categoria] || CATEGORIA_INFO.Pipoca;

    if (!dados) {
      App.nav("#/loja");
      return;
    }

    document.title = "Cinemark - " + categoria;

    const itens = Object.entries(dados.itens).map(([nome, produto]) =>
      '<li><a href="#/comprar?categoria=' + encodeURIComponent(categoria) + "&item=" + encodeURIComponent(nome) + '">' +
      "<strong>" + App.esc(nome) + "</strong>" + App.esc(produto.descricao) +
      '<span>Escolher <i class="fa-solid fa-arrow-right"></i></span></a></li>'
    ).join("");

    App.$("app").innerHTML =
      '<header class="contato-hero">' +
      '<span class="lanches-kicker">BOMBONIERE CINEMARK</span>' +
      "<h1>" + App.esc(info.titulo) + "</h1><p>" + App.esc(info.subtitulo) + "</p></header>" +
      '<main class="lanche-detalhe"><div class="lanche-detalhe-cabecalho">' +
      '<div class="lanche-icone"><i class="fa-solid ' + info.icone + '"></i></div>' +
      "<h2>" + App.esc(info.chamada) + "</h2><p>" + App.esc(info.descricao) + "</p></div>" +
      '<ul class="lanche-opcoes">' + itens + "</ul>" +
      '<div class="lanche-detalhe-acoes"><a href="#/loja"><i class="fa-solid fa-arrow-left"></i> Voltar aos lanches</a></div>' +
      "</main>" +
      '<footer class="site-footer">© 2026 Cinemark. Todos os direitos reservados.<nav class="rodape-links" aria-label="Links do rodapé"><a href="#/ajuda">Ajuda</a><a href="#/contato">Contato</a><a href="#/ingressos">Meus ingressos</a></nav></footer>';
  }

  /* =========================================================
     COMPRAR (produto + carrinho)
     ========================================================= */

  function renderComprar(query) {
    const catalogo = window.CATALOGO_LANCHES;
    const categoria = query.get("categoria");
    const nome = query.get("item");
    const produto = catalogo?.[categoria]?.itens?.[nome];

    const contaAutenticada = ["cliente", "admin"].includes(Store.sessao.atual()?.perfil);

    App.$("app").innerHTML =
      '<header class="contato-hero comprar-hero">' +
      '<span class="lanches-kicker">LOJA CINEMARK</span>' +
      "<h1>Seu pedido</h1><p>Escolha a quantidade e prepare tudo para a sessão.</p></header>" +
      '<main class="compra-layout">' +
      '<section class="compra-produto" aria-labelledby="produtoNome">' +
      '<a class="voltar-categoria" id="voltarCategoria" href="#/loja"><i class="fa-solid fa-arrow-left"></i> Voltar à loja</a>' +
      '<p class="produto-categoria" id="produtoCategoria">Bomboniere</p>' +
      "<h2 id=\"produtoNome\">Carregando produto</h2>" +
      '<p class="produto-descricao" id="produtoDescricao"></p>' +
      '<label id="varianteCompraGrupo" for="varianteCompra" hidden>Escolha o tamanho<select id="varianteCompra"></select></label>' +
      '<p class="produto-preco" id="produtoPreco"></p>' +
      '<p class="preco-nota">Preços válidos para retirada no balcão do cinema.</p>' +
      '<p class="login-compra-aviso" id="loginCompraAviso" role="status" hidden>' +
      'Entre em uma conta de cliente ou crie uma conta para escolher tamanhos e fazer pedidos. <a href="#/login">Entrar ou criar conta</a></p>' +
      '<label for="quantidade">Quantidade</label>' +
      '<input id="quantidade" type="number" min="1" max="99" value="1" inputmode="numeric">' +
      '<button class="acao-principal" id="adicionarCarrinho" type="button"><i class="fa-solid fa-cart-plus"></i> Adicionar ao carrinho</button>' +
      '<p class="mensagem-compra" id="mensagemCompra" role="status" aria-live="polite"></p>' +
      "</section>" +
      '<aside class="compra-carrinho" id="checkoutBox" aria-labelledby="tituloCarrinho">' +
      '<div class="carrinho-cabecalho"><h2 id="tituloCarrinho">Seu carrinho</h2><span id="quantidadeCarrinho">0 itens</span></div>' +
      '<p class="login-compra-aviso" id="loginCarrinhoAviso" hidden>' +
      'Entre em uma conta de cliente para alterar o carrinho ou concluir o pedido. <a href="#/login">Entrar ou criar conta</a></p>' +
      '<ul class="itens-carrinho" id="itensCarrinho"></ul>' +
      '<p class="carrinho-vazio" id="carrinhoVazio">Seu carrinho ainda está vazio.</p>' +
      '<div class="carrinho-total"><span>Subtotal</span><strong id="subtotalCarrinho">R$ 0,00</strong></div>' +
      '<p class="carrinho-desconto" id="linhaDescontoLoja" hidden>Desconto do plano <span id="valorDescontoLoja"></span></p>' +
      '<div class="carrinho-total"><span>Total</span><strong id="totalCarrinho">R$ 0,00</strong></div>' +
      '<div class="checkout-bloco" id="checkoutBloco">' +
      '<div class="form-linha"><label for="retiradaNome">Quem vai retirar</label><input type="text" class="adm-input" id="retiradaNome" autocomplete="name"></div>' +
      '<p class="form-ajuda"><i class="fa-solid fa-store"></i> Retirada no balcão do cinema.</p>' +
      '<div class="pag-opcoes" role="radiogroup" aria-label="Forma de pagamento">' +
      '<label class="pag-opcao"><input type="radio" name="pagLoja" value="balcao" checked> <i class="fa-solid fa-cash-register"></i> Pagar na retirada</label>' +
      '<label class="pag-opcao"><input type="radio" name="pagLoja" value="pix"> <i class="fa-solid fa-qrcode"></i> Pix</label>' +
      '<label class="pag-opcao"><input type="radio" name="pagLoja" value="cartao"> <i class="fa-solid fa-credit-card"></i> Cartão</label>' +
      "</div>" +
      '<div id="cartaoLojaCampos" hidden>' +
      '<div class="form-linha"><label for="lojaCartaoNumero">Número do cartão</label><input type="text" class="adm-input" id="lojaCartaoNumero" inputmode="numeric" placeholder="0000 0000 0000 0000" maxlength="19"></div>' +
      '<div class="form-duplo"><div class="form-linha"><label for="lojaCartaoValidade">Validade</label><input type="text" class="adm-input" id="lojaCartaoValidade" placeholder="MM/AA" maxlength="5"></div>' +
      '<div class="form-linha"><label for="lojaCartaoCvv">CVV</label><input type="password" class="adm-input" id="lojaCartaoCvv" inputmode="numeric" placeholder="123" maxlength="4"></div></div>' +
      '<div class="form-linha"><label for="lojaCartaoTitular">Nome impresso no cartão</label><input type="text" class="adm-input" id="lojaCartaoTitular" autocomplete="cc-name"></div>' +
      "</div>" +
      '<p class="pag-aviso"><i class="fa-solid fa-lock"></i> Os dados do cartão são validados no navegador e nunca são armazenados.</p>' +
      "</div>" +
      '<button class="acao-finalizar" id="finalizarCompra" type="button" disabled><i class="fa-solid fa-check"></i> Finalizar pedido</button>' +
      '<p class="mensagem-finalizacao" id="mensagemFinalizacao" role="status" aria-live="polite"></p>' +
      "</aside></main>" +
      '<footer class="site-footer">© 2026 Cinemark. Todos os direitos reservados.<nav class="rodape-links" aria-label="Links do rodapé"><a href="#/ajuda">Ajuda</a><a href="#/contato">Contato</a><a href="#/ingressos">Meus ingressos</a></nav></footer>';

    const campoQuantidade = App.$("quantidade");
    const listaCarrinho = App.$("itensCarrinho");
    const opcoesVariantes = Array.isArray(produto?.opcoes) ? produto.opcoes : [];
    const varianteGrupo = App.$("varianteCompraGrupo");
    const varianteSelect = App.$("varianteCompra");
    const produtoDescricao = App.$("produtoDescricao");
    const produtoPreco = App.$("produtoPreco");
    let varianteSelecionada = opcoesVariantes[0] || null;

    function atualizarDetalheProduto() {
      if (!produto) return;
      const tamanho = varianteSelecionada?.tamanho || produto.tamanho;
      const preco = varianteSelecionada?.preco ?? produto.preco;
      produtoDescricao.textContent = (tamanho ? tamanho + " · " : "") + produto.descricao;
      produtoPreco.textContent = App.fmtMoeda(preco);
    }

    if (produto) {
      document.title = "Cinemark - " + nome;
      App.$("produtoCategoria").textContent = categoria;
      App.$("produtoNome").textContent = nome;
      if (opcoesVariantes.length) {
        varianteGrupo.hidden = false;
        varianteSelect.replaceChildren(...opcoesVariantes.map((opcao) => {
          const item = document.createElement("option");
          item.value = opcao.id;
          item.textContent = opcao.tamanho + " · " + App.fmtMoeda(opcao.preco);
          return item;
        }));
        varianteSelect.disabled = !contaAutenticada;
        varianteSelect.addEventListener("change", () => {
          varianteSelecionada = opcoesVariantes.find((o) => o.id === varianteSelect.value);
          atualizarDetalheProduto();
        });
      }
      atualizarDetalheProduto();
      App.$("voltarCategoria").href = "#/loja";
      campoQuantidade.disabled = !contaAutenticada;
      App.$("adicionarCarrinho").disabled = !contaAutenticada;
      App.$("loginCompraAviso").hidden = contaAutenticada;
    } else {
      App.$("produtoNome").textContent = "Produto não encontrado";
      produtoDescricao.textContent = "Volte ao cardápio e escolha um item disponível.";
      produtoPreco.textContent = "";
      campoQuantidade.disabled = true;
      App.$("adicionarCarrinho").disabled = true;
    }

    function renderizarCarrinho() {
      const itens = Store.carrinho.listar();
      const totalUnidades = itens.reduce((soma, item) => soma + item.quantidade, 0);
      const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

      listaCarrinho.replaceChildren();
      itens.forEach((item) => {
        const linha = document.createElement("li");
        linha.className = "item-carrinho";

        const tituloEl = document.createElement("strong");
        tituloEl.textContent = item.nome + " · " + item.categoria;

        const preco = document.createElement("span");
        preco.className = "item-carrinho-preco";
        preco.textContent = App.fmtMoeda(item.preco * item.quantidade);

        const detalhe = document.createElement("span");
        detalhe.className = "item-carrinho-detalhe";
        detalhe.textContent = item.tamanho || "";

        const controles = document.createElement("div");
        controles.className = "item-carrinho-controles";

        const qtd = document.createElement("input");
        qtd.className = "quantidade-item";
        qtd.type = "number";
        qtd.min = "0";
        qtd.max = "99";
        qtd.value = item.quantidade;
        qtd.disabled = !contaAutenticada;
        qtd.setAttribute("aria-label", "Quantidade de " + item.nome);
        qtd.addEventListener("change", () => {
          const nova = Math.min(99, Math.max(0, Number(qtd.value) || 0));
          Store.carrinho.atualizarQuantidade(item.id, nova);
          renderizarCarrinho();
        });

        const remover = document.createElement("button");
        remover.className = "remover-item";
        remover.type = "button";
        remover.disabled = !contaAutenticada;
        remover.setAttribute("aria-label", "Remover " + item.nome + " do carrinho");
        remover.innerHTML = '<i class="fa-solid fa-trash-can" aria-hidden="true"></i>';
        remover.addEventListener("click", () => {
          Store.carrinho.remover(item.id);
          renderizarCarrinho();
        });

        controles.append(qtd, remover);
        linha.append(tituloEl, preco, detalhe, controles);
        listaCarrinho.append(linha);
      });

      App.$("quantidadeCarrinho").textContent = totalUnidades + " " + (totalUnidades === 1 ? "item" : "itens");
      const conta = Store.sessao.atual();
      const desconto = Store.pedidos.descontoPara(conta?.id);
      const totalFinal = Math.round(total * 100 * (1 - desconto.percentual / 100)) / 100;
      App.$("subtotalCarrinho").textContent = App.fmtMoeda(total);
      App.$("totalCarrinho").textContent = App.fmtMoeda(totalFinal);
      App.$("linhaDescontoLoja").hidden = !desconto.percentual;
      if (desconto.percentual) {
        App.$("valorDescontoLoja").textContent =
          "−" + desconto.percentual + "% (" + desconto.plano + "): −" + App.fmtMoeda(total - totalFinal);
      }
      App.$("carrinhoVazio").hidden = itens.length > 0;
      App.$("finalizarCompra").disabled = itens.length === 0 || !contaAutenticada;
      App.$("checkoutBloco").hidden = itens.length === 0 || !contaAutenticada;
      App.$("loginCarrinhoAviso").hidden = contaAutenticada;
      const campoRetirada = App.$("retiradaNome");
      if (campoRetirada && conta && !campoRetirada.value) campoRetirada.value = conta.nome || "";
    }

    document.querySelectorAll('input[name="pagLoja"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        App.$("cartaoLojaCampos").hidden =
          document.querySelector('input[name="pagLoja"]:checked')?.value !== "cartao";
      });
    });

    App.$("adicionarCarrinho").addEventListener("click", () => {
      if (!contaAutenticada || !produto) return;
      const quantidade = Math.min(99, Math.max(1, Number(campoQuantidade.value) || 1));
      campoQuantidade.value = quantidade;
      const preco = varianteSelecionada?.preco ?? produto.preco;
      const tamanho = varianteSelecionada?.tamanho || produto.tamanho || "";
      Store.carrinho.adicionar({
        id: categoria + ":" + nome + ":" + (varianteSelecionada?.id || "padrao"),
        categoria, nome, preco, tamanho, descricao: produto.descricao
      }, quantidade);
      App.$("mensagemCompra").textContent = nome + (tamanho ? " (" + tamanho + ")" : "") + " adicionado ao carrinho.";
      App.$("mensagemFinalizacao").textContent = "";
      renderizarCarrinho();
    });

    App.$("finalizarCompra").addEventListener("click", () => {
      if (!contaAutenticada) return;
      const conta = Store.sessao.atual();
      const metodo = document.querySelector('input[name="pagLoja"]:checked')?.value;
      const pagamento = { metodo };
      if (metodo === "cartao") {
        pagamento.numero = App.$("lojaCartaoNumero").value;
        pagamento.validade = App.$("lojaCartaoValidade").value;
        pagamento.cvv = App.$("lojaCartaoCvv").value;
        pagamento.titular = App.$("lojaCartaoTitular").value;
      }
      const resultado = Store.pedidos.criar({
        itens: Store.carrinho.listar(),
        clienteNome: App.$("retiradaNome").value,
        email: conta.email,
        usuarioId: conta.id,
        pagamento,
        unidade: "Balcão do cinema"
      });
      if (!resultado.ok) {
        App.$("mensagemFinalizacao").textContent = resultado.erro;
        return;
      }
      const pedido = resultado.dado;
      Store.carrinho.limpar();
      const pagamentoTexto = pedido.pagamento.metodo === "balcao" ? "Pagar na retirada"
        : pedido.pagamento.metodo === "pix" ? "Pix"
        : "Cartão •• " + pedido.pagamento.ultimos4;
      App.$("checkoutBox").innerHTML =
        '<div class="pedido-sucesso"><i class="fa-solid fa-circle-check pedido-sucesso-icone" aria-hidden="true"></i>' +
        "<h2>Pedido confirmado!</h2>" +
        '<p class="pedido-codigo">Código <strong>' + App.esc(pedido.codigo) + "</strong></p>" +
        '<ul class="pedido-itens">' +
        pedido.itens.map((item) => "<li>" + item.quantidade + "× " + App.esc(item.nome) +
          (item.tamanho ? " (" + App.esc(item.tamanho) + ")" : "") +
          " — " + App.fmtBRL(item.precoCentavos * item.quantidade) + "</li>").join("") +
        "</ul>" +
        (pedido.descontoPercentual
          ? "<p>Desconto " + pedido.descontoPercentual + "% (" + App.esc(pedido.planoTitulo) + ")</p>"
          : "") +
        "<p><strong>Total: " + App.fmtBRL(pedido.totalCentavos) + "</strong> · " + pagamentoTexto + "</p>" +
        "<p>Retire no balcão do cinema apresentando este código.</p>" +
        '<p class="comprovante-acoes"><a class="filme-botao-principal" href="#/perfil">Ver meus pedidos</a></p>' +
        '<p><a href="#/loja">Continuar comprando</a></p></div>';
      App.$("mensagemFinalizacao").textContent = "";
      App.$("mensagemCompra").textContent = "";
      App.toast("Pedido " + pedido.codigo + " confirmado!");
    });

    renderizarCarrinho();
  }

  Pages.loja = { render: renderLoja };
  Pages.lanche = { render: renderLanche };
  Pages.comprar = { render: renderComprar };
})();
