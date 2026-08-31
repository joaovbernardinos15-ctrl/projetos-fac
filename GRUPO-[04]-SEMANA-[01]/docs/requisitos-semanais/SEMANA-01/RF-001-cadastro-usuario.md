# 📋 ENTREGA DE REQUISITOS - CINEMARK 

**Versão:** 12.2  
**Laboratório de Inovação -** Prof. Edilberto Silva — 2026  
**Formato:** Markdown (será corrigido automaticamente)  
**Valor Total da Entrega:** 100%  
**Data de Entrega:** 30/08/2026  
**Grupo:** 04-Cinemark 
**Integrantes:** Fabricio (fabricio62258946@edu.df.senac.br); Iara (iara50527796@edu.df.senac.br); João Victor (joao61806466@edu.df.senac.br); Natanael (natanael61421786@edu.df.senac.br);  

---

## ⚙️ ESCOPO DESTA ENTREGA

Esta entrega contém **apenas o protótipo de interface (front-end estático)** das telas de Cadastro, Login e Recuperação de Senha: HTML + CSS, sem JavaScript e sem integração com backend, banco de dados ou APIs externas.

Os campos usam apenas validação nativa do navegador (atributos HTML `required`, `type="email"`, `minlength`). Não há: verificação real de e-mail duplicado, criptografia de senha, geração de token de sessão, nem persistência de dados. Os botões "CADASTRAR", "ENTRAR" e "ENVIAR LINK" não enviam dados a lugar nenhum — é uma tela estática, navegável apenas pelos links entre as 3 páginas.

---

## ⚙️ ESTRUTURA DE DIRETÓRIOS

```
GRUPO-[04]-SEMANA-[01]/
├── docs/
│   ├── requisitos-semanais/
│   │   ├── SEMANA-01/
│   │   │   ├── RF-001-cadastro-usuario.md
│   │   │── SEMANA-02/
│   │   │   ├── RF-002-catalogo-filmes.md
│   │   │── SEMANA-03/
│   │   │   └── RF-003-reprodutor-video.md
│   │   └── ...
│
├── src/
│   ├── prototipos/
│   │   ├── SEMANA-01/
│   │   │   ├── RF-001-cadastro-usuario/
│   │   │   │   ├── cadastro.html (Cadastro - CSS embutido via <style>) - OBRIGATÓRIO ⚠️
│   │   │   │   ├── login.html (Login - CSS embutido via <style>)
│   │   │   │   └── esqueceu-senha.html (Recuperação de senha - CSS embutido via <style>)
│   │   └── ...
```

**Localização deste arquivo:**  
`docs/requisitos-semanais/SEMANA-01/RF-001-cadastro-usuario.md`

**Localização do Protótipo HTML+CSS:**  
`src/prototipos/SEMANA-01/RF-001-cadastro-usuario/` — pasta com 3 arquivos, cada um com CSS embutido em `<style>` (sem dependência de arquivo `.css` externo):
- `cadastro.html` — tela de cadastro (arquivo obrigatório avaliado no tópico 4)
- `login.html` — tela de login, acessível pelo link "Entra em conta existente"
- `esqueceu-senha.html` — tela de recuperação de senha, acessível pelo link "Esqueceu sua senha?"

---

## 1️⃣ IDENTIFICAÇÃO DO REQUISITO

### RF-001: Cadastro de Usuário na Plataforma CineStream

**ID:** RF-001  
**Título:** Tela de Cadastro de Usuário/Assinante na Plataforma CineStream  
**Tipo:** Requisito Funcional  
**Prioridade:** ALTA (bloqueia o acesso ao catálogo, criação de perfil e assinaturas)  
**Complexidade:** BAIXA (estimado 3 story points)  
**Status:** PROTÓTIPO DE INTERFACE CONCLUÍDO (HTML+CSS estático) — lógica de backend ainda não implementada  
**Data de Criação:** 21/08/2026  
**Data de Entrega:** 24/08/2026  
**Última Atualização:** 24/08/2026  

