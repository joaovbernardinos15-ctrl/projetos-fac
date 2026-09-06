# 📋 ENTREGA SEMANAL DE REQUISITOS

**Versão do Template:** 12.2
**Laboratório de Inovação -** Prof. Edilberto Silva — 2026
**Grupo:** Grupo 04 - Cinemark
**Integrantes:** Fabricio (fabricio62258946@edu.df.senac.br); João Victor (joao61806466@edu.df.senac.br); 
Natanael (natanael61421786@edu.df.senac.br)
**Data de Entrega:** 31/08/2026

---

## 1️⃣ IDENTIFICAÇÃO DO REQUISITO

**ID:** RF-001
**Título:** Tela de Login (Autenticação) na Plataforma CineStream
**Tipo:** Requisito Funcional
**Prioridade:** ALTA (porta de entrada para assinantes já cadastrados; bloqueia acesso ao catálogo)
**Complexidade:** BAIXA (estimativa: 3 story points — protótipo de interface, sem autenticação real)
**Status:** PROTÓTIPO DE INTERFACE CONCLUÍDO (nova entrega da Semana 02)
**Data de Criação:** 29/08/2026
**Última Atualização:** 31/08/2026

**Breve Descrição:**
Tela que permite que um assinante já cadastrado informe e-mail e senha para acessar a plataforma. É o painel exibido por padrão ao abrir o protótipo. Toda a validação é feita no navegador (HTML5 + JavaScript); não há autenticação real, pois não existe backend nesta entrega.

---

## 2️⃣ DESCRIÇÃO E ATORES

### Descrição Detalhada

**Por que este requisito existe?**
- É o ponto de entrada principal da aplicação (painel exibido por padrão)
- Garante que apenas assinantes possam, futuramente, acessar o catálogo pago
- Oferece atalhos para Cadastro e Recuperação de Senha

**Contexto do Negócio:**
Plataforma de streaming por assinatura (SVOD). Nesta entrega, o foco é a experiência de preenchimento e validação client-side; não há verificação real de credenciais contra uma base de dados.

### Atores do Sistema

**1. ASSINANTE / USUÁRIO (Ator Principal)**
- **Papel:** Autenticar-se para acessar a plataforma
- **Responsabilidade:** Informar e-mail e senha corretamente
- **Permissões:**
  - ✅ Preencher e submeter o formulário de login
  - ✅ Alternar a visibilidade da senha
  - ✅ Navegar para Cadastro ou Esqueci Senha
  - ❌ Autenticação real (não implementada — sem backend)

**2. NAVEGADOR / VALIDAÇÃO CLIENT-SIDE (Ator Automático)**
- **Papel:** Aplicar validação nativa (HTML5) e regras adicionais via JavaScript
- **Responsabilidade:**
  - Bloquear envio se e-mail ou senha estiverem vazios (`required`)
  - Validar formato do e-mail via expressão regular
  - Validar que a senha tem no mínimo 8 caracteres (`minlength="8"`)
- **Permissões:** Todas as validações client-side descritas acima

**3. GERENTE DE CONTEÚDO E NEGÓCIOS (Stakeholder, não interage diretamente)**
- **Papel:** Acompanhar métricas de acesso (quantos assinantes conseguem logar, taxa de abandono na tela de login)
- **Responsabilidade:** Definir, no futuro, regras de negócio como bloqueio por tentativas de login incorretas
- **Observação:** Não é um ator técnico do sistema — assim como no RF de Cadastro, é um interessado no resultado, não alguém que clica na tela
- **Permissões:** ❌ Nenhuma nesta entrega (papel é apenas de definição de regras/acompanhamento, não implementado)

---

## 3️⃣ ESPECIFICAÇÃO DE CASOS DE USO (UC)

### UC-XXX: Realizar Login

### Pré-Condições
- Navegador web moderno disponível, com JavaScript habilitado
- Os três arquivos do protótipo (`index.html`, `css/style.css`, `js/script.js`) estão na mesma estrutura de pastas
- ⚠️ Não há verificação real de que o usuário possui uma conta previamente cadastrada — não existe base de dados nesta entrega

