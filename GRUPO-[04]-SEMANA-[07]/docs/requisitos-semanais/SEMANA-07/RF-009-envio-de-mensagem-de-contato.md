# ENTREGA SEMANAL DE REQUISITOS

**Data de referência:** 05/10/2026  
**Grupo:** Grupo 04 - Cinemark

**Integrantes:** Fabrício Aguiar (fabricio62258946@edu.df.senac.br); João Silva (joao61806466@edu.df.senac.br); Natanael Souza (natanael61421786@edu.df.senac.br)

---

## 1. IDENTIFICAÇÃO DO REQUISITO

### RF-009: Envio de mensagem de contato

**ID:** RF-009  
**Título:** Preparar mensagem para contato com a equipe  
**Prioridade:** Média — oferece um canal de comunicação apresentado ao visitante.  
**Complexidade:** 2 story points — estimativa sujeita à revisão da equipe.  
**Status:** Implementado por link `mailto`; envio depende do cliente de e-mail do usuário.  
**Tipo:** Requisito Funcional

**Breve descrição:**  
O visitante preenche nome, e-mail, assunto e mensagem e solicita o envio pelo formulário de contato.

## 2. DESCRIÇÃO E ATORES

- **Visitante ou cliente (ator principal):** pode preencher e solicitar abertura de mensagem; deve concluir o envio no cliente de e-mail externo.
- **Navegador/cliente de e-mail (ator externo):** tenta abrir o aplicativo configurado com os dados do formulário.
- **Sistema (ator automático):** valida campos no cliente e fornece o destino `mailto`; não recebe nem confirma entrega.

## 3. ESPECIFICAÇÃO DE CASOS DE USO

### Pré-condições

- O navegador consegue abrir a página de contato.
- Para efetivar o envio pelo fluxo atual, o usuário deve ter um cliente de e-mail configurado e concluir a ação nesse cliente.

### Pós-condições

**Sucesso:** o navegador solicita a abertura do cliente de e-mail com o destino configurado; envio só ocorre se o usuário o concluir externamente.  
**Falha:** se a validação falhar ou o cliente não estiver disponível, a página não registra nem confirma recebimento.

### UC-009: Preparar mensagem de contato

### Fluxo principal

1. O usuário abre `contato.html`.
2. Informa nome, endereço de e-mail, assunto e mensagem.
3. O navegador verifica o preenchimento dos campos e o formato básico do e-mail.
4. O usuário aciona **Enviar mensagem**.
5. O navegador tenta abrir o cliente de e-mail padrão com o destino configurado.
6. O usuário revisa e envia a mensagem pelo cliente externo.

### Fluxos alternativos

- **Campo obrigatório vazio ou e-mail inválido:** impedir o envio do formulário e indicar o dado a corrigir.
- **Nenhum cliente de e-mail configurado:** o navegador pode não conseguir prosseguir; a página não envia a mensagem por conta própria.

**RN-01:** Nome, e-mail, assunto e mensagem são obrigatórios.  
**RN-02:** O e-mail deve possuir formato aceito pela validação nativa do navegador.  
**RN-03:** Acionar o formulário não deve ser apresentado como confirmação de recebimento pelo Cinemark.  
**RN-04:** O destinatário definido no protótipo é `contato@cinemark.com.br`; sua validade operacional não foi verificada.  
**RN-05:** O formulário só solicita abertura/envio pelo cliente de e-mail configurado; o site não armazena nem processa a mensagem.  
**RN-06:** O conteúdo da mensagem deve ser fornecido pelo usuário; o formulário não deve acrescentar dados não informados.  
**RN-07:** Se o cliente de e-mail não estiver disponível, a página não pode afirmar que a mensagem foi enviada.

### Requisitos não funcionais relacionados

| ID | Requisito e critério de aceitação | Situação |
|---|---|---|
| RNF-01 | Campos devem ser identificáveis por leitores de tela e operáveis por teclado. | `aria-label`/campos presentes; auditoria pendente |
| RNF-02 | Erros de preenchimento devem ser detectáveis sem depender apenas de cor. | Validação nativa do navegador; teste assistivo pendente |
| RNF-03 | Formulário deve caber em larguras de 375, 768 e 1280 px sem cortar campos ou botão. | CSS presente; inspeção visual pendente |
| RNF-04 | Envio não deve expor dados a destino diferente do endereço informado no formulário. | Destino `mailto` fixo; revisar no ambiente do usuário |
| RNF-05 | A interface deve diferenciar a solicitação de abertura do cliente de e-mail de uma confirmação de recebimento. | Limitação documentada; validar texto apresentado no navegador |
| RNF-06 | A página deve funcionar nas duas versões estáveis mais recentes de Chrome, Firefox e Safari. | Matriz de compatibilidade pendente |
| RNF-07 | Se o cliente não estiver configurado, o restante da página deve continuar navegável e os dados não devem ser declarados enviados. | Dependente do navegador; teste manual pendente |