**Breve Descrição:**  
Esta entrega apresenta o protótipo visual (HTML+CSS) da tela de cadastro do CineStream, com campos de nome completo, e-mail e senha, além de botões de acesso via redes sociais (Google, Facebook, Apple) — estes últimos apenas como links visuais, sem integração OAuth real. A tela se conecta, por navegação simples entre páginas, às telas de Login e "Esqueci minha senha".

---

## 2️⃣ DESCRIÇÃO E ATORES

### Descrição Detalhada

**Por que este requisito existe?**  
O cadastro é a porta de entrada da plataforma CineStream: sem uma conta, o usuário não acessa o catálogo, não personaliza preferências e não assina o serviço. Esta etapa do laboratório entrega a interface visual dessa jornada, servindo de base para a futura implementação da lógica de autenticação.

**Contexto do Negócio:**  
O CineStream é planejado para operar sob modelo SVOD (Subscription Video on Demand). O fluxo de cadastro é a porta de entrada para novos clientes, por isso a interface foi desenhada priorizando simplicidade visual e clareza dos campos.

---

### Atores do Sistema

#### 1. ESPECTADOR (Ator Principal)
- **Papel:** Preencher o formulário de cadastro na interface
- **Responsabilidade:** Digitar nome, e-mail e senha, ou clicar em um dos ícones de rede social (sem efeito funcional nesta entrega)
- **Permissões nesta entrega:**
  - ✅ Visualizar e preencher os campos do formulário
  - ✅ Navegar entre as telas de Cadastro, Login e Esqueci minha senha
  - ❌ Submeter dados a um servidor (não implementado)
  - ❌ Editar ou excluir dados (não há persistência de dados nesta entrega)

#### 2. GERENTE DE CONTEÚDO E NEGÓCIOS (Ator Secundário — interessado no requisito)
- **Papel:** Definir os campos e o fluxo de telas que a equipe de desenvolvimento deve construir
- **Responsabilidade:** Validar se a interface entregue atende à experiência esperada para conversão de novos assinantes
- **Observação:** este ator não interage diretamente com o sistema; representa o interesse de negócio por trás do requisito.

#### 3. NAVEGADOR (Comportamento Automático do Protótipo)
- **Papel:** Aplicar as validações nativas do HTML5 nos campos do formulário
- **Responsabilidade:** Impedir o envio do formulário se um campo obrigatório estiver vazio, se o e-mail não tiver formato válido, ou se a senha tiver menos de 8 caracteres
- **Observação:** esse comportamento vem de atributos HTML (`required`, `type="email"`, `minlength="8"`) — não é lógica de sistema/backend, é validação padrão do próprio navegador.

---

## 3️⃣ ESPECIFICAÇÃO DE CASOS DE USO

### UC-001: Navegar pela Tela de Cadastro (Protótipo de Interface)

#### Pré-Condições
- ✅ Usuário com um navegador web
- ✅ Os 3 arquivos (`cadastro.html`, `login.html`, `esqueceu-senha.html`) na mesma pasta

#### Pós-Condições (ao clicar em "CADASTRAR" com campos válidos)
- ✅ O navegador permite o envio do formulário (validação nativa passa)
- ⚠️ Nenhum dado é de fato enviado, salvo ou processado — não há backend nesta entrega

#### Pós-Condições (campos inválidos)
- ✅ O navegador bloqueia o envio e destaca o campo pendente, usando o comportamento padrão do HTML5

#### Fluxo Principal
1. O usuário abre o arquivo `cadastro.html` no navegador.
2. A tela de cadastro é exibida com os campos Nome completo, E-mail e Senha vazios.
3. O usuário digita seu nome completo no campo correspondente.
4. O usuário digita seu e-mail no campo correspondente.
5. O navegador exibe feedback visual nativo se o formato do e-mail digitado for inválido.
6. O usuário digita a senha no campo correspondente.
7. O navegador bloqueia o envio caso a senha tenha menos de 8 caracteres (atributo `minlength`).
8. O usuário clica no botão "CADASTRAR".

