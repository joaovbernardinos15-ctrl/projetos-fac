window.CATALOGO_LANCHES = {
  Pipoca: {
    icone: "fa-bowl-food",
    imagem: "img/ChatGPT%20Image%2017%20de%20set.%20de%202026,%2016_04_36.png",
    alt: "Pipocas clássica e caramelizada",
    descricao: "O clássico da sessão em versões para todos os gostos.",
    itens: {
      Tradicional: {
        descricao: "Pipoca salgada e crocante, preparada para acompanhar a sessão.",
        opcoes: [
          { id: "p", tamanho: "P · 80 g", preco: 9.9 },
          { id: "m", tamanho: "M · 120 g", preco: 13.9 },
          { id: "g", tamanho: "G · 180 g", preco: 17.9 }
        ]
      },
      Doce: {
        descricao: "Pipoca doce leve e crocante para aproveitar durante o filme.",
        opcoes: [
          { id: "p", tamanho: "P · 80 g", preco: 10.9 },
          { id: "m", tamanho: "M · 120 g", preco: 14.9 },
          { id: "g", tamanho: "G · 180 g", preco: 18.9 }
        ]
      },
      Caramelizada: {
        descricao: "Pipoca coberta com caramelo, com sabor marcante em cada mordida.",
        opcoes: [
          { id: "p", tamanho: "P · 80 g", preco: 11.9 },
          { id: "m", tamanho: "M · 120 g", preco: 15.9 },
          { id: "g", tamanho: "G · 180 g", preco: 19.9 }
        ]
      },
      Tamanhos: {
        descricao: "Pipoca salgada e crocante para aproveitar sozinho ou compartilhar.",
        opcoes: [
          { id: "p", tamanho: "P · 80 g", preco: 9.9 },
          { id: "m", tamanho: "M · 120 g", preco: 13.9 },
          { id: "g", tamanho: "G · 180 g", preco: 17.9 }
        ]
      }
    }
  },
  Bebidas: {
    icone: "fa-mug-hot",
    imagem: "img/ChatGPT%20Image%2017%20de%20set.%20de%202026,%2016_04_25.png",
    alt: "Bebidas variadas",
    descricao: "Opções geladas e quentes para acompanhar seu filme.",
    itens: {
      Refrigerantes: {
        descricao: "Bebida gelada em sabores clássicos para acompanhar a pipoca.",
        opcoes: [
          { id: "300ml", tamanho: "300 ml", preco: 6.9 },
          { id: "500ml", tamanho: "500 ml", preco: 9.9 },
          { id: "700ml", tamanho: "700 ml", preco: 12.9 },
          { id: "1l", tamanho: "1 L", preco: 15.9 }
        ]
      },
      Sucos: {
        descricao: "Opção refrescante para aproveitar antes ou durante a sessão.",
        opcoes: [
          { id: "300ml", tamanho: "300 ml", preco: 6.9 },
          { id: "500ml", tamanho: "500 ml", preco: 9.9 },
          { id: "1l", tamanho: "1 L", preco: 15.9 }
        ]
      },
      Cafés: {
        descricao: "Bebida quente servida em porção individual.",
        opcoes: [
          { id: "200ml", tamanho: "200 ml", preco: 7.9 },
          { id: "300ml", tamanho: "300 ml", preco: 9.9 },
          { id: "500ml", tamanho: "500 ml", preco: 12.9 }
        ]
      },
      Combos: { preco: 12.9, tamanho: "Bebida 500 ml + lanche", descricao: "Combine uma bebida com um lanche favorito; composição demonstrativa." }
    }
  },
  Salgados: {
    icone: "fa-hotdog",
    imagem: "img/ChatGPT%20Image%2017%20de%20set.%20de%202026,%2016_04_40.png",
    alt: "Hot dog e snacks",
    descricao: "Clássicos quentinhos e porções para compartilhar.",
    itens: {
      "Hot dog": { preco: 14.9, tamanho: "1 unidade", descricao: "Pão macio com salsicha e acompanhamentos clássicos." },
      Nachos: {
        descricao: "Nachos crocantes, ideais para compartilhar durante a sessão.",
        opcoes: [
          { id: "p", tamanho: "P · 100 g", preco: 12.9 },
          { id: "m", tamanho: "M · 150 g", preco: 16.9 },
          { id: "g", tamanho: "G · 250 g", preco: 22.9 }
        ]
      },
      Batata: {
        descricao: "Batatas douradas e crocantes para acompanhar sua sessão.",
        opcoes: [
          { id: "p", tamanho: "P · 100 g", preco: 9.9 },
          { id: "m", tamanho: "M · 180 g", preco: 13.9 },
          { id: "g", tamanho: "G · 250 g", preco: 17.9 }
        ]
      },
      Porções: {
        descricao: "Porções para dividir com a turma.",
        opcoes: [
          { id: "p", tamanho: "P · 150 g", preco: 12.9 },
          { id: "m", tamanho: "M · 250 g", preco: 17.9 },
          { id: "g", tamanho: "G · 400 g", preco: 24.9 }
        ]
      }
    }
  },
  Doces: {
    icone: "fa-candy-cane",
    imagem: "img/ChatGPT%20Image%2017%20de%20set.%20de%202026,%2016_04_29.png",
    alt: "Seleção de doces e chocolates",
    descricao: "Um toque doce para deixar a sessão ainda melhor.",
    itens: {
      Chocolates: { preco: 8.9, tamanho: "90 g", descricao: "Chocolate em porção individual para saborear ou compartilhar." },
      Balas: { preco: 5.9, tamanho: "100 g", descricao: "Mix de balas coloridas em embalagem demonstrativa." },
      Doces: { preco: 7.9, tamanho: "1 unidade", descricao: "Doce individual para deixar a sessão mais gostosa." },
      Sorvetes: { preco: 9.9, tamanho: "120 ml", descricao: "Sobremesa gelada em porção individual." }
    }
  },
  Combos: {
    icone: "fa-box-open",
    imagem: "img/ChatGPT%20Image%2017%20de%20set.%20de%202026,%2016_03_56.png",
    alt: "Combo família para compartilhar",
    descricao: "Combinações prontas para aproveitar sozinho ou com a turma.",
    itens: {
      "Combo Clássico": { preco: 29.9, tamanho: "Pipoca 120 g + 2 bebidas 300 ml", descricao: "Pipoca tradicional acompanhada de duas bebidas." },
      "Combo Doce": { preco: 26.9, tamanho: "Pipoca 100 g + chocolate 90 g + bebida 300 ml", descricao: "Uma combinação doce com pipoca, chocolate e bebida." },
      "Combo Família": { preco: 44.9, tamanho: "Pipoca 180 g + 4 bebidas 300 ml", descricao: "Porções demonstrativas maiores para compartilhar." },
      "Monte seu combo": { preco: 34.9, tamanho: "Pipoca 120 g + bebida 500 ml + 1 lanche", descricao: "Combine pipoca, bebida e um lanche em uma só opção." }
    }
  },
  Brinquedos: {
    icone: "fa-puzzle-piece",
    imagem: "img/brinquedos-categoria.jpg",
    alt: "Brinquedos, jogos de tabuleiro e bichos de pelúcia em uma brinquedoteca",
    descricao: "Brinquedos e lembranças para levar a diversão para casa.",
    itens: {
      "Miniatura colecionável": { preco: 29.9, tamanho: "Aprox. 10 cm · 1 unidade", descricao: "Peça demonstrativa para guardar ou acrescentar à coleção." },
      "Pelúcia de cinema": { preco: 39.9, tamanho: "Aprox. 25 cm · 1 unidade", descricao: "Uma companhia macia para levar a diversão para casa." },
      "Kit de adesivos": { preco: 9.9, tamanho: "6 adesivos", descricao: "Adesivos temáticos para personalizar seus objetos." },
      "Quebra-cabeça": { preco: 24.9, tamanho: "100 peças", descricao: "Um desafio divertido para montar em casa ou com a família." }
    }
  }
};