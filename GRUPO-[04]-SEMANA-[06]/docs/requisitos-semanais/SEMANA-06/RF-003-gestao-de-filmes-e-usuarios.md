# ENTREGA SEMANAL DE REQUISITOS

**Data de referência:** 05/10/2026  
**Grupo:** Grupo 04 - Cinemark

**Integrantes:** Fabrício Aguiar (fabricio62258946@edu.df.senac.br); João Silva (joao61806466@edu.df.senac.br); Natanael Souza (natanael61421786@edu.df.senac.br)

---

## 1. IDENTIFICAÇÃO DO REQUISITO

### RF-003: Gestão de filmes e usuários

**ID:** RF-003  
**Título:** Gerenciar filmes e contas pelo painel administrativo  
**Prioridade:** Alta — mantém o catálogo e as contas do protótipo.  
**Complexidade:** 8 story points — estimativa sujeita à revisão da equipe.  
**Status:** Implementado no protótipo; persistência local, sem servidor.  
**Tipo:** Requisito Funcional

**Breve descrição:**  
O administrador consulta, cadastra, edita e exclui filmes e usuários. O painel oferece busca, filtros, indicadores e confirmação para exclusões.

## 2. DESCRIÇÃO E ATORES

- **Administrador (ator principal):** pode consultar, criar, editar e excluir filmes/usuários conforme as regras do painel; não pode remover ou rebaixar o último administrador.
- **Sistema (ator automático):** verifica a sessão administrativa, valida operações, atualiza listas/indicadores e persiste registros localmente.

## 3. ESPECIFICAÇÃO DE CASOS DE USO

### Pré-condições

- O usuário possui sessão com perfil `admin`.
- O navegador permite acesso ao `localStorage`.

### Pós-condições

**Sucesso:** operação válida atualiza a coleção local, a lista e os indicadores do painel.  
**Falha:** operação recusada deixa o registro original intacto e apresenta mensagem de validação.

### UC-003: Gerenciar filmes e usuários

### Fluxo principal

1. O administrador abre o painel.
2. O sistema valida a sessão e apresenta as abas de filmes e usuários e os indicadores.
3. O administrador escolhe uma aba, consulta os registros ou abre formulário de criação/edição.
4. O sistema valida e grava os dados.
5. Para excluir, o administrador solicita a ação e confirma.
6. O sistema atualiza a lista, os indicadores e o armazenamento.

### Fluxos alternativos

- **Sem sessão administrativa:** redirecionar para a tela de login.
- **Dados inválidos, duplicidade ou e-mail já usado:** não salvar e apresentar erro.
- **Tentativa de excluir ou rebaixar o último administrador:** bloquear a operação.
- **Exclusão cancelada:** manter os dados inalterados.

**RN-01:** Apenas administrador pode abrir o painel.  
**RN-02:** Título, gênero, ano e classificação indicativa são obrigatórios para filmes; título duplicado não é permitido.  
**RN-03:** Nome, e-mail e senha são obrigatórios na criação de usuário; a senha tem mínimo de oito caracteres.  
**RN-04:** E-mail deve ser válido e único; ao editar usuário, senha vazia mantém a senha atual.  
**RN-05:** A exclusão exige confirmação e o último administrador não pode ser removido ou rebaixado.  
**RN-06:** A busca e os filtros devem combinar seus critérios e oferecer estado vazio quando não houver correspondências.  
**RN-07:** Filmes devem ser listados alfabeticamente e a consulta de usuários deve permitir busca por nome/e-mail e filtro por perfil.  
**RN-08:** Ao editar um filme, o ID do registro é preservado e não podem ser criados títulos equivalentes duplicados.  
**RN-09:** Cancelar confirmação de exclusão não pode modificar o registro selecionado.  
**RN-10:** Indicadores devem refletir a quantidade de filmes, filmes em cartaz, usuários e administradores após alterações.

### Requisitos não funcionais relacionados

| ID | Requisito e critério de aceitação | Situação |
|---|---|---|
| RNF-01 | Busca e filtros devem atualizar a tabela em menos de 100 ms com 100 registros, medidos no navegador de referência. | Meta definida; medição pendente |
| RNF-02 | Acesso sem perfil administrativo deve ser redirecionado e textos de registros devem ser escapados antes de inserção em HTML. | Verificação parcial no protótipo; teste de segurança pendente |
| RNF-03 | Operações destrutivas exigem confirmação e falhas de validação não alteram os registros. | Implementado segundo o fluxo; testes de regressão pendentes |
| RNF-04 | O painel deve funcionar em 375, 768 e 1280 px, com tabelas roláveis. | Layout presente; validação visual pendente |
| RNF-05 | CRUD deve funcionar nas duas versões estáveis mais recentes de Chrome, Firefox e Safari. | Matriz de compatibilidade pendente |
| RNF-06 | Campos, ações e mensagens devem ser acessíveis por teclado e tecnologia assistiva; avaliar WCAG 2.1 AA. | Auditoria pendente; sem certificação |
| RNF-07 | Dados persistem após recarga na mesma origem enquanto o `localStorage` existir e não for limpo. | Persistência local implementada; teste de recarga pendente |
| RNF-08 | Documentar armazenamento finito, ausência de sincronização/backups e risco de dados locais adulteráveis. | Limitações descritas; exportação/backup não implementados |