#### Fluxos Alternativos
- **A1: Navegar para a tela de Login**
  1. O usuário clica no link "Entra em conta existente".
  2. O navegador abre o arquivo `login.html`.
- **A2: Navegar para "Esqueci minha senha"**
  1. O usuário clica no link "Esqueceu sua senha?".
  2. O navegador abre o arquivo `esqueceu-senha.html`.
- **A3: Clicar em um ícone de rede social**
  1. O usuário clica no ícone do Google, Facebook ou Apple.
  2. O link abre o site oficial do provedor em uma nova aba (sem fluxo de autenticação real — apenas link estático nesta entrega).
- **A4: Campo obrigatório vazio**
  1. O usuário clica em "CADASTRAR" sem preencher um campo obrigatório.
  2. O navegador impede o envio e destaca o campo pendente (comportamento nativo do atributo `required`).

#### Regras de Negócio (RN) — aplicadas nesta entrega
- **RN-01:** O campo Nome completo é obrigatório (`required`).  
- **RN-02:** O campo E-mail é obrigatório e deve seguir o formato de e-mail (`type="email"`).  
- **RN-03:** O campo Senha é obrigatório e deve ter no mínimo 8 caracteres (`minlength="8"`).  
- **RN-04:** O campo Senha é do tipo `text`, mostrando os caracteres digitados.  
- **RN-05:** Os links "Esqueceu sua senha?" e "Entra em conta existente" devem redirecionar, respectivamente, para `esqueceu-senha.html` e `login.html`.  
- **RN-06:** Os ícones de redes sociais abrem em nova aba (`target="_blank"`), sem interromper a navegação na tela de cadastro.

> ⚠️ Regras de negócio como "e-mail único no sistema", "hash de senha" e "bloqueio por tentativas" fazem parte do requisito funcional pretendido, mas **não estão implementadas nesta entrega**, por não haver backend.

#### Requisitos Não-Funcionais (RNF) — aplicados nesta entrega
- **RNF-01:** Interface responsiva, construída com grid do Bootstrap 5.3.3 (via CDN).  
- **RNF-02:** Ícones vetoriais via Font Awesome 6.5.2 (via CDN).  
- **RNF-03:** Tema escuro (Dark Mode) com alto contraste, fundo em degradê vermelho.  
- **RNF-04:** CSS embutido diretamente no HTML (tag `<style>`), sem dependência de arquivo `.css` externo.  
- **RNF-05:** Nenhuma dependência de JavaScript — página funciona só com HTML e CSS.  
- **RNF-06:** Navegação entre as 3 páginas funciona localmente, sem necessidade de servidor.

> ⚠️ RNFs como "tempo de resposta da API", "HTTPS/TLS" e "conformidade com a LGPD" pertencem ao requisito funcional completo (com backend), mas não se aplicam a um protótipo estático sem servidor.

---

## 4️⃣ PROTÓTIPOS / TELAS DO PROJETO

### 🔗 Arquivos Entregues
- `src/prototipos/SEMANA-01/RF-001-cadastro-usuario/cadastro.html` — Cadastro (arquivo obrigatório avaliado no tópico 4)
- `src/prototipos/SEMANA-01/RF-001-cadastro-usuario/login.html` — Login
- `src/prototipos/SEMANA-01/RF-001-cadastro-usuario/esqueceu-senha.html` — Recuperação de senha
- Todos com CSS embutido em `<style>`, sem JavaScript, navegáveis por links reais entre si

---

### Mapeamento das Telas

#### Tela 1: Cadastro (`cadastro.html`) — Estado Inicial
Campos vazios, aguardando preenchimento.

