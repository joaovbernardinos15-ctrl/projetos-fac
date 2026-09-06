# 📋 ENTREGA SEMANAL DE REQUISITOS

**Versão do Template:** 12.2
**Laboratório de Inovação -** Prof. Edilberto Silva — 2026
**Grupo:** Grupo 04 - Cinemark
**Integrantes:** Fabricio (fabricio62258946@edu.df.senac.br); João Victor (joao61806466@edu.df.senac.br); 
Natanael (natanael61421786@edu.df.senac.br)
**Data de Entrega:** 31/08/2026

---

## 1️⃣ IDENTIFICAÇÃO DO REQUISITO

**ID:** RF-003
**Título:** Tela de Recuperação de Senha ("Esqueci minha Senha") na Plataforma CineStream
**Tipo:** Requisito Funcional
**Prioridade:** MÉDIA (importante para retenção de assinantes, mas não bloqueia o fluxo principal de novos cadastros)
**Complexidade:** BAIXA (estimativa: 2 story points — tela simples de um único campo)
**Status:** PROTÓTIPO DE INTERFACE CONCLUÍDO (nova entrega da Semana 02)
**Data de Criação:** 29/08/2026
**Última Atualização:** 05/09/2026

**Breve Descrição:**
Tela que permite que um assinante que esqueceu a senha informe seu e-mail cadastrado para, futuramente, receber um link de redefinição. Nesta entrega, é um protótipo de interface estático: nenhum e-mail é realmente enviado.

---

## 2️⃣ DESCRIÇÃO E ATORES

### Descrição Detalhada

**Por que este requisito existe?**
- Evita perda de assinantes que esqueceram a senha e não conseguiriam mais acessar a conta
- Reduz a carga de suporte manual para redefinição de senha
- Mantém o usuário dentro do fluxo de autenticação (sem precisar contatar suporte)

**Contexto do Negócio:**
Plataforma de streaming por assinatura (SVOD). Nesta entrega, o foco é a experiência de preenchimento do e-mail e a navegação de volta ao Login; não há envio real de e-mail nem geração de link de redefinição.

### Atores do Sistema

**1. ASSINANTE (Ator Principal)**
- **Papel:** Solicitar recuperação de senha informando o e-mail cadastrado
- **Responsabilidade:** Informar um e-mail em formato válido
- **Permissões:**
  - ✅ Preencher e submeter o formulário de recuperação
  - ✅ Retornar ao Login a qualquer momento
  - ❌ Receber um e-mail real com link de redefinição (não implementado — sem backend)

**2. NAVEGADOR / VALIDAÇÃO CLIENT-SIDE (Ator Automático)**
- **Papel:** Aplicar validação nativa (HTML5) e regra adicional via JavaScript
- **Responsabilidade:**
  - Bloquear envio se o e-mail estiver vazio (`required`)
  - Validar formato do e-mail via expressão regular
- **Permissões:** Validações client-side descritas acima

**3. GERENTE DE CONTEÚDO E NEGÓCIOS (Stakeholder, não interage diretamente)**
- **Papel:** Acompanhar quantos pedidos de recuperação de senha acontecem (indicador de fricção no login)
- **Responsabilidade:** Definir, no futuro, políticas como tempo de expiração do link e limite de pedidos por período
- **Observação:** Não é um ator técnico do sistema — é um interessado no resultado, assim como no RF de Cadastro
- **Permissões:** ❌ Nenhuma nesta entrega (papel é apenas de definição de regras/acompanhamento, não implementado)

---

## 3️⃣ ESPECIFICAÇÃO DE CASOS DE USO (UC)

### UC-003: Solicitar Recuperação de Senha

### Pré-Condições
- Navegador web moderno disponível, com JavaScript habilitado
- Os três arquivos do protótipo (`index.html`, `css/style.css`, `js/script.js`) estão na mesma estrutura de pastas
- Assinante está no painel de Login e optou por "Esqueceu sua senha?"

