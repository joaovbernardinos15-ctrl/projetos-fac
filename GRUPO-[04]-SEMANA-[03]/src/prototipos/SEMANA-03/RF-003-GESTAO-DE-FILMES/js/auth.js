const panels = document.querySelectorAll('.form-panel');
const toggleButtons = document.querySelectorAll('[data-show-panel]');
const passwordToggles = document.querySelectorAll('.toggle-password');

// --- Toasts (Cadastro, Login e Recuperação de Senha) ---
const cadastroToast = document.querySelector('#toastCadastro');
const loginToast = document.querySelector('#toastLogin');
const recuperacaoToast = document.querySelector('#toastRecuperacao');

const toastTimeouts = new WeakMap();

function mostrarToast(toastEl) {
  if (!toastEl) return;

  clearTimeout(toastTimeouts.get(toastEl));
  toastEl.classList.add('visivel');

  const timeoutId = setTimeout(() => {
    toastEl.classList.remove('visivel');
  }, 4500);

  toastTimeouts.set(toastEl, timeoutId);
}

function mostrarToastCadastro() {
  mostrarToast(cadastroToast);
}

function mostrarToastLogin() {
  mostrarToast(loginToast);
}

function mostrarToastRecuperacao() {
  mostrarToast(recuperacaoToast);
}

// Botão de fechar de cada toast
[cadastroToast, loginToast, recuperacaoToast].forEach((toastEl) => {
  const closeButton = toastEl?.querySelector('.fechar-toast');
  closeButton?.addEventListener('click', () => {
    toastEl.classList.remove('visivel');
    clearTimeout(toastTimeouts.get(toastEl));
  });
});

function showPanel(panelName) {
  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === panelName;
    panel.classList.toggle('active', isActive);
  });
}

toggleButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const nextPanel = button.dataset.showPanel;
    showPanel(nextPanel);
  });
});

passwordToggles.forEach((button) => {
  const icon = button.querySelector('i');

  button.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });

  if (icon) {
    icon.classList.add('fa-eye');
  }

  const updateToggleState = (isPasswordVisible) => {
    if (!icon) return;

    icon.classList.toggle('fa-eye', isPasswordVisible);        // olho aberto quando visível
    icon.classList.toggle('fa-eye-slash', !isPasswordVisible); // olho cortado quando oculta

    button.setAttribute('aria-label', isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha');
    button.title = isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha';
};

  button.addEventListener('click', () => {
    const targetId = button.dataset.target;
    const input = document.getElementById(targetId);

    if (!input) return;

    const isPasswordVisible = input.type === 'text';
    input.type = isPasswordVisible ? 'password' : 'text';
    updateToggleState(input.type === 'text');
  });

  updateToggleState(false);
});

showPanel('login');

// Regex simples e eficaz para validar e-mail
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarEmail(input) {
  const valor = input.value.trim();
  const valido = emailRegex.test(valor);

  input.classList.toggle('is-valid', valido && valor.length > 0);
  input.classList.toggle('is-invalid', !valido && valor.length > 0);

  return valido;
}

// Aplica a todos os campos de e-mail da página
document.querySelectorAll('input[type="email"]').forEach((input) => {
  // valida enquanto digita (depois que o usuário já saiu do campo uma vez)
  input.addEventListener('blur', () => validarEmail(input));
  input.addEventListener('input', () => {
    if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')) {
      validarEmail(input);
    }
  });
});

/* Mensagens de erro vindas do Store (e-mail duplicado, senha curta, etc.) */
function mostrarErro(painel, mensagem) {
  const caixa = painel.querySelector('.erro-auth');
  if (!caixa) return;

  caixa.textContent = mensagem;
  caixa.hidden = false;
}

function limparErro(painel) {
  const caixa = painel.querySelector('.erro-auth');
  if (!caixa) return;

  caixa.textContent = '';
  caixa.hidden = true;
}

function limparValidacaoVisual(form) {
  form.querySelectorAll('.is-valid, .is-invalid').forEach((input) => {
    input.classList.remove('is-valid', 'is-invalid');
  });
}