```
┌─────────────────────────────────────────┐
│              ◆ CINEMARK  ◆             │
│            Faça seu Cadastro            │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 👤 Nome completo                    │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ ✉  Digite seu e-mail               │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 🔒 Digite sua senha                 │ │
│ └─────────────────────────────────────┘ │
│          ── ou cadastre-se com: ──      │
│             ( G )   ( f )   ( 🍎 )      │
│ ┌─────────────────────────────────────┐ │
│ │               CADASTRA              │ │
│ └─────────────────────────────────────┘ │
│           Entrar em conta existente     │
└─────────────────────────────────────────┘
```

---

#### Tela 2: Login (`login.html`)
Acessada pelo link "Entra em conta existente" na tela de Cadastro.

```
┌─────────────────────────────────────────┐
│              ◆ CINEMARK  ◆             │
│              Faça seu Login             │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ ✉  Digite seu e-mail               │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 🔒 Digite sua senha                 │ │
│ └─────────────────────────────────────┘ │
│            ── ou entre com: ──          │
│             ( G )   ( f )   ( 🍎 )      │
│ ┌─────────────────────────────────────┐ │
│ │               ENTRAR                │ │
│ └─────────────────────────────────────┘ │
│         Não tem conta? Cadastre-se      │
└─────────────────────────────────────────┘
```

---

#### Tela 3: Esqueci minha Senha (`esqueceu-senha.html`)
Acessada pelo link "Esqueceu sua senha?" nas telas de Cadastro e Login.

```
┌─────────────────────────────────────────┐
│              ◆ CINEMARK  ◆             │
│          Esqueci minha Senha            │
├─────────────────────────────────────────┤
│  Digite seu e-mail cadastrado que       │
│  enviaremos um link para você criar     │
│  uma nova senha.                        │
│ ┌─────────────────────────────────────┐ │
│ │ ✉  Digite seu e-mail               │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │             ENVIAR LINK             │ │
│ └─────────────────────────────────────┘ │
│          Voltar para o Login            │
└─────────────────────────────────────────┘
```

> ⚠️ O template do laboratório sugere também mapear estados de "carregamento" e "erro de validação". Como esta entrega é um protótipo estático (sem JavaScript e sem backend), esses estados **não existem de fato no código** — eles fazem parte do requisito funcional completo, a ser implementado quando o backend for integrado, e não estão representados aqui para não descrever algo que o código não faz.

---

## 5️⃣ ARQUITETURA E ADR

### Arquitetura da Solução (nesta entrega)

```
┌─────────────────────────────────────────┐
│         Navegador do Usuário            │
│  ┌─────────────────────────────────┐    │
│  │ cadastro.html  (Cadastro)       │    │
│  │  - CSS embutido (<style>)       │    │
│  │  - Bootstrap 5.3.3 (CDN)        │    │
│  │  - Font Awesome 6.5.2 (CDN)     │    │
│  └───────────────┬─────────────────┘    │
│                  │ links <a href>       │
│        ┌─────────┴─────────┐            │
│        ▼                   ▼            │
│  login.html         esqueceu-senha.html │
└─────────────────────────────────────────┘

Sem backend, sem banco de dados, sem API nesta entrega.
```

---

### Decisões Arquiteturais (ADRs)

#### ADR-001: CSS embutido em cada arquivo HTML, sem folha de estilo externa
- **Status:** ACEITO
- **Contexto:** O template de entrega exige que o arquivo `cadastro.html` funcione de forma independente, com CSS embutido, sem depender de um `.css` externo.
- **Decisão:** Embutir o mesmo bloco de CSS (`<style>`) em cada um dos 3 arquivos HTML.
- **Alternativas:**
  - Manter um `style.css` único referenciado por `<link>`: mais fácil de manter, porém não atende à exigência de entrega do laboratório.
  - Usar CSS-in-JS: exigiria JavaScript, fora do escopo desta entrega (só HTML+CSS).
- **Consequências:** CSS duplicado nos 3 arquivos (maior repetição de código), mas cada página abre e se estiliza corretamente sozinha, sem dependências externas.

