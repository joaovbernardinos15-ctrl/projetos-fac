# ENTREGA SEMANAL DE REQUISITOS

**Data de referência:** 05/10/2026  
**Grupo:** Grupo 04 - Cinemark

**Integrantes:** Fabrício Aguiar (fabricio62258946@edu.df.senac.br); João Silva (joao61806466@edu.df.senac.br); Natanael Souza (natanael61421786@edu.df.senac.br)

---

## 1. IDENTIFICAÇÃO DO REQUISITO

### RF-001: Apresentação da página inicial

**ID:** RF-001  
**Título:** Apresentar destaques e atalhos da plataforma  
**Prioridade:** Alta — é o ponto inicial de navegação do visitante.  
**Complexidade:** 3 story points — estimativa sujeita à revisão da equipe.  
**Status:** Implementado parcialmente no protótipo.  
**Tipo:** Requisito Funcional

**Breve descrição:**  
O sistema apresenta na página inicial um filme em destaque, uma seleção de filmes do catálogo e atalhos para o catálogo completo e para a loja.

## 2. DESCRIÇÃO E ATORES

### Atores

- **Visitante ou cliente (ator principal):** consulta os destaques e escolhe uma área do site; tem permissão para navegar ao catálogo, aos detalhes e à loja, sem precisar autenticar-se.
- **Sistema (ator automático):** obtém os filmes locais disponíveis, renderiza destaque e cards e oferece navegação; não concede acesso a funções administrativas.

## 3. ESPECIFICAÇÃO DE CASOS DE USO

### Pré-condições

- A página inicial e os arquivos JavaScript necessários estão disponíveis.
- O navegador permite executar JavaScript e acessar o armazenamento local usado pelo protótipo.

### Pós-condições

**Sucesso:** destaque e filmes locais disponíveis foram apresentados; o usuário pode seguir para filme, catálogo ou loja.  
**Falha:** se não houver dados ou JavaScript, a página não deve indicar reprodução inexistente e os links estáticos principais permanecem disponíveis.

### UC-001: Consultar a página inicial

### Fluxo principal

1. O usuário abre `index.html`.
2. O sistema apresenta o destaque e os filmes marcados como em cartaz.
3. O usuário navega pelos cards do carrossel ou seleciona um dos atalhos.
4. O sistema direciona o usuário ao detalhe do filme, ao catálogo ou à loja conforme a ação.

### Fluxos alternativos

- **Catálogo vazio:** a página continua oferecendo os atalhos para catálogo e loja, mesmo sem cards de filmes.
- **Filme sem fonte de vídeo:** o destaque ou card permanece consultável; a tela de reprodução informa a indisponibilidade.

**RN-01:** Os filmes mostrados como disponíveis devem respeitar o estado registrado no catálogo.  
**RN-02:** O destaque deve identificar o filme e disponibilizar navegação para o catálogo ou para seus detalhes.  
**RN-03:** Os atalhos para catálogo e loja devem permanecer acessíveis independentemente da autenticação.  
**RN-04:** A página não deve afirmar que um vídeo pode ser reproduzido quando não existe fonte válida.  
**RN-05:** Os dados apresentados no destaque devem corresponder ao registro do filme selecionado no armazenamento local.  
**RN-06:** A navegação do destaque para os detalhes deve usar o identificador do filme; quando nenhum destaque válido existir, deve haver caminho para o catálogo.

### Requisitos não funcionais relacionados

| ID | Requisito e critério de aceitação | Situação |
|---|---|---|
| RNF-01 | A página deve ser utilizável em larguras de 375, 768 e 1280 px sem rolagem horizontal indevida. | CSS responsivo presente; validação visual pendente |
| RNF-02 | Controles do carrossel devem ter nome acessível, foco visível e operação por teclado. | Rótulos presentes no HTML; teste de teclado/foco pendente |
| RNF-03 | Imagens informativas devem possuir texto alternativo significativo; imagens decorativas devem usar alternativa vazia. | Implementação parcial; revisar os banners/destaque |
| RNF-04 | A página deve apresentar conteúdo sem depender de autenticação do usuário. | Implementado pela navegação pública |
| RNF-05 | A renderização de filmes deve usar dados do catálogo local e não declarar reprodução disponível sem fonte de vídeo válida. | Fonte local e estado de disponibilidade verificados; teste de ponta a ponta pendente |
| RNF-06 | A página deve continuar oferecendo acesso ao catálogo e à loja quando a lista de filmes estiver vazia. | Links presentes; cenário vazio requer teste manual |
| RNF-07 | Compatibilidade visual e funcional deve ser validada nas duas últimas versões estáveis de Chrome, Firefox e Safari. | Matriz de navegadores pendente |

