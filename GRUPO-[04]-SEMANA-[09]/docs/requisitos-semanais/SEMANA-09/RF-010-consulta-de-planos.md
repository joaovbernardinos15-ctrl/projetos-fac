# ENTREGA SEMANAL DE REQUISITOS

**Data de referência:** 05/10/2026  
**Grupo:** Grupo 04 - Cinemark

**Integrantes:** Fabrício Aguiar (fabricio62258946@edu.df.senac.br); João Silva (joao61806466@edu.df.senac.br); Natanael Souza (natanael61421786@edu.df.senac.br)

---

## 1. IDENTIFICAÇÃO DO REQUISITO

### RF-010: Consulta de planos

**ID:** RF-010  
**Título:** Consultar planos e benefícios propostos  
**Prioridade:** Baixa no protótipo — a assinatura ainda não está disponível.  
**Complexidade:** 2 story points — estimativa sujeita à revisão da equipe.  
**Status:** Consulta implementada; contratação não implementada.  
**Tipo:** Requisito Funcional

**Breve descrição:**  
O visitante ou cliente aciona **Planos** na navegação e consulta, em uma janela modal, os planos Lite, Plus e Ultra, seus preços e benefícios propostos. A consulta está disponível nas páginas inicial, catálogo de filmes, loja, categorias de produtos, pedido e contato.

## 2. DESCRIÇÃO E ATORES

- **Visitante ou cliente (ator principal):** pode consultar as opções e fechar o modal; não pode contratar plano pelo protótipo.
- **Sistema (ator automático):** apresenta nomes, preços demonstrativos e benefícios propostos e mantém ações de contratação indisponíveis.

## 3. ESPECIFICAÇÃO DE CASOS DE USO

### Pré-condições

- O usuário está em uma página que apresenta o atalho **Planos** e os dados da interface estão carregados.

### Pós-condições

**Sucesso:** opções demonstrativas ficam visíveis até o fechamento do modal; nenhum dado de conta ou sessão é alterado.  
**Tentativa de contratação:** nenhuma assinatura ou cobrança é criada; os botões permanecem indisponíveis.

### UC-010: Consultar planos disponíveis

### Fluxo principal

1. O usuário aciona **Planos**.
2. O sistema abre a janela modal.
3. O usuário consulta as opções Lite, Plus e Ultra, os preços e os benefícios propostos.
4. O usuário fecha a janela pelo botão de fechar ou pelos controles do modal.

### Fluxo alternativo

- **Tentativa de assinatura:** os botões de assinatura estão desabilitados e indicam **Em breve**; nenhuma contratação é iniciada.

**RN-01:** Os valores e benefícios exibidos são demonstrativos/propostos e não devem ser apresentados como assinatura contratável.  
**RN-02:** Os botões de contratação permanecem desabilitados enquanto não houver fluxo de assinatura implementado.  
**RN-03:** A consulta é pública e não requer autenticação.  
**RN-04:** O modal deve oferecer forma de fechamento e manter o foco e a navegação coerentes com o componente.  
**RN-05:** Preços e benefícios devem ser identificados como demonstrativos/propostos; não podem induzir o usuário a acreditar que há cobrança ou adesão ativa.  
**RN-06:** Fechar o modal deve retornar o usuário à página e ao contexto de navegação anterior.  
**RN-07:** A consulta de planos não pode alterar perfil, sessão, carrinho ou dados de usuário.

### Requisitos não funcionais relacionados

| ID | Requisito e critério de aceitação | Situação |
|---|---|---|
| RNF-01 | Modal deve adaptar-se a 375, 768 e 1280 px; conteúdo excedente deve continuar alcançável por rolagem. | Bootstrap responsivo presente; validação visual pendente |
| RNF-02 | Modal deve ser operável por teclado, com foco visível e fechamento acessível. | Componente Bootstrap usado; auditoria de foco pendente |
| RNF-03 | Preços, títulos e benefícios devem manter contraste e legibilidade em telas móveis. | Estilos presentes; revisão de contraste pendente |
| RNF-04 | Consulta deve estar disponível sem autenticação e sem modificar dados locais. | Disponível nas páginas públicas; confirmar por teste de fluxo |
| RNF-05 | Botões desabilitados devem expor estado indisponível e não iniciar ação. | Ações exibem “Em breve” e possuem `disabled`; abertura e estado conferidos no navegador em `comprar.html` e `bebidas.html` |
| RNF-06 | Modal deve funcionar nas duas versões estáveis mais recentes de Chrome, Firefox e Safari. | Matriz de compatibilidade pendente |
| RNF-07 | Conteúdo deve identificar claramente que assinatura ainda não está disponível. | Aviso e rótulos “Em breve” presentes nas páginas com o modal |

### Escopo e limitações

Não há criação de assinatura, cadastro de meio de pagamento, cobrança, gestão de benefícios, controle de telas ou bloqueio de conteúdo por plano. Os benefícios exibidos são apenas conteúdo demonstrativo.

### Rastreabilidade