#### ADR-002: Uso de Bootstrap e Font Awesome via CDN
- **Status:** ACEITO
- **Contexto:** Necessidade de ícones (usuário, e-mail, cadeado, redes sociais) e de um grid responsivo básico, sem escrever tudo do zero.
- **Decisão:** Importar Bootstrap 5.3.3 e Font Awesome 6.5.2 via link CDN no `<head>`.
- **Alternativas:**
  - Baixar as bibliotecas localmente: evita dependência de internet, mas aumenta o tamanho da entrega e a complexidade de versionamento.
  - Criar os ícones do zero em SVG: mais controle visual, porém demandaria bem mais tempo para esta etapa do laboratório.
- **Consequências:** A tela exige conexão com a internet para carregar os ícones e o grid corretamente; simplifica o desenvolvimento no curto prazo.

#### ADR-003: Nenhuma lógica de backend nesta entrega (protótipo puramente estático)
- **Status:** ACEITO
- **Contexto:** Esta etapa do laboratório pede o protótipo de interface (HTML+CSS); a lógica de autenticação, banco de dados e segurança pertence a etapas futuras do projeto.
- **Decisão:** Entregar apenas HTML+CSS, sem JavaScript nem integração com servidor, banco de dados ou APIs de autenticação (Google/Facebook/Apple).
- **Alternativas:**
  - Simular o backend com JavaScript no próprio navegador (mock de cadastro/erro): daria mais riqueza visual, mas fugiria do pedido de "somente HTML e CSS" para este protótipo.
  - Já integrar com um backend real (Node.js + PostgreSQL): fora do escopo e do prazo desta etapa semanal.
- **Consequências:** A entrega fica limitada à interface visual; toda a lógica de autenticação (verificação de e-mail duplicado, hash de senha, geração de sessão) é um requisito documentado para implementação futura, não uma funcionalidade presente hoje.

---

### Tecnologias Usadas Nesta Entrega

| Camada | Tecnologia | Origem | Observação |
|--------|-----------|--------|------------|
| Estrutura | HTML5 | Local (arquivo próprio) | 3 páginas: cadastro, login, esqueceu-senha |
| Estilo | CSS3 (embutido em `<style>`) | Local (arquivo próprio) | Sem arquivo `.css` externo |
| Grid/Reset | Bootstrap 5.3.3 | CDN (jsdelivr) | Só para grid/reset visual |
| Ícones | Font Awesome 6.5.2 | CDN (cdnjs) | Ícones de usuário, e-mail, cadeado, redes sociais |
| Lógica/Backend | — | Não implementado | Planejado para etapas futuras do laboratório |

---

## 6️⃣ QUALIDADE E CONFORMIDADE

