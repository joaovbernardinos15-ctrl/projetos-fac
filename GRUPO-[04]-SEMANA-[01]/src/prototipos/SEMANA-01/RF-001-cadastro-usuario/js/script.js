const panels = document.querySelectorAll('.form-panel');
const toggleButtons = document.querySelectorAll('[data-show-panel]');
const passwordToggles = document.querySelectorAll('.toggle-password');

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

// Bloqueia o envio do formulário se o e-mail for inválido
document.querySelectorAll('.auth-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && !validarEmail(emailInput)) {
      event.preventDefault();
      emailInput.focus();
    }
  });
});

document.querySelectorAll('input[type="email"]').forEach((input) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\s/g, ''); // remove espaços digitados
  });
});