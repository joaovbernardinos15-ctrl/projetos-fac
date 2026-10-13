# ENTREGA SEMANAL DE REQUISITOS

**Data de referência:** 05/10/2026  
**Grupo:** Grupo 04 - Cinemark

**Integrantes:** Fabrício Aguiar (fabricio62258946@edu.df.senac.br); João Silva (joao61806466@edu.df.senac.br); Natanael Souza (natanael61421786@edu.df.senac.br)

---

## 1. IDENTIFICAÇÃO DO REQUISITO

### RF-007: Consulta do cardápio da loja

**ID:** RF-007  
**Título:** Consultar categorias e produtos da loja  
**Prioridade:** Média — apresenta os produtos que podem ser adicionados ao pedido demonstrativo.  
**Complexidade:** 3 story points — estimativa sujeita à revisão da equipe.  
**Status:** Implementado no protótipo.  
**Tipo:** Requisito Funcional

**Breve descrição:**  
O visitante ou cliente consulta categorias de produtos, descrições e preços demonstrativos e escolhe um item para avançar à tela do pedido.

## 2. DESCRIÇÃO E ATORES

- **Visitante ou cliente (ator principal):** pode navegar por categorias, consultar produtos/preços e escolher item; não edita catálogo ou estoque.
- **Sistema (ator automático):** apresenta os dados locais, formata preços e encaminha ao pedido apenas a identificação do item selecionado.

## 3. ESPECIFICAÇÃO DE CASOS DE USO

### Pré-condições

- A página da loja, os dados do cardápio e o JavaScript estão disponíveis.

### Pós-condições

**Sucesso:** usuário consulta os produtos e, ao selecionar um válido, chega à tela de pedido com sua identificação.  
**Falha:** item inválido não é tratado como produto selecionável e a interface oferece retorno à loja.

### UC-007: Consultar categorias e produtos

### Fluxo principal

1. O usuário abre `lanches.html`.
2. O sistema apresenta atalhos e seções de categorias.
3. O usuário consulta nome, descrição e preço de um produto.
4. O usuário seleciona o produto.
5. O sistema abre `comprar.html` com a categoria e o item selecionados.

### Fluxos alternativos

- **Categoria sem produtos:** não há produto para selecionar; os atalhos permanecem conforme os dados disponíveis.
- **Item inválido ou inexistente:** a tela do pedido informa que o produto não foi encontrado e desativa a inclusão no carrinho.

**RN-01:** Categorias, descrições e preços vêm do catálogo local `menu-data.js`.  
**RN-02:** Preços devem ser apresentados em moeda brasileira (BRL).  
**RN-03:** A escolha deve transferir a identificação do produto à tela de pedido; o dado recebido deve corresponder a um item cadastrado.  
**RN-04:** Os preços são demonstrativos e não constituem cobrança ou oferta comercial efetiva.  
**RN-05:** A página deve permitir navegar às categorias por atalhos e retornar ao início da loja.  
**RN-06:** Produtos devem apresentar nome, descrição e preço; imagens de categoria, quando presentes, devem identificar o conteúdo.  
**RN-07:** Uma categoria ou item sem cadastro não pode ser apresentado como produto válido para compra.

### Requisitos não funcionais relacionados

| ID | Requisito e critério de aceitação | Situação |
|---|---|---|
| RNF-01 | O cardápio deve se adaptar a larguras de 375, 768 e 1280 px sem perda de acesso às categorias/produtos. | Estilos presentes; revisão visual pendente |
| RNF-02 | Imagens informativas devem possuir texto alternativo e controles devem ser acessíveis por teclado. | Texto alternativo definido nos dados; auditoria pendente |
| RNF-03 | Valores devem usar formato monetário pt-BR com duas casas decimais. | `Intl.NumberFormat` usado; teste de saída pendente |
| RNF-04 | O conteúdo do cardápio deve ser renderizado sem interpretar descrições como HTML executável. | Renderização usa nós de texto; teste de segurança pendente |
| RNF-05 | O catálogo deve estar disponível sem autenticação e sem recarga para navegação entre âncoras. | Implementado por HTML/JavaScript local |
| RNF-06 | A página deve funcionar nas duas versões estáveis mais recentes de Chrome, Firefox e Safari. | Matriz de compatibilidade pendente |
| RNF-07 | Falta de imagem de uma categoria não deve impedir consulta aos produtos cadastrados. | Categoria Brinquedos não tem imagem no catálogo; verificar layout degradado |

