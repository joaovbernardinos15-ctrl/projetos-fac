# ENTREGA SEMANAL DE REQUISITOS

**Data de Entrega:** 28/09/2026
**Grupo:** Grupo 04 - Cinemark
**Integrantes:** Fabrício Aguiar (fabricio62258946@edu.df.senac.br); João Silva (joao61806466@edu.df.senac.br); Natanael Souza (natanael61421786@edu.df.senac.br)

---

## 1. IDENTIFICAÇÃO DO REQUISITO

### RF-003: Gestão de Filmes e Usuários

**ID:** RF-003
**Título:** Gerenciar filmes e usuários pelo painel administrativo
**Prioridade:** Alta — o catálogo e as contas dependem desta manutenção.
**Complexidade:** 8 story points — estimativa para dois CRUDs, filtros, sessão e validações; sujeita à revisão da equipe.
**Status:** Implementado no protótipo / em revisão acadêmica.
**Tipo:** Requisito Funcional

**Breve Descrição:**
O sistema permite que um administrador autenticado cadastre, consulte, edite e exclua filmes e usuários. O painel também apresenta indicadores e oferece busca e filtros para localizar registros.

---

## 2. DESCRIÇÃO E ATORES

### Descrição Detalhada

O painel administrativo centraliza a manutenção do catálogo de filmes e das contas de usuários do protótipo Cinemark. Para filmes, permite informar título, gênero, ano, classificação indicativa, caminho do pôster, sinopse e situação em cartaz. Para usuários, permite manter nome, e-mail, perfil e senha.

Os dados são armazenados no navegador por meio do `localStorage`. O protótipo não utiliza servidor ou banco de dados remoto.

### Atores do Sistema

#### 1. Administrador (ator principal)

- **Papel:** Gerenciar filmes e contas de usuários pelo painel administrativo.
- **Responsabilidades:** Consultar e localizar registros, cadastrar e editar informações e confirmar exclusões.
- **Permissões no painel:** CREATE, READ, UPDATE e DELETE de filmes e usuários.
- **Restrição observada:** O sistema não permite excluir o último administrador cadastrado.

#### 2. Sistema (ator automático)

- **Papel:** Validar operações, apresentar os registros e persistir as alterações no navegador.
- **Responsabilidades:** Aplicar as regras de validação implementadas, atualizar os indicadores e impedir o acesso ao painel quando a sessão não pertence a um administrador.

---

## 3. ESPECIFICAÇÃO DE CASOS DE USO

### UC-003: Gerenciar filmes e usuários

#### Pré-Condições

- O administrador deve estar autenticado.
- A sessão atual deve possuir o perfil `admin`.
- O navegador deve permitir o uso de `localStorage`.

#### Pós-Condições (Sucesso)

- A operação realizada é refletida na lista correspondente.
- Os dados alterados são gravados no `localStorage` do navegador.
- Os indicadores do painel são atualizados após as operações de cadastro, edição e exclusão.

#### Pós-Condições (Falha)

- A operação inválida não é aplicada.
- O painel apresenta a mensagem de validação correspondente.

#### Fluxo Principal

1. O administrador entra no painel administrativo após autenticar-se.
2. O sistema verifica se a sessão possui perfil de administrador.
3. O sistema apresenta as abas de filmes e usuários e os indicadores do painel.
4. O administrador escolhe uma das abas.
5. Para localizar registros, o administrador informa um termo de busca ou seleciona um filtro disponível.
6. Para cadastrar um registro, o administrador aciona o botão de novo filme ou novo usuário.
7. O sistema apresenta o formulário correspondente.
8. O administrador informa os dados e solicita o salvamento.
9. O sistema valida os dados e grava o novo registro ou as alterações no `localStorage`.
10. O sistema atualiza a lista e os indicadores e apresenta uma confirmação.
11. Para excluir um registro, o administrador aciona a opção de exclusão e confirma a operação.
12. O sistema remove o registro, atualiza a lista e apresenta uma confirmação.

#### Fluxos Alternativos

**A1: Usuário sem perfil administrativo**

