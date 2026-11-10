/* =========================================================
   CINEMARK — CONTA (pg-conta.js)
   Contato funcional (salva no Store e cai no admin),
   login/cadastro, perfil e painel do admin com a nova
   aba "Mensagens" (RF-009). Adaptado do protótipo.
   ========================================================= */

(() => {
  /* =========================================================
     CONTATO — agora salva a mensagem (antes era só mailto)
     ========================================================= */

  function statusMensagem(msg) {
    if (msg.respondida) return '<span class="msg-status msg-status-respondida">Respondida</span>';
    if (msg.lida) return '<span class="msg-status msg-status-lida">Lida</span>';
    return '<span class="msg-status msg-status-nova">Nova</span>';
  }

  function cartãoMinhaMensagem(msg) {
    return (
      '<article class="minha-msg"><header><div><strong>' + App.esc(msg.assunto) + "</strong> " + statusMensagem(msg) + "</div>" +
      '<span class="msg-data">' + App.formatarData(msg.criadaEm) + "</span></header>" +
      "<p>" + App.esc(msg.mensagem) + "</p>" +
      (msg.respondida && msg.resposta
        ? '<div class="minha-msg-resposta"><strong>Resposta da equipe:</strong><br>' + App.esc(msg.resposta) + "</div>"
        : "") +
      "</article>"
    );
  }

  function renderContato() {
    App.$("app").innerHTML =
      '<header class="contato-hero"><h1>Fale Conosco</h1><p>Dúvidas, sugestões ou reclamações? A gente quer ouvir você.</p></header>' +
      '<main class="contato-wrap">' +
      '<section class="contato-card"><h2>Envie sua mensagem</h2>' +
      '<form class="contato-form" id="formContato" novalidate>' +
      '<div class="field">' +
      '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>' +
      '<input type="text" id="contatoNome" name="nome" placeholder="Seu nome" aria-label="Seu nome" required /></div>' +
      '<div class="field">' +
      '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" aria-hidden="true"><path d="M4 4h16v16H4z" /><path d="M22 6l-10 7L2 6" /></svg>' +
      '<input type="email" id="contatoEmail" name="email" placeholder="Seu e-mail" aria-label="Seu e-mail" required /></div>' +
      '<div class="field">' +
      '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" aria-hidden="true"><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" /></svg>' +
      '<input type="text" id="contatoAssunto" name="assunto" placeholder="Assunto" aria-label="Assunto" required /></div>' +
      '<div class="field field-textarea">' +
      '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>' +
      '<textarea id="contatoMensagem" name="mensagem" placeholder="Sua mensagem" required></textarea></div>' +
      '<button type="submit" class="submit-btn">ENVIAR MENSAGEM</button>' +
      '<div id="contatoFeedback"></div>' +
      '<p class="contato-form-nota" role="note">Respondemos em até 2 dias úteis. Se você tem uma conta, acompanhe a resposta em Minhas mensagens abaixo ou no seu perfil.</p>' +
      '<div class="minhas-msgs" id="minhasMsgs" hidden><h3>Minhas mensagens</h3>' +
      "<p>Acompanhe por aqui o status e a resposta da equipe.</p><div id=\"listaMinhasMsgs\"></div></div>" +
      "</form></section>" +

      '<section class="contato-card contato-canais" aria-labelledby="tituloCanais">' +
      "<h2 id=\"tituloCanais\">Outros canais de contato</h2>" +
      '<p class="contato-canais-intro">Escolha o canal que for mais conveniente para você.</p>' +
      '<ul class="contato-info-list">' +
      '<li><i class="fa-solid fa-envelope" aria-hidden="true"></i><div><strong>E-mail</strong><a href="mailto:contato@cinemark.com.br">contato@cinemark.com.br</a></div></li>' +
      '<li><i class="fa-solid fa-phone" aria-hidden="true"></i><div><strong>Telefone</strong><a href="tel:+5561998081510">(61) 99808-1510</a></div></li>' +
      '<li><i class="fa-solid fa-location-dot" aria-hidden="true"></i><div><strong>Unidades</strong><span>Consulte os cinemas Cinemark no mapa abaixo.</span></div></li>' +
      '<li><i class="fa-regular fa-clock" aria-hidden="true"></i><div><strong>Horário de atendimento</strong><span>Todos os dias, das 10h às 23h</span></div></li>' +
      "</ul>" +
      '<div class="socials" aria-label="Redes sociais da Cinemark">' +
      '<a class="social-btn" href="https://www.instagram.com/cinemarkoficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Cinemark"><i class="fa-brands fa-instagram" aria-hidden="true"></i><span>Instagram</span></a>' +
      '<a class="social-btn" href="https://www.facebook.com/CinemarkBrasil/" target="_blank" rel="noopener noreferrer" aria-label="Facebook Cinemark Brasil"><i class="fa-brands fa-facebook-f" aria-hidden="true"></i><span>Facebook</span></a>' +
      '<a class="social-btn" href="https://x.com/CinemarkBrasil" target="_blank" rel="noopener noreferrer" aria-label="X, antigo Twitter, Cinemark Brasil"><i class="fa-brands fa-x-twitter" aria-hidden="true"></i><span>X / Twitter</span></a>' +
      "</div>" +
      '<div class="contato-mapa-cabecalho"><div>' +
      "<h3><i class=\"fa-solid fa-map-location-dot\" aria-hidden=\"true\"></i> Cinemas Cinemark</h3>" +
      "<p>Encontre uma unidade perto de você pelo mapa.</p></div>" +
      '<a href="https://www.google.com/maps/search/?api=1&amp;query=Cinemark%20Brasil" target="_blank" rel="noopener noreferrer">Ver unidades <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></div>' +
      '<iframe class="contato-map" src="https://www.google.com/maps?q=Cinemark%20Brasil&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa de busca por cinemas Cinemark no Brasil"></iframe>' +
      '<p class="contato-canais-nota">Unidade modelo: Cinemark Shopping Metrópole — Av. das Américas, 5000, Barra da Tijuca, Rio de Janeiro · RJ. Bilheteria aberta todos os dias, das 10h às 23h.</p>' +
      "</section>" +
      '<section class="contato-card contato-faq" aria-labelledby="tituloFaq"><h2 id="tituloFaq">Dúvidas frequentes</h2>' +
      '<details class="faq-item" open><summary>Quem tem direito à meia-entrada?</summary><p>Estudantes com CIE válida, idosos a partir de 60 anos, crianças de 3 a 12 anos, doadores de sangue e outros casos previstos em lei. Apresente o documento na bilheteria junto com o código da reserva.</p></details>' +
      '<details class="faq-item"><summary>Posso cancelar ou trocar minha reserva?</summary><p>Sim. Reservas futuras podem ser canceladas gratuitamente na página Meus ingressos. Trocas de horário devem ser feitas na bilheteria, conforme a disponibilidade da sessão.</p></details>' +
      '<details class="faq-item"><summary>Como retiro meus ingressos?</summary><p>Apresente o código da reserva (ou o QR Code em Meus ingressos) na bilheteria com 30 minutos de antecedência. O pagamento é feito na retirada.</p></details>' +
      '<details class="faq-item"><summary>Qual é a classificação indicativa?</summary><p>Cada filme exibe a classificação na página de detalhes. Menores de idade precisam estar acompanhados conforme a indicação e a legislação vigente.</p></details>' +
      '<p class="faq-ver-mais"><a href="#/ajuda">Ver todas as dúvidas, termos e privacidade</a></p>' +
      "</section></main>" +
      '<footer class="site-footer">© 2026 Cinemark. Todos os direitos reservados.<nav class="rodape-links" aria-label="Links do rodapé"><a href="#/ajuda">Ajuda</a><a href="#/contato">Contato</a><a href="#/ingressos">Meus ingressos</a></nav></footer>';

    const sessao = Store.sessao.atual();
    if (sessao) {
      const usuario = Store.usuarios.buscarPorId(sessao.id);
      if (usuario) {
        App.$("contatoNome").value = usuario.nome || "";
        App.$("contatoEmail").value = usuario.email || "";
      }
    }

    function mostrarMinhasMensagens(email) {
      const lista = Store.mensagens.listarPorEmail(email).slice(0, 10);
      const bloco = App.$("minhasMsgs");
      if (!lista.length) {
        bloco.hidden = true;
        return;
      }
      bloco.hidden = false;
      App.$("listaMinhasMsgs").innerHTML = lista.map(cartãoMinhaMensagem).join("");
    }

    const emailInicial = App.$("contatoEmail").value.trim();
    if (emailInicial) mostrarMinhasMensagens(emailInicial);

    App.$("formContato").addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = App.$("contatoNome").value;
      const email = App.$("contatoEmail").value;
      const assunto = App.$("contatoAssunto").value;
      const mensagem = App.$("contatoMensagem").value;
      const feedback = App.$("contatoFeedback");

      const resultado = Store.mensagens.criar({ nome, email, assunto, mensagem });
      if (!resultado.ok) {
        feedback.innerHTML = '<p class="contato-erro" role="alert">' + App.esc(resultado.erro) + "</p>";
        return;
      }

      feedback.innerHTML =
        '<div class="contato-sucesso" role="status"><i class="fa-solid fa-circle-check" aria-hidden="true"></i>' +
        "<div><strong>Mensagem enviada!</strong> Obrigado pelo contato, " + App.esc(resultado.dado.nome.split(" ")[0]) +
        ". A equipe vai ler e responder por aqui mesmo.</div></div>";
      App.$("contatoAssunto").value = "";
      App.$("contatoMensagem").value = "";
      mostrarMinhasMensagens(resultado.dado.email);
      App.toast("Mensagem enviada para a equipe.");
    });
  }

  /* =========================================================
     LOGIN / CADASTRO / RECUPERAÇÃO
     ========================================================= */

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function renderLogin() {
    if (Store.sessao.atual()) {
      App.nav(Store.sessao.ehAdmin() ? "#/admin" : "#/");
      return;
    }

    App.$("app").innerHTML =
      '<main class="auth-shell"><section class="card-auth">' +
      '<div class="logo-losango" aria-label="Logo da Cinemark"><i class="fa-solid fa-play"></i></div>' +

      '<div class="form-panel active" data-panel="login"><h3 class="titulo-card">Faça seu Login</h3>' +
      '<form class="auth-form" id="formLogin">' +
      '<div class="input-icone"><i class="fa-solid fa-envelope"></i>' +
      '<input id="loginEmail" type="email" placeholder="E-mail" required><div class="invalid-feedback">Digite um e-mail válido.</div></div>' +
      '<div class="input-icone password-wrap"><i class="fa-solid fa-lock"></i>' +
      '<input id="loginPassword" type="password" placeholder="Senha (mínimo 8 caracteres)" required minlength="8">' +
      '<button type="button" class="toggle-password" data-target="loginPassword" aria-label="Mostrar senha"><i class="fa-solid fa-eye"></i></button></div>' +
      '<button type="button" class="link-vermelho link-btn" data-show-panel="recover">Esqueceu sua senha?</button>' +
      '<p class="erro-auth" role="alert" hidden></p>' +
      '<button type="submit" class="btn-vermelho">ENTRAR</button></form>' +
      '<p class="texto-rodape">Não tem conta? <button type="button" class="link-btn link-rodape" data-show-panel="register">Cadastre-se</button></p></div>' +

      '<div class="form-panel" data-panel="register"><h3 class="titulo-card">Faça seu Cadastro</h3>' +
      '<form class="auth-form" id="formRegister">' +
      '<div class="input-icone"><i class="fa-solid fa-user"></i>' +
      '<input id="registerNome" type="text" placeholder="Nome completo" required></div>' +
      '<div class="input-icone"><i class="fa-solid fa-envelope"></i>' +
      '<input id="registerEmail" type="email" placeholder="E-mail" required><div class="invalid-feedback">Digite um e-mail válido.</div></div>' +
      '<div class="input-icone password-wrap"><i class="fa-solid fa-lock"></i>' +
      '<input id="registerPassword" type="password" placeholder="Senha (mínimo 8 caracteres)" required minlength="8">' +
      '<button type="button" class="toggle-password" data-target="registerPassword" aria-label="Mostrar senha"><i class="fa-solid fa-eye"></i></button></div>' +
      '<div class="input-icone password-wrap"><i class="fa-solid fa-lock"></i>' +
      '<input id="registerPasswordConfirmation" type="password" placeholder="Confirmar senha" required minlength="8">' +
      '<button type="button" class="toggle-password" data-target="registerPasswordConfirmation" aria-label="Mostrar senha"><i class="fa-solid fa-eye"></i></button>' +
      '<div class="invalid-feedback">As senhas precisam ser iguais.</div></div>' +
      '<p class="erro-auth" role="alert" hidden></p>' +
      '<button type="submit" class="btn-vermelho">CADASTRAR</button></form>' +
      '<p class="texto-rodape"><button type="button" class="link-btn link-rodape" data-show-panel="login">Entra em conta existente</button></p></div>' +

      '<div class="form-panel" data-panel="recover"><h3 class="titulo-card">Esqueci minha Senha</h3>' +
      '<div id="etapaRecuperarEmail">' +
      '<p class="texto-explicacao">Digite seu e-mail para receber um código de verificação.</p>' +
      '<form class="auth-form" id="formRecover">' +
      '<div class="input-icone"><i class="fa-solid fa-envelope"></i>' +
      '<input id="recoverEmail" type="email" placeholder="E-mail" required></div>' +
      '<p class="erro-auth" role="alert" hidden></p>' +
      '<button type="submit" class="btn-vermelho">ENVIAR CÓDIGO</button></form></div>' +
      '<div id="etapaRecuperarCodigo" hidden>' +
      '<p class="texto-explicacao">Enviamos um código de 6 dígitos (veja o e-mail simulado abaixo). Ele vale por 15 minutos.</p>' +
      '<div class="email-simulado" id="emailSimulado" role="status"></div>' +
      '<form class="auth-form" id="formNovaSenha">' +
      '<div class="input-icone"><i class="fa-solid fa-key"></i>' +
      '<input id="recoverCodigo" type="text" inputmode="numeric" placeholder="Código de 6 dígitos" required maxlength="6"></div>' +
      '<div class="input-icone password-wrap"><i class="fa-solid fa-lock"></i>' +
      '<input id="recoverNovaSenha" type="password" placeholder="Nova senha (mínimo 8 caracteres)" required minlength="8">' +
      '<button type="button" class="toggle-password" data-target="recoverNovaSenha" aria-label="Mostrar senha"><i class="fa-solid fa-eye"></i></button></div>' +
      '<p class="erro-auth" role="alert" hidden></p>' +
      '<button type="submit" class="btn-vermelho">DEFINIR NOVA SENHA</button></form></div>' +
      '<p class="texto-rodape"><button type="button" class="link-btn link-rodape" data-show-panel="login">Voltar para o Login</button></p></div>' +

      '<p class="texto-rodape"><a href="#/">&larr; Voltar para o site</a></p>' +
      "</section></main>" +

      '<div id="toastCadastro" class="toast-cadastro" role="status" aria-live="polite"><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Cadastro realizado com sucesso!</span><button type="button" class="fechar-toast" aria-label="Fechar mensagem">&times;</button></div>' +
      '<div id="toastLogin" class="toast-cadastro" role="status" aria-live="polite"><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Login realizado com sucesso!</span><button type="button" class="fechar-toast" aria-label="Fechar mensagem">&times;</button></div>' +
      '<div id="toastRecuperacao" class="toast-cadastro" role="status" aria-live="polite"><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Senha alterada! Entre com a nova senha.</span><button type="button" class="fechar-toast" aria-label="Fechar mensagem">&times;</button></div>';

    const panels = document.querySelectorAll(".form-panel");
    function showPanel(name) {
      panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === name));
    }
    document.querySelectorAll("[data-show-panel]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        showPanel(btn.dataset.showPanel);
      });
    });

    document.querySelectorAll(".toggle-password").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.target);
        if (!input) return;
        const mostrar = input.type === "password";
        input.type = mostrar ? "text" : "password";
        const icon = btn.querySelector("i");
        if (icon) {
          icon.classList.toggle("fa-eye", mostrar);
          icon.classList.toggle("fa-eye-slash", !mostrar);
        }
        btn.setAttribute("aria-label", mostrar ? "Ocultar senha" : "Mostrar senha");
      });
    });

    const toastTimeouts = new Map();
    function mostrarToast(id) {
      const el = document.getElementById(id);
      if (!el) return;
      clearTimeout(toastTimeouts.get(el));
      el.classList.add("visivel");
      toastTimeouts.set(el, setTimeout(() => el.classList.remove("visivel"), 4500));
    }
    document.querySelectorAll(".toast-cadastro .fechar-toast").forEach((btn) => {
      btn.addEventListener("click", () => btn.closest(".toast-cadastro")?.classList.remove("visivel"));
    });

    function mostrarErro(form, mensagem) {
      const caixa = form.querySelector(".erro-auth");
      if (!caixa) return;
      caixa.textContent = mensagem;
      caixa.hidden = false;
    }
    function limparErro(form) {
      const caixa = form.querySelector(".erro-auth");
      if (!caixa) return;
      caixa.textContent = "";
      caixa.hidden = true;
    }

    App.$("formRegister").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      const senha = App.$("registerPassword").value;
      const confirma = App.$("registerPasswordConfirmation").value;
      if (!emailRegex.test(App.$("registerEmail").value.trim())) {
        mostrarErro(form, "Digite um e-mail válido.");
        return;
      }
      if (senha !== confirma) {
        mostrarErro(form, "As senhas precisam ser iguais.");
        return;
      }
      const resultado = Store.usuarios.criar({
        nome: App.$("registerNome").value,
        email: App.$("registerEmail").value,
        senha,
        perfil: "cliente"
      });
      if (!resultado.ok) {
        mostrarErro(form, resultado.erro);
        return;
      }
      limparErro(form);
      form.reset();
      showPanel("login");
      mostrarToast("toastCadastro");
    });

    App.$("formLogin").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      const resultado = Store.usuarios.autenticar(
        App.$("loginEmail").value,
        App.$("loginPassword").value
      );
      if (!resultado.ok) {
        mostrarErro(form, resultado.erro);
        return;
      }
      limparErro(form);
      mostrarToast("toastLogin");
      App.renderNavConta();
      const destino = resultado.dado.perfil === "admin" ? "#/admin" : "#/";
      setTimeout(() => App.nav(destino), 900);
    });

    App.$("formRecover").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      const resultado = Store.gerarCodigoRecuperacao(App.$("recoverEmail").value);
      if (!resultado.ok) {
        mostrarErro(form, resultado.erro);
        return;
      }
      limparErro(form);
      App.$("etapaRecuperarEmail").hidden = true;
      App.$("etapaRecuperarCodigo").hidden = false;
      App.$("emailSimulado").innerHTML =
        '<strong>E-mail simulado para ' + App.esc(resultado.dado.email) + ":</strong>" +
        '<span class="codigo-simulado">' + App.esc(resultado.dado.codigo) + "</span>" +
        "<small>Sem servidor de e-mail neste projeto, o código aparece aqui para concluir a recuperação.</small>";
      App.$("recoverCodigo").focus();
    });

    App.$("formNovaSenha").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      const email = App.$("recoverEmail").value;
      const resultado = Store.redefinirSenha(email, App.$("recoverCodigo").value, App.$("recoverNovaSenha").value);
      if (!resultado.ok) {
        mostrarErro(form, resultado.erro);
        return;
      }
      limparErro(form);
      form.reset();
      App.$("formRecover").reset();
      App.$("etapaRecuperarCodigo").hidden = true;
      App.$("etapaRecuperarEmail").hidden = false;
      App.$("loginEmail").value = email;
      showPanel("login");
      mostrarToast("toastRecuperacao");
    });
  }

  /* =========================================================
     PERFIL (próprios dados + minhas mensagens)
     ========================================================= */

  function renderPerfil() {
    const sessao = Store.sessao.atual();
    const usuario = sessao && Store.usuarios.buscarPorId(sessao.id);
    if (!usuario) {
      Store.sessao.encerrar();
      App.nav("#/login");
      return;
    }

    const minhasMsgs = Store.mensagens.listarPorEmail(usuario.email);

    App.$("app").innerHTML =
      '<header class="adm-topbar"><a class="adm-marca" href="#/">' +
      '<i class="fa-solid fa-film"></i><span>Cinemark<small>MINHA CONTA</small></span></a>' +
      '<div class="adm-topbar-acoes">' +
      '<a class="adm-btn" href="#/"><i class="fa-solid fa-arrow-left"></i> Voltar ao site</a>' +
      '<a class="adm-btn" href="#/admin" id="linkAdmin" ' + (usuario.perfil === "admin" ? "" : "hidden") + '><i class="fa-solid fa-gauge-high"></i> Administração</a>' +
      '<button type="button" class="adm-btn adm-btn-perigo" id="btnSair"><i class="fa-solid fa-arrow-right-from-bracket"></i> Sair</button>' +
      "</div></header>" +
      '<main class="perfil-conteudo"><div class="perfil-card">' +
      '<div class="perfil-avatar" id="perfilIniciais">?</div>' +
      "<h1 class=\"adm-titulo-pagina\" id=\"perfilNomeTopo\">—</h1>" +
      '<p class="perfil-meta"><span class="etiqueta" id="perfilEtiqueta">CLIENTE</span> &nbsp;·&nbsp; Cliente desde <span id="perfilDesde">—</span></p>' +
      '<p class="mensagem-erro" id="erroPerfil" hidden></p>' +
      '<div class="form-linha"><label for="perfilNome">Nome completo</label><input type="text" class="adm-input" id="perfilNome"></div>' +
      '<div class="form-linha"><label for="perfilEmail">E-mail</label><input type="email" class="adm-input" id="perfilEmail"></div>' +
      '<div class="form-linha"><label for="perfilSenha">Nova senha</label>' +
      '<input type="password" class="adm-input" id="perfilSenha" placeholder="Mínimo 8 caracteres">' +
      '<p class="form-ajuda">Deixe em branco para continuar com a senha atual.</p></div>' +
      '<button type="button" class="adm-btn adm-btn-primario" id="btnSalvarPerfil"><i class="fa-solid fa-floppy-disk"></i> Salvar alterações</button>' +

      '<section class="perfil-msgs" aria-labelledby="tituloMinhasMsgs">' +
      "<h2 id=\"tituloMinhasMsgs\">Minhas mensagens de contato</h2>" +
      "<p>Mensagens que você enviou pela página de contato, com a resposta da equipe.</p>" +
      '<div id="perfilListaMsgs">' +
      (minhasMsgs.length
        ? minhasMsgs.map(cartãoMinhaMensagem).join("")
        : '<p class="form-ajuda">Você ainda não enviou mensagens. <a href="#/contato">Falar com a equipe</a></p>') +
      "</div></section>" +

      '<section class="perfil-msgs" aria-labelledby="tituloMeusIngressos">' +
      "<h2 id=\"tituloMeusIngressos\">Meus ingressos</h2>" +
      '<p id="perfilResumoIngressos"></p>' +
      '<p><a class="adm-btn adm-btn-primario" href="#/ingressos"><i class="fa-solid fa-ticket"></i> Ver meus ingressos</a></p>' +
      "</section>" +

      '<section class="perfil-msgs" aria-labelledby="tituloMeusPedidos">' +
      "<h2 id=\"tituloMeusPedidos\">Meus pedidos da loja</h2>" +
      '<p>Retire no balcão do cinema apresentando o código do pedido.</p>' +
      '<div id="perfilListaPedidos"></div></section>' +

      '<section class="perfil-msgs" aria-labelledby="tituloMinhaAssinatura">' +
      "<h2 id=\"tituloMinhaAssinatura\">Minha assinatura</h2>" +
      '<div id="perfilAssinatura"></div></section>' +

      '<section class="aviso-perigo"><h3><i class="fa-solid fa-triangle-exclamation"></i> Excluir minha conta</h3>' +
      "<p>Sua conta e seus dados serão removidos permanentemente do sistema. Não é possível desfazer.</p>" +
      '<button type="button" class="adm-btn adm-btn-perigo" id="btnExcluirConta"><i class="fa-solid fa-trash"></i> Excluir minha conta</button></section>' +
      "</div></main>" +

      '<div class="modal fade modal-cinemark" id="modalExcluirConta" tabindex="-1" aria-hidden="true">' +
      '<div class="modal-dialog modal-dialog-centered modal-sm"><div class="modal-content">' +
      '<div class="modal-header"><h5 class="modal-title">Excluir minha conta</h5>' +
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button></div>' +
      '<div class="modal-body"><p class="mensagem-erro" id="erroExcluirConta" hidden></p>' +
      "<p>Digite <strong>EXCLUIR</strong> para confirmar:</p>" +
      '<input type="text" class="adm-input" id="confirmacaoTexto" placeholder="EXCLUIR"></div>' +
      '<div class="modal-footer"><button type="button" class="adm-btn" data-bs-dismiss="modal">Cancelar</button>' +
      '<button type="button" class="adm-btn adm-btn-perigo" id="btnConfirmarExclusaoConta">Excluir definitivamente</button></div>' +
      "</div></div></div>" +
      '<div class="toast-adm" id="toastAdm" role="status" aria-live="polite"></div>';

    let timeoutToast;
    function avisar(mensagem) {
      const toastEl = App.$("toastAdm");
      toastEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + App.esc(mensagem);
      toastEl.classList.add("visivel");
      clearTimeout(timeoutToast);
      timeoutToast = setTimeout(() => toastEl.classList.remove("visivel"), 3200);
    }

    function preencher(dados) {
      const iniciais = String(dados.nome || "")
        .split(" ").filter(Boolean).slice(0, 2)
        .map((parte) => parte[0].toUpperCase()).join("");
      App.$("perfilIniciais").textContent = iniciais || "?";
      App.$("perfilNomeTopo").textContent = dados.nome;
      App.$("perfilNome").value = dados.nome;
      App.$("perfilEmail").value = dados.email;
      App.$("perfilDesde").textContent = dados.criadoEm
        ? new Date(dados.criadoEm).toLocaleDateString("pt-BR") : "—";
      const etiqueta = App.$("perfilEtiqueta");
      const ehAdmin = dados.perfil === "admin";
      etiqueta.textContent = ehAdmin ? "ADMINISTRADOR" : "CLIENTE";
      etiqueta.className = "etiqueta " + (ehAdmin ? "etiqueta-admin" : "etiqueta-cliente");
      App.$("linkAdmin").hidden = !ehAdmin;
    }
    preencher(usuario);

    /* ----- resumo de ingressos ----- */
    (function resumoIngressos() {
      const todas = Store.reservas.listarPorUsuario(usuario.id, usuario.email)
        .filter((r) => !r.canceladaEm && Store.reservas.horarioFim(r) > Date.now());
      App.$("perfilResumoIngressos").innerHTML = todas.length
        ? "Você tem <strong>" + todas.length + "</strong> " + (todas.length === 1 ? "reserva futura" : "reservas futuras") + ". Apresente o código na bilheteria."
        : "Você ainda não tem reservas futuras. <a href=\"#/filmes\">Ver filmes em cartaz</a>";
    })();

    /* ----- pedidos da loja ----- */
    const ROTULOS_PEDIDO_PERFIL = { confirmado: "Confirmado", pronto: "Pronto p/ retirada", entregue: "Entregue", cancelado: "Cancelado" };
    function renderizarPedidosPerfil() {
      const lista = Store.pedidos.listarPorUsuario(usuario.id, usuario.email);
      const caixa = App.$("perfilListaPedidos");
      if (!lista.length) {
        caixa.innerHTML = '<p class="form-ajuda">Você ainda não fez pedidos. <a href="#/loja">Ver a loja</a></p>';
        return;
      }
      caixa.innerHTML = lista.map((p) =>
        '<article class="minha-msg"><header><div><strong>Pedido ' + App.esc(p.codigo) + "</strong> " +
        '<span class="msg-status">' + ROTULOS_PEDIDO_PERFIL[p.status] + "</span></div>" +
        '<span class="msg-data">' + App.formatarData(p.criadaEm) + "</span></header>" +
        "<p>" + p.itens.map((item) => App.esc(item.quantidade + "× " + item.nome + (item.tamanho ? " (" + item.tamanho + ")" : ""))).join("; ") + "</p>" +
        "<p><strong>Total: " + App.fmtBRL(p.totalCentavos) + "</strong>" +
        (p.descontoPercentual ? " (desconto " + p.descontoPercentual + "% " + App.esc(p.planoTitulo || "do plano") + ")" : "") + "</p>" +
        (p.status === "confirmado"
          ? '<p><button type="button" class="adm-btn adm-btn-perigo" data-cancelar-pedido="' + p.id + '">Cancelar pedido</button></p>'
          : "") +
        "</article>"
      ).join("");
    }
    renderizarPedidosPerfil();
    App.$("perfilListaPedidos").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cancelar-pedido]");
      if (!btn) return;
      if (!btn.dataset.confirmado) {
        btn.dataset.confirmado = "1";
        btn.textContent = "Confirmar cancelamento?";
        return;
      }
      const resultado = Store.pedidos.cancelar(btn.dataset.cancelarPedido, { usuarioId: usuario.id });
      if (!resultado.ok) {
        App.$("erroPerfil").textContent = resultado.erro;
        App.$("erroPerfil").hidden = false;
        return;
      }
      App.$("erroPerfil").hidden = true;
      renderizarPedidosPerfil();
      avisar("Pedido cancelado.");
    });

    /* ----- assinatura ----- */
    (function renderizarAssinatura() {
      const caixa = App.$("perfilAssinatura");
      const ativa = Store.assinaturas.ativaPara(usuario.id);
      if (!ativa) {
        caixa.innerHTML = '<p class="form-ajuda">Você não tem uma assinatura ativa. Assinantes ganham desconto nos ingressos e na loja.</p>' +
          '<p><button type="button" class="adm-btn adm-btn-primario" data-bs-toggle="modal" data-bs-target="#modalPlanos"><i class="fa-solid fa-crown"></i> Ver planos</button></p>';
        return;
      }
      const plano = Store.assinaturas.buscarPlano(ativa.planoId);
      caixa.innerHTML =
        "<p><strong>Plano " + App.esc(ativa.planoNome) + "</strong> · válido até " +
        new Date(ativa.fimEm).toLocaleDateString("pt-BR") + "</p>" +
        (plano
          ? "<p class=\"form-ajuda\">" + plano.beneficios.map((b) => App.esc(b)).join(" · ") + "</p>"
          : "") +
        '<p><button type="button" class="adm-btn" id="btnCancelarAssinatura">Cancelar assinatura</button></p>';
      App.$("btnCancelarAssinatura").addEventListener("click", (e) => {
        const btn = e.currentTarget;
        if (!btn.dataset.confirmado) {
          btn.dataset.confirmado = "1";
          btn.textContent = "Confirmar cancelamento?";
          return;
        }
        Store.assinaturas.cancelar(usuario.id);
        renderizarAssinatura();
        avisar("Assinatura cancelada.");
      });
    })();

    App.$("btnSalvarPerfil").addEventListener("click", () => {
      const dados = { nome: App.$("perfilNome").value, email: App.$("perfilEmail").value };
      const novaSenha = App.$("perfilSenha").value;
      if (novaSenha) dados.senha = novaSenha;
      if (!String(dados.nome).trim()) {
        App.$("erroPerfil").textContent = "O nome não pode ficar em branco.";
        App.$("erroPerfil").hidden = false;
        return;
      }
      const resultado = Store.usuarios.atualizar(usuario.id, dados);
      if (!resultado.ok) {
        App.$("erroPerfil").textContent = resultado.erro;
        App.$("erroPerfil").hidden = false;
        return;
      }
      App.$("erroPerfil").hidden = true;
      App.$("perfilSenha").value = "";
      preencher(resultado.dado);
      App.renderNavConta();
      avisar("Dados atualizados com sucesso.");
    });

    App.$("btnSair").addEventListener("click", () => {
      Store.sessao.encerrar();
      App.nav("#/");
    });

    const modalExcluir = typeof bootstrap !== "undefined" ? new bootstrap.Modal(App.$("modalExcluirConta")) : null;
    App.$("btnExcluirConta").addEventListener("click", () => {
      App.$("erroExcluirConta").hidden = true;
      App.$("confirmacaoTexto").value = "";
      modalExcluir?.show();
    });
    App.$("btnConfirmarExclusaoConta").addEventListener("click", () => {
      if (App.$("confirmacaoTexto").value.trim().toUpperCase() !== "EXCLUIR") {
        App.$("erroExcluirConta").textContent = "Digite EXCLUIR para confirmar.";
        App.$("erroExcluirConta").hidden = false;
        return;
      }
      const resultado = Store.usuarios.excluir(usuario.id);
      if (!resultado.ok) {
        App.$("erroExcluirConta").textContent = resultado.erro;
        App.$("erroExcluirConta").hidden = false;
        return;
      }
      App.nav("#/");
    });
  }

  /* =========================================================
     ADMIN — filmes, usuários e MENSAGENS (novo)
     ========================================================= */

  function escapar(texto) {
    return App.esc(texto);
  }

  function renderAdmin() {
    const logado = Store.sessao.atual();
    const naoLidas = Store.mensagens.naoLidas();

    App.$("app").innerHTML =
      '<header class="adm-topbar"><a class="adm-marca" href="#/">' +
      '<i class="fa-solid fa-film"></i><span>Cinemark<small>PAINEL ADMINISTRATIVO</small></span></a>' +
      '<div class="adm-topbar-acoes">' +
      '<span class="adm-usuario"><i class="fa-solid fa-circle-user"></i> <strong id="admNome">' + escapar(logado.nome) + "</strong></span>" +
      '<a class="adm-btn" href="#/"><i class="fa-solid fa-arrow-left"></i> Ver o site</a>' +
      '<button type="button" class="adm-btn" id="btnRestaurar" title="Volta os dados para o estado inicial"><i class="fa-solid fa-rotate-left"></i> Restaurar dados</button>' +
      '<button type="button" class="adm-btn adm-btn-perigo" id="btnSair"><i class="fa-solid fa-arrow-right-from-bracket"></i> Sair</button>' +
      "</div></header>" +

      '<main class="adm-conteudo">' +
      "<h1 class=\"adm-titulo-pagina\">Gestão de conteúdo</h1>" +
      "<p class=\"adm-subtitulo\">Cadastro, consulta, edição e exclusão de filmes, usuários, mensagens do contato e pedidos da loja.</p>" +
      '<section class="adm-cards">' +
      '<article class="adm-card"><span class="rotulo">Filmes cadastrados</span><span class="valor" id="totalFilmes">0</span></article>' +
      '<article class="adm-card"><span class="rotulo">Em cartaz</span><span class="valor" id="totalCartaz">0</span></article>' +
      '<article class="adm-card"><span class="rotulo">Usuários</span><span class="valor" id="totalUsuarios">0</span></article>' +
      '<article class="adm-card"><span class="rotulo">Administradores</span><span class="valor" id="totalAdmins">0</span></article>' +
      '<article class="adm-card"><span class="rotulo">Mensagens recebidas</span><span class="valor" id="totalMensagens">0</span></article>' +
      '<article class="adm-card"><span class="rotulo">Mensagens não lidas</span><span class="valor" id="totalNaoLidas">0</span></article>' +
      '<article class="adm-card"><span class="rotulo">Pedidos da loja</span><span class="valor" id="totalPedidos">0</span></article>' +
      '<article class="adm-card"><span class="rotulo">Assinaturas ativas</span><span class="valor" id="totalAssinaturas">0</span></article>' +
      "</section>" +

      '<nav class="adm-abas">' +
      '<button type="button" class="adm-aba ativa" data-aba="filmes"><i class="fa-solid fa-clapperboard"></i> Filmes</button>' +
      '<button type="button" class="adm-aba" data-aba="usuarios"><i class="fa-solid fa-users"></i> Usuários</button>' +
      '<button type="button" class="adm-aba" data-aba="pedidos"><i class="fa-solid fa-bag-shopping"></i> Pedidos <span class="etiqueta-msg' + (Store.pedidos.listar().filter((p) => p.status === "confirmado").length ? "" : " zero") + '">' + Store.pedidos.listar().filter((p) => p.status === "confirmado").length + "</span></button>" +
      '<button type="button" class="adm-aba" data-aba="mensagens"><i class="fa-solid fa-envelope-open-text"></i> Mensagens <span class="etiqueta-msg' + (naoLidas ? "" : " zero") + '" id="badgeMensagens">' + naoLidas + "</span></button>" +
      "</nav>" +

      '<section class="adm-painel" data-painel="filmes">' +
      '<div class="adm-filtros"><div class="adm-campo-busca"><i class="fa-solid fa-magnifying-glass"></i>' +
      '<input type="search" class="adm-input" id="buscaFilme" placeholder="Buscar por título ou gênero..."></div>' +
      '<select class="adm-select" id="filtroGenero"><option value="">Todos os gêneros</option></select>' +
      '<select class="adm-select" id="filtroCartaz"><option value="">Todos os status</option><option value="sim">Em cartaz</option><option value="nao">Fora de cartaz</option></select>' +
      '<button type="button" class="adm-btn adm-btn-primario" id="btnNovoFilme"><i class="fa-solid fa-plus"></i> Novo filme</button></div>' +
      '<div class="adm-tabela-wrap"><table class="adm-tabela"><thead><tr>' +
      "<th>Pôster</th><th>Título</th><th>Gênero</th><th>Ano</th><th>Classificação</th><th>Status</th>" +
      '<th class="coluna-acoes">Ações</th></tr></thead><tbody id="tabelaFilmes"></tbody></table>' +
      '<div class="adm-vazio" id="filmesVazio" hidden><i class="fa-regular fa-face-frown"></i> Nenhum filme encontrado com esses filtros.</div></div>' +
      "</section>" +

      '<section class="adm-painel" data-painel="usuarios" hidden>' +
      '<div class="adm-filtros"><div class="adm-campo-busca"><i class="fa-solid fa-magnifying-glass"></i>' +
      '<input type="search" class="adm-input" id="buscaUsuario" placeholder="Buscar por nome ou e-mail..."></div>' +
      '<select class="adm-select" id="filtroPerfil"><option value="">Todos os perfis</option><option value="admin">Administrador</option><option value="cliente">Cliente</option></select>' +
      '<button type="button" class="adm-btn adm-btn-primario" id="btnNovoUsuario"><i class="fa-solid fa-user-plus"></i> Novo usuário</button></div>' +
      '<div class="adm-tabela-wrap"><table class="adm-tabela"><thead><tr>' +
      "<th>Nome</th><th>E-mail</th><th>Perfil</th><th>Cadastrado em</th>" +
      '<th class="coluna-acoes">Ações</th></tr></thead><tbody id="tabelaUsuarios"></tbody></table>' +
      '<div class="adm-vazio" id="usuariosVazio" hidden><i class="fa-regular fa-face-frown"></i> Nenhum usuário encontrado com esses filtros.</div></div>' +
      "</section>" +

      '<section class="adm-painel" data-painel="pedidos" hidden>' +
      '<div class="adm-filtros"><div class="adm-campo-busca"><i class="fa-solid fa-magnifying-glass"></i>' +
      '<input type="search" class="adm-input" id="buscaPedido" placeholder="Buscar por código, nome ou e-mail..."></div>' +
      '<select class="adm-select" id="filtroStatusPedido"><option value="">Todos os status</option><option value="confirmado">Confirmado</option><option value="pronto">Pronto p/ retirada</option><option value="entregue">Entregue</option><option value="cancelado">Cancelado</option></select>' +
      "</div>" +
      '<div class="adm-tabela-wrap"><table class="adm-tabela"><thead><tr>' +
      "<th>Código</th><th>Feito em</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Status</th>" +
      '<th class="coluna-acoes">Ações</th></tr></thead><tbody id="tabelaPedidos"></tbody></table>' +
      '<div class="adm-vazio" id="pedidosVazio" hidden><i class="fa-solid fa-bag-shopping"></i> Nenhum pedido encontrado com esses filtros.</div></div>' +
      "</section>" +

      '<section class="adm-painel" data-painel="mensagens" hidden>' +      '<div class="adm-filtros"><div class="adm-campo-busca"><i class="fa-solid fa-magnifying-glass"></i>' +
      '<input type="search" class="adm-input" id="buscaMensagem" placeholder="Buscar por nome, e-mail ou assunto..."></div>' +
      '<select class="adm-select" id="filtroStatusMsg"><option value="">Todas</option><option value="nova">Não lidas</option><option value="lida">Lidas</option><option value="respondida">Respondidas</option><option value="aguardando">Aguardando resposta</option></select>' +
      "</div>" +
      '<div class="adm-tabela-wrap"><table class="adm-tabela"><thead><tr>' +
      "<th>Recebida em</th><th>Nome / e-mail</th><th>Assunto</th><th>Mensagem</th><th>Status</th>" +
      '<th class="coluna-acoes">Ações</th></tr></thead><tbody id="tabelaMensagens"></tbody></table>' +
      '<div class="adm-vazio" id="mensagensVazio" hidden><i class="fa-regular fa-envelope-open"></i> Nenhuma mensagem encontrada com esses filtros.</div></div>' +
      "</section>" +
      "</main>" +

      '<div class="modal fade modal-cinemark" id="modalFilme" tabindex="-1" aria-hidden="true">' +
      '<div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header">' +
      '<h5 class="modal-title" id="tituloModalFilme">Novo filme</h5>' +
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button></div>' +
      '<div class="modal-body"><p class="mensagem-erro" id="erroFilme" hidden></p>' +
      '<input type="hidden" id="filmeId">' +
      '<div class="form-linha"><label for="filmeTitulo">Título *</label><input type="text" class="adm-input" id="filmeTitulo" placeholder="Ex.: A Odisseia"></div>' +
      '<div class="form-duplo"><div class="form-linha"><label for="filmeGenero">Gênero *</label><input type="text" class="adm-input" id="filmeGenero" list="listaGeneros" placeholder="Ex.: Ação"><datalist id="listaGeneros"></datalist></div>' +
      '<div class="form-linha"><label for="filmeAno">Ano *</label><input type="number" class="adm-input" id="filmeAno" min="1900" max="2100" placeholder="2026"></div></div>' +
      '<div class="form-duplo"><div class="form-linha"><label for="filmeClassificacao">Classificação *</label>' +
      '<select class="adm-select" id="filmeClassificacao" style="max-width:none"><option value="L">L — Livre</option><option value="10">10 anos</option><option value="12">12 anos</option><option value="14">14 anos</option><option value="16">16 anos</option><option value="18">18 anos</option></select></div>' +
      '<div class="form-linha"><label for="filmePoster">Caminho do pôster</label><input type="text" class="adm-input" id="filmePoster" placeholder="src/img/meu-poster.png"></div></div>' +
      '<div class="form-linha"><label for="filmeSinopse">Sinopse</label><textarea class="adm-textarea" id="filmeSinopse" rows="3" placeholder="Resumo do filme (opcional)"></textarea></div>' +
      '<div class="form-linha"><label for="filmeFonteVideo">Trailer ou fonte do vídeo</label>' +
      '<input type="text" class="adm-input" id="filmeFonteVideo" placeholder="https://youtu.be/... ou src/videos/meu-filme.mp4">' +
      '<small class="text-white-50">Use um link HTTPS de trailer (YouTube) ou um caminho relativo para vídeo autorizado. Não envie arquivos aqui.</small></div>' +
      '<label class="form-check-cinemark"><input type="checkbox" id="filmeEmCartaz" checked> Em cartaz (aparece no carrossel da home)</label></div>' +
      '<div class="modal-footer"><button type="button" class="adm-btn" data-bs-dismiss="modal">Cancelar</button>' +
      '<button type="button" class="adm-btn adm-btn-primario" id="btnSalvarFilme"><i class="fa-solid fa-floppy-disk"></i> Salvar</button></div>' +
      "</div></div></div>" +

      '<div class="modal fade modal-cinemark" id="modalUsuario" tabindex="-1" aria-hidden="true">' +
      '<div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header">' +
      '<h5 class="modal-title" id="tituloModalUsuario">Novo usuário</h5>' +
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button></div>' +
      '<div class="modal-body"><p class="mensagem-erro" id="erroUsuario" hidden></p>' +
      '<input type="hidden" id="usuarioId">' +
      '<div class="form-linha"><label for="usuarioNome">Nome completo *</label><input type="text" class="adm-input" id="usuarioNome"></div>' +
      '<div class="form-linha"><label for="usuarioEmail">E-mail *</label><input type="email" class="adm-input" id="usuarioEmail"></div>' +
      '<div class="form-duplo"><div class="form-linha"><label for="usuarioPerfil">Perfil *</label>' +
      '<select class="adm-select" id="usuarioPerfil" style="max-width:none"><option value="cliente">Cliente</option><option value="admin">Administrador</option></select>' +
      '<p class="form-ajuda" id="ajudaHierarquiaAdmin"></p></div>' +
      '<div class="form-linha"><label for="usuarioSenha">Senha</label><input type="password" class="adm-input" id="usuarioSenha" placeholder="Mínimo 8 caracteres">' +
      '<p class="form-ajuda" id="ajudaSenha"></p></div></div></div>' +
      '<div class="modal-footer"><button type="button" class="adm-btn" data-bs-dismiss="modal">Cancelar</button>' +
      '<button type="button" class="adm-btn adm-btn-primario" id="btnSalvarUsuario"><i class="fa-solid fa-floppy-disk"></i> Salvar</button></div>' +
      "</div></div></div>" +

      '<div class="modal fade modal-cinemark" id="modalMensagem" tabindex="-1" aria-hidden="true">' +
      '<div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header">' +
      '<h5 class="modal-title" id="tituloModalMensagem">Mensagem</h5>' +
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button></div>' +
      '<div class="modal-body"><p class="mensagem-erro" id="erroMensagem" hidden></p>' +
      '<input type="hidden" id="mensagemId">' +
      '<div class="msg-detalhe-bloco"><small>Recebida em</small><div id="msgData">—</div></div>' +
      '<div class="msg-detalhe-bloco"><small>De</small><div id="msgRemetente">—</div></div>' +
      '<div class="msg-detalhe-bloco"><small>Assunto</small><div id="msgAssunto"><strong>—</strong></div></div>' +
      '<div class="msg-detalhe-bloco"><small>Mensagem</small><div class="msg-detalhe-texto" id="msgTexto">—</div></div>' +
      '<div class="form-linha"><label for="msgResposta">Resposta da equipe</label>' +
      '<textarea class="adm-textarea" id="msgResposta" rows="3" placeholder="Escreva a resposta que o visitante verá no perfil e no contato..."></textarea></div>' +
      "</div>" +
      '<div class="modal-footer"><button type="button" class="adm-btn" data-bs-dismiss="modal">Fechar</button>' +
      '<button type="button" class="adm-btn" id="btnAlternarLida"><i class="fa-solid fa-envelope-open"></i> <span>Marcar como lida</span></button>' +
      '<button type="button" class="adm-btn adm-btn-primario" id="btnResponderMsg"><i class="fa-solid fa-reply"></i> Salvar resposta</button></div>' +
      "</div></div></div>" +

      '<div class="modal fade modal-cinemark" id="modalExcluir" tabindex="-1" aria-hidden="true">' +
      '<div class="modal-dialog modal-dialog-centered modal-sm"><div class="modal-content"><div class="modal-header">' +
      '<h5 class="modal-title">Confirmar exclusão</h5>' +
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button></div>' +
      '<div class="modal-body"><p class="mensagem-erro" id="erroExcluir" hidden></p>' +
      "<p id=\"textoExcluir\">Tem certeza?</p><p class=\"form-ajuda\">Essa ação não pode ser desfeita.</p></div>" +
      '<div class="modal-footer"><button type="button" class="adm-btn" data-bs-dismiss="modal">Cancelar</button>' +
      '<button type="button" class="adm-btn adm-btn-perigo" id="btnConfirmarExclusao"><i class="fa-solid fa-trash"></i> Excluir</button></div>' +
      "</div></div></div>" +

      '<div class="toast-adm" id="toastAdm" role="status" aria-live="polite"></div>';

    const $ = (id) => document.getElementById(id);
    const modalFilme = typeof bootstrap !== "undefined" ? new bootstrap.Modal($("modalFilme")) : null;
    const modalUsuario = typeof bootstrap !== "undefined" ? new bootstrap.Modal($("modalUsuario")) : null;
    const modalExcluir = typeof bootstrap !== "undefined" ? new bootstrap.Modal($("modalExcluir")) : null;
    const modalMensagem = typeof bootstrap !== "undefined" ? new bootstrap.Modal($("modalMensagem")) : null;

    let timeoutToast;
    function avisar(mensagem) {
      const toastEl = $("toastAdm");
      toastEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + escapar(mensagem);
      toastEl.classList.add("visivel");
      clearTimeout(timeoutToast);
      timeoutToast = setTimeout(() => toastEl.classList.remove("visivel"), 3200);
    }
    function mostrarErro(el, mensagem) {
      el.textContent = mensagem;
      el.hidden = false;
    }
    function esconderErro(el) {
      el.textContent = "";
      el.hidden = true;
    }
    function formatarDataCurta(iso) {
      if (!iso) return "—";
      return new Date(iso).toLocaleDateString("pt-BR");
    }

    function atualizarIndicadores() {
      const filmes = Store.filmes.listar();
      const usuarios = Store.usuarios.listar();
      const mensagens = Store.mensagens.listar();
      $("totalFilmes").textContent = filmes.length;
      $("totalCartaz").textContent = filmes.filter((f) => f.emCartaz).length;
      $("totalUsuarios").textContent = usuarios.length;
      $("totalAdmins").textContent = usuarios.filter((u) => u.perfil === "admin").length;
      $("totalMensagens").textContent = mensagens.length;
      const nl = mensagens.filter((m) => !m.lida).length;
      $("totalNaoLidas").textContent = nl;
      const pedidos = Store.pedidos.listar();
      $("totalPedidos").textContent = pedidos.length;
      $("totalAssinaturas").textContent = Store.assinaturas.listar().filter((a) => a.status === "ativa" && Date.parse(a.fimEm) > Date.now()).length;
      const badge = $("badgeMensagens");
      badge.textContent = nl;
      badge.classList.toggle("zero", nl === 0);
    }

    /* ----- abas ----- */
    document.querySelectorAll(".adm-aba").forEach((aba) => {
      aba.addEventListener("click", () => {
        document.querySelectorAll(".adm-aba").forEach((outra) =>
          outra.classList.toggle("ativa", outra === aba));
        document.querySelectorAll(".adm-painel").forEach((painel) => {
          painel.hidden = painel.dataset.painel !== aba.dataset.aba;
        });
      });
    });

    /* ----- filmes ----- */
    function filmesFiltrados() {
      const busca = Store.normalizar($("buscaFilme").value);
      const genero = $("filtroGenero").value;
      const cartaz = $("filtroCartaz").value;
      return Store.filmes.listar()
        .filter((f) => {
          const okBusca = !busca ||
            Store.normalizar(f.titulo).includes(busca) ||
            Store.normalizar(f.genero).includes(busca);
          const okGenero = !genero || f.genero === genero;
          const okCartaz = !cartaz ||
            (cartaz === "sim" && f.emCartaz) || (cartaz === "nao" && !f.emCartaz);
          return okBusca && okGenero && okCartaz;
        })
        .sort((a, b) => String(a.titulo).localeCompare(String(b.titulo), "pt-BR"));
    }

    function renderizarFilmes() {
      const lista = filmesFiltrados();
      $("tabelaFilmes").innerHTML = lista.map((f) =>
        "<tr><td>" + (f.poster
          ? '<img class="adm-poster" src="' + escapar(App.assetUrl(f.poster)) + '" alt="Pôster de ' + escapar(f.titulo) + '">'
          : '<div class="adm-poster"></div>') + "</td>" +
        "<td><strong>" + escapar(f.titulo) + "</strong></td>" +
        "<td>" + escapar(f.genero) + "</td><td>" + escapar(f.ano) + "</td><td>" + escapar(f.classificacao) + "</td>" +
        '<td><span class="etiqueta ' + (f.emCartaz ? "etiqueta-cartaz" : "etiqueta-fora") + '">' +
        (f.emCartaz ? "EM CARTAZ" : "FORA") + "</span></td>" +
        '<td class="coluna-acoes"><div class="adm-acoes">' +
        '<button type="button" class="adm-btn-icone" data-editar-filme="' + f.id + '" title="Editar"><i class="fa-solid fa-pen"></i></button>' +
        '<button type="button" class="adm-btn-icone excluir" data-excluir-filme="' + f.id + '" title="Excluir"><i class="fa-solid fa-trash"></i></button>' +
        "</div></td></tr>"
      ).join("");
      $("filmesVazio").hidden = lista.length > 0;
      atualizarIndicadores();
    }

    function preencherGeneros() {
      const generos = Store.filmes.generos();
      $("filtroGenero").innerHTML = '<option value="">Todos os gêneros</option>' +
        generos.map((g) => '<option value="' + escapar(g) + '">' + escapar(g) + "</option>").join("");
      $("listaGeneros").innerHTML = generos.map((g) => '<option value="' + escapar(g) + '">').join("");
    }

    function abrirModalFilme(id) {
      esconderErro($("erroFilme"));
      preencherGeneros();
      const filme = id ? Store.filmes.buscarPorId(id) : null;
      $("tituloModalFilme").textContent = filme ? "Editar filme" : "Novo filme";
      $("filmeId").value = filme ? filme.id : "";
      $("filmeTitulo").value = filme ? filme.titulo : "";
      $("filmeGenero").value = filme ? filme.genero : "";
      $("filmeAno").value = filme ? filme.ano : new Date().getFullYear();
      $("filmeClassificacao").value = filme ? filme.classificacao : "L";
      $("filmePoster").value = filme ? filme.poster : "";
      $("filmeSinopse").value = filme ? filme.sinopse : "";
      $("filmeFonteVideo").value = filme ? filme.fonteVideo || "" : "";
      $("filmeEmCartaz").checked = filme ? filme.emCartaz : true;
      modalFilme?.show();
    }

    function salvarFilme() {
      const id = $("filmeId").value;
      const dados = {
        titulo: $("filmeTitulo").value, genero: $("filmeGenero").value,
        ano: $("filmeAno").value, classificacao: $("filmeClassificacao").value,
        poster: $("filmePoster").value, sinopse: $("filmeSinopse").value,
        fonteVideo: $("filmeFonteVideo").value, emCartaz: $("filmeEmCartaz").checked
      };
      const resultado = id ? Store.filmes.atualizar(id, dados) : Store.filmes.criar(dados);
      if (!resultado.ok) {
        mostrarErro($("erroFilme"), resultado.erro);
        return;
      }
      modalFilme?.hide();
      preencherGeneros();
      renderizarFilmes();
      avisar(id ? "Filme atualizado com sucesso." : "Filme cadastrado com sucesso.");
    }

    /* ----- usuários ----- */
    function usuariosFiltrados() {
      const busca = Store.normalizar($("buscaUsuario").value);
      const perfil = $("filtroPerfil").value;
      return Store.usuarios.listar()
        .filter((u) => {
          const okBusca = !busca ||
            Store.normalizar(u.nome).includes(busca) ||
            Store.normalizar(u.email).includes(busca);
          return okBusca && (!perfil || u.perfil === perfil);
        })
        .sort((a, b) => String(a.nome).localeCompare(String(b.nome), "pt-BR"));
    }

    function renderizarUsuarios() {
      const lista = usuariosFiltrados();
      $("tabelaUsuarios").innerHTML = lista.map((u) => {
        const ehVoce = u.id === logado.id;
        return "<tr><td><strong>" + escapar(u.nome) + "</strong>" +
          (ehVoce ? ' <span class="form-ajuda">(você)</span>' : "") + "</td>" +
          "<td>" + escapar(u.email) + "</td>" +
          '<td><span class="etiqueta ' + (u.perfil === "admin" ? "etiqueta-admin" : "etiqueta-cliente") + '">' +
          (u.perfil === "admin" ? "ADMIN" : "CLIENTE") + "</span></td>" +
          "<td>" + formatarDataCurta(u.criadoEm) + "</td>" +
          '<td class="coluna-acoes"><div class="adm-acoes">' +
          '<button type="button" class="adm-btn-icone" data-editar-usuario="' + u.id + '" title="Editar"><i class="fa-solid fa-pen"></i></button>' +
          '<button type="button" class="adm-btn-icone excluir" data-excluir-usuario="' + u.id + '" title="Excluir"><i class="fa-solid fa-trash"></i></button>' +
          "</div></td></tr>";
      }).join("");
      $("usuariosVazio").hidden = lista.length > 0;
      atualizarIndicadores();
    }

    function abrirModalUsuario(id) {
      esconderErro($("erroUsuario"));
      const usuario = id ? Store.usuarios.buscarPorId(id) : null;
      $("tituloModalUsuario").textContent = usuario ? "Editar usuário" : "Novo usuário";
      $("usuarioId").value = usuario ? usuario.id : "";
      $("usuarioNome").value = usuario ? usuario.nome : "";
      $("usuarioEmail").value = usuario ? usuario.email : "";
      $("usuarioPerfil").value = usuario ? usuario.perfil : "cliente";
      $("usuarioSenha").value = "";
      $("ajudaHierarquiaAdmin").textContent =
        "Você só pode rebaixar administradores cadastrados por você, desde que outro administrador permaneça.";
      $("ajudaSenha").textContent = usuario
        ? "Deixe em branco para manter a senha atual."
        : "Obrigatória, mínimo 8 caracteres.";
      modalUsuario?.show();
    }

    function salvarUsuario() {
      const id = $("usuarioId").value;
      const dados = {
        nome: $("usuarioNome").value, email: $("usuarioEmail").value,
        perfil: $("usuarioPerfil").value, senha: $("usuarioSenha").value
      };
      let resultado;
      if (id) {
        if (!dados.senha) delete dados.senha;
        resultado = Store.usuarios.atualizar(id, dados, { atorId: logado.id });
      } else {
        if (dados.perfil === "admin") dados.criadoPor = logado.id;
        resultado = Store.usuarios.criar(dados);
      }
      if (!resultado.ok) {
        mostrarErro($("erroUsuario"), resultado.erro);
        return;
      }
      modalUsuario?.hide();
      if (id === logado.id && resultado.dado.perfil !== "admin") {
        App.nav("#/");
        return;
      }
      renderizarUsuarios();
      if (id === logado.id) $("admNome").textContent = resultado.dado.nome;
      avisar(id ? "Usuário atualizado com sucesso." : "Usuário cadastrado com sucesso.");
    }

    /* ----- MENSAGENS (novo: caixa de entrada do contato) ----- */
    function mensagensFiltradas() {
      const busca = Store.normalizar($("buscaMensagem").value);
      const status = $("filtroStatusMsg").value;
      return Store.mensagens.listar().filter((m) => {
        const okBusca = !busca ||
          Store.normalizar(m.nome).includes(busca) ||
          Store.normalizar(m.email).includes(busca) ||
          Store.normalizar(m.assunto).includes(busca);
        let okStatus = true;
        if (status === "nova") okStatus = !m.lida;
        else if (status === "lida") okStatus = m.lida;
        else if (status === "respondida") okStatus = m.respondida;
        else if (status === "aguardando") okStatus = !m.respondida;
        return okBusca && okStatus;
      });
    }

    function etiquetaStatus(m) {
      if (m.respondida) return '<span class="msg-status msg-status-respondida">Respondida</span>';
      if (m.lida) return '<span class="msg-status msg-status-lida">Lida</span>';
      return '<span class="msg-status msg-status-nova">Nova</span>';
    }

    function renderizarMensagens() {
      const lista = mensagensFiltradas();
      $("tabelaMensagens").innerHTML = lista.map((m) =>
        '<tr class="' + (!m.lida ? "msg-nao-lida" : "") + '">' +
        "<td>" + App.formatarData(m.criadaEm) + "</td>" +
        '<td class="msg-assunto-cell"><strong>' + escapar(m.nome) + "</strong><small>" + escapar(m.email) + "</small></td>" +
        "<td><strong>" + escapar(m.assunto) + "</strong></td>" +
        '<td><div class="msg-preview">' + escapar(m.mensagem) + "</div></td>" +
        "<td>" + etiquetaStatus(m) + "</td>" +
        '<td class="coluna-acoes"><div class="adm-acoes">' +
        '<button type="button" class="adm-btn-icone" data-ver-mensagem="' + m.id + '" title="Ler e responder"><i class="fa-solid fa-envelope-open-text"></i></button>' +
        '<button type="button" class="adm-btn-icone" data-lida-mensagem="' + m.id + '" title="' + (m.lida ? "Marcar como não lida" : "Marcar como lida") + '">' +
        '<i class="fa-solid ' + (m.lida ? "fa-envelope" : "fa-envelope-open") + '"></i></button>' +
        '<button type="button" class="adm-btn-icone excluir" data-excluir-mensagem="' + m.id + '" title="Excluir"><i class="fa-solid fa-trash"></i></button>' +
        "</div></td></tr>"
      ).join("");
      $("mensagensVazio").hidden = lista.length > 0;
      atualizarIndicadores();
    }

    function abrirModalMensagem(id) {
      esconderErro($("erroMensagem"));
      const m = Store.mensagens.buscarPorId(id);
      if (!m) return;
      $("mensagemId").value = m.id;
      $("tituloModalMensagem").textContent = "Mensagem de " + m.nome;
      $("msgData").textContent = App.formatarData(m.criadaEm);
      $("msgRemetente").textContent = m.nome + " <" + m.email + ">";
      $("msgAssunto").innerHTML = "<strong>" + escapar(m.assunto) + "</strong> " + etiquetaStatus(m);
      $("msgTexto").textContent = m.mensagem;
      $("msgResposta").value = m.resposta || "";
      $("btnAlternarLida").querySelector("span").textContent = m.lida ? "Marcar como não lida" : "Marcar como lida";
      // Abrir a mensagem conta como leitura.
      if (!m.lida) {
        Store.mensagens.marcarLida(m.id, true);
        renderizarMensagens();
      }
      modalMensagem?.show();
    }

    /* ----- exclusão (um modal para filmes, usuários e mensagens) ----- */
    let exclusaoPendente = null;
    function pedirConfirmacao(tipo, id) {
      esconderErro($("erroExcluir"));
      exclusaoPendente = { tipo, id };
      if (tipo === "filme") {
        const f = Store.filmes.buscarPorId(id);
        $("textoExcluir").innerHTML = "Excluir o filme <strong>" + escapar(f.titulo) + "</strong>?";
      } else if (tipo === "usuario") {
        const u = Store.usuarios.buscarPorId(id);
        $("textoExcluir").innerHTML = "Excluir a conta de <strong>" + escapar(u.nome) + "</strong>?";
      } else {
        const m = Store.mensagens.buscarPorId(id);
        $("textoExcluir").innerHTML = "Excluir a mensagem de <strong>" + escapar(m.nome) + "</strong> sobre “" + escapar(m.assunto) + "”?";
      }
      modalExcluir?.show();
    }

    function confirmarExclusao() {
      if (!exclusaoPendente) return;
      const { tipo, id } = exclusaoPendente;
      const ehVoce = tipo === "usuario" && id === logado.id;
      const resultado = tipo === "filme"
        ? Store.filmes.excluir(id)
        : tipo === "usuario"
          ? Store.usuarios.excluir(id)
          : Store.mensagens.excluir(id);
      if (!resultado.ok) {
        mostrarErro($("erroExcluir"), resultado.erro);
        return;
      }
      modalExcluir?.hide();
      exclusaoPendente = null;
      if (ehVoce) {
        App.nav("#/");
        return;
      }
      if (tipo === "filme") {
        preencherGeneros();
        renderizarFilmes();
        avisar("Filme excluído.");
      } else if (tipo === "usuario") {
        renderizarUsuarios();
        avisar("Usuário excluído.");
      } else {
        renderizarMensagens();
        avisar("Mensagem excluída.");
      }
    }

    /* ----- eventos ----- */
    $("buscaFilme").addEventListener("input", renderizarFilmes);
    $("filtroGenero").addEventListener("change", renderizarFilmes);
    $("filtroCartaz").addEventListener("change", renderizarFilmes);
    $("btnNovoFilme").addEventListener("click", () => abrirModalFilme(null));
    $("btnSalvarFilme").addEventListener("click", salvarFilme);
    $("tabelaFilmes").addEventListener("click", (e) => {
      const editar = e.target.closest("[data-editar-filme]");
      if (editar) return abrirModalFilme(editar.dataset.editarFilme);
      const excluir = e.target.closest("[data-excluir-filme]");
      if (excluir) return pedirConfirmacao("filme", excluir.dataset.excluirFilme);
    });

    $("buscaUsuario").addEventListener("input", renderizarUsuarios);
    $("filtroPerfil").addEventListener("change", renderizarUsuarios);
    $("btnNovoUsuario").addEventListener("click", () => abrirModalUsuario(null));
    $("btnSalvarUsuario").addEventListener("click", salvarUsuario);
    $("tabelaUsuarios").addEventListener("click", (e) => {
      const editar = e.target.closest("[data-editar-usuario]");
      if (editar) return abrirModalUsuario(editar.dataset.editarUsuario);
      const excluir = e.target.closest("[data-excluir-usuario]");
      if (excluir) return pedirConfirmacao("usuario", excluir.dataset.excluirUsuario);
    });

    $("buscaMensagem").addEventListener("input", renderizarMensagens);
    $("filtroStatusMsg").addEventListener("change", renderizarMensagens);
    $("tabelaMensagens").addEventListener("click", (e) => {
      const ver = e.target.closest("[data-ver-mensagem]");
      if (ver) return abrirModalMensagem(ver.dataset.verMensagem);
      const lida = e.target.closest("[data-lida-mensagem]");
      if (lida) {
        const m = Store.mensagens.buscarPorId(lida.dataset.lidaMensagem);
        if (m) Store.mensagens.marcarLida(m.id, !m.lida);
        return renderizarMensagens();
      }
      const excluir = e.target.closest("[data-excluir-mensagem]");
      if (excluir) return pedirConfirmacao("mensagem", excluir.dataset.excluirMensagem);
    });

    $("btnAlternarLida").addEventListener("click", () => {
      const id = $("mensagemId").value;
      const m = Store.mensagens.buscarPorId(id);
      if (!m) return;
      Store.mensagens.marcarLida(id, !m.lida);
      modalMensagem?.hide();
      renderizarMensagens();
      avisar(m.lida ? "Mensagem marcada como não lida." : "Mensagem marcada como lida.");
    });

    $("btnResponderMsg").addEventListener("click", () => {
      const id = $("mensagemId").value;
      const resultado = Store.mensagens.responder(id, $("msgResposta").value);
      if (!resultado.ok) {
        mostrarErro($("erroMensagem"), resultado.erro);
        return;
      }
      modalMensagem?.hide();
      renderizarMensagens();
      avisar("Resposta salva. O visitante vê na página de contato e no perfil.");
    });

    /* ----- pedidos da loja ----- */
    const ROTULOS_STATUS_PEDIDO = {
      confirmado: "Confirmado",
      pronto: "Pronto p/ retirada",
      entregue: "Entregue",
      cancelado: "Cancelado"
    };

    function pedidosFiltrados() {
      const busca = Store.normalizar($("buscaPedido").value);
      const status = $("filtroStatusPedido").value;
      return Store.pedidos.listar().filter((p) => {
        const okBusca = !busca ||
          Store.normalizar(p.codigo).includes(busca) ||
          Store.normalizar(p.clienteNome).includes(busca) ||
          Store.normalizar(p.email).includes(busca);
        return okBusca && (!status || p.status === status);
      });
    }

    function renderizarPedidos() {
      const lista = pedidosFiltrados();
      $("tabelaPedidos").innerHTML = lista.map((p) => {
        const itens = p.itens.map((item) =>
          item.quantidade + "× " + item.nome + (item.tamanho ? " (" + item.tamanho + ")" : "")).join("; ");
        const pagamento = p.pagamento.metodo === "balcao" ? "Na retirada"
          : p.pagamento.metodo === "pix" ? "Pix"
          : "Cartão •• " + p.pagamento.ultimos4;
        return "<tr><td><strong>" + escapar(p.codigo) + "</strong></td>" +
          "<td>" + App.formatarData(p.criadaEm) + "</td>" +
          "<td>" + escapar(p.clienteNome) + "<br><small>" + escapar(p.email) + "</small></td>" +
          '<td><small title="' + escapar(itens) + '">' + escapar(itens.length > 80 ? itens.slice(0, 80) + "…" : itens) + "</small></td>" +
          "<td><strong>" + App.fmtBRL(p.totalCentavos) + "</strong><br><small>" + pagamento + "</small>" +
          (p.descontoPercentual ? "<br><small>−" + p.descontoPercentual + "% " + escapar(p.planoTitulo || "plano") + "</small>" : "") + "</td>" +
          '<td><span class="etiqueta etiqueta-pedido-' + p.status + '">' + ROTULOS_STATUS_PEDIDO[p.status] + "</span></td>" +
          '<td class="coluna-acoes"><select class="adm-select adm-select-status" data-status-pedido="' + p.id + '" aria-label="Alterar status do pedido ' + escapar(p.codigo) + '">' +
          Object.entries(ROTULOS_STATUS_PEDIDO).map(([valor, rotulo]) =>
            '<option value="' + valor + '"' + (p.status === valor ? " selected" : "") + ">" + rotulo + "</option>").join("") +
          "</select></td></tr>";
      }).join("");
      $("pedidosVazio").hidden = lista.length > 0;
      atualizarIndicadores();
    }

    $("buscaPedido").addEventListener("input", renderizarPedidos);
    $("filtroStatusPedido").addEventListener("change", renderizarPedidos);
    $("tabelaPedidos").addEventListener("change", (e) => {
      const seletor = e.target.closest("[data-status-pedido]");
      if (!seletor) return;
      const resultado = Store.pedidos.atualizarStatus(seletor.dataset.statusPedido, seletor.value, { atorAdmin: true });
      if (!resultado.ok) {
        mostrarErro($("erroExcluir"), resultado.erro);
        renderizarPedidos();
        return;
      }
      renderizarPedidos();
      avisar("Pedido " + resultado.dado.codigo + " marcado como " + ROTULOS_STATUS_PEDIDO[resultado.dado.status] + ".");
    });

    $("btnConfirmarExclusao").addEventListener("click", confirmarExclusao);

    $("btnSair").addEventListener("click", () => {
      Store.sessao.encerrar();
      App.nav("#/");
    });
    $("btnRestaurar").addEventListener("click", () => {
      if (!window.confirm("Isso apaga filmes, usuários, mensagens, pedidos e assinaturas e volta tudo ao estado inicial. Continuar?")) return;
      Store.restaurarPadrao();
      window.location.hash = "#/login";
      window.location.reload();
    });

    preencherGeneros();
    renderizarFilmes();
    renderizarUsuarios();
    renderizarPedidos();
    renderizarMensagens();
  }

  /* =========================================================
     MEUS INGRESSOS — reservas futuras com QR + histórico
     ========================================================= */

  function formatarSessao(reserva) {
    const dataFmt = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" })
      .format(new Date(reserva.data + "T12:00:00"));
    return dataFmt + " às " + reserva.horario;
  }

  function cartãoIngresso(reserva, { passada = false } = {}) {
    const cancelada = Boolean(reserva.canceladaEm);
    const classe = "ingresso-card" + (cancelada ? " ingresso-cancelado" : "") + (passada ? " ingresso-passado" : "");
    return '<article class="' + classe + '">' +
      '<div class="ingresso-qr" id="qr-' + reserva.id + '" aria-label="QR Code da reserva ' + App.esc(reserva.codigo) + '"></div>' +
      '<div class="ingresso-info">' +
      "<h3>" + App.esc(reserva.filmeTitulo) + "</h3>" +
      "<p><i class=\"fa-solid fa-location-dot\"></i> " + App.esc(reserva.cinema) + " · Sala " + App.esc(reserva.sala) + "</p>" +
      "<p><i class=\"fa-solid fa-calendar-day\"></i> " + App.esc(formatarSessao(reserva)) + "</p>" +
      "<p><i class=\"fa-solid fa-couch\"></i> Assentos " + App.esc(reserva.lugares.join(", ")) + " · " +
      (reserva.tipoIngresso === "meia" ? "Meia-entrada" : "Inteira") + "</p>" +
      "<p><i class=\"fa-solid fa-barcode\"></i> Código <strong>" + App.esc(reserva.codigo) + "</strong></p>" +
      "<p><strong>Total: " + App.fmtBRL(reserva.valorTotalCentavos) + "</strong>" +
      (reserva.descontoPercentual ? " <small>(desconto " + reserva.descontoPercentual + "% " + App.esc(reserva.planoTitulo || "do plano") + ")</small>" : "") + "</p>" +
      (cancelada ? '<p><span class="msg-status">Cancelada</span></p>'
        : passada ? '<p><span class="msg-status msg-status-lida">Sessão encerrada</span></p>'
        : '<p><button type="button" class="adm-btn adm-btn-perigo" data-cancelar-reserva="' + reserva.id + '">Cancelar reserva</button></p>') +
      "</div></article>";
  }

  function renderIngressos() {
    const sessao = Store.sessao.atual();
    const usuario = sessao && Store.usuarios.buscarPorId(sessao.id);
    if (!usuario) {
      Store.sessao.encerrar();
      App.nav("#/login");
      return;
    }

    App.$("app").innerHTML =
      '<header class="adm-topbar"><a class="adm-marca" href="#/">' +
      '<i class="fa-solid fa-film"></i><span>Cinemark<small>MEUS INGRESSOS</small></span></a>' +
      '<div class="adm-topbar-acoes">' +
      '<a class="adm-btn" href="#/perfil"><i class="fa-solid fa-id-card"></i> Meu perfil</a>' +
      '<a class="adm-btn" href="#/"><i class="fa-solid fa-arrow-left"></i> Voltar ao site</a>' +
      "</div></header>" +
      '<main class="adm-conteudo ingressos-conteudo">' +
      "<h1 class=\"adm-titulo-pagina\">Meus ingressos</h1>" +
      "<p class=\"adm-subtitulo\">Apresente o código ou o QR Code na bilheteria para retirar seus ingressos.</p>" +
      '<div class="adm-filtros"><div class="adm-campo-busca"><i class="fa-solid fa-magnifying-glass"></i>' +
      '<input type="search" class="adm-input" id="buscaReserva" placeholder="Buscar por código ou filme..."></div></div>' +
      "<h2>Próximas sessões</h2>" +
      '<div id="listaIngressosAtivos" class="ingressos-lista"></div>' +
      "<h2>Histórico</h2>" +
      '<div id="listaIngressosHistorico" class="ingressos-lista"></div>' +
      "</main>" +
      '<div class="toast-adm" id="toastAdm" role="status" aria-live="polite"></div>';

    let timeoutToast;
    function avisar(mensagem) {
      const toastEl = App.$("toastAdm");
      toastEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + App.esc(mensagem);
      toastEl.classList.add("visivel");
      clearTimeout(timeoutToast);
      timeoutToast = setTimeout(() => toastEl.classList.remove("visivel"), 3200);
    }

    function renderizarListas() {
      const busca = Store.normalizar(App.$("buscaReserva").value);
      const todas = Store.reservas.listarPorUsuario(usuario.id, usuario.email)
        .filter((r) => !busca || Store.normalizar(r.codigo).includes(busca) || Store.normalizar(r.filmeTitulo).includes(busca));
      const ativas = todas.filter((r) => !r.canceladaEm && Store.reservas.horarioFim(r) > Date.now());
      const historico = todas.filter((r) => r.canceladaEm || Store.reservas.horarioFim(r) <= Date.now());

      App.$("listaIngressosAtivos").innerHTML = ativas.length
        ? ativas.map((r) => cartãoIngresso(r)).join("")
        : '<p class="form-ajuda">Nenhuma reserva futura. <a href="#/filmes">Ver filmes em cartaz</a></p>';
      App.$("listaIngressosHistorico").innerHTML = historico.length
        ? historico.map((r) => cartãoIngresso(r, { passada: !r.canceladaEm })).join("")
        : '<p class="form-ajuda">Nenhum ingresso no histórico.</p>';

      [...ativas, ...historico].forEach((r) => App.qr(App.$("qr-" + CSS.escape(r.id)), r.codigo, 120));
    }

    App.$("buscaReserva").addEventListener("input", renderizarListas);
    App.$("app").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cancelar-reserva]");
      if (!btn || !App.$("listaIngressosAtivos").contains(btn)) return;
      if (!btn.dataset.confirmado) {
        btn.dataset.confirmado = "1";
        btn.textContent = "Confirmar cancelamento?";
        return;
      }
      const resultado = Store.reservas.cancelar(btn.dataset.cancelarReserva, { usuarioId: usuario.id });
      if (!resultado.ok) {
        avisar(resultado.erro);
        return;
      }
      renderizarListas();
      avisar("Reserva cancelada. Os assentos foram liberados.");
    });

    renderizarListas();
  }

  /* =========================================================
     ASSINAR PLANO — checkout do plano com pagamento simulado
     ========================================================= */

  function renderAssinar(query) {
    const sessao = Store.sessao.atual();
    const usuario = sessao && Store.usuarios.buscarPorId(sessao.id);
    if (!usuario) {
      Store.sessao.encerrar();
      App.nav("#/login");
      return;
    }

    const planoId = query.get("plano");
    const plano = Store.assinaturas.buscarPlano(planoId);
    if (!plano) {
      App.$("app").innerHTML =
        '<main class="contato-wrap"><section class="contato-card"><h2>Plano não encontrado</h2>' +
        "<p>Escolha um dos planos disponíveis.</p>" +
        '<p><button type="button" class="submit-btn" data-bs-toggle="modal" data-bs-target="#modalPlanos">Ver planos</button></p>' +
        '<p><a href="#/">&larr; Voltar para o início</a></p></section></main>';
      return;
    }

    const ativa = Store.assinaturas.ativaPara(usuario.id);

    App.$("app").innerHTML =
      '<header class="contato-hero"><h1>Assinar ' + App.esc(plano.nome) + '</h1><p>' + App.fmtMoeda(plano.preco) + ' por mês · renovação mensal · cancele quando quiser.</p></header>' +
      '<main class="compra-layout assinar-layout">' +
      '<section class="compra-produto" aria-labelledby="tituloResumoPlano">' +
      "<h2 id=\"tituloResumoPlano\">Resumo do plano</h2>" +
      '<ul class="plano-resumo-lista">' +
      plano.beneficios.map((b) => '<li><i class="fa-solid fa-check"></i> ' + App.esc(b) + "</li>").join("") +
      "</ul>" +
      '<p class="produto-preco">' + App.fmtMoeda(plano.preco) + '<span class="preco-periodo">/mês</span></p>' +
      (ativa
        ? '<p class="form-ajuda">Você já tem o plano <strong>' + App.esc(ativa.planoNome) + "</strong> ativo até " +
          new Date(ativa.fimEm).toLocaleDateString("pt-BR") + ". Ao confirmar, ele será substituído pelo plano " + App.esc(plano.nome) + ".</p>"
        : "") +
      "</section>" +
      '<aside class="compra-carrinho" aria-labelledby="tituloPagamentoPlano">' +
      "<h2 id=\"tituloPagamentoPlano\">Pagamento</h2>" +
      '<div class="pag-opcoes" role="radiogroup" aria-label="Forma de pagamento">' +
      '<label class="pag-opcao"><input type="radio" name="pagPlano" value="pix" checked> <i class="fa-solid fa-qrcode"></i> Pix</label>' +
      '<label class="pag-opcao"><input type="radio" name="pagPlano" value="cartao"> <i class="fa-solid fa-credit-card"></i> Cartão de crédito</label>' +
      "</div>" +
      '<div id="cartaoPlanoCampos" hidden>' +
      '<div class="form-linha"><label for="planoCartaoNumero">Número do cartão</label><input type="text" class="adm-input" id="planoCartaoNumero" inputmode="numeric" placeholder="0000 0000 0000 0000" maxlength="19"></div>' +
      '<div class="form-duplo"><div class="form-linha"><label for="planoCartaoValidade">Validade</label><input type="text" class="adm-input" id="planoCartaoValidade" placeholder="MM/AA" maxlength="5"></div>' +
      '<div class="form-linha"><label for="planoCartaoCvv">CVV</label><input type="password" class="adm-input" id="planoCartaoCvv" inputmode="numeric" placeholder="123" maxlength="4"></div></div>' +
      '<div class="form-linha"><label for="planoCartaoTitular">Nome impresso no cartão</label><input type="text" class="adm-input" id="planoCartaoTitular" autocomplete="cc-name"></div>' +
      "</div>" +
      '<p class="pag-aviso"><i class="fa-solid fa-lock"></i> Ambiente de demonstração acadêmica: os dados do cartão são validados no navegador e nunca saem daqui.</p>' +
      '<p class="mensagem-erro" id="erroAssinar" hidden></p>' +
      '<button class="acao-finalizar" id="confirmarAssinatura" type="button"><i class="fa-solid fa-check"></i> Confirmar assinatura</button>' +
      "</aside></main>" +
      '<footer class="site-footer">© 2026 Cinemark. Todos os direitos reservados.</footer>' +
      '<div class="toast-adm" id="toastAdm" role="status" aria-live="polite"></div>';

    const metodoPix = () => document.querySelector('input[name="pagPlano"]:checked')?.value === "pix";
    document.querySelectorAll('input[name="pagPlano"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        App.$("cartaoPlanoCampos").hidden = metodoPix();
      });
    });

    App.$("confirmarAssinatura").addEventListener("click", () => {
      const metodo = document.querySelector('input[name="pagPlano"]:checked')?.value;
      const pagamento = { metodo };
      if (metodo === "cartao") {
        pagamento.numero = App.$("planoCartaoNumero").value;
        pagamento.validade = App.$("planoCartaoValidade").value;
        pagamento.cvv = App.$("planoCartaoCvv").value;
        pagamento.titular = App.$("planoCartaoTitular").value;
      }
      const resultado = Store.assinaturas.assinar({ usuarioId: usuario.id, planoId: plano.id, pagamento });
      if (!resultado.ok) {
        App.$("erroAssinar").textContent = resultado.erro;
        App.$("erroAssinar").hidden = false;
        return;
      }
      App.$("app").innerHTML =
        '<header class="contato-hero"><h1>Assinatura confirmada!</h1><p>Bem-vindo ao plano ' + App.esc(resultado.dado.planoNome) + '.</p></header>' +
        '<main class="contato-wrap"><section class="contato-card pedido-sucesso">' +
        '<i class="fa-solid fa-circle-check pedido-sucesso-icone" aria-hidden="true"></i>' +
        "<h2>Plano " + App.esc(resultado.dado.planoNome) + " ativo</h2>" +
        "<p>Válido até <strong>" + new Date(resultado.dado.fimEm).toLocaleDateString("pt-BR") + "</strong>.</p>" +
        "<p>Pagamento: " + (resultado.dado.pagamento.metodo === "pix" ? "Pix" : "Cartão •• " + resultado.dado.pagamento.ultimos4) + " · " + App.fmtMoeda(resultado.dado.precoCentavos / 100) + "/mês.</p>" +
        "<p>Seus descontos já valem para as próximas reservas e pedidos.</p>" +
        '<p class="comprovante-acoes"><a class="filme-botao-principal" href="#/filmes">Ver filmes em cartaz</a> <a class="filme-botao-secundario" href="#/perfil">Ir para meu perfil</a></p>' +
        "</section></main>" +
        '<footer class="site-footer">© 2026 Cinemark. Todos os direitos reservados.<nav class="rodape-links" aria-label="Links do rodapé"><a href="#/ajuda">Ajuda</a><a href="#/contato">Contato</a><a href="#/ingressos">Meus ingressos</a></nav></footer>';
      window.scrollTo(0, 0);
    });
  }

  /* =========================================================
     AJUDA — FAQ, termos e privacidade
     ========================================================= */

  function renderAjuda() {
    App.$("app").innerHTML =
      '<header class="contato-hero"><h1>Ajuda</h1><p>Dúvidas frequentes, termos de uso e privacidade.</p></header>' +
      '<main class="contato-wrap">' +
      '<section class="contato-card contato-faq" aria-labelledby="tituloAjudaFaq"><h2 id="tituloAjudaFaq">Dúvidas frequentes</h2>' +
      '<details class="faq-item" open><summary>Quem tem direito à meia-entrada?</summary><p>Estudantes com CIE válida, idosos a partir de 60 anos, crianças de 3 a 12 anos, doadores de sangue e demais casos previstos na legislação. Apresente o documento na bilheteria junto com o código da reserva.</p></details>' +
      '<details class="faq-item"><summary>Como compro ingressos pelo site?</summary><p>Abra a página do filme, clique em "Ver sessões e comprar ingresso", escolha o dia e o horário, selecione os assentos e confirme a reserva com sua conta. O pagamento é feito na bilheteria, na retirada.</p></details>' +
      '<details class="faq-item"><summary>Como retiro meus ingressos?</summary><p>Apresente o código da reserva ou o QR Code da página Meus ingressos na bilheteria, com 30 minutos de antecedência.</p></details>' +
      '<details class="faq-item"><summary>Posso cancelar minha reserva?</summary><p>Sim. Reservas de sessões futuras podem ser canceladas gratuitamente na página Meus ingressos, e os assentos voltam a ficar disponíveis na hora.</p></details>' +
      '<details class="faq-item"><summary>Como funciona o pedido da loja?</summary><p>Monte seu carrinho na Loja, finalize informando quem vai retirar e escolha pagar na retirada, via Pix ou cartão. Acompanhe o status em Meu perfil e retire no balcão com o código do pedido.</p></details>' +
      '<details class="faq-item"><summary>Quais são os benefícios da assinatura?</summary><p>O plano Plus dá 10% de desconto nos ingressos e 5% na loja; o Ultra dá 20% e 10%. O Lite garante pré-venda e pontos no programa de fidelidade. Os descontos aparecem automaticamente na hora de reservar e de finalizar o pedido.</p></details>' +
      '<details class="faq-item"><summary>Esqueci minha senha. E agora?</summary><p>Na tela de login, clique em "Esqueceu sua senha?", informe seu e-mail e use o código de verificação para definir uma nova senha.</p></details>' +
      '<details class="faq-item"><summary>O que é a classificação indicativa?</summary><p>Cada filme exibe a classificação na página de detalhes. Menores de idade precisam estar acompanhados conforme a indicação e a legislação vigente.</p></details>' +
      "</section>" +
      '<section class="contato-card" aria-labelledby="tituloTermos"><h2 id="tituloTermos">Termos de uso</h2>' +
      "<p>1. A conta é pessoal e intransferível. Mantenha sua senha em sigilo.</p>" +
      "<p>2. A reserva garante os assentos escolhidos até o início da sessão. Chegue com 30 minutos de antecedência para retirar os ingressos na bilheteria.</p>" +
      "<p>3. Cancelamentos de reservas futuras são gratuitos e liberam os assentos imediatamente.</p>" +
      "<p>4. Pedidos da loja são retirados no balcão do cinema mediante apresentação do código do pedido.</p>" +
      "<p>5. Assinaturas têm renovação mensal e podem ser canceladas a qualquer momento pelo perfil; os descontos valem enquanto a assinatura estiver ativa.</p>" +
      "</section>" +
      '<section class="contato-card" aria-labelledby="tituloPrivacidade"><h2 id="tituloPrivacidade">Privacidade</h2>' +
      "<p>Usamos seus dados (nome, e-mail, reservas, pedidos e assinatura) apenas para operar sua conta, suas compras e seu atendimento. Não compartilhamos seus dados com terceiros para marketing.</p>" +
      "<p>Você pode editar seus dados no perfil a qualquer momento e excluir sua conta definitivamente na página Meu perfil — isso apaga todos os seus dados.</p>" +
      "<p>Dúvidas sobre privacidade? Fale com a equipe pela página de <a href=\"#/contato\">contato</a>.</p>" +
      "</section></main>" +
      '<footer class="site-footer">© 2026 Cinemark. Todos os direitos reservados.<nav class="rodape-links" aria-label="Links do rodapé"><a href="#/ajuda">Ajuda</a><a href="#/contato">Contato</a><a href="#/ingressos">Meus ingressos</a></nav></footer>';
  }

  Pages.contato = { render: renderContato };
  Pages.ingressos = { render: renderIngressos };
  Pages.assinar = { render: renderAssinar };
  Pages.ajuda = { render: renderAjuda };
  Pages.login = { render: renderLogin };
  Pages.perfil = { render: renderPerfil };
  Pages.admin = { render: renderAdmin };

  /* Inicia o roteador depois que todas as páginas foram registradas. */
  App.start();
})();
