# ENTREGA SEMANAL DE REQUISITOS

**Data de referência:** 05/10/2026  
**Grupo:** Grupo 04 - Cinemark

**Integrantes:** Fabrício Aguiar (fabricio62258946@edu.df.senac.br); João Silva (joao61806466@edu.df.senac.br); Natanael Souza (natanael61421786@edu.df.senac.br)

---

## 1. IDENTIFICAÇÃO DO REQUISITO

### RF-005: Consulta e filtro do catálogo de filmes

**ID:** RF-005  
**Título:** Pesquisar e filtrar filmes disponíveis  
**Prioridade:** Alta — facilita localizar títulos no catálogo.  
**Complexidade:** 5 story points — estimativa sujeita à revisão da equipe.  
**Status:** Implementado no protótipo.  
**Tipo:** Requisito Funcional

**Breve descrição:**  
O visitante ou cliente consulta filmes em cartaz, pesquisa por título ou gênero e combina a busca com filtros de gênero e letra inicial.

## 2. DESCRIÇÃO E ATORES

- **Visitante ou cliente (ator principal):** pode consultar, pesquisar, filtrar e abrir detalhes de filmes em cartaz; não altera os registros do catálogo.
- **Sistema (ator automático):** lê filmes locais em cartaz, aplica critérios e apresenta resultados ordenados sem modificar os dados.

## 3. ESPECIFICAÇÃO DE CASOS DE USO

### Pré-condições

- O catálogo e os scripts da página estão disponíveis.
- Há filmes cadastrados para que resultados sejam exibidos.

### Pós-condições

**Sucesso:** a lista mostra apenas filmes que correspondem aos critérios ativos e não altera os dados armazenados.  
**Falha/sem correspondências:** a lista é substituída por estado vazio e permanece disponível a ação de limpar filtros.

### UC-005: Consultar e filtrar filmes

### Fluxo principal

1. O usuário abre `filmes.html`.
2. O sistema apresenta os filmes em cartaz, os filtros e a busca.
3. O usuário digita parte do título ou gênero e/ou escolhe um gênero e uma letra.
4. O sistema combina os critérios e atualiza a lista e o contador.
5. O usuário seleciona um card para abrir os detalhes do filme.

### Fluxos alternativos

- **Nenhum resultado:** exibir mensagem de ausência e permitir limpar os filtros.
- **Letra sem filmes:** deixar a opção indisponível.
- **Filtro removido:** atualizar a lista conforme os critérios restantes; limpar todos restaura o catálogo completo em cartaz.

**RN-01:** A lista pública contém apenas filmes marcados como em cartaz.  
**RN-02:** A busca considera título e gênero, ignorando caixa e acentuação.  
**RN-03:** Os critérios ativos de busca, gênero e letra inicial são combinados.  
**RN-04:** A ordenação dos resultados é alfabética pelo título.  
**RN-05:** Cada filme deve abrir a página de detalhes usando seu identificador, não um índice dependente da ordenação.  
**RN-06:** Filmes sem fonte de vídeo continuam consultáveis, mas o card deve deixar claro que não há vídeo disponível.  
**RN-07:** Limpar filtros deve restaurar todos os filmes em cartaz e atualizar contador e estado vazio.

### Requisitos não funcionais relacionados

| ID | Requisito e critério de aceitação | Situação |
|---|---|---|
| RNF-01 | Busca, gênero e letra devem atualizar a lista sem recarregar a página. | Implementado em JavaScript; teste funcional pendente |
| RNF-02 | Com 100 registros, os resultados devem atualizar em menos de 100 ms após entrada/filtro. | Meta mensurável; benchmark pendente |
| RNF-03 | Busca deve ignorar maiúsculas, minúsculas e acentuação. | Implementação presente; casos de teste pendentes |
| RNF-04 | Lista, contador, controles de filtro e estado vazio devem ser utilizáveis por teclado e leitor de tela. | `aria-live` presente; auditoria completa pendente |
| RNF-05 | O catálogo deve adaptar-se a 375, 768 e 1280 px sem corte de conteúdo. | CSS responsivo presente; inspeção visual pendente |
| RNF-06 | Funcionalidade deve ser validada nas duas versões estáveis mais recentes de Chrome, Firefox e Safari. | Matriz de navegadores pendente |
| RNF-07 | Dados exibidos devem ser tratados para não interpretar conteúdo do catálogo como marcação executável. | Escape no render atual; teste de segurança pendente |

