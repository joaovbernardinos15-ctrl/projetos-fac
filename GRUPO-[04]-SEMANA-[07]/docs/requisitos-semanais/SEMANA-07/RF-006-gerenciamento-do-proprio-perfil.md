# ENTREGA SEMANAL DE REQUISITOS

**Data de referência:** 05/10/2026  
**Grupo:** Grupo 04 - Cinemark

**Integrantes:** Fabrício Aguiar (fabricio62258946@edu.df.senac.br); João Silva (joao61806466@edu.df.senac.br); Natanael Souza (natanael61421786@edu.df.senac.br)

---

## 1. IDENTIFICAÇÃO DO REQUISITO

### RF-006: Gerenciamento do próprio perfil

**ID:** RF-006  
**Título:** Consultar, atualizar e excluir a própria conta  
**Prioridade:** Média — oferece autonomia ao usuário cadastrado.  
**Complexidade:** 5 story points — estimativa sujeita à revisão da equipe.  
**Status:** Implementado no protótipo, com dados locais.  
**Tipo:** Requisito Funcional

**Breve descrição:**  
Um usuário autenticado pode consultar os dados da própria conta, editar nome, e-mail ou senha, encerrar a sessão e solicitar a exclusão da conta.

## 2. DESCRIÇÃO E ATORES

- **Cliente ou administrador autenticado (ator principal):** pode consultar e editar somente a própria conta e solicitar sua exclusão; não pode escolher outro usuário como alvo.
- **Sistema (ator automático):** verifica a sessão, valida alterações, protege o último administrador, exige confirmação de exclusão e encerra a sessão removida.

## 3. ESPECIFICAÇÃO DE CASOS DE USO

### Pré-condições

- O usuário está autenticado e a conta correspondente ainda existe.

### Pós-condições

**Sucesso:** alterações válidas persistem no Store local; exclusão permitida remove a conta, encerra a sessão e redireciona.  
**Falha:** dados inválidos ou exclusão proibida não alteram a conta e apresentam mensagem.

### UC-006.1: Consultar e atualizar o perfil

### Fluxo principal — consulta e edição

1. O usuário abre a página de perfil.
2. O sistema apresenta nome, e-mail, perfil e data de cadastro, quando disponível.
3. O usuário altera os campos desejados e solicita salvar.
4. O sistema valida e-mail e dados obrigatórios, grava a alteração e confirma o resultado.
5. Se o campo de senha ficar vazio, a senha atual é mantida.

### UC-006.2: Excluir a própria conta ou encerrar sessão

### Fluxo principal — exclusão e saída

1. O usuário solicita excluir a conta.
2. O sistema pede que digite `EXCLUIR`.
3. Após confirmação válida, o sistema tenta excluir a conta, encerra a sessão e retorna à página inicial.
4. Ao sair sem excluir, o sistema encerra a sessão e retorna à página inicial.

### Fluxos alternativos

- **Sessão ausente ou conta não localizada:** direcionar para login e encerrar uma sessão inconsistente.
- **Dados inválidos ou e-mail já usado:** não salvar e mostrar a validação correspondente.
- **Senha nova menor que oito caracteres:** rejeitar a alteração.
- **Último administrador:** recusar a exclusão da conta.
- **Texto de confirmação incorreto:** manter a conta e solicitar a confirmação correta.

**RN-01:** Somente o titular autenticado pode alterar ou excluir a conta apresentada no perfil.  
**RN-02:** Nome e e-mail não podem ficar vazios; e-mail deve ser válido e único.  
**RN-03:** Senha nova é opcional, mas deve ter pelo menos oito caracteres quando informada.  
**RN-04:** Exclusão só ocorre após confirmação textual exata, ignorando diferenças de caixa e espaços externos.  
**RN-05:** A exclusão do último administrador é bloqueada.  
**RN-06:** Uma sessão apontando para usuário inexistente deve ser encerrada e direcionada à autenticação.  
**RN-07:** Após alteração bem-sucedida, o formulário deve refletir os dados atualizados e limpar o campo de senha.

### Requisitos não funcionais relacionados

