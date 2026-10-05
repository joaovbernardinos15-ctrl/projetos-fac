# ENTREGA SEMANAL DE REQUISITOS

**Data de referência:** 05/10/2026  
**Grupo:** Grupo 04 - Cinemark

**Integrantes:** Fabrício Aguiar (fabricio62258946@edu.df.senac.br); João Silva (joao61806466@edu.df.senac.br); Natanael Souza (natanael61421786@edu.df.senac.br)

---

## 1. IDENTIFICAÇÃO DO REQUISITO

### RF-002: Cadastro e autenticação de usuários

**ID:** RF-002  
**Título:** Criar conta e iniciar ou encerrar sessão  
**Prioridade:** Alta — necessário para identificar clientes e administradores no protótipo.  
**Complexidade:** 5 story points — estimativa sujeita à revisão da equipe.  
**Status:** Implementado como demonstração local; não utiliza autenticação de servidor.  
**Tipo:** Requisito Funcional

**Breve descrição:**  
O sistema permite cadastrar uma conta de cliente, autenticar um usuário previamente cadastrado e encerrar a sessão no navegador.

## 2. DESCRIÇÃO E ATORES

- **Visitante (ator principal):** pode cadastrar conta de cliente e autenticar-se com conta existente; não pode criar perfil administrativo.
- **Usuário cadastrado (ator principal):** informa credenciais, consulta o estado de autenticação e pode encerrar a própria sessão.
- **Sistema (ator automático):** valida e-mail/senha, consulta registros locais, abre/encerra sessão e aplica o redirecionamento correspondente ao perfil.

## 3. ESPECIFICAÇÃO DE CASOS DE USO

### Pré-condições

- A página de autenticação e o armazenamento local do navegador estão disponíveis.
- Para entrar, a conta já deve existir no armazenamento local.

### Pós-condições

**Sucesso:** cadastro cria uma conta cliente local; login cria sessão local e direciona conforme o perfil; logout remove a sessão.  
**Falha:** dados inválidos ou credenciais incorretas não criam sessão nem confirmam cadastro.

### UC-002.1: Cadastrar conta de cliente

### Fluxo principal — cadastro

1. O visitante escolhe a opção de cadastro.
2. Informa nome, e-mail, senha e confirmação da senha.
3. O sistema valida os campos, o formato do e-mail, o tamanho mínimo da senha e a igualdade das senhas.
4. O sistema cria uma conta com perfil de cliente e apresenta uma confirmação.

### UC-002.2: Autenticar usuário e encerrar sessão

### Fluxo principal — login e saída

1. O usuário informa e-mail e senha.
2. O sistema valida as credenciais armazenadas localmente.
3. Em caso de sucesso, cria a sessão e direciona administradores ao painel e clientes à página inicial.
4. Ao selecionar **Sair**, o sistema encerra a sessão e retorna à página inicial.

### Fluxos alternativos

- **Dados inválidos ou e-mail já cadastrado:** o cadastro é recusado e uma mensagem é exibida.
- **Credenciais incorretas:** o acesso é recusado com mensagem de erro.
- **Recuperação de senha:** a interface verifica se o e-mail existe e exibe uma confirmação, mas não envia link nem altera senha; recuperação real não está implementada.

**RN-01:** O cadastro público cria usuários com perfil de cliente; não permite conceder perfil administrativo.  
**RN-02:** Nome, e-mail e senha são obrigatórios; o e-mail deve ser válido e não pode estar duplicado.  
**RN-03:** A senha deve possuir ao menos oito caracteres e a confirmação deve coincidir com ela.  
**RN-04:** Mensagens de erro não devem indicar autenticação bem-sucedida quando as credenciais forem inválidas.  
**RN-05:** Links com ícones de Google, Facebook ou Apple não representam login social implementado.  
**RN-06:** Uma sessão de administrador deve direcionar ao painel; uma sessão de cliente deve direcionar à página inicial.  
**RN-07:** Solicitação de recuperação só confirma localmente se o e-mail existe; não deve ser considerada troca de senha ou envio de mensagem efetivo.

### Requisitos não funcionais relacionados

| ID | Requisito e critério de aceitação | Situação |
|---|---|---|
| RNF-01 | Formulários devem ser operáveis por teclado, com foco visível e mensagens associadas ao estado de validação. | Estrutura presente; auditoria de teclado pendente |
| RNF-02 | E-mail inválido, confirmação divergente e erros de autenticação devem ser comunicados sem depender apenas de cor. | Validação e mensagens presentes; verificação de leitor de tela pendente |
| RNF-03 | A senha deve permanecer mascarada por padrão e o controle de visibilidade deve ter nome acessível. | Alternância implementada; teste de acessibilidade pendente |
| RNF-04 | O fluxo deve funcionar nas duas versões estáveis mais recentes de Chrome, Firefox e Safari. | Matriz de compatibilidade pendente |
| RNF-05 | Credenciais e sessão locais não devem ser descritas como autenticação segura para produção; XSS pode expor dados do armazenamento. | Limitação documentada; backend seguro não implementado |
| RNF-06 | O formulário deve permanecer utilizável em viewport móvel de 375 px sem corte de campos ou ações. | CSS responsivo presente; validação visual pendente |
| RNF-07 | A tela deve apresentar resposta de validação sem recarregar a página em cadastro/login válidos e inválidos. | Tratamento no JavaScript; testes de fluxo pendentes |

### Escopo e limitações

Os dados usam `localStorage`; não há backend, envio de e-mail, OAuth, recuperação efetiva, proteção contra adulteração pelo usuário do navegador ou sincronização entre dispositivos.

### Rastreabilidade

**Telas/arquivos:** `src/prototipos/SEMANA-06/login.html`, `src/prototipos/SEMANA-06/js/auth.js`, `src/prototipos/SEMANA-06/js/store.js`, `src/prototipos/SEMANA-06/js/nav.js`.  
**Critério de aceite:** cadastro válido cria cliente local; login válido abre a sessão e o destino correspondente ao perfil; credenciais inválidas não abrem sessão; sair encerra a sessão.

## 4. PROTÓTIPOS / TELAS

**Tela existente:** `src/prototipos/SEMANA-06/login.html`; estilos em `css/auth.css`; lógica em `js/auth.js`.

```text
┌─────────────────────────────┐
│ Cinemark                    │
│ [Entrar] [Cadastrar] [Recuperar]│
│ E-mail      [____________]   │
│ Senha       [____________]   │
│ [Mostrar senha]              │
│ [Mensagem de validação]      │
│ [ENTRAR]                     │
└─────────────────────────────┘
```

Os painéis de cadastro e recuperação são alternados na mesma tela. Recuperação não envia e-mail; login social não está implementado. CSS é externo, não embutido.

## 5. ARQUITETURA E DECISÕES TÉCNICAS

**Fluxo de dados:** formulário → validação no navegador (`auth.js`) → `Store.usuarios` (`store.js`) → persistência em `localStorage` → mensagem ou redirecionamento.

| Camada | Tecnologia | Uso |
|---|---|---|
| Interface | HTML/CSS | Painéis de login, cadastro e recuperação |
| Validação/interação | JavaScript | Validação de e-mail/senha e alternância de painéis |
| Dados e sessão | `Store` / `localStorage` | Contas e sessão demonstrativas locais |
| UI | Bootstrap / Font Awesome | Componentes visuais e ícones |

### ADR-001: Persistência local

**Contexto:** não existe backend nesta entrega.  
**Decisão:** manter contas e sessão pelo `Store` baseado em `localStorage`.  
**Alternativas rejeitadas:** API remota indisponível para o protótipo e estado apenas em memória, que se perderia ao navegar.  
**Consequência:** permite demonstração local, mas não protege credenciais nem sincroniza dispositivos.

### ADR-002: Validação no cliente

**Contexto:** os formulários são estáticos e não enviam dados para servidor.  
**Decisão:** aplicar validações HTML e JavaScript antes das operações locais.  
**Alternativa rejeitada:** introduzir backend fora do escopo técnico atual.  
**Consequência:** validação pode ser contornada; não é controle de segurança para produção.

### ADR-003: Recuperação demonstrativa

**Contexto:** não há serviço de e-mail nem fluxo de redefinição.  
**Decisão:** manter a checagem local existente e documentar claramente que não envia link nem muda senha.  
**Alternativa rejeitada:** exibir confirmação como se a mensagem tivesse sido enviada.  
**Consequência:** a interface demonstra o fluxo, mas recuperação real permanece pendente.

## 6. QUALIDADE E CONFORMIDADE

- [x] Identificação, prioridade, complexidade e status informados.
- [x] Atores, pré-condições e fluxos principal/alternativos descritos.
- [x] Sete regras de negócio numeradas.
- [x] Requisitos não funcionais numerados e com status de validação.
- [x] Protótipo, caminhos dos arquivos e fluxo de dados documentados.
- [x] Três ADRs registrados.
- [ ] Executar testes de cadastro, login, logout e redirecionamento por perfil.
- [ ] Auditar acessibilidade, responsividade e navegadores previstos.
- [ ] Implementar autenticação segura e recuperação real antes de uso em produção.
- [ ] Converter/validar protótipo no formato HTML único com CSS embutido se esse critério da validação for obrigatório nesta entrega.