### Pós-Condições (Sucesso)
- E-mail com formato válido e senha preenchida (8+ caracteres)
- O envio nativo do formulário é interceptado (`preventDefault`) e o sistema exibe um toast "Login realizado com sucesso!" por 4,5 segundos (fechável manualmente pelo botão "×")
- O painel permanece em "Login" — não há redirecionamento para outra tela nem limpeza automática dos campos
- ⚠️ **Ressalva importante:** não há autenticação real (sem backend/base de dados) — o toast é apenas uma simulação de sucesso no cliente, igual ao que já existia no painel de Cadastro

### Pós-Condições (Falha)
- Se o e-mail estiver em formato inválido: envio é bloqueado (`preventDefault`), campo recebe foco e é destacado como inválido
- Se algum campo obrigatório estiver vazio: validação nativa do HTML5 (`required`) impede o envio

### Fluxo Principal
1. Assinante acessa `index.html` — o painel "Login" é exibido por padrão
2. Assinante preenche o campo "E-mail"
3. Sistema valida o formato do e-mail ao sair do campo (blur) e, a partir daí, a cada nova digitação
4. Assinante preenche o campo "Senha" (oculto por padrão, mínimo 8 caracteres)
5. Assinante pode clicar no ícone de olho para alternar entre mostrar/ocultar a senha
6. Assinante clica em "ENTRAR"
7. Sistema valida o formato do e-mail; se inválido, bloqueia o envio e foca o campo
8. Se o e-mail for válido, o sistema impede o envio nativo (`preventDefault`) e exibe um toast "Login realizado com sucesso!" por 4,5 segundos
9. O painel permanece em "Login"; os campos preenchidos não são limpos automaticamente e não há redirecionamento para outra tela (não existe dashboard/área logada nesta entrega)

### Fluxo Alternativo A1: Ir para Cadastro a partir do Login
1. Assinante ainda não tem conta
2. Assinante clica em "Cadastre-se" no rodapé do painel de Login
3. Sistema troca o painel ativo para "Cadastro" via JavaScript
4. Campos do formulário de Login permanecem preenchidos em segundo plano (painel oculto, não é resetado)
5. Assinante visualiza o formulário de Cadastro vazio

### Fluxo Alternativo A2: Ir para Esqueci Senha
1. Assinante não recorda a senha
2. Assinante clica em "Esqueceu sua senha?"
3. Sistema troca o painel ativo para "Esqueci minha Senha" via JavaScript
4. Assinante visualiza o texto explicativo e o campo de e-mail para recuperação
5. Assinante pode retornar ao Login a qualquer momento pelo link "Voltar para o Login"

### Fluxo Alternativo A3: Login via ícone de rede social
1. Assinante visualiza os ícones (Google, Facebook, Apple) na seção "ou entre com"
2. Assinante clica em um dos ícones
3. Sistema abre o site oficial do provedor em uma nova aba (`target="_blank"`)
4. ⚠️ Não há integração OAuth real: é apenas um link estático para a página do provedor
5. Assinante retorna à aba original do CineStream, painel de Login continua ativo

### Fluxo Alternativo A4: E-mail em formato inválido
1. Assinante digita um e-mail sem "@" ou sem domínio válido
2. Ao sair do campo (evento `blur`), o sistema roda a validação via expressão regular
3. Sistema marca o campo com classe visual de "inválido"
4. Assinante clica em "ENTRAR" mesmo assim
5. Sistema detecta e-mail inválido no momento do envio, chama `preventDefault()`
6. Sistema devolve o foco ao campo de e-mail
7. Assinante corrige o e-mail; sistema revalida a cada nova digitação
8. Ao atingir um formato válido, a marcação visual de inválido é removida