1. O sistema identifica que não há sessão administrativa válida.
2. O sistema redireciona o usuário para `login.html`.

**A2: Dados obrigatórios do filme ausentes**

1. O sistema identifica a ausência de título, gênero, ano ou classificação.
2. O sistema não grava o filme e apresenta uma mensagem informando os campos obrigatórios.

**A3: Título de filme já cadastrado**

1. O sistema identifica outro filme com título equivalente, desconsiderando diferenças de maiúsculas, minúsculas e acentuação.
2. O sistema não grava o cadastro ou alteração e informa que já existe um filme com esse título.

**A4: Dados obrigatórios ou senha inválidos no cadastro de usuário**

1. O sistema identifica nome, e-mail ou senha ausentes, ou senha com menos de oito caracteres.
2. O sistema não grava o usuário e apresenta a mensagem de validação correspondente.

**A5: Tentativa de excluir o último administrador**

1. O administrador solicita a exclusão da última conta com perfil administrativo.
2. O sistema bloqueia a operação e apresenta uma mensagem informando que o último administrador não pode ser excluído.

### UC-003.1: Atualizar usuário

#### Fluxo Principal

1. O administrador abre a aba Usuários.
2. O sistema exibe a lista de usuários.
3. O administrador localiza o usuário pela busca ou pelo filtro de perfil.
4. O administrador aciona a opção de editar na linha do usuário.
5. O sistema abre o modal com nome, e-mail e perfil preenchidos.
6. O administrador altera um ou mais dados; se não quiser trocar a senha, deixa o campo senha em branco.
7. O administrador aciona Salvar.
8. O sistema valida os dados e grava as alterações no `localStorage`.
9. O sistema fecha o modal, atualiza a lista e apresenta uma confirmação.

#### Fluxos Alternativos

**A6: E-mail já utilizado por outra conta**

1. O sistema identifica que outro usuário já utiliza o e-mail informado.
2. O sistema não salva a alteração e apresenta uma mensagem de erro.

**A7: Nova senha com menos de oito caracteres**

1. O administrador informa uma nova senha com menos de oito caracteres.
2. O sistema não salva a alteração e informa o tamanho mínimo permitido.

### UC-003.2: Excluir usuário

#### Fluxo Principal

1. O administrador abre a aba Usuários e localiza a conta que deseja excluir.
2. O administrador aciona a opção de excluir na linha do usuário.
3. O sistema apresenta uma confirmação com o nome da conta e informa que a ação não pode ser desfeita.
4. O administrador confirma a exclusão.
5. O sistema verifica se a operação é permitida e remove o usuário do `localStorage`.
6. O sistema atualiza a lista e apresenta uma confirmação.

#### Fluxos Alternativos

**A8: Administrador cancela a exclusão**

1. No modal de confirmação, o administrador aciona Cancelar.
2. O sistema fecha o modal sem alterar a conta.

**A9: Administrador exclui a própria conta**

1. O administrador confirma a exclusão da própria conta.
2. O sistema remove a conta, encerra a sessão e redireciona para `index.html`.

### UC-003.3: Consultar e filtrar filmes

**Pré-condição:** sessão administrativa; dados locais disponíveis.
**Pós-condição:** registros exibidos sem alterar os dados armazenados.

1. O administrador abre a aba Filmes.
2. O sistema lista os filmes em ordem alfabética de título.
3. O administrador busca por título ou gênero e/ou filtra por gênero e situação em cartaz.
4. O sistema combina os critérios e atualiza a tabela.
5. Ao limpar os critérios, todos os filmes voltam a ser exibidos.

**Alternativa:** sem correspondências, o sistema apresenta o estado vazio. A busca ignora caixa e acentuação. Não há paginação neste protótipo.

### UC-003.4: Consultar e filtrar usuários

**Pré-condição:** sessão administrativa; dados locais disponíveis.
**Pós-condição:** consulta sem alteração das contas.

1. O administrador abre a aba Usuários.
2. O sistema lista as contas em ordem alfabética de nome.
3. O administrador busca por nome ou e-mail e/ou seleciona Cliente ou Administrador.
4. O sistema combina os critérios e atualiza a tabela.
5. Ao limpar os critérios, todas as contas voltam a ser exibidas.

