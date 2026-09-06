# 📋 ENTREGA SEMANAL DE REQUISITOS

**Versão do Template:** 12.2
**Laboratório de Inovação -** Prof. Edilberto Silva — 2026
**Grupo:** Grupo 04 - Cinemark
**Integrantes:** Fabricio (fabricio62258946@edu.df.senac.br); João Victor (joao61806466@edu.df.senac.br); 
Natanael (natanael61421786@edu.df.senac.br)
**Data de Entrega:** 07/09/2026

---

## 1️⃣ IDENTIFICAÇÃO DO REQUISITO

**ID:** RF-002
**Título:** Tela de Cadastro de Usuário/Assinante na Plataforma CineStream
**Tipo:** Requisito Funcional
**Prioridade:** ALTA (porta de entrada para novos assinantes; bloqueia acesso ao catálogo)
**Complexidade:** BAIXA-MÉDIA (estimativa: 5 story points — aumentou em relação à Semana 01 pela adição de confirmação de senha e validação client-side)
**Status:** PROTÓTIPO DE INTERFACE ATUALIZADO (correções de segurança e UX da Semana 01 aplicadas)
**Data de Criação:** 29/08/2026
**Última Atualização:** 05/09/2026

**Breve Descrição:**
Tela que permite que um novo espectador crie uma conta na plataforma CineStream (SVOD), informando nome, e-mail e senha (com confirmação). É um protótipo de interface estático quanto a backend: toda a validação é feita no navegador (HTML5 + JavaScript), sem envio real de dados a um servidor.

---

## 2️⃣ DESCRIÇÃO E ATORES

### Descrição Detalhada

**Por que este requisito existe?**
- É a porta de entrada de novos assinantes na plataforma
- Permite personalização futura da experiência (perfis, recomendações)
- Sem cadastro, o espectador não acessa o catálogo pago

**Contexto do Negócio:**
Plataforma de streaming por assinatura (SVOD). Nesta entrega, a prioridade é validar a experiência de preenchimento e as regras de validação no cliente (navegador), sem persistência de dados.

### Atores do Sistema

**1. ESPECTADOR (Ator Principal)**
- **Papel:** Criar uma nova conta na plataforma
- **Responsabilidade:** Preencher nome, e-mail, senha e confirmação de senha corretamente
- **Permissões:**
  - ✅ Preencher e submeter o formulário de cadastro
  - ✅ Alternar a visibilidade da senha (mostrar/ocultar)
  - ❌ Submeter dados a um servidor real (não implementado nesta entrega)
  - ❌ Editar/excluir cadastro (não há persistência)

**2. NAVEGADOR / VALIDAÇÃO CLIENT-SIDE (Ator Automático)**
- **Papel:** Aplicar validação nativa (HTML5) e regras adicionais via JavaScript
- **Responsabilidade:**
  - Bloquear envio se campos obrigatórios estiverem vazios (`required`)
  - Validar formato de e-mail via expressão regular a cada digitação/perda de foco
  - Validar que senha tem no mínimo 8 caracteres (`minlength="8"`)
  - Validar que "Confirmar senha" é idêntica à "Senha"
- **Permissões:** Todas as validações client-side descritas acima

**3. GERENTE DE CONTEÚDO E NEGÓCIOS (Stakeholder, não interage diretamente)**
- **Papel:** Definir regras de negócio para cadastro (ex.: obrigatoriedade de e-mail único)
- **Observação:** Não é um ator técnico do sistema; é interessado no resultado

---

## 3️⃣ ESPECIFICAÇÃO DE CASOS DE USO (UC)

### UC-002: Realizar Cadastro de Usuário

### Pré-Condições
- Navegador web moderno disponível, com JavaScript habilitado
- Os três arquivos do protótipo (`index.html`, `css/style.css`, `js/script.js`) estão na mesma estrutura de pastas
- Painel "Cadastro" é acessado a partir do painel de Login (não existe URL direta separada — é tudo uma única página com painéis alternáveis)

### Pós-Condições (Sucesso)
- E-mail com formato válido, senha com 8+ caracteres e confirmação de senha idêntica à senha
- Formulário é limpo (`form.reset()`), estados de validação visual são removidos
- O painel visível volta a ser o de "Login"
- Um toast de confirmação ("Cadastro realizado com sucesso!") é exibido por 4,5 segundos, com botão para fechar manualmente
- ⚠️ **Ressalva:** nenhum dado é efetivamente enviado ou salvo em um servidor — é apenas um comportamento simulado no cliente