### Escopo e limitações

Não há backend, armazenamento de mensagens, protocolo de confirmação, acompanhamento de solicitações ou garantia de entrega. A seção de informações complementares está oculta na versão atual da página.

### Rastreabilidade

**Tela/arquivo:** `src/prototipos/SEMANA-06/contato.html`.  
**Critério de aceite:** campos vazios ou e-mail inválido não passam pela validação do navegador; com dados válidos, a página aciona o destino `mailto` sem declarar que recebeu ou processou a mensagem.

## 4. PROTÓTIPOS / TELAS

**Tela existente:** `src/prototipos/SEMANA-06/contato.html`; estilos em `css/contato-fixes.css`, `css/style.css` e `css/navbar.css`.

```text
┌─────────────────────────────────────────────┐
│ Fale Conosco                                │
│ Dúvidas, sugestões ou reclamações?          │
│ Nome       [________________________]       │
│ E-mail     [________________________]       │
│ Assunto    [________________________]       │
│ Mensagem   [________________________]       │
│            [________________________]       │
│ [ENVIAR MENSAGEM]                           │
└─────────────────────────────────────────────┘
```

O `action` atual usa `mailto`; informações complementares aparecem ocultas no HTML atual e não foram consideradas um fluxo funcional.

## 5. ARQUITETURA E DECISÕES TÉCNICAS

**Fluxo de dados:** usuário preenche formulário HTML → validação nativa (`required`, `type=email`) → navegador trata o destino `mailto` → eventual cliente externo de e-mail abre para revisão/envio. O site não recebe resposta de entrega.

| Camada | Tecnologia | Uso |
|---|---|---|
| Interface | HTML e CSS externo | Formulário e informações de contato |
| Validação | Recursos nativos do navegador | Campos obrigatórios e formato básico de e-mail |
| Integração | URI `mailto:` | Solicitação de abertura do cliente de e-mail |

### ADR-001: Uso de `mailto`

**Contexto:** não há backend para receber formulários.  
**Decisão:** usar o mecanismo `mailto` disponível no navegador.  
**Alternativa rejeitada:** criar um endpoint fictício sem serviço receptor.  
**Consequência:** não exige infraestrutura, mas depende de cliente de e-mail configurado e não confirma entrega.

### ADR-002: Validação HTML nativa

**Contexto:** o formulário não possui lógica de servidor.  
**Decisão:** usar `required` e `type=email` no navegador.  
**Alternativa rejeitada:** adicionar JavaScript apenas para repetir validação nativa.  
**Consequência:** validação simples e imediata; não garante validade do endereço nem deve ser tratada como segurança.

### ADR-003: Não persistir mensagens localmente

**Contexto:** mensagens podem conter dados pessoais e não há política de retenção/consentimento definida.  
**Decisão:** não gravar o formulário no `localStorage`.  
**Alternativa rejeitada:** simular protocolo persistindo mensagens no navegador.  
**Consequência:** a aplicação não mantém histórico nem consegue acompanhar solicitações.

## 6. QUALIDADE E CONFORMIDADE

- [x] Identificação, prioridade, complexidade e status informados.
- [x] Atores, pré-condições e fluxos principal/alternativos descritos.
- [x] Sete regras de negócio e sete RNFs numerados.
- [x] Limitação do `mailto` e do recebimento documentada.
- [x] Mockup, tela e fluxo de dados documentados.
- [x] Três ADRs com alternativas e consequências.
- [ ] Testar campos obrigatórios, e-mail inválido e comportamento sem cliente de e-mail.
- [ ] Validar acessibilidade, responsividade e compatibilidade nos navegadores previstos.
- [ ] Confirmar o endereço de contato com o responsável antes de publicação.
- [ ] Converter/validar protótipo no formato HTML único com CSS embutido se esse critério da validação for obrigatório nesta entrega.