**Alternativa:** sem correspondências, o sistema apresenta o estado vazio.

#### Regras de Negócio (RN)

**RN-01:** Somente uma sessão com perfil `admin` pode acessar o painel administrativo.
**RN-02:** Título, gênero, ano e classificação são obrigatórios para cadastrar um filme.
**RN-03:** Não é permitido cadastrar filmes com títulos duplicados; a comparação ignora caixa e acentuação.
**RN-04:** Nome, e-mail e senha são obrigatórios para cadastrar um usuário.
**RN-05:** A senha de um usuário deve ter no mínimo oito caracteres.
**RN-06:** Não é permitido cadastrar mais de um usuário com o mesmo e-mail.
**RN-07:** Não é permitido excluir o último usuário com perfil de administrador.
**RN-08:** Ao editar usuário, deixar a senha em branco mantém a senha atual.
**RN-09:** A exclusão de filme ou usuário exige confirmação no painel.
**RN-10:** No formulário de usuário, o perfil pode ser selecionado como Cliente ou Administrador.

**RN-11:** Não é permitido remover o perfil do último administrador, inclusive por edição.
**RN-12:** Campos obrigatórios permanecem obrigatórios na edição; valores apenas com espaços são rejeitados. O e-mail deve ter formato válido e o perfil deve ser Cliente ou Administrador.

#### Requisitos Não Funcionais

Os critérios abaixo são verificáveis. Definir uma meta não equivale a comprovar seu atendimento.

| ID | Requisito e critério de aceitação | Situação |
|---|---|---|
| RNF-01 | Busca e filtro devem atualizar a tabela em menos de 100 ms com 100 registros, medidos após o carregamento no navegador de referência. | Meta; medição no navegador pendente |
| RNF-02 | Acesso sem sessão administrativa deve redirecionar ao login; textos inseridos nas tabelas devem ser escapados. | Implementado; segurança limitada ao protótipo |
| RNF-03 | Operações destrutivas devem exigir confirmação e operações inválidas devem apresentar mensagem sem alterar o registro. | Implementado |
| RNF-04 | O painel deve permitir uso em larguras de 375, 768 e 1280 px, com tabelas roláveis e controles acessíveis. | Layout implementado; revisão visual pendente |
| RNF-05 | Fluxos CRUD devem funcionar nas duas últimas versões estáveis de Chrome, Firefox e Safari. | Matriz de compatibilidade pendente |
| RNF-06 | Campos devem possuir labels, ações nomes acessíveis e mensagens de erro perceptíveis; avaliar teclado, foco e contraste para WCAG 2.1 AA. | Auditoria completa pendente; não há certificação AA |
| RNF-07 | Alterações devem permanecer após recarregar a página na mesma origem e navegador, enquanto o armazenamento existir. | Implementado com localStorage |
| RNF-08 | Documentar capacidade, disponibilidade e recuperação: armazenamento finito, dependências CDN e ausência de backup automático. | Documentado; backup/exportação não implementados |


---

## 4. PROTÓTIPOS / TELAS

### Protótipo Existente

O painel administrativo está implementado em `src/prototipos/SEMANA-05/RF-003-GESTAO-DE-FILMES/admin.html`. Os estilos e comportamentos estão em arquivos separados (`css/admin.css`, `js/admin.js` e `js/store.js`); o CSS não está embutido no HTML.

### Mockups das Telas

Os mockups abaixo representam os componentes e estados existentes no painel. Os dados usados nos exemplos são ilustrativos.