### Pós-Condições (Falha)
- Se o e-mail estiver em formato inválido: envio é bloqueado (`preventDefault`), campo recebe foco e é destacado como inválido
- Se a confirmação de senha não coincidir com a senha: envio é bloqueado, campo "Confirmar senha" é marcado como inválido e recebe foco
- Se algum campo obrigatório estiver vazio: validação nativa do HTML5 (`required`) impede o envio

### Fluxo Principal
1. Espectador acessa `index.html` — o painel exibido por padrão é o de "Login"
2. Espectador clica em "Cadastre-se" no rodapé do painel de Login
3. Sistema troca o painel visível para "Cadastro" via JavaScript (sem recarregar a página)
4. Espectador preenche o campo "Nome completo"
5. Espectador preenche o campo "E-mail"; o sistema valida o formato ao sair do campo (blur) e, a partir daí, a cada nova digitação
6. Espectador preenche o campo "Senha" (oculto por padrão, mínimo 8 caracteres); pode clicar no ícone de olho para alternar entre mostrar/ocultar
7. Espectador preenche o campo "Confirmar senha"; o sistema compara os dois valores em tempo real
8. Espectador clica em "CADASTRAR"
9. Sistema valida o formato do e-mail; se inválido, bloqueia o envio e foca o campo
10. Sistema valida se "Senha" e "Confirmar senha" são idênticas; se não, bloqueia o envio, marca o campo como inválido e foca nele
11. Se tudo estiver válido, o sistema impede o envio real (não há backend), limpa o formulário, volta para o painel de Login e exibe o toast de sucesso

### Fluxo Alternativo A1: Ir para Login a partir do Cadastro
1. Espectador está no painel de Cadastro e decide que já tem conta
2. Espectador clica em "Entra em conta existente"
3. Sistema troca o painel ativo para "Login" via JavaScript
4. Campos do formulário de Cadastro permanecem preenchidos em segundo plano (painel oculto, não é resetado)
5. Espectador visualiza o formulário de Login vazio, pronto para autenticação

### Fluxo Alternativo A2: Cadastro via ícone de rede social
1. Espectador visualiza os ícones (Google, Facebook, Apple) na seção "ou cadastre-se com"
2. Espectador clica em um dos ícones
3. Sistema abre o site oficial do provedor em uma nova aba (`target="_blank"`)
4. ⚠️ Não há integração OAuth real: é apenas um link estático para a página do provedor
5. Espectador retorna à aba original do CineStream, painel de Cadastro continua ativo

### Fluxo Alternativo A3: E-mail em formato inválido
1. Espectador digita um e-mail sem "@" ou sem domínio válido
2. Ao sair do campo (evento `blur`), o sistema roda a validação via expressão regular
3. Sistema marca o campo com classe visual de "inválido"
4. Espectador clica em "CADASTRAR" mesmo assim
5. Sistema detecta e-mail inválido no momento do envio, chama `preventDefault()`
6. Sistema devolve o foco ao campo de e-mail
7. Espectador corrige o e-mail; sistema revalida a cada nova digitação (pois o campo já foi "tocado")
8. Ao atingir um formato válido, a marcação visual de inválido é removida

### Fluxo Alternativo A4: Senha e confirmação não coincidem
1. Espectador preenche "Senha" com 8+ caracteres
2. Espectador preenche "Confirmar senha" com um valor diferente
3. Espectador clica em "CADASTRAR"
4. Sistema compara os dois campos e detecta divergência
5. Sistema chama `preventDefault()`, marca "Confirmar senha" com classe de erro e exibe a mensagem "As senhas precisam ser iguais."
6. Sistema devolve o foco ao campo "Confirmar senha"
7. Espectador corrige o valor; a cada nova digitação em qualquer um dos dois campos, o sistema revalida e remove o erro assim que os valores coincidirem

### Regras de Negócio (RN)
- **RN-01:** Nome completo é obrigatório (`required`)
- **RN-02:** E-mail é obrigatório e deve ter formato válido (validação nativa `type="email"` + regex JavaScript)
- **RN-03:** Senha é obrigatória, com no mínimo 8 caracteres (`minlength="8"`)
- **RN-04:** Confirmação de senha é obrigatória e deve ser idêntica à senha informada
- **RN-05:** Senha fica oculta por padrão (`type="password"`), com opção de exibição via ícone de olho (toggle controlado por JavaScript)
- **RN-06:** Links/ícones de redes sociais abrem em nova aba, sem autenticação OAuth real
- **RN-07:** Ao concluir o cadastro (client-side), o formulário é limpo e o usuário retorna à tela de Login — não há persistência real de dados