### Escopo e limitações

A página usa dados do protótipo, sem serviço remoto de recomendação ou personalização. Não há comprovação de métricas de audiência, recomendações baseadas em histórico ou atualização em tempo real.

### Rastreabilidade

**Telas/arquivos:** `src/prototipos/SEMANA-06/index.html`, `src/prototipos/SEMANA-06/js/site.js`.  
**Critério de aceite:** ao abrir a página inicial, o usuário visualiza os destaques disponíveis e consegue navegar para catálogo, detalhe de filme e loja pelos controles apresentados.

## 4. PROTÓTIPOS / TELAS

**Tela existente:** `src/prototipos/SEMANA-06/index.html`; estilos em `css/home.css`, `css/style.css` e `css/navbar.css`; comportamento em `js/site.js`.

```text
┌─────────────────────────────────────────────┐
│ Cinemark   Início  Filmes  Loja  Planos     │
├─────────────────────────────────────────────┤
│ EM DESTAQUE                                 │
│ [Pôster] Título, descrição e metadados      │
│          [Assistir destaque] [Explorar]      │
├─────────────────────────────────────────────┤
│ Filmes para descobrir        [‹] [›]         │
│ [Card de filme] [Card de filme]              │
├─────────────────────────────────────────────┤
│ Prepare seus favoritos       [Explorar loja] │
└─────────────────────────────────────────────┘
```

Estados a validar: lista normal, catálogo sem filmes, destaque sem fonte de vídeo e viewport móvel. O protótipo usa CSS externo; não foi convertido para HTML com CSS embutido.

## 5. ARQUITETURA E DECISÕES TÉCNICAS

**Fluxo de dados:** `index.html` carrega `store.js` e `site.js` → `Store.filmes.listar()` lê os dados locais → `site.js` monta o destaque e carrossel → links abrem `filme.html`, `filmes.html` ou `lanches.html`.

| Camada | Tecnologia | Uso |
|---|---|---|
| Interface | HTML e CSS externo | Estrutura e apresentação da página inicial |
| Comportamento | JavaScript (`site.js`) | Dados do destaque e controles do carrossel |
| Dados | `Store` / `localStorage` | Catálogo demonstrativo persistido no navegador |
| Componentes visuais | Bootstrap e Font Awesome | Navegação, modal e ícones |

### ADR-001: Dados locais do catálogo

**Contexto:** o protótipo não possui API ou servidor.  
**Decisão:** reutilizar `Store.filmes` e o `localStorage` já usados pelo site.  
**Alternativa rejeitada:** catálogo fixo duplicado no HTML/JavaScript.  
**Consequência:** alterações locais do catálogo podem aparecer na home; não há sincronização entre navegadores.

### ADR-002: Carrossel Bootstrap

**Contexto:** a home precisa navegar por banners e grupos de filmes com controles de interface conhecidos.  
**Decisão:** manter os componentes Bootstrap já incluídos no protótipo.  
**Alternativa rejeitada:** adicionar biblioteca de carrossel adicional.  
**Consequência:** o comportamento depende do JavaScript/CSS carregado pelo Bootstrap CDN.

### ADR-003: Links para páginas dedicadas

**Contexto:** a home não contém todos os filtros ou detalhes de reprodução.  
**Decisão:** usar links às páginas dedicadas de catálogo, filme e loja.  
**Alternativa rejeitada:** concentrar catálogo, detalhe e loja em um único documento.  
**Consequência:** navegação simples entre páginas; estados de interface não são uma aplicação SPA.

## 6. QUALIDADE E CONFORMIDADE

- [x] Identificação, prioridade, complexidade e status informados.
- [x] Atores, pré-condições, fluxos principal e alternativos descritos.
- [x] Seis regras de negócio numeradas.
- [x] Requisitos não funcionais numerados, com critério e situação.
- [x] Tela, caminhos dos arquivos e fluxo de dados informados.
- [x] Três ADRs com contexto, decisão, alternativa e consequência.
- [ ] Testar estados normal/vazio em navegadores e larguras previstos.
- [ ] Auditar teclado, foco, leitor de tela, contraste e texto alternativo.
- [ ] Validar visualmente o protótipo; CSS permanece em arquivo externo.
- [ ] Converter/validar o protótipo no formato HTML único com CSS embutido, caso este critério da validação seja obrigatório para a Semana 06.