**Tela 1: Painel administrativo — aba Filmes**

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Cinemark · PAINEL ADMINISTRATIVO                    [Ver o site] [Sair]  │
│ Gestão de conteúdo                                                       │
│ Filmes cadastrados: 17 | Em cartaz: 17 | Usuários: — | Administradores: —│
├──────────────────────────────────────────────────────────────────────────┤
│ [ Filmes ] [ Usuários ]                                                 │
│                                                                          │
│ [Buscar por título ou gênero...] [Todos os gêneros v] [Todos os status v]│
│                                                        [ + Novo filme ]  │
│                                                                          │
│ Pôster    Título                 Gênero   Ano   Class.  Status   Ações   │
│ [img]     A Odisseia             Ação     2026  14      EM CARTAZ [E][X] │
│ [img]     Cansei de Ser Nerd     Comédia  2026  12      EM CARTAZ [E][X] │
└──────────────────────────────────────────────────────────────────────────┘
```

`[E]` representa editar e `[X]` representa excluir. A quantidade dos indicadores varia conforme os dados locais.

**Tela 2: Cadastro/edição de filme — formulário vazio**

```text
┌────────────────────────────────────────────────────────────┐
│ Novo filme                                             [ X ]│
├────────────────────────────────────────────────────────────┤
│ Título *                                                   │
│ [Ex.: A Odisseia________________________________________]  │
│                                                            │
│ Gênero *                         Ano *                     │
│ [Ex.: Ação________________]       [2026________________]    │
│                                                            │
│ Classificação *                 Caminho do pôster          │
│ [L — Livre                 v]    [./img/meu-poster.png___] │
│                                                            │
│ Sinopse                                                    │
│ [Resumo do filme (opcional)_____________________________] │
│                                                            │
│ [x] Em cartaz (aparece no carrossel da home)               │
├────────────────────────────────────────────────────────────┤
│                                      [Cancelar] [Salvar]    │
└────────────────────────────────────────────────────────────┘
```

Na edição, o mesmo modal aparece com os dados atuais preenchidos e o título “Editar filme”.

**Tela 3: Erro de validação no filme**

```text
┌────────────────────────────────────────────────────────────┐
│ Novo filme                                             [ X ]│
├────────────────────────────────────────────────────────────┤
│ Já existe um filme cadastrado com esse título.             │
│                                                            │
│ Título *                                                   │
│ [A Odisseia_____________________________________________]  │
│ Gênero * [Ação________________]  Ano * [2026___________]   │
│ Classificação * [14 anos         v]                        │
│                                                            │
│                                      [Cancelar] [Salvar]   │
└────────────────────────────────────────────────────────────┘
```

Essa mensagem é exibida quando o título informado já existe. O painel também apresenta mensagem quando faltam título, gênero, ano ou classificação.

**Tela 4: Painel administrativo — aba Usuários**

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Gestão de conteúdo                                                       │
│ [ Filmes ] [ Usuários ]                                                 │
│                                                                          │
│ [Buscar por nome ou e-mail...] [Todos os perfis v] [ + Novo usuário ]   │
│                                                                          │
│ Nome                 E-mail                    Perfil       Cadastrado   │
│ Gerente de Conteúdo  admin@cinemark.com        ADMIN        27/09/2026  [E][X]
│ João Silva           joao@email.com            CLIENTE      27/09/2026  [E][X]
└──────────────────────────────────────────────────────────────────────────┘
```

As ações `[E]` e `[X]` permitem, respectivamente, editar e solicitar a exclusão do usuário selecionado.

**Tela 5: Edição de usuário — formulário preenchido**

```text
┌────────────────────────────────────────────────────────────┐
│ Editar usuário                                         [ X ]│
├────────────────────────────────────────────────────────────┤
│ Nome completo *                                            │
│ [Gerente de Conteúdo___________________________________]  │
│                                                            │
│ E-mail *                                                   │
│ [admin@cinemark.com____________________________________]  │
│                                                            │
│ Perfil *                         Senha                     │
│ [Administrador             v]    [Mínimo 8 caracteres___] │
│                                  Deixe em branco para       │
│                                  manter a senha atual.      │
├────────────────────────────────────────────────────────────┤
│                                      [Cancelar] [Salvar]    │
└────────────────────────────────────────────────────────────┘
```

O campo Perfil também oferece a opção Cliente. Para um novo usuário, a senha é obrigatória; na edição, pode ficar em branco para manter a senha atual.

**Estado vazio:** quando uma busca ou filtro não encontra registros, a tabela mostra “Nenhum filme encontrado com esses filtros.” ou “Nenhum usuário encontrado com esses filtros.”, conforme a aba selecionada.

