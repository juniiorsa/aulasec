// Aguarda o carregamento completo do DOM para executar o script
document.addEventListener('DOMContentLoaded', () => {

  // Inicializa a biblioteca de animações (AOS)
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
  });

  // --- LÓGICA DO MODAL ---

  const ctaButton = document.getElementById('cta-button');
  const modalOverlay = document.getElementById('phone-modal');
  const closeModalButton = document.getElementById('close-modal');
  const phoneForm = document.getElementById('phone-form');
  const phoneInput = document.getElementById('phone-input');

  // --- CONFIGURAÇÃO DA INTEGRAÇÃO ---

  // 1. URL do Webhook do seu fluxo no n8n
  // IMPORTANTE: Substitua pela URL real do seu Webhook
  const n8nWebhookUrl = 'URL_DO_SEU_WEBHOOK_N8N_AQUI';

  // 2. URL para onde o usuário será redirecionado APÓS o sucesso
  const communityRedirectURL = 'https://chat.whatsapp.com/SUA_COMUNIDADE_AQUI';

  // --- FUNÇÕES DO MODAL ---

  const openModal = () => modalOverlay.classList.add('active');
  const closeModal = () => modalOverlay.classList.remove('active');

  ctaButton.addEventListener('click', (event) => {
    event.preventDefault();
    openModal();
  });

  closeModalButton.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  // --- LÓGICA DE ENVIO PARA O N8N ---

  phoneForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    const phoneNumber = phoneInput.value;
    const submitButton = phoneForm.querySelector('.submit-button');

    // Validação simples
    if (phoneNumber.trim().length < 10) { // Verifica um mínimo de caracteres
      alert('Por favor, preencha um número de telefone válido com DDD.');
      return;
    }

    // Feedback visual para o usuário
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    try {
      // Envia os dados para o webhook do n8n usando a API Fetch
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envia o telefone dentro de um objeto JSON
        body: JSON.stringify({
          phone: phoneNumber
        }),
      });

      // Se a resposta do n8n não for bem-sucedida (ex: erro no fluxo), lança um erro
      if (!response.ok) {
        throw new Error(`Erro na comunicação com o servidor: ${response.statusText}`);
      }

      // Se tudo correu bem, o n8n já executou a automação.
      // Agora, podemos redirecionar o usuário.
      submitButton.textContent = 'Redirecionando...';
      window.location.href = communityRedirectURL;

    } catch (error) {
      console.error('Erro ao enviar para o webhook do n8n:', error);
      alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente em instantes.');
      
      // Reabilita o botão para que o usuário possa tentar novamente
      submitButton.textContent = 'Entrar para a Comunidade';
      submitButton.disabled = false;
    }
  });

});
