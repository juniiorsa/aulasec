document.addEventListener('DOMContentLoaded', () => {

  // Inicializa a biblioteca de animações (AOS)
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
  });

  // --- ELEMENTOS DO DOM ---
  const ctaButton = document.getElementById('cta-button');
  const modalOverlay = document.getElementById('phone-modal');
  const closeModalButton = document.getElementById('close-modal');
  const phoneForm = document.getElementById('phone-form');
  const phoneInput = document.getElementById('phone-input');
  const errorMessageDiv = document.getElementById('error-message');

  // --- CONFIGURAÇÃO DA INTEGRAÇÃO ---
  const n8nWebhookUrl = 'URL_DO_SEU_WEBHOOK_N8N_AQUI';
  const communityRedirectURL = 'https://chat.whatsapp.com/SUA_COMUNIDADE_AQUI';

  // --- FUNÇÕES DO MODAL ---
  const openModal = () => modalOverlay.classList.add('active');
  const closeModal = () => {
    modalOverlay.classList.remove('active');
    hideError(); // Esconde o erro ao fechar o modal
  };

  // --- FUNÇÕES DO FORMULÁRIO ---
  const showError = (message) => {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
  };

  const hideError = () => {
    errorMessageDiv.style.display = 'none';
  };

  // Função para aplicar a máscara de telefone
  const applyPhoneMask = (event) => {
    let input = event.target;
    input.value = phoneMask(input.value);
  };

  const phoneMask = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };

  // Validação do número de telefone (10 ou 11 dígitos)
  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return /^\d{10,11}$/.test(digitsOnly);
  };

  // --- EVENT LISTENERS ---
  ctaButton.addEventListener('click', (event) => {
    event.preventDefault();
    openModal();
  });

  closeModalButton.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) closeModal();
  });

  phoneInput.addEventListener('input', applyPhoneMask);
  phoneInput.addEventListener('focus', hideError);

  phoneForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const phoneNumber = phoneInput.value;
    const submitButton = phoneForm.querySelector('.submit-button');

    if (!validatePhone(phoneNumber)) {
      showError('Por favor, digite um telefone válido com DDD.');
      return;
    }

    hideError();
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (!response.ok) {
        throw new Error(`Erro na comunicação: ${response.statusText}`);
      }

      submitButton.textContent = 'Redirecionando...';
      window.location.href = communityRedirectURL;

    } catch (error) {
      console.error('Erro ao enviar para o webhook:', error);
      showError('Ocorreu um erro. Tente novamente.');
      submitButton.textContent = 'Entrar para a Comunidade';
      submitButton.disabled = false;
    }
  });
});