// Bloqueia o envio do formulário se o e-mail for inválido
document.querySelectorAll('.auth-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && !validarEmail(emailInput)) {
      event.preventDefault();
      emailInput.focus();
      return;
    }

    const passwordInput = form.querySelector('#registerPassword');
    const confirmationInput = form.querySelector('#registerPasswordConfirmation');

    if (passwordInput && confirmationInput && passwordInput.value !== confirmationInput.value) {
      event.preventDefault();
      confirmationInput.dataset.touched = 'true';
      confirmationInput.dataset.validationFocus = 'true';
      confirmationInput.classList.add('is-invalid');
      confirmationInput.focus();
      return;
    }

    // --- Cadastro: CREATE de usuário no Store ---
    const registerPanel = form.closest('[data-panel="register"]');
    if (registerPanel) {
      event.preventDefault();

      const resultado = Store.usuarios.criar({
        nome: document.getElementById('registerNome').value,
        email: document.getElementById('registerEmail').value,
        senha: passwordInput.value,
        perfil: 'cliente'
      });

      if (!resultado.ok) {
        mostrarErro(registerPanel, resultado.erro);
        return;
      }

      limparErro(registerPanel);
      form.reset();
      limparValidacaoVisual(form);
      delete confirmationInput?.dataset.touched;
      delete confirmationInput?.dataset.validationFocus;
      showPanel('login');
      mostrarToastCadastro();
      return;
    }

    // --- Login: autentica contra os usuários cadastrados ---
    const loginPanel = form.closest('[data-panel="login"]');
    if (loginPanel) {
      event.preventDefault();

      const resultado = Store.usuarios.autenticar(
        document.getElementById('loginEmail').value,
        document.getElementById('loginPassword').value
      );

      if (!resultado.ok) {
        mostrarErro(loginPanel, resultado.erro);
        return;
      }

      limparErro(loginPanel);
      limparValidacaoVisual(form);
      mostrarToastLogin();

      // Admin cai direto no painel; cliente volta para a home.
      const destino = resultado.dado.perfil === 'admin' ? 'admin.html' : 'index.html';
      setTimeout(() => { window.location.href = destino; }, 900);
      return;
    }

    // --- Esqueci Senha: sem back-end, apenas confirma se o e-mail existe ---
    const recoverPanel = form.closest('[data-panel="recover"]');
    if (recoverPanel) {
      event.preventDefault();

      const email = document.getElementById('recoverEmail').value;

      if (!Store.usuarios.buscarPorEmail(email)) {
        mostrarErro(recoverPanel, 'Não encontramos nenhuma conta com esse e-mail.');
        return;
      }

      limparErro(recoverPanel);
      form.reset();
      limparValidacaoVisual(form);
      mostrarToastRecuperacao();
      return;
    }
  });
});

const passwordInput = document.querySelector('#registerPassword');
const passwordConfirmation = document.querySelector('#registerPasswordConfirmation');

function validarConfirmacaoSenha() {
  if (!passwordInput || !passwordConfirmation) return;

  const hasPassword = passwordInput.value.length > 0;
  const hasValue = passwordConfirmation.value.length > 0;
  const matches = hasPassword && passwordConfirmation.value === passwordInput.value;
  const showMismatch = passwordConfirmation.dataset.touched === 'true';

  passwordConfirmation.classList.toggle('is-invalid', showMismatch && hasPassword && hasValue && !matches);
  passwordConfirmation.classList.toggle('is-valid', hasValue && hasPassword && matches && passwordInput.value.length >= 8);
}

if (passwordInput && passwordConfirmation) {
  const limparErroConfirmacao = () => {
    passwordConfirmation.dataset.touched = 'false';
    passwordConfirmation.classList.remove('is-invalid');
  };

  passwordInput.addEventListener('input', () => {
    limparErroConfirmacao();
    validarConfirmacaoSenha();
  });
  passwordConfirmation.addEventListener('input', () => {
    limparErroConfirmacao();
    validarConfirmacaoSenha();
  });
  passwordConfirmation.addEventListener('focus', () => {
    if (passwordConfirmation.dataset.validationFocus === 'true') {
      delete passwordConfirmation.dataset.validationFocus;
      return;
    }

    limparErroConfirmacao();
  });
  passwordConfirmation.addEventListener('mousedown', limparErroConfirmacao);
  passwordConfirmation.addEventListener('blur', (event) => {
    const focusTarget = event.relatedTarget;
    if (focusTarget && focusTarget.closest && focusTarget.closest('.toggle-password')) return;

    passwordConfirmation.dataset.touched = 'true';
    validarConfirmacaoSenha();
  });
}

document.querySelectorAll('input[type="email"]').forEach((input) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\s/g, ''); // remove espaços digitados
  });
});