### Regras de Negócio (RN)
- **RN-01:** E-mail é obrigatório e deve ter formato válido (validação nativa `type="email"` + regex JavaScript)
- **RN-02:** Senha é obrigatória, com no mínimo 8 caracteres (`minlength="8"`)
- **RN-03:** Senha fica oculta por padrão (`type="password"`), com opção de exibição via ícone de olho
- **RN-04:** Login social é apenas um link estático, sem autenticação OAuth real
- **RN-05:** Não há endpoint de backend: a submissão do formulário não realiza autenticação real
- **RN-06:** O link "Esqueceu sua senha?" direciona para o painel próprio de recuperação de senha

### Requisitos Não-Funcionais (RNF)
- **RNF-01:** Responsividade via grid do Bootstrap 5.3.3 + media query própria (`max-width: 480px`)
- **RNF-02:** Ícones vetoriais via Font Awesome 6.5.2 (CDN)
- **RNF-03:** Identidade visual "dark mode" com gradiente vermelho (paleta Cinemark)
- **RNF-04:** CSS mantido em arquivo externo compartilhado (`css/style.css`)
- **RNF-05:** Validação client-side implementada em JavaScript puro, sem frameworks
- **RNF-06:** Compatível com navegadores modernos com suporte a ES6+ (Chrome, Firefox, Edge)

---

## 4️⃣ PROTÓTIPO/TELA (HTML+CSS)

**Arquivo:** `src/prototipos/SEMANA-02/RF-002-cadastro-usuario/index.html`
**CSS:** `css/style.css` (externo, compartilhado com as telas de Cadastro e Esqueci Senha)
**JS:** `js/script.js` (compartilhado)

> ⚠️ Esta tela **não é um arquivo isolado**: ela é o painel `data-panel="login"` dentro do mesmo `index.html` que também contém Cadastro e Esqueci Senha, e é o painel exibido por padrão (`showPanel('login')`).

### Estados representados neste protótipo
- **Vazio (estado inicial):** painel "Login" exibido ao abrir a página, campos em branco
- **Preenchido/validação em tempo real:** campo de e-mail recebe destaque visual conforme validade
- **Erro:** e-mail em formato inválido — campo destacado + mensagem (`invalid-feedback`)
- **Sucesso:** toast "Login realizado com sucesso!" no canto inferior direito, some após 4,5s ou ao clicar em fechar

⚠️ **Observação honesta:** não há estado de "carregando" (spinner) e não há redirecionamento para uma área logada/dashboard — o toast é apenas uma simulação de sucesso no cliente, pois não há backend.

### Mockup/Descrição das Telas

**Tela 1: Formulário Vazio (Estado Inicial — painel padrão)**
```
┌─────────────────────────────────────┐
│           ◆ (logo Cinemark)         │
│          Faça seu Login             │
├─────────────────────────────────────┤
│                                     │
│ ✉️  E-mail: [______________]        │
│                                     │
│ 🔒 Senha: [______________]      👁  │
│                                     │
│         ou entre com:               │
│         (G)   (f)   ( )             │
│                                     │
│      Esqueceu sua senha?            │
│                                     │
│           [ ENTRAR ]                │
│                                     │
│    Não tem conta? Cadastre-se       │
└─────────────────────────────────────┘
```

**Tela 2: Formulário Preenchido (Validação Visual)**
```
┌─────────────────────────────────────┐
│          Faça seu Login             │
├─────────────────────────────────────┤
│ ✉️  E-mail: [joao@email.com   ] ✅  │
│                                     │
│ 🔒 Senha: [•••••••••••••  ]     👁  │
│                                     │
│           [ ENTRAR ]                │
└─────────────────────────────────────┘
```

**Tela 3: Erro de Validação**
```
┌─────────────────────────────────────┐
│          Faça seu Login             │
├─────────────────────────────────────┤
│ ✉️  E-mail: [joao@email       ] ❌  │
│    Digite um e-mail válido.         │
│                                     │
│ 🔒 Senha: [______________]      👁  │
│                                     │
│           [ ENTRAR ]                │
└─────────────────────────────────────┘
```