### Escopo e limitações

O catálogo não é editável pelo cliente, não informa estoque e não possui integração com sistema de pedidos, pagamento ou disponibilidade de unidades.

### Rastreabilidade

**Telas/arquivos:** `src/prototipos/SEMANA-06/lanches.html`, `src/prototipos/SEMANA-06/js/lanches.js`, `src/prototipos/SEMANA-06/js/menu-data.js`, `src/prototipos/SEMANA-06/comprar.html`.  
**Critério de aceite:** o cardápio apresenta os dados cadastrados e cada produto válido abre a tela de pedido com categoria e item corretos.

## 4. PROTÓTIPOS / TELAS

**Tela existente:** `src/prototipos/SEMANA-06/lanches.html`; conteúdo montado por `js/lanches.js` a partir de `js/menu-data.js`; estilos em `css/lanches.css`.

```text
┌───────────────────────────────────────────────┐
│ Loja Cinemark                                 │
│ [Pipoca] [Bebidas] [Salgados] [Doces] [Combos]│
├───────────────────────────────────────────────┤
│ Categoria: Pipoca                             │
│ [Imagem] Descrição da categoria               │
│ [Produto · descrição · preço] [Comprar →]     │
│ [Produto · descrição · preço] [Comprar →]     │
└───────────────────────────────────────────────┘
```

O catálogo de dados inclui também Brinquedos. A presença de imagem é opcional conforme os dados atuais.

## 5. ARQUITETURA E DECISÕES TÉCNICAS

**Fluxo de dados:** `menu-data.js` define categorias/produtos → `lanches.js` percorre o catálogo e cria elementos → link carrega categoria/item em `comprar.html` → tela valida o item contra o mesmo catálogo.

| Camada | Tecnologia | Uso |
|---|---|---|
| Conteúdo | Objeto JavaScript (`menu-data.js`) | Categorias, produtos, descrições e preços |
| Interface | HTML/CSS | Área de categorias e cards |
| Renderização | JavaScript (`lanches.js`) | Criação de atalhos e itens |
| Formatação | `Intl.NumberFormat` | Valores em BRL |

### ADR-001: Catálogo estático no JavaScript

**Contexto:** o protótipo não possui serviço de catálogo.  
**Decisão:** declarar produtos em `menu-data.js`.  
**Alternativas rejeitadas:** API remota e cadastro administrativo de produtos, não existentes nesta entrega.  
**Consequência:** simples manutenção para demonstração; mudanças exigem alteração do arquivo e publicação.

### ADR-002: Renderização com DOM

**Contexto:** dados de categoria precisam gerar seções repetidas.  
**Decisão:** construir elementos DOM e inserir texto como nós de texto.  
**Alternativa rejeitada:** concatenar todos os dados de descrição em HTML interpretável.  
**Consequência:** evita tratar descrições como marcação; estrutura depende do JavaScript.

### ADR-003: Navegação para uma tela de pedido única

**Contexto:** todas as categorias compartilham o mesmo fluxo de carrinho.  
**Decisão:** enviar identificadores do item via query string para `comprar.html` e validar contra o catálogo.  
**Alternativa rejeitada:** criar uma página separada para cada produto.  
**Consequência:** menos páginas duplicadas; parâmetros inválidos devem ser tratados como item não encontrado.

## 6. QUALIDADE E CONFORMIDADE

- [x] Identificação, prioridade, complexidade e status informados.
- [x] Atores, pré-condições e fluxos principal/alternativos descritos.
- [x] Sete regras de negócio e sete RNFs numerados.
- [x] Tela, arquivos e fluxo de dados documentados.
- [x] Três ADRs com alternativas e consequências.
- [ ] Testar todos os itens, links, parâmetros inválidos e categoria sem imagem.
- [ ] Validar BRL, responsividade, acessibilidade e navegadores previstos.
- [ ] Conferir contraste e leitura dos cards em zoom e viewport estreito.
- [ ] Converter/validar protótipo no formato HTML único com CSS embutido se esse critério da validação for obrigatório nesta entrega.