**Tela 6: Confirmação de exclusão de filme**

```text
┌──────────────────────────────────────────────┐
│ Confirmar exclusão                      [ X ]│
├──────────────────────────────────────────────┤
│ Excluir o filme A Odisseia?                  │
│ Essa ação não pode ser desfeita.             │
├──────────────────────────────────────────────┤
│                    [Cancelar] [Excluir]      │
└──────────────────────────────────────────────┘
```

**Tela 7: Confirmação de exclusão de usuário**

```text
┌──────────────────────────────────────────────┐
│ Confirmar exclusão                      [ X ]│
├──────────────────────────────────────────────┤
│ Excluir a conta de João Silva?               │
│ Essa ação não pode ser desfeita.             │
├──────────────────────────────────────────────┤
│                    [Cancelar] [Excluir]      │
└──────────────────────────────────────────────┘
```

O painel usa o mesmo modal para excluir filmes e usuários, substituindo a mensagem pelo registro selecionado. Se a operação não puder ser concluída, como na tentativa de excluir o último administrador, a mensagem de erro aparece no modal.

**Estado de carregamento:** não há spinner nem estado de carregamento implementado no protótipo.

### Fluxo de Navegação

1. O administrador autentica-se na tela de login.
2. Após o login, é direcionado ao painel administrativo.
3. No painel, alterna entre as abas Filmes e Usuários.
4. Pode abrir os formulários de cadastro/edição ou solicitar a exclusão de um registro.
5. Pode retornar ao site ou encerrar a sessão.

O protótipo consultado não apresenta um estado de carregamento com spinner. A interface utiliza arquivos CSS e JavaScript externos, em vez de CSS embutido no `admin.html`.

---

## 5. ARQUITETURA E DECISÕES TÉCNICAS

### Arquitetura da Solução

```text
┌─────────────────────────────┐
│ Navegador                   │
│ admin.html + admin.css      │
│ admin.js                    │
└──────────────┬──────────────┘
               │ chamadas locais
               ▼
┌─────────────────────────────┐
│ Store (store.js)            │
│ CRUD de filmes e usuários   │
│ Controle de sessão          │
└──────────────┬──────────────┘
               │ leitura e gravação
               ▼
┌─────────────────────────────┐
│ localStorage do navegador   │
│ filmes, usuários e sessão   │
└─────────────────────────────┘
```

### ADR-001: Persistência local com `localStorage`

**Status:** Implementado no protótipo
**Contexto:** O projeto implementa a persistência no próprio navegador e não possui integração com backend ou banco de dados remoto.
**Decisão observada:** O módulo `js/store.js` concentra as operações de leitura e gravação de filmes, usuários e sessão no `localStorage`.
**Consequência observada:** Os dados ficam associados ao navegador em que foram cadastrados; não há sincronização entre dispositivos ou usuários.

### ADR-002: Separação da interface e camada de dados

**Status:** Adotado.
**Contexto:** várias telas compartilham filmes, usuários e sessão.
**Decisão:** HTML/CSS apresentam a interface; `admin.js` controla eventos e renderização; `store.js` centraliza CRUD e validação. Trata-se de separação em camadas, semelhante a MVC, sem framework MVC formal.
**Alternativa rejeitada:** duplicar CRUD em cada página.
**Consequências:** regras reaproveitáveis e testes isolados; ainda há acoplamento aos IDs do DOM e ao armazenamento do navegador.

### ADR-003: localStorage em vez de IndexedDB ou API

**Status:** Adotado para a demonstração.
**Contexto:** pequeno catálogo e execução sem servidor.
**Decisão:** manter armazenamento síncrono simples. IndexedDB adicionaria transações e maior capacidade, mas também complexidade; uma API permitiria dados compartilhados e controle de acesso real, exigindo backend.
**Consequências:** adequado à demonstração, sem sincronização, transações entre coleções ou garantia contra alterações concorrentes. A capacidade depende do navegador/origem; cerca de 5 MiB é uma referência de planejamento, não uma garantia universal. Gravações podem falhar por quota ou bloqueio e ainda não possuem tratamento completo na interface.