### Pós-Condições (Sucesso)
- E-mail preenchido em formato válido
- O envio nativo do formulário é interceptado (`preventDefault`); o formulário é limpo (`form.reset()`), o painel volta automaticamente para "Login" e o sistema exibe um toast "Link de recuperação enviado! Verifique seu e-mail." por 4,5 segundos (fechável manualmente)
- ⚠️ **Ressalva importante:** **nenhum e-mail é enviado de fato** — não há backend/SMTP nesta entrega; o toast é apenas uma simulação de sucesso no cliente, igual ao que já existia no painel de Cadastro

### Pós-Condições (Falha)
- Se o e-mail estiver em formato inválido: envio é bloqueado (`preventDefault`), campo recebe foco e é destacado como inválido
- Se o campo estiver vazio: validação nativa do HTML5 (`required`) impede o envio

### Fluxo Principal
1. Assinante está no painel de Login e clica em "Esqueceu sua senha?"
2. Sistema exibe o painel "Esqueci minha Senha" via JavaScript, com texto explicativo
3. Assinante lê o texto: "Digite seu e-mail cadastrado que enviaremos um link para você criar uma nova senha"
4. Assinante preenche o campo "E-mail"
5. Sistema valida o formato do e-mail ao sair do campo (blur) e a cada nova digitação
6. Assinante clica em "ENVIAR LINK"
7. Sistema valida o e-mail; se inválido, bloqueia o envio e foca o campo
8. Se válido, o sistema impede o envio nativo (`preventDefault`), limpa o formulário e retorna automaticamente ao painel de "Login"
9. Sistema exibe um toast "Link de recuperação enviado! Verifique seu e-mail." por 4,5 segundos (nenhum e-mail é enviado de fato — não há backend/SMTP nesta entrega)

### Fluxo Alternativo A1: Voltar para o Login
1. Assinante decide que não precisa mais recuperar a senha (ex.: lembrou a senha)
2. Assinante clica em "Voltar para o Login"
3. Sistema troca o painel ativo para "Login" via JavaScript
4. Campo de e-mail deste painel permanece preenchido em segundo plano (painel oculto, não é resetado)
5. Assinante visualiza o formulário de Login

### Fluxo Alternativo A2: E-mail em formato inválido
1. Assinante digita um e-mail sem "@" ou sem domínio válido
2. Ao sair do campo (evento `blur`), o sistema roda a validação via expressão regular
3. Sistema marca o campo com classe visual de "inválido"
4. Assinante clica em "ENVIAR LINK" mesmo assim
5. Sistema detecta e-mail inválido no momento do envio, chama `preventDefault()`
6. Sistema devolve o foco ao campo de e-mail
7. Assinante corrige o e-mail; sistema revalida a cada nova digitação
8. Ao atingir um formato válido, a marcação visual de inválido é removida

### Fluxo Alternativo A3: Campo de e-mail vazio
1. Assinante clica em "ENVIAR LINK" sem preencher o e-mail
2. Validação nativa do HTML5 (`required`) impede o envio do formulário
3. Navegador exibe balão de aviso nativo ("Preencha este campo")
4. Assinante preenche o e-mail e tenta novamente

### Regras de Negócio (RN)
- **RN-01:** E-mail é obrigatório e deve ter formato válido (validação nativa `type="email"` + regex JavaScript) ✅ *implementado*
- **RN-02:** Nenhum e-mail é efetivamente enviado nesta entrega — é um protótipo estático, sem backend ✅ *implementado (limitação assumida)*
- **RN-03:** O link "Voltar para o Login" permite retornar à tela de autenticação a qualquer momento ✅ *implementado*
- **RN-04:** Ao concluir o envio (client-side), o sistema retorna automaticamente ao painel de Login e exibe toast de confirmação ✅ *implementado*
- **RN-05:** O link de recuperação deveria expirar após um período (ex.: 30 minutos) ❌ *planejado, não implementado — depende de backend*
- **RN-06:** O sistema deveria permitir apenas 1 pedido de recuperação a cada X minutos por e-mail, para evitar abuso/spam ❌ *planejado, não implementado — depende de backend*

