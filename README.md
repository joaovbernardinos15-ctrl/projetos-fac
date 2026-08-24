
# 📋 ENTREGA DE REQUISITOS - CINESTREAM

**Versão:** 12.2  
**Laboratório de Inovação -** Prof. Edilberto Silva — 2026  
**Formato:** Markdown (será corrigido automaticamente)  
**Valor Total da Entrega:** 100%  
**Data de Entrega:** 24/08/2026  
**Grupo:** CineStream  
**Integrantes:** Fabricio (fabricio62258946@edu.df.senac.br); Iara (iara50527796@edu.df.senac.br); João Victor (joao61806466@edu.df.senac.br); Natanael (natanael61421786@edu.df.senac.br);  

---

## ⚙️ ESTRUTURA DE DIRETÓRIOS


```

cine-stream-arquitetura/
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
│   │   │   │   ├── index.html :https://github.com/joaovbernardinos15-ctrl/carros/blob/main/Cinemark/index.html
│   │   │   │   └── (CSS) : https://github.com/joaovbernardinos15-ctrl/carros/tree/main/Cinemark/css
│   │   └── ...

```

**Localização deste arquivo:**  
`docs/requisitos-semanais/SEMANA-01/RF-001-cadastro-usuario.md`

**Localização do Protótipo HTML+CSS:**  
`src/prototipos/SEMANA-01/RF-001-cadastro-usuario/index.html`

---

## 1️⃣ IDENTIFICAÇÃO DO REQUISITO

### RF-001: Cadastro de Usuário na Plataforma CineStream

**ID:** RF-001  
**Título:** Criar novo registro de usuário/assinante na plataforma CineStream  
**Tipo:** Requisito Funcional  
**Prioridade:** ALTA (bloqueia o acesso ao catálogo, criação de perfil e assinaturas)  
**Complexidade:** BAIXA  
**Status:** EM DESENVOLVIMENTO  
**Data de Criação:** 21/08/2026  
**Data de Entrega:** 24/08/2026  
**Última Atualização:** 24/08/2026  

**Breve Descrição:**  
O sistema deve permitir que novos usuários se cadastrem na plataforma CineStream fornecendo e-mail e senha ou utilizando provedores de autenticação social (Google, Facebook e Apple). O cadastro é indispensável para personalizar preferências de visualização, gerenciar assinaturas e liberar o streaming de vídeo.

---

## 2️⃣ DESCRIÇÃO E ATORES

### Descrição Detalhada

**Por que este requisito existe?**  
A plataforma CineStream precisa gerenciar dados de identificação e acesso dos usuários para:
- Autenticar os espectadores e liberar streaming de filmes e séries
- Armazenar histórico de navegação, favoritos e listas de reprodução ("Minha Lista")
- Gerenciar assinaturas, planos de pagamento e cobranças recorrentes ("baixar filmes")
- Alimentar o algoritmo de recomendação personalizada com base no perfil do usuário
- Garantir conformidade com a LGPD e normativas de segurança digital

**Contexto do Negócio:**  
O CineStream opera sob modelo SVOD (Subscription Video on Demand). O fluxo de cadastro é a porta de entrada para novos clientes. Uma interface intuitiva, segura e com múltiplos métodos de autenticação minimiza a taxa de rejeição e alavanca a conversão de novos assinantes.

---

### Atores do Sistema

#### 1. ESPECTADOR (Ator Principal)
- **Papel:** Criar nova conta no serviço CineStream
- **Responsabilidade:** Inserir e-mail válido, definir senha segura ou autorizar login via rede social
- **Permissões:** 
  - ✅ CREATE (criar própria conta)
  - ✅ READ (visualizar dados do próprio perfil)
  - ❌ UPDATE (edição em tela de perfil própria)
  - ❌ DELETE (solicitação via suporte/privacidade)

#### 2. GERENTE DE CONTEÚDO E NEGÓCIOS (Ator Secundário)
- **Papel:** Monitorar métricas de conversão de novos usuários
- **Responsabilidade:** Acompanhar volumes de novos cadastros e retenção de usuários
- **Permissões:**
  - ✅ READ (acesso a relatórios estatísticos e métricas consolidadas sem exibição de dados sensíveis)

#### 3. SISTEMA CINESTREAM (Ator Automático)
- **Papel:** Validar dados, criptografar credenciais e integrar com provedores externos
- **Responsabilidade:** Validar sintaxe de e-mail, verificar duplicidade, aplicar hash na senha, integrar com APIs OAuth 2.0 (Google, Facebook, Apple) e emitir token de sessão JWT
- **Permissões:**
  - ✅ CREATE, READ, UPDATE em tabelas de autenticação e logs de auditoria

---

## 3️⃣ ESPECIFICAÇÃO DE CASOS DE USO

### UC-001: Realizar Cadastro no CineStream