### Requisitos Não-Funcionais (RNF)
- **RNF-01:** Responsividade via grid do Bootstrap 5.3.3 + media query própria (`max-width: 480px`)
- **RNF-02:** Ícones vetoriais via Font Awesome 6.5.2 (CDN)
- **RNF-03:** Identidade visual "dark mode" com gradiente vermelho (paleta Cinemark)
- **RNF-04:** CSS mantido em arquivo externo compartilhado (`css/style.css`), referenciado via `<link>`
- **RNF-05:** Validação client-side implementada em JavaScript puro, sem frameworks
- **RNF-06:** Compatível com navegadores modernos com suporte a ES6+ (Chrome, Firefox, Edge)

---

## 4️⃣ PROTÓTIPO/TELA (HTML+CSS)

**Arquivo:** `src/prototipos/SEMANA-02/index.html`
**CSS:** `css/style.css` (externo, compartilhado com as telas de Login e Esqueci Senha)
**JS:** `js/script.js` (compartilhado)

> ⚠️ Esta tela **não é um arquivo isolado**: ela é um dos três painéis (`data-panel="register"`) dentro do mesmo `index.html` que também contém Login e Esqueci Senha. A troca de painel é feita via JavaScript (`showPanel()`), sem recarregar a página.

### Estados representados neste protótipo
- **Vazio (estado inicial):** todos os campos em branco, painel "Cadastro" oculto até o usuário navegar até ele
- **Preenchido/validação em tempo real:** campos de e-mail e confirmação de senha recebem destaque visual conforme validade
- **Erro:** e-mail inválido ou senha/confirmação divergentes — campo destacado + mensagem (`invalid-feedback`)
- **Sucesso:** toast "Cadastro realizado com sucesso!" no canto inferior direito, some após 4,5s ou ao clicar em fechar

⚠️ **Observação honesta:** este protótipo **não tem estado de "carregando"** (spinner), já que não há chamada real a um backend — o "sucesso" é apenas simulado no cliente.

### Mockup/Descrição das Telas

**Tela 1: Formulário Vazio (Estado Inicial)**
```
┌─────────────────────────────────────┐
│           ◆ (logo Cinemark)         │
│         Faça seu Cadastro           │
├─────────────────────────────────────┤
│                                     │
│ 👤 Nome completo: [______________]  │
│                                     │
│ ✉️  E-mail: [______________]        │
│                                     │
│ 🔒 Senha: [______________]      👁  │
│                                     │
│ 🔒 Confirmar senha: [_________] 👁  │
│                                     │
│        ou cadastre-se com:          │
│         (G)   (f)   ( )             │
│                                     │
│          [ CADASTRAR ]              │
│                                     │
│      Entra em conta existente       │
└─────────────────────────────────────┘
```

**Tela 2: Formulário Preenchido (Validação Visual)**
```
┌─────────────────────────────────────┐
│         Faça seu Cadastro           │
├─────────────────────────────────────┤
│ 👤 Nome completo: [João Silva    ]  │
│                                     │
│ ✉️  E-mail: [joao@email.com   ] ✅  │
│                                     │
│ 🔒 Senha: [•••••••••••••  ]     👁  │
│                                     │
│ 🔒 Confirmar senha: [••••••••] ✅   │
│                                     │
│          [ CADASTRAR ]              │
└─────────────────────────────────────┘
```

**Tela 3: Erro de Validação**
```
┌─────────────────────────────────────┐
│         Faça seu Cadastro           │
├─────────────────────────────────────┤
│ 👤 Nome completo: [João Silva    ]  │
│                                     │
│ ✉️  E-mail: [joao@email       ] ❌  │
│    Digite um e-mail válido.         │
│                                     │
│ 🔒 Senha: [•••••••••••••  ]     👁  │
│                                     │
│ 🔒 Confirmar senha: [•••••   ] ❌   │
│    As senhas precisam ser iguais.   │
│                                     │
│          [ CADASTRAR ]              │
└─────────────────────────────────────┘
```

**Tela 4: Sucesso (toast + retorno ao Login)**
```
┌─────────────────────────────────────┐
│          Faça seu Login             │
│    (painel volta para Login)        │
├─────────────────────────────────────┤
│ ✉️  E-mail: [______________]        │
│ 🔒 Senha: [______________]      👁  │
│          [ ENTRAR ]                 │
└─────────────────────────────────────┘
                    ┌───────────────────────────────┐
                    │ ✅ Cadastro realizado com       │
                    │    sucesso!                 ×  │
                    └───────────────────────────────┘
```

⚠️ Não existe **Tela 5: Carregando** — não há chamada assíncrona real a um backend, então não há spinner nesta entrega (mesma limitação assumida no RF-001).

---

## 5️⃣ ARQUITETURA E ADR