### Requisitos Não-Funcionais (RNF)
- **RNF-01:** Responsividade via grid do Bootstrap 5.3.3 + media query própria (`max-width: 480px`)
- **RNF-02:** Ícones vetoriais via Font Awesome 6.5.2 (CDN) — usado no campo de e-mail
- **RNF-03:** Identidade visual "dark mode" com gradiente vermelho (paleta Cinemark)
- **RNF-04:** CSS mantido em arquivo externo compartilhado (`css/style.css`)
- **RNF-05:** Validação client-side implementada em JavaScript puro, sem frameworks
- **RNF-06:** Compatível com navegadores modernos com suporte a ES6+ (Chrome, Firefox, Edge)

---

## 4️⃣ PROTÓTIPO/TELA (HTML+CSS)

**Arquivo:** `src/prototipos/SEMANA-02/index.html`
**CSS:** `css/style.css` (externo, compartilhado com as telas de Login e Cadastro)
**JS:** `js/script.js` (compartilhado)

> ⚠️ Esta tela **não é um arquivo isolado**: ela é o painel `data-panel="recover"` dentro do mesmo `index.html` que também contém Login e Cadastro.

### Estados representados neste protótipo
- **Vazio (estado inicial):** campo de e-mail em branco, texto explicativo visível
- **Preenchido/validação em tempo real:** campo de e-mail recebe destaque visual conforme validade
- **Erro:** e-mail em formato inválido — campo destacado
- **Sucesso:** toast "Link de recuperação enviado! Verifique seu e-mail." no canto inferior direito, some após 4,5s ou ao clicar em fechar; painel retorna automaticamente para "Login"

⚠️ **Observação honesta:** não há estado de "carregando" (spinner) e nenhum e-mail é enviado de fato — o toast é apenas uma simulação de sucesso no cliente, pois não há backend/SMTP.

### Mockup/Descrição das Telas

**Tela 1: Formulário Vazio (Estado Inicial)**
```
┌─────────────────────────────────────┐
│         Esqueci minha Senha         │
├─────────────────────────────────────┤
│                                     │
│  Digite seu e-mail cadastrado que   │
│  enviaremos um link para você       │
│  criar uma nova senha.              │
│                                     │
│ ✉️  E-mail: [______________]        │
│                                     │
│         [ ENVIAR LINK ]             │
│                                     │
│      Voltar para o Login            │
└─────────────────────────────────────┘
```

**Tela 2: Formulário Preenchido (Validação Visual)**
```
┌─────────────────────────────────────┐
│         Esqueci minha Senha         │
├─────────────────────────────────────┤
│ ✉️  E-mail: [joao@email.com   ] ✅  │
│                                     │
│         [ ENVIAR LINK ]             │
└─────────────────────────────────────┘
```

**Tela 3: Erro de Validação**
```
┌─────────────────────────────────────┐
│         Esqueci minha Senha         │
├─────────────────────────────────────┤
│ ✉️  E-mail: [joao@email       ] ❌  │
│    Digite um e-mail válido.         │
│                                     │
│         [ ENVIAR LINK ]             │
└─────────────────────────────────────┘
```

**Tela 4: Sucesso (toast + retorno automático ao Login)**
```
┌─────────────────────────────────────┐
│          Faça seu Login             │
│   (painel volta automaticamente)    │
├─────────────────────────────────────┤
│ ✉️  E-mail: [______________]        │
│ 🔒 Senha: [______________]      👁  │
│           [ ENTRAR ]                │
└─────────────────────────────────────┘
                    ┌───────────────────────────────┐
                    │ ✅ Link de recuperação           │
                    │    enviado! Verifique seu       │
                    │    e-mail.                   ×  │
                    └───────────────────────────────┘
```