### Escopo e limitações

O catálogo depende dos dados existentes no navegador. Não há paginação, pesquisa em servidor, avaliação, recomendação personalizada ou disponibilidade em tempo real.

### Rastreabilidade

**Telas/arquivos:** `src/prototipos/SEMANA-06/filmes.html`, `src/prototipos/SEMANA-06/js/site.js`, `src/prototipos/SEMANA-06/js/store.js`.  
**Critério de aceite:** buscar, filtrar por gênero e letra em combinação, limpar critérios e abrir um filme devem produzir resultados coerentes com os registros locais.

## 4. PROTÓTIPOS / TELAS

**Tela existente:** `src/prototipos/SEMANA-06/filmes.html`; estilos em `css/filmes.css`; comportamento em `js/site.js`.

```text
┌─────────────────────────────────────────────────┐
│ FILMES                          N encontrados   │
│ [Buscar por título ou gênero...]                │
│ Gênero: [Todos] [Ação] [Drama] ...              │
│ Letra: [Todos] [A] [B] [C] ...                  │
│ [Card: pôster, título, gênero, classificação]  │
│ [Card: pôster, título, gênero, classificação]  │
│ Estado vazio: Nenhum filme encontrado [Limpar]  │
└─────────────────────────────────────────────────┘
```

O estado vazio e os botões de limpar filtros existem no HTML. CSS é externo; não foi embutido.

## 5. ARQUITETURA E DECISÕES TÉCNICAS

**Fluxo de dados:** `filmes.html` carrega `Store` e `site.js` → catálogo local é filtrado em memória → cards e contador são renderizados → seleção abre `filme.html?id=...`.

| Camada | Tecnologia | Uso |
|---|---|---|
| Interface | HTML/CSS externo | Busca, filtros, cards e estado vazio |
| Consulta | JavaScript (`site.js`) | Normalização, combinação de filtros e ordenação |
| Origem dos dados | `Store.filmes` | Leitura do catálogo local |
| Navegação | URL com ID do filme | Acesso à página de detalhes |

### ADR-001: Filtragem no cliente

**Contexto:** o catálogo do protótipo é carregado localmente e não há API.  
**Decisão:** filtrar a lista em memória a cada interação.  
**Alternativa rejeitada:** adicionar backend de busca fora do escopo.  
**Consequência:** resposta simples para o volume de demonstração; escalabilidade depende da memória e do tamanho local do catálogo.

### ADR-002: Normalização textual antes da comparação

**Contexto:** buscas devem encontrar títulos/gêneros apesar de caixa e acentuação.  
**Decisão:** remover diacríticos e converter para minúsculas antes de comparar.  
**Alternativa rejeitada:** comparação literal sensível a caixa/acentuação.  
**Consequência:** melhora busca em português; requer teste com caracteres e entradas vazias.

### ADR-003: Filtros combináveis e renderização sem recarga

**Contexto:** usuário precisa refinar resultados em mais de uma dimensão.  
**Decisão:** combinar texto, gênero e letra e atualizar a grade no mesmo documento.  
**Alternativa rejeitada:** navegação/recarregamento por filtro.  
**Consequência:** interação imediata; estado dos filtros não é compartilhado por URL.

## 6. QUALIDADE E CONFORMIDADE

- [x] Identificação, prioridade, complexidade e status informados.
- [x] Atores, pré-condições e fluxos principal/alternativos descritos.
- [x] Sete regras de negócio e sete RNFs numerados.
- [x] Critérios verificáveis e situação de validação informados.
- [x] Mockup, arquivos e fluxo de dados documentados.
- [x] Três ADRs com alternativas e consequências.
- [ ] Testar combinações, busca sem acentos, ausência de resultados e links para detalhe.
- [ ] Medir resposta para 100 registros e validar navegadores/tamanhos previstos.
- [ ] Revisar acessibilidade e segurança da saída HTML.
- [ ] Converter/validar protótipo no formato HTML único com CSS embutido se esse critério da validação for obrigatório nesta entrega.