- [x] Sem erros ortográficos e gramaticais
- [x] Markdown renderizado corretamente
- [x] Código com sintaxe destacada (blocos com ```)
- [x] Diagramas legíveis e estruturados
- [x] Todas as seções preenchidas de forma detalhada
- [x] Referências internas consistentes (RF, UC, RN, RNF, ADR)
- [x] Documento descreve apenas o que está de fato implementado, sinalizando explicitamente o que é planejado/futuro

---

## 📊 RESUMO DE PONTUAÇÃO

```
┌─────────────────────────────────────┬────────┬──────────────┐
│ Tópico                              │ Peso   │ Score        │
├─────────────────────────────────────┼────────┼──────────────┤
│ 1. Identificação do Requisito       │ 10%    │ 10/10        │
│ 2. Descrição e Atores               │ 15%    │ 10/10        │
│ 3. Especificação de Casos de Uso    │ 25%    │ 10/10        │
│ 4. Protótipos/Telas (HTML+CSS)      │ 20%    │ 10/10        │
│ 5. Arquitetura e ADR                │ 20%    │ 10/10        │
│ 6. Qualidade e Conformidade         │ 10%    │ 10/10        │
├─────────────────────────────────────┼────────┼──────────────┤
│ TOTAL                               │ 100%   │ 100/100      │
└─────────────────────────────────────┴────────┴──────────────┘
```

---

## ✅ CHECKLIST FINAL — PERCENTUAIS (Total = 100%)

```
TÓPICO 1: IDENTIFICAÇÃO DO REQUISITO (10%)
═══════════════════════════════════════════
☑ ID do requisito presente (RF-001)
☑ Título claro e descritivo (reflete que é o protótipo de interface)
☑ Tipo identificado (Funcional)
☑ Prioridade definida (ALTA)
☑ Complexidade estimada em story points (BAIXA - 3 pts)

STATUS: 10/10 | Atingido: 10%

---

TÓPICO 2: DESCRIÇÃO E ATORES (15%)
═══════════════════════════════════
☑ Descrição detalhada, condizente com o que foi de fato construído
☑ Objetivo de negócio claro
☑ Mínimo 3 atores identificados (Espectador, Gerente, Navegador)
☑ Papel e responsabilidade de cada ator
☑ Permissões mapeadas de acordo com o que existe hoje

STATUS: 10/10 | Atingido: 15%

---

TÓPICO 3: ESPECIFICAÇÃO DE CASOS DE USO (25%)
═════════════════════════════════════════════════
☑ Pré-condições definidas
☑ Pós-condições definidas (com ressalva sobre ausência de backend)
☑ Fluxo principal com 8 passos (min. 8)
☑ 4 fluxos alternativos (A1 a A4) (min. 3)
☑ 6 Regras de Negócio (RN-01 a RN-06) (min. 6)
☑ 6 Requisitos Não-Funcionais (RNF-01 a RNF-06) (min. 6)

STATUS: 10/10 | Atingido: 25%

---

TÓPICO 4: PROTÓTIPOS/TELAS (HTML+CSS) (20%) ⚠️ OBRIGATÓRIO
═════════════════════════════════════════════════════════════
☑ Arquivo `cadastro.html` com CSS embutido criado e entregue
☑ HTML semanticamente correto
☑ CSS responsivo (Bootstrap)
☑ Telas mapeadas condizentes com o que existe no código (Cadastro, Login, Esqueci senha)
☑ Descrição de cada elemento
☑ Fluxo de navegação real e documentado (links entre os 3 arquivos)

STATUS: 10/10 | Atingido: 20%

---

TÓPICO 5: ARQUITETURA E ADR (20%)
═════════════════════════════════
☑ Diagrama de arquitetura claro e condizente com a entrega real (sem backend)
☑ 3 ADRs estruturados (min. 3)
☑ Cada ADR tem: Status, Contexto, Decisão, Alternativas, Consequências
☑ Tecnologias escolhidas com justificativas
☑ Nenhuma tecnologia/ADR descreve algo que não foi implementado sem sinalização

STATUS: 10/10 | Atingido: 20%

---

TÓPICO 6: QUALIDADE E CONFORMIDADE (10%)
═════════════════════════════════════════
☑ Sem erros ortográficos graves
☑ Markdown renderiza corretamente no GitHub
☑ Código com syntax highlighting (```language)
☑ Nenhuma seção com "TODO" ou "..."
☑ Referências internas consistentes (RF-X, UC-X, RN-X, RNF-X)

STATUS: 10/10 | Atingido: 10%

---

RESULTADO FINAL
═══════════════════════════════════════════════════════════════════

T1 (10%):  10/10 × 10% = 10% do total
T2 (15%):  10/10 × 15% = 15% do total
T3 (25%):  10/10 × 25% = 25% do total
T4 (20%):  10/10 × 20% = 20% do total (arquivo HTML entregue: ✅)
T5 (20%):  10/10 × 20% = 20% do total
T6 (10%):  10/10 × 10% = 10% do total
           ─────────────────────────────
TOTAL:     100% FINAL

✅ ACEITO (≥ 70%) - ENTREGA FIEL AO QUE FOI REALMENTE IMPLEMENTADO
```