⚠️ Não existe **Tela 5: Carregando** — não há chamada assíncrona real a um backend, então não há spinner nesta entrega. Também não existe uma tela de "redefinir senha" propriamente dita (o fluxo termina no toast + retorno ao Login).

---

## 5️⃣ ARQUITETURA E ADR

### Diagrama de Componentes
```
┌───────────────────────────────┐
│   Frontend Estático            │
│   index.html (painel Recover)   │
│   + css/style.css               │
│   + js/script.js                │
└──────────────┬─────────────────┘
               │ CDN (sem build)
               ▼
┌────────────────────────────────┐
│ Bootstrap 5.3.3 (grid/reset)    │
│ Font Awesome 6.5.2 (ícones)     │
└────────────────────────────────┘

⚠️ Sem Backend / Sem envio real de e-mail nesta entrega
```

### ADR-001: Recuperação de senha sem envio real de e-mail, com confirmação simulada
**Status:** ACEITO
**Contexto:** Não há servidor de e-mail (SMTP) nem backend nesta entrega.
**Decisão:** O botão "ENVIAR LINK" não dispara nenhum e-mail real, mas o sistema simula o sucesso: limpa o formulário, retorna ao painel de Login e exibe um toast de confirmação (`mostrarToastRecuperacao()`), reaproveitando a mesma estrutura usada no Cadastro.
**Alternativas:** Manter o comportamento nativo do formulário sem nenhum feedback visual (descartada — gerava inconsistência de UX com o Cadastro).
**Consequências:** ✅ Consistência visual entre as três telas; ⚠️ Ainda não representa um envio real de e-mail (sem backend/SMTP).

### ADR-002: Tela simples com um único campo
**Status:** ACEITO
**Contexto:** O fluxo de recuperação de senha, nesta fase, só precisa capturar o e-mail do usuário.
**Decisão:** Manter a tela com apenas o campo de e-mail e o botão "ENVIAR LINK", sem campos adicionais.
**Alternativas:** Adicionar pergunta de segurança ou CPF (rejeitada — aumentaria a complexidade sem necessidade nesta fase do protótipo).
**Consequências:** ✅ Tela simples e rápida de preencher; ✅ Alinhada ao padrão de mercado (ex.: "digite seu e-mail para recuperar a senha").

### ADR-003: Retorno automático ao painel de Login após o envio
**Status:** ACEITO
**Contexto:** Depois que o usuário "envia o link", ele precisará fazer login novamente assim que trocar a senha — não faz sentido ficar parado na tela de recuperação.
**Decisão:** No JavaScript, após o envio válido, o sistema chama `showPanel('login')` automaticamente, junto com o toast de confirmação, em vez de manter o usuário no painel de recuperação.
**Alternativas:** Manter o usuário no próprio painel "Esqueci Senha" só com o toast, deixando a navegação de volta manual (via link "Voltar para o Login").
**Consequências:** ✅ Fluxo mais direto (menos cliques); ⚠️ Se o toast desaparecer rápido, o usuário pode não perceber que o "link" foi enviado, já que a tela muda de painel imediatamente.

---

## 6️⃣ QUALIDADE E CONFORMIDADE

- [x] Sem erros ortográficos graves (revisado)
- [x] Markdown renderiza corretamente
- [x] Blocos de código com syntax highlighting
- [x] Nenhuma seção com "TODO" ou "..."
- [x] Referências internas consistentes (RF-003, UC-003, RN-01 a RN-06, RNF-01 a RNF-06)

### Limitações conhecidas (transparência)
- Nenhum e-mail é enviado de fato (sem backend/SMTP) — o toast é apenas uma simulação de sucesso no cliente
- Não há tela de redefinição de senha propriamente dita (o fluxo termina no toast + retorno ao Login) — pode ser objeto de uma entrega futura