| ID | Requisito e critério de aceitação | Situação |
|---|---|---|
| RNF-01 | A página deve exigir sessão válida antes de apresentar ou alterar dados pessoais. | Verificação local implementada; segurança não equivale a controle de servidor |
| RNF-02 | Ações de exclusão devem explicar a consequência e permitir cancelar antes da confirmação final. | Modal e confirmação textual presentes; teste de fluxo pendente |
| RNF-03 | Campos, botões e erros devem ter nomes/associações acessíveis e foco perceptível. | Labels presentes nos campos; auditoria de teclado/leitor de tela pendente |
| RNF-04 | A página deve adaptar-se a 375, 768 e 1280 px sem ocultar campos ou ações. | CSS presente; validação visual pendente |
| RNF-05 | Alterações devem persistir após recarga na mesma origem enquanto o armazenamento local existir. | Persistência via Store; teste de recarga pendente |
| RNF-06 | O perfil deve funcionar nas duas versões estáveis mais recentes de Chrome, Firefox e Safari. | Matriz de compatibilidade pendente |
| RNF-07 | Dados pessoais armazenados no navegador devem ser tratados como dados locais não protegidos contra acesso por scripts da origem. | Limitação documentada; uso de backend seguro não implementado |

### Escopo e limitações

O armazenamento é local ao navegador. Não há fluxo de confirmação por e-mail, exportação de dados ou restauração da conta após a exclusão.

### Rastreabilidade

**Telas/arquivos:** `src/prototipos/SEMANA-06/perfil.html`, `src/prototipos/SEMANA-06/js/perfil.js`, `src/prototipos/SEMANA-06/js/store.js`.  
**Critério de aceite:** o titular atualiza os próprios dados com validação, mantém a senha ao deixar o campo em branco e não consegue excluir o último administrador.

## 4. PROTÓTIPOS / TELAS

**Tela existente:** `src/prototipos/SEMANA-06/perfil.html`; estilos em `css/admin.css`; lógica em `js/perfil.js`.

```text
┌──────────────────────────────────────┐
│ Cinemark · Minha conta       [Sair]   │
│ [Iniciais] Nome do usuário            │
│ Perfil · Cliente desde data           │
│ Nome [________________________]       │
│ E-mail [______________________]       │
│ Nova senha [_________________]        │
│ [Salvar alterações]                   │
│ Excluir minha conta [Excluir]         │
└──────────────────────────────────────┘
Modal: digite EXCLUIR [Cancelar] [Excluir]
```

Os elementos correspondem à tela atual; estilos permanecem externos.

## 5. ARQUITETURA E DECISÕES TÉCNICAS

**Fluxo de dados:** verificação de sessão → `Store.usuarios.buscarPorId()` → preencher perfil → interação em `perfil.js` → atualizar/excluir via `Store` → gravar em `localStorage` → atualizar interface ou redirecionar.

| Camada | Tecnologia | Uso |
|---|---|---|
| Interface | HTML/CSS e Bootstrap | Dados, formulário e confirmação |
| Lógica | JavaScript (`perfil.js`) | Validação local, eventos e navegação |
| Persistência | `Store` / `localStorage` | Conta e sessão demonstrativas |
| Confirmação | Modal Bootstrap | Confirmar exclusão |

### ADR-001: Identificar a conta pela sessão

**Contexto:** a tela deve carregar apenas a conta autenticada.  
**Decisão:** obter ID da sessão e consultar o Store por ID.  
**Alternativa rejeitada:** confiar em um ID fornecido livremente por parâmetro de URL.  
**Consequência:** a interface está vinculada à sessão local; proteção de servidor ainda não existe.

### ADR-002: Atualização parcial da conta

**Contexto:** o usuário pode atualizar nome/e-mail sem necessariamente trocar senha.  
**Decisão:** enviar senha ao Store somente quando preenchida.  
**Alternativa rejeitada:** exigir nova senha em toda edição.  
**Consequência:** evita alteração não intencional; validação e armazenamento continuam locais.

### ADR-003: Confirmação textual para exclusão

**Contexto:** exclusão é irreversível no protótipo.  
**Decisão:** exigir digitação de `EXCLUIR` no modal antes de chamar a operação de remoção.  
**Alternativa rejeitada:** excluir com um único clique.  
**Consequência:** reduz acionamento acidental, mas não permite recuperação após confirmação.

## 6. QUALIDADE E CONFORMIDADE

- [x] Identificação, prioridade, complexidade e status informados.
- [x] Atores, pré-condições e fluxos principal/alternativos descritos.
- [x] Sete regras e sete RNFs numerados.
- [x] Tela, arquivos e fluxo de dados documentados.
- [x] Três ADRs com decisão, alternativa e consequência.
- [ ] Testar sessão ausente, atualização, e-mail duplicado, senha inválida e exclusão.
- [ ] Validar foco, acessibilidade, responsividade e navegadores previstos.
- [ ] Confirmar os limites de segurança antes de qualquer uso com dados reais.
- [ ] Converter/validar protótipo no formato HTML único com CSS embutido se esse critério da validação for obrigatório nesta entrega.