#### Pré-Condições
- ✅ Usuário com conexão ativa com a internet
- ✅ Provedores de identidade externa (Google, Facebook, Apple) operacionais
- ✅ Banco de dados e API de autenticação do CineStream online

#### Pós-Condições (Sucesso)
- ✅ Conta de usuário criada com ID único e status ATIVO
- ✅ Hash seguro da senha gravado no banco de dados
- ✅ Token JWT emitido e sessão inicializada
- ✅ Redirecionamento automático para a tela de seleção de perfil / catálogo principal

#### Pós-Condições (Falha)
- ✅ Mensagem de erro descritiva exibida na interface
- ✅ NENHUM dado de usuário persistido no banco
- ✅ Evento de falha/tentativa registrado nos logs de auditoria e segurança

#### Fluxo Principal
1. O usuário acessa a tela de cadastro do CineStream.
2. O sistema exibe o formulário com campos de E-mail, Senha, botões de autenticação social (Google, Facebook, Apple) e opção de navegação.
3. O usuário digita seu e-mail no campo correspondente.
4. O sistema valida a sintaxe e o formato do e-mail em tempo real.
5. O usuário digita a senha no campo correspondente.
6. O sistema valida os critérios de segurança da senha (mínimo de 8 caracteres).
7. O usuário clica no botão "CADASTRA".
8. O sistema verifica no banco de dados se o e-mail já está cadastrado.
9. O sistema aplica hash seguro na senha utilizando o algoritmo Bcrypt (12 rounds).
10. O sistema grava o novo usuário no banco de dados com ID único.
11. O sistema gera o token JWT de sessão.
12. O sistema exibe mensagem de sucesso e redireciona o usuário autenticado para a página inicial do catálogo.

#### Fluxos Alternativos
- **A1: Cadastro via Provedores Sociais (Google / Facebook / Apple)**
  1. O usuário clica no ícone do provedor social desejado.
  2. O sistema redireciona para a autorização OAuth 2.0.
  3. O usuário autoriza o compartilhamento do e-mail.
  4. O sistema valida o token e cria/vincula a conta.
- **A2: E-mail já cadastrado**
  1. O sistema identifica e-mail duplicado.
  2. Exibe alerta de erro na tela.
- **A3: Senha fora do padrão de segurança**
  1. O sistema identifica senha menor que 8 caracteres.
  2. Exibe mensagem de aviso e bloqueia o envio até a correção.
- **A4: Falha temporária de conexão com o banco de dados**
  1. O sistema tenta reconectar automaticamente.
  2. Caso persista, exibe aviso de indisponibilidade temporária.

#### Regras de Negócio (RN)
- **RN-01:** O e-mail deve ser único na base de dados do CineStream.  
- **RN-02:** A senha criada diretamente no formulário deve conter no mínimo 8 caracteres.  
- **RN-03:** Autenticações sociais devem utilizar o protocolo OAuth 2.0 / OpenID Connect.  
- **RN-04:** As senhas devem ser obrigatoriamente salvas com hash Bcrypt.  
- **RN-05:** Bloqueio temporário por IP  após 5 tentativas inválidas em 1 minuto.  
- **RN-06:** Ao criar a conta, um perfil de usuário "Principal" é gerado automaticamente.  
- **RN-07:** Aceite dos Termos de Serviço implícito ao clicar no botão de cadastro.  

#### Requisitos Não-Funcionais (RNF)
- **RNF-01:** Tempo de resposta da API < 1.5 segundos.  
- **RNF-02:** Interface responsiva adaptável para dispositivos móveis e desktop.  
- **RNF-03:** Transmissão de dados via HTTPS com TLS 1.3.  
- **RNF-04:** Conformidade com a LGPD (Lei nº 13.709/2018).  
- **RNF-05:** Disponibilidade com atendimento com chatbots de i.a 
- **RNF-06:** Tema Dark Mode com alto contraste.  

---

## 4️⃣ PROTÓTIPOS / TELAS DO PROJETO

### 🔗 Links do Código-Fonte e Repositório
- **Link do HTML:*https://github.com/joaovbernardinos15-ctrl/carros/blob/main/Cinemark/index.html* 
- **Link do CSS:*https://github.com/joaovbernardinos15-ctrl/carros/tree/main/Cinemark/css* 
- **Link do GitHub:*https://github.com/joaovbernardinos15-ctrl/carros/tree/main/Cinemark* 

---

### Mapeamento das Telas (4 Telas)

#### Tela 1: Tela Padrão (Estado Inicial)
Interface inicial limpa, com os campos de e-mail, senha e botões de redes sociais aguardando o preenchimento do usuário.