### Escopo e limitações

O painel não sincroniza entre usuários ou dispositivos e não substitui autenticação e autorização em servidor. A exclusão de usuários e dados é local ao protótipo.

### Rastreabilidade

**Telas/arquivos:** `src/prototipos/SEMANA-06/admin.html`, `src/prototipos/SEMANA-06/js/admin.js`, `src/prototipos/SEMANA-06/js/store.js`.  
**Critério de aceite:** um administrador consegue manter filmes e usuários válidos; operações proibidas são recusadas sem alterar o registro.

## 4. PROTÓTIPOS / TELAS

**Tela existente:** `src/prototipos/SEMANA-06/admin.html`; estilos em `css/admin.css`; comportamento em `js/admin.js`.

```text
┌──────────────────────────────────────────────────────────┐
│ PAINEL ADMINISTRATIVO       [Ver site] [Restaurar] [Sair]│
│ Filmes: N | Em cartaz: N | Usuários: N | Admins: N       │
│ [Filmes] [Usuários]                                      │
│ [Buscar...] [Filtros]                     [+ Novo]       │
│ Tabela de registros                     [Editar] [Excluir]│
└──────────────────────────────────────────────────────────┘
```

O HTML e CSS são arquivos separados conforme a organização atual do protótipo. O mockup resume a tela; modais de edição e confirmação devem ser conferidos no navegador.

## 5. ARQUITETURA E DECISÕES TÉCNICAS

**Fluxo de dados:** ação na interface (`admin.html`) → evento em `admin.js` → validação/operação em `Store` (`store.js`) → serialização no `localStorage` → nova renderização da tabela e dos indicadores.

| Camada | Tecnologia | Uso |
|---|---|---|
| Interface | HTML, CSS e Bootstrap | Tabelas, abas e modais |
| Lógica | JavaScript (`admin.js`) | Renderização, filtros e formulários |
| Dados | `Store` / `localStorage` | CRUD local de filmes e usuários |
| Ícones | Font Awesome | Identificação visual de ações |

### ADR-001: Armazenamento no navegador

**Contexto:** o protótipo não dispõe de API/backend.  
**Decisão:** encapsular operações por `Store` e persistir os registros no `localStorage`.  
**Alternativas rejeitadas:** IndexedDB (complexidade adicional para o volume de demonstração) e API remota (fora do ambiente entregue).  
**Consequência:** simples de executar, mas limitado ao navegador/origem e sem controle multiusuário.

### ADR-002: Separação entre interface e Store

**Contexto:** regras de validação e persistência não devem estar misturadas em marcação HTML.  
**Decisão:** concentrar interações em `admin.js` e regras de dados em `store.js`.  
**Alternativa rejeitada:** CRUD inteiramente inline no HTML.  
**Consequência:** lógica reutilizável/testável com dependência explícita de carregamento dos scripts.

### ADR-003: Interface baseada em tabelas e modais

**Contexto:** painel precisa permitir leitura de vários registros e edição pontual.  
**Decisão:** tabelas para consulta, modais para cadastro/edição/confirmação.  
**Alternativa rejeitada:** páginas distintas para cada operação.  
**Consequência:** mantém contexto da lista, mas requer atenção a foco, acessibilidade e responsividade.

## 6. QUALIDADE E CONFORMIDADE

- [x] Identificação, prioridade, complexidade e status informados.
- [x] Atores, pré/pós-condições e fluxos principais/alternativos descritos.
- [x] Dez regras de negócio numeradas.
- [x] RNFs numerados, com critério de aceitação e situação.
- [x] Protótipo, organização de arquivos e fluxo de dados descritos.
- [x] Três ADRs com alternativas e consequências.
- [ ] Executar testes CRUD, filtros, validações e proteção do último administrador.
- [ ] Medir desempenho com 100 registros e validar navegadores/telas previstos.
- [ ] Fazer auditoria de segurança e acessibilidade; CSS permanece externo.
- [ ] Converter/validar protótipo no formato HTML único com CSS embutido se esse critério da validação for obrigatório nesta entrega.