**Tela 4: Sucesso (toast — permanece no painel de Login)**
```
┌─────────────────────────────────────┐
│          Faça seu Login             │
│   (permanece no mesmo painel)       │
├─────────────────────────────────────┤
│ ✉️  E-mail: [joao@email.com   ] ✅  │
│ 🔒 Senha: [•••••••••••••  ]     👁  │
│           [ ENTRAR ]                │
└─────────────────────────────────────┘
                    ┌───────────────────────────────┐
                    │ ✅ Login realizado com          │
                    │    sucesso!                 ×  │
                    └───────────────────────────────┘
```

⚠️ Não existe **Tela 5: Carregando** — não há chamada assíncrona real a um backend, então não há spinner nesta entrega, e também não existe uma tela de "área logada" para redirecionar após o login.

---

## 5️⃣ ARQUITETURA E ADR

### Diagrama de Componentes
```
┌───────────────────────────────┐
│   Frontend Estático            │
│   index.html (painel Login)     │
│   + css/style.css               │
│   + js/script.js                │
└──────────────┬─────────────────┘
               │ CDN (sem build)
               ▼
┌────────────────────────────────┐
│ Bootstrap 5.3.3 (grid/reset)    │
│ Font Awesome 6.5.2 (ícones)     │
└────────────────────────────────┘

⚠️ Sem Backend / Sem Banco de Dados / Sem Autenticação Real nesta entrega
```

### ADR-001: Login exibido como painel padrão
**Status:** ACEITO
**Contexto:** O usuário deve ver primeiro a tela de autenticação ao abrir o protótipo.
**Decisão:** `showPanel('login')` é chamado ao carregar o script, tornando o painel de Login o padrão visível.
**Alternativas:** Exibir o painel de Cadastro por padrão (rejeitada — menos comum em produtos reais).
**Consequências:** ✅ Comportamento condizente com produtos reais de streaming.

### ADR-002: Toast de sucesso no Login
**Status:** ACEITO
**Contexto:** O painel de Cadastro já tinha um toast de sucesso; o de Login não tinha o mesmo tratamento em uma versão anterior desta entrega.
**Decisão:** Reaproveitar a mesma estrutura de toast (`.toast-cadastro`) para o Login, criando um `#toastLogin` próprio com a função `mostrarToastLogin()`. O painel de Login não é resetado nem trocado após o sucesso, já que não existe uma área logada/dashboard nesta entrega.
**Alternativas:** Manter o comportamento nativo do navegador sem nenhum feedback (descartada — gerava inconsistência de UX com o Cadastro).
**Consequências:** ✅ Consistência visual entre as telas; ⚠️ Ainda não simula uma autenticação real (não há backend).

### ADR-003: Login social como link estático
**Status:** ACEITO
**Contexto:** Integração real com OAuth (Google/Facebook/Apple) está fora do escopo deste protótipo.
**Decisão:** Ícones sociais são links simples (`<a target="_blank">`) para o site oficial de cada provedor.
**Alternativas:** Simular fluxo OAuth com JavaScript (rejeitada — complexidade desnecessária para um protótipo estático).
**Consequências:** ✅ Simplicidade; ⚠️ Não representa fielmente o fluxo real de login social.

---

## 6️⃣ QUALIDADE E CONFORMIDADE

- [x] Sem erros ortográficos graves (revisado)
- [x] Markdown renderiza corretamente
- [x] Blocos de código com syntax highlighting
- [x] Nenhuma seção com "TODO" ou "..."
- [x] Referências internas consistentes (RF-XXX, UC-XXX, RN-XX, RNF-XX — numeração final pendente)

> ℹ️ Este documento **não inclui autoavaliação/pontuação**, conforme apontado no feedback da Semana 01: a avaliação e a nota cabem ao professor.

### Limitações conhecidas (transparência)
- Não há autenticação real (sem backend, sem base de dados de usuários) — o toast de sucesso é apenas uma simulação no cliente
- Não existe área logada/dashboard: após o toast, o usuário permanece na própria tela de Login
- Não há integração OAuth real com Google/Facebook/Apple (são apenas links estáticos)