```

┌─────────────────────────────────────────┐
│              ◆ CINESTREAM ◆             │
│            Faça seu Cadastro            │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ ✉  Digite seu e-mail                │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 🔒 Digite sua senha                👁│ │
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

#### Tela 2: Tela de Validação (Campos Validados)
Interface demonstrando a validação em tempo real dos campos inseridos (e-mail válido e senha no padrão de segurança).


```

┌─────────────────────────────────────────┐
│              ◆ CINESTREAM ◆             │
│            Faça seu Cadastro            │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ ✉  usuario@email.com              ✅│ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 🔒 •••••••••••••                  👁│ │
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

#### Tela 3: Tela de Load (Carregamento / Processamento)
Interface exibindo o indicador de carregamento (spinner/feedback visual) durante a requisição de cadastro.


```

┌─────────────────────────────────────────┐
│              ◆ CINESTREAM ◆             │
│            Faça seu Cadastro            │
├─────────────────────────────────────────┤
│                                         │
│          Criando sua conta...           │
│        ⟳ (Carregando / Processing)      │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │         PROCESSANDO...              │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

```

---

#### Tela 4: Tela de Erro de Validação
Interface com feedback de erro em destaque indicando inconsistências ou duplicidade de dados cadastrais.


```

┌─────────────────────────────────────────┐
│              ◆ CINESTREAM ◆             │
│            Faça seu Cadastro            │
├─────────────────────────────────────────┤
│ ⚠️ E-mail já cadastrado no sistema      │
│ ┌─────────────────────────────────────┐ │
│ │ ✉  usuario@email.com              ❌│ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 🔒 •••••••••••••                  👁│ │
│ └─────────────────────────────────────┘      
      ── ou cadastre-se com: ──      │
│             ( G )   ( f )   ( 🍎 )     │
│ ┌─────────────────────────────────────┐ │
│ │               CADASTRA              │ │
│ └─────────────────────────────────────┘ │
│           Entrar em conta existente     │
└─────────────────────────────────────────┘

```

---

## 5️⃣ ARQUITETURA E ADR

### Arquitetura da Solução


```

┌─────────────────────────┐
│  Frontend SPA / Mobile  │ (HTML + CSS + JS / Web & App)
│  Tela de Cadastro       │
└────────────┬────────────┘
│ HTTPS / Rest API (JSON)
▼
┌─────────────────────────┐
│ API Gateway / Auth Svc  │ (Node.js + Express.js)
│ POST /api/v1/auth/signup│
└──────┬─────────────┬────┘
│             │
│ Bcrypt      └─────────────────────┐ OAuth 2.0 Protocol
▼                                   ▼
┌───────────────┐                 ┌─────────────────┐
│ PostgreSQL BD │                 │ Provedores OAuth│
│ Tabela: users │                 │ Google/FB/Apple │
└───────────────┘                 └─────────────────┘

```

---

### Decisões Arquiteturais (ADRs)

#### ADR-001: PostgreSQL como Banco de Dados Relacional
- **Status:** ACEITO
- **Contexto:** Necessidade de integridade ACID para evitar contas duplicadas e gerenciar dados de assinaturas.
- **Decisão:** Adotar PostgreSQL 14+.
- **Consequências:** Garantia de consistência, alto desempenho e suporte a JSONB.

#### ADR-002: Algoritmo Bcrypt para Criptografia de Senhas
- **Status:** ACEITO
- **Contexto:** Armazenamento seguro de senhas de forma irreversível.
- **Decisão:** Utilizar a biblioteca Bcrypt com fator de custo.
- **Consequências:** Em conformidade com OWASP, protegido contra ataques de força bruta.

#### ADR-003: Autenticação Stateless via JWT
- **Status:** ACEITO
- **Contexto:** Autenticação eficiente entre frontend e microserviços de streaming.
- **Decisão:** Implementar tokens JWT  com expiração curta e Refresh Tokens.
- **Consequências:** Arquitetura stateless e escalável.

---

### Tecnologias Escolhidas

| Camada | Tecnologia | Versão | Justificativa |
|--------|-----------|--------|---------------|
| Frontend | HTML5 + CSS3 + JS | ES2022 | Padrão web, leve e responsivo |
| Backend API | Node.js + Express.js | 18 LTS | Alta performance e integração com JWT/OAuth |
| Banco de Dados | PostgreSQL | 14+ | Relacional, suporte ACID robusto |
| Criptografia | Bcrypt | 5+ | Padrão recomendado para hash de senhas |
| Validação | express-validator | 7+ | Validação rigorosa e sanitização de dados |

---

## 6️⃣ QUALIDADE E CONFORMIDADE

- [x] Sem erros ortográficos e gramaticais
- [] Markdown renderizado corretamente
- [] Código com sintaxe destacada
- [x] Diagramas legíveis e estruturados
- [] Todas as seções preenchidas de forma detalhada
- [x] Referências internas consistentes (RF, UC, RN, RNF, ADR)

```