### ADR-004: Bootstrap e validação no navegador

**Status:** Adotado no protótipo.
**Contexto:** implementar modais e layout responsivo com a estrutura existente.
**Decisão:** manter Bootstrap 5.3.3 e CSS próprio em vez de migrar para Tailwind ou reescrever componentes. Validar regras no Store, independentemente do formulário.
**Consequências:** reaproveitamento e entrega mais simples; dependência de CDN. Validação no navegador pode ser contornada, portanto uma versão de produção exige validação e autorização no backend.

### Fluxo de dados

```mermaid
flowchart TD
    A[Administrador] --> B[Formulário e admin.js]
    B --> C[Store: validação]
    C --> D{Dados válidos?}
    D -->|Não| E[Mensagem de erro]
    D -->|Sim| F[localStorage: gravação]
    F --> G[Store: leitura]
    G --> H[Tabela e indicadores]
```

Consultas seguem `admin.js → Store.listar() → localStorage → filtros → tabela` sem gravar. As chaves são `cinemark:filmes`, `cinemark:usuarios` e `cinemark:sessao`.

### Limitações e segurança

Visitantes e clientes acessam as páginas públicas, mas não têm permissão de painel. O sistema é um componente interno, não um usuário externo. A sessão local pode ser adulterada; não representa autenticação segura de produção. Senhas estão em texto puro e devem ser exclusivamente fictícias. Escape de texto reduz injeção nas tabelas, mas não comprova ausência de XSS em todo o site. Uma versão de produção precisaria de backend, hash de senhas, autorização no servidor e HTTPS/TLS. HTTPS sozinho não protege dados locais contra scripts maliciosos.

Os dados pertencem à origem e ao navegador, podem ser apagados e não são compartilhados entre dispositivos. Não há backup, disponibilidade garantida nem controle de concorrência. A opção Restaurar padrão é destrutiva e não recupera cadastros anteriores. Recursos CDN exigem conectividade/cache; não se promete funcionamento totalmente offline. Não há spinner porque as operações atuais são síncronas; futura API deverá adicionar estados de carregamento e falha.

### Tecnologias Utilizadas

| Camada | Tecnologia | Uso observado |
|---|---|---|
| Estrutura das telas | HTML | Páginas do protótipo, incluindo o painel administrativo |
| Estilos | CSS | Arquivos externos para apresentação e layout |
| Comportamento e regras | JavaScript | Eventos da interface, validações e operações CRUD |
| Persistência | `localStorage` | Armazenamento local de filmes, usuários e sessão |
| Componentes visuais | Bootstrap 5.3.3 | Biblioteca referenciada no HTML do painel |
| Ícones | Font Awesome 6.5.2 | Ícones referenciados no HTML do painel |

---

## 6. QUALIDADE E CONFORMIDADE

- [x] Identificação do requisito baseada na funcionalidade existente.
- [x] Descrição e regras de negócio alinhadas ao código do protótipo.
- [x] Fluxos de sucesso, validação e acesso administrativo documentados.
- [x] Arquitetura descrita conforme a persistência atualmente implementada.
- [x] Localização do painel administrativo informada.
- [x] Entrada `RF-03.html` adicionada, direcionando ao painel `admin.html`; CSS/JS externos preservados. A recomendação de nomenclatura é informativa na validação.
- [ ] Confirmar com o professor eventual exigência adicional de HTML único com CSS embutido; não foi presumida equivalência desse formato com a entrada adicionada.
- [x] Requisitos não funcionais numerados com critérios e pendências explícitos.

---

**Observação:** Este documento descreve o estado atual do protótipo da Semana 05; não pressupõe backend, banco de dados, integrações ou comportamentos que não estejam implementados.

### Validação executada nesta revisão

Execute `node tests/rf003-store.test.cjs` na raiz do repositório. O teste usa armazenamento em memória e verifica CRUD, título duplicado, campos obrigatórios, e-mail, manutenção de senha e proteção do último administrador. Passou nesta revisão; não substitui teste visual ou em navegadores reais. Sintaxe de `store.js` e `admin.js` também verificada com `node --check`.
