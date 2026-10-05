# ENTREGA SEMANAL DE REQUISITOS

**Data de referência:** 05/10/2026  
**Grupo:** Grupo 04 - Cinemark

**Integrantes:** Fabrício Aguiar (fabricio62258946@edu.df.senac.br); João Silva (joao61806466@edu.df.senac.br); Natanael Souza (natanael61421786@edu.df.senac.br)

---

## 1. IDENTIFICAÇÃO DO REQUISITO

### RF-008: Carrinho e pedido demonstrativo

**ID:** RF-008  
**Título:** Montar carrinho e simular a conclusão do pedido  
**Prioridade:** Média — completa o fluxo demonstrativo da loja.  
**Complexidade:** 5 story points — estimativa sujeita à revisão da equipe.  
**Status:** Implementado como simulação local; não há compra ou pagamento real.  
**Tipo:** Requisito Funcional

**Breve descrição:**  
O usuário escolhe a quantidade de um produto, adiciona-o ao carrinho, altera ou remove itens, consulta a soma demonstrativa e conclui uma simulação de pedido.

## 2. DESCRIÇÃO E ATORES

- **Visitante ou cliente (ator principal):** pode montar, alterar e limpar o carrinho demonstrativo; autenticação não é exigida e não há compra real.
- **Sistema (ator automático):** valida produto/quantidade, mantém o carrinho no navegador, calcula total e informa explicitamente o resultado simulado.

## 3. ESPECIFICAÇÃO DE CASOS DE USO

### Pré-condições

- O produto foi selecionado a partir do catálogo válido.
- O navegador permite acesso ao armazenamento local.

### Pós-condições

**Sucesso:** carrinho e total refletem as alterações; concluir a simulação limpa o carrinho e apresenta confirmação demonstrativa.  
**Falha:** produto inválido ou carrinho vazio não conclui operação nem simula pedido aceito.

### UC-008: Montar e concluir pedido demonstrativo

### Fluxo principal

1. O usuário consulta o produto e informa uma quantidade entre 1 e 99.
2. O sistema adiciona o item ao carrinho; inclusões repetidas do mesmo item são somadas.
3. O usuário revisa quantidades, remove itens ou altera quantidades.
4. O sistema atualiza subtotal por item, total de unidades e total demonstrativo.
5. Com carrinho não vazio, o usuário seleciona **Comprar agora**.
6. O sistema limpa o carrinho e apresenta a confirmação de simulação concluída.

### Fluxos alternativos

- **Produto não encontrado:** desativar a inclusão do item.
- **Quantidade zero no carrinho:** remover o item da lista.
- **Carrinho vazio:** informar que não há itens e manter a conclusão desabilitada.
- **Quantidade fora dos limites:** limitar o valor ao intervalo permitido pela interface.

**RN-01:** O carrinho é associado ao navegador por meio do armazenamento local, não a uma conta autenticada.  
**RN-02:** A quantidade adicionada deve ficar entre 1 e 99; quantidade zero em uma linha remove o produto.  
**RN-03:** Itens com a mesma identificação de produto são consolidados e suas quantidades somadas.  
**RN-04:** O total demonstrativo é a soma de preço multiplicado pela quantidade de cada item.  
**RN-05:** Concluir o pedido apenas limpa o carrinho e exibe uma confirmação; não efetua pagamento, reserva, entrega ou grava pedido em servidor.  
**RN-06:** Alterar a quantidade para zero remove o item; carrinho vazio deve desabilitar a ação de conclusão.  
**RN-07:** A quantidade individual informada deve ser limitada ao intervalo de 1 a 99; não há garantia de estoque.  
**RN-08:** O preço usado no carrinho deve vir do produto validado no catálogo local, não de texto arbitrário recebido na URL.

### Requisitos não funcionais relacionados

| ID | Requisito e critério de aceitação | Situação |
|---|---|---|
| RNF-01 | O total e subtotais devem ser recalculados após adicionar, alterar ou remover item. | Implementado; teste de precisão e casos limite pendente |
| RNF-02 | Valores devem ser exibidos em BRL com duas casas decimais. | `Intl.NumberFormat` usado; validação pendente |
| RNF-03 | Carrinho deve permanecer durante navegação e recarga na mesma origem enquanto `localStorage` existir. | Persistência prevista via Store; teste de recarga pendente |
| RNF-04 | A ação de conclusão deve ser impossível quando o carrinho estiver vazio. | Botão desabilitado no estado vazio; teste de teclado pendente |
| RNF-05 | Controles de quantidade e remoção devem possuir nomes acessíveis e funcionar por teclado. | Rótulos acessíveis no JavaScript; auditoria pendente |
| RNF-06 | A tela deve se adaptar a 375, 768 e 1280 px sem ocultar total ou ações. | CSS dedicado presente; revisão visual pendente |
| RNF-07 | A interface deve informar claramente que preços e conclusão são demonstrativos. | Nota e confirmação presentes; revisar visibilidade em telas pequenas |
| RNF-08 | Validar operação nas duas versões estáveis mais recentes de Chrome, Firefox e Safari. | Matriz de compatibilidade pendente |

### Escopo e limitações

Não há checkout real, cálculo de taxas, identificação do comprador, gestão de estoque, integração de pagamento, confirmação por e-mail ou histórico de pedidos.

### Rastreabilidade

**Telas/arquivos:** `src/prototipos/SEMANA-06/comprar.html`, `src/prototipos/SEMANA-06/js/comprar.js`, `src/prototipos/SEMANA-06/js/store.js`.  
**Critério de aceite:** adicionar, atualizar e remover itens recalcula o carrinho; a finalização está indisponível sem itens e, quando acionada, informa claramente que é demonstrativa.

## 4. PROTÓTIPOS / TELAS

**Tela existente:** `src/prototipos/SEMANA-06/comprar.html`; lógica em `js/comprar.js`; persistência em `js/store.js`; estilos em `css/comprar.css`.

```text
┌────────────────────────────────────────────────────┐
│ Seu pedido                                         │
│ Categoria · Produto · descrição · preço demonstrativo│
│ Quantidade [ 1 ] [Adicionar ao carrinho]           │
│                                                    │
│ Seu carrinho (N itens)                             │
│ Produto [quantidade] [remover]                     │
│ Total demonstrativo: R$ 0,00                       │
│ [Comprar agora]                                    │
│ [mensagem de pedido demonstrativo]                  │
└────────────────────────────────────────────────────┘
```

## 5. ARQUITETURA E DECISÕES TÉCNICAS

**Fluxo de dados:** parâmetros identificam o produto → `comprar.js` valida no catálogo → alterações chamam `Store.carrinho` → `localStorage` mantém itens → tela recalcula unidades e total → conclusão demonstrativa limpa o carrinho.

| Camada | Tecnologia | Uso |
|---|---|---|
| Interface | HTML/CSS | Produto, controles, lista e total |
| Lógica | JavaScript (`comprar.js`) | Validação visual e cálculos |
| Persistência | `Store.carrinho` / `localStorage` | Estado local do carrinho |
| Moeda | `Intl.NumberFormat` | Formatação BRL |

### ADR-001: Carrinho no armazenamento local

**Contexto:** não há backend de pedidos.  
**Decisão:** manter carrinho no `localStorage` via Store.  
**Alternativas rejeitadas:** estado apenas em memória (perdido entre páginas) e API remota (não disponível).  
**Consequência:** carrinho persiste localmente, sem associação segura a uma conta ou sincronização.

### ADR-002: Catálogo como fonte de preço

**Contexto:** parâmetros de URL não são fonte confiável para preço.  
**Decisão:** resolver produto e preço consultando `CATALOGO_LANCHES`.  
**Alternativa rejeitada:** confiar em preço enviado na URL.  
**Consequência:** produto inválido é bloqueado na interface; sem servidor, ainda não há validação transacional contra adulteração avançada.

### ADR-003: Finalização demonstrativa

**Contexto:** não existe serviço de pagamento, pedido ou estoque.  
**Decisão:** ao acionar a ação, limpar o carrinho e identificar a conclusão como demonstrativa.  
**Alternativa rejeitada:** simular cobrança ou afirmar pedido confirmado.  
**Consequência:** demonstra interação, mas não cria pedido recuperável nem realiza compra.

## 6. QUALIDADE E CONFORMIDADE

- [x] Identificação, prioridade, complexidade e status informados.
- [x] Atores, pré-condições e fluxos principal/alternativos descritos.
- [x] Oito regras de negócio e oito RNFs numerados.
- [x] Tela, arquivos e fluxo de dados documentados.
- [x] Três ADRs com alternativas e consequências.
- [ ] Testar adição, consolidação, atualização, remoção, carrinho vazio e finalização.
- [ ] Validar arredondamento/formatação, persistência, responsividade e acessibilidade.
- [ ] Confirmar que mensagens não sugerem compra ou pagamento reais.
- [ ] Converter/validar protótipo no formato HTML único com CSS embutido se esse critério da validação for obrigatório nesta entrega.