**Telas/arquivos:** `src/prototipos/SEMANA-08/index.html`, `filmes.html`, `lanches.html`, `contato.html`, `comprar.html`, `pipoca.html`, `bebidas.html`, `doces.html`, `combos.html` e `salgados.html`; lógica compartilhada em `js/planos.js` nas páginas sem marcação própria do modal; estilos em `css/planos.css`.  
**Critério de aceite:** o usuário consegue abrir e fechar a janela e consultar as opções, enquanto qualquer tentativa de contratação permanece indisponível e claramente sinalizada.

## 4. PROTÓTIPOS / TELAS

**Telas existentes:** o botão **Planos** abre o modal em todas as páginas listadas na rastreabilidade. `index.html`, `filmes.html`, `lanches.html` e `contato.html` contêm a marcação do modal. Nas páginas `comprar.html`, `pipoca.html`, `bebidas.html`, `doces.html`, `combos.html` e `salgados.html`, `js/planos.js` cria o mesmo conteúdo do modal quando a página ainda não o contém. Os estilos são carregados de `css/planos.css`.

```text
┌──────────────────────────────────────────────────┐
│ Planos Cinemark                         [Fechar] │
│ Benefícios e valores demonstrativos              │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐     │
│ │ Lite       │ │ Plus       │ │ Ultra      │     │
│ │ benefícios│ │ benefícios│ │ benefícios│     │
│ │ preço/mês  │ │ preço/mês  │ │ preço/mês  │     │
│ │ [Em breve]│ │ [Em breve]│ │ [Em breve]│     │
│ └────────────┘ └────────────┘ └────────────┘     │
└──────────────────────────────────────────────────┘
```

## 5. ARQUITETURA E DECISÕES TÉCNICAS

**Fluxo de dados:** botão **Planos** referencia `#modalPlanos` → Bootstrap abre o modal já presente na página ou criado por `js/planos.js` → marcação HTML apresenta os dados estáticos dos planos → ações desabilitadas não iniciam contratação → usuário fecha o modal.

| Camada | Tecnologia | Uso |
|---|---|---|
| Interface | HTML e CSS externo (`css/planos.css`) | Cartões, informações e apresentação responsiva dos planos |
| Interação | Bootstrap Modal e `js/planos.js` | Abertura/fechamento; criação do modal nas páginas sem marcação própria |
| Dados | Marcação HTML ou conteúdo estático criado por JavaScript | Preços demonstrativos e benefícios propostos; sem consulta a backend |

### ADR-001: Modal para consulta

**Contexto:** usuário deve consultar planos sem abandonar a tela atual, em todas as páginas que exibem o atalho **Planos**.  
**Decisão:** apresentar opções em modal Bootstrap. Quatro páginas mantêm a marcação do modal no próprio HTML; nas demais páginas listadas, `js/planos.js` cria essa marcação quando necessário.  
**Alternativa rejeitada:** exigir navegação para uma página de planos separada nesta versão.  
**Consequência:** preserva o contexto de navegação e mantém o mesmo conteúdo nas páginas cobertas; alterações no conteúdo estático devem ser sincronizadas entre as marcações HTML existentes e `js/planos.js`. Conteúdo longo pode exigir rolagem dentro do modal.

### ADR-002: Conteúdo estático

**Contexto:** planos ainda não são mantidos por backend ou área administrativa.  
**Decisão:** manter valores e benefícios como conteúdo estático, na marcação das páginas que já contêm o modal e em `js/planos.js` para as demais páginas cobertas.  
**Alternativa rejeitada:** declarar integração com serviço inexistente.  
**Consequência:** mudanças são manuais, não há consulta dinâmica de preços e o conteúdo duplicado precisa permanecer consistente.

### ADR-003: Contratação desabilitada

**Contexto:** não existem checkout, cobrança ou ciclo de assinatura.  
**Decisão:** deixar ações desabilitadas e apresentar “Em breve”.  
**Alternativa rejeitada:** botão aparentemente funcional que não conclui uma operação.  
**Consequência:** evita simular uma contratação real; adesão permanece fora do escopo.

## 6. QUALIDADE E CONFORMIDADE

- [x] Identificação, prioridade, complexidade e status informados.
- [x] Atores, pré-condições e fluxos principal/alternativo descritos.
- [x] Sete regras de negócio e sete RNFs numerados.
- [x] Mockup, páginas relacionadas e fluxo de dados documentados.
- [x] Três ADRs com alternativas e consequências.
- [x] Conferir que todas as páginas listadas têm o botão **Planos** ligado ao modal e os recursos necessários carregados.
- [ ] Testar a abertura, o fechamento e as opções do modal em cada página listada.
- [ ] Conferir visualmente responsividade, foco e fechamento em todas as páginas.
- [ ] Testar teclado, foco, fechamento, responsividade e contraste.
- [ ] Validar nos navegadores previstos; contratação continua desabilitada.
- [ ] Converter/validar protótipo no formato HTML único com CSS embutido se esse critério da validação for obrigatório nesta entrega.