### Diagrama de Componentes
```
┌───────────────────────────────┐
│   Frontend Estático            │
│   index.html (painel Cadastro) │
│   + css/style.css               │
│   + js/script.js                │
└──────────────┬─────────────────┘
               │ CDN (sem build)
               ▼
┌────────────────────────────────┐
│ Bootstrap 5.3.3 (grid/reset)    │
│ Font Awesome 6.5.2 (ícones)     │
└────────────────────────────────┘

⚠️ Sem Backend / Sem Banco de Dados nesta entrega
```

### ADR-001: CSS externo compartilhado entre as três telas
**Status:** ACEITO
**Contexto:** As três telas (Login, Cadastro, Esqueci Senha) vivem no mesmo `index.html`.
**Decisão:** Usar um único `css/style.css` externo em vez de CSS embutido por tela.
**Alternativas:** CSS embutido em `<style>` (como sugerido no template) — descartado porque duplicaria estilos entre os três painéis.
**Consequências:** ✅ Sem duplicação de estilo; ⚠️ Foge do padrão "CSS embutido" citado no template — necessário justificar ao professor.

### ADR-002: Bootstrap e Font Awesome via CDN
**Status:** ACEITO
**Contexto:** Necessidade de grid responsivo e ícones sem escrever tudo do zero.
**Decisão:** Carregar Bootstrap 5.3.3 e Font Awesome 6.5.2 via CDN.
**Alternativas:** Baixar e hospedar localmente.
**Consequências:** ✅ Simplicidade; ⚠️ Depende de internet/CDN disponível.

### ADR-003: Sem lógica de backend (protótipo puro)
**Status:** ACEITO
**Contexto:** Escopo desta entrega é validar a interface e as regras de validação client-side.
**Decisão:** Nenhuma chamada a API/servidor é feita; o "sucesso" do cadastro é simulado no JavaScript.
**Alternativas:** Mockar uma API fake com `fetch` e `setTimeout`.
**Consequências:** ✅ Transparência sobre o que não está implementado; ⚠️ Não testa cenários de erro de rede.

### ADR-004: Senha oculta com toggle via JavaScript
**Status:** ACEITO
**Contexto:** Feedback da Semana 01 apontou que a senha aparecia em texto plano (`type="text"`).
**Decisão:** Campos de senha usam `type="password"` por padrão, com botão de alternância (ícone de olho) controlado por JavaScript.
**Alternativas:** Manter texto plano (rejeitada — falha de segurança/UX).
**Consequências:** ✅ Corrige o gap crítico apontado pelo professor; ✅ Mantém usabilidade (usuário pode conferir o que digitou).

### ADR-005: Confirmação de senha via comparação client-side
**Status:** ACEITO
**Contexto:** Feedback da Semana 01 apontou ausência de campo "Confirmar Senha".
**Decisão:** Adicionar campo `registerPasswordConfirmation` e comparar seu valor com `registerPassword` a cada digitação, bloqueando o envio se divergirem.
**Alternativas:** Validar só no momento do submit, sem feedback em tempo real (rejeitada, pior UX).
**Consequências:** ✅ Corrige o gap crítico; ⚠️ Toda a lógica é client-side, sem revalidação no servidor (pois não há servidor nesta entrega).

### ADR-006: Três telas unificadas em um único arquivo HTML com painéis JS
**Status:** ACEITO
**Contexto:** O template original sugere um `index.html` por RF (uma pasta por tela). O grupo optou por unificar Login, Cadastro e Esqueci Senha em um único arquivo com painéis alternáveis via JavaScript (`data-show-panel`), em vez de três arquivos `.html` separados.
**Decisão:** Manter um único `index.html` compartilhado entre as três telas/RFs, com cada RF documentado em um `.md` próprio.
**Alternativas:** Separar em três arquivos `.html` distintos (como pedido inicialmente pelo professor no feedback da Semana 01).
**Consequências:** ✅ Evita duplicação de CSS/JS entre telas; ✅ Navegação mais fluida (sem reload de página); ⚠️ Foge da estrutura "1 pasta de protótipo por RF" esperada pelo template — deve ser explicado ao professor nesta entrega.

---

## 6️⃣ QUALIDADE E CONFORMIDADE

- [x] Sem erros ortográficos graves (revisado)
- [x] Markdown renderiza corretamente
- [x] Blocos de código com syntax highlighting
- [x] Nenhuma seção com "TODO" ou "..."
- [x] Referências internas consistentes (RF-002, UC-002, RN-01 a RN-07, RNF-01 a RNF-06)

### Limitações conhecidas (transparência)
- Não há persistência real de dados (cadastro é simulado no cliente)
- Não há integração OAuth real com Google/Facebook/Apple (são apenas links estáticos)
- Não há estado de "carregando" (spinner), pois não existe chamada assíncrona real