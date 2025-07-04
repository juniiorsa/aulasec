// Aguarda o carregamento completo do DOM para executar o script
document.addEventListener('DOMContentLoaded', () => {

  // Inicializa a biblioteca de animações (AOS)
  // doc: https://github.com/michalsnik/aos
  AOS.init({
    duration: 800, // Duração da animação em ms
    once: true,    // Animar elementos apenas uma vez
    offset: 100,   // "Gatilho" da animação um pouco antes de o elemento aparecer
  });

  // --- LÓGICA DO MODAL ---

  // Seleciona os elementos do DOM necessários para o modal
  const ctaButton = document.getElementById('cta-button');
  const modalOverlay = document.getElementById('phone-modal');
  const closeModalButton = document.getElementById('close-modal');
  const phoneForm = document.getElementById('phone-form');
  const phoneInput = document.getElementById('phone-input');

  // URL para onde o usuário será redirecionado
  // IMPORTANTE: Substitua pela URL real da sua comunidade
  const communityRedirectURL = 'https://chat.whatsapp.com/SUA_COMUNIDADE_AQUI';

  // Função para abrir o modal
  const openModal = () => {
    modalOverlay.classList.add('active');
  };

  // Função para fechar o modal
  const closeModal = () => {
    modalOverlay.classList.remove('active');
  };

  // Adiciona o evento de clique ao botão principal de CTA
  ctaButton.addEventListener('click', (event) => {
    event.preventDefault(); // Impede que o link "#" mude a URL
    openModal();
  });

  // Adiciona o evento de clique ao botão de fechar do modal
  closeModalButton.addEventListener('click', closeModal);

  // Adiciona o evento de clique ao fundo do modal para fechá-lo
  modalOverlay.addEventListener('click', (event) => {
    // Fecha o modal apenas se o clique for no overlay (fundo) e não no container
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  // Adiciona o evento de submissão ao formulário do modal
  phoneForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o recarregamento da página
    
    const phoneNumber = phoneInput.value;
    const submitButton = phoneForm.querySelector('.submit-button');

    // Simples validação para garantir que o campo não está vazio
    if (phoneNumber.trim() === '') {
      alert('Por favor, preencha seu número de telefone.');
      return;
    }

    // Feedback visual para o usuário
    submitButton.textContent = 'Redirecionando...';
    submitButton.disabled = true;

    // AQUI: Você poderia enviar o 'phoneNumber' para uma API, Google Sheets, etc.
    // Ex: sendToAPI(phoneNumber);

    // Aguarda um pouco para o usuário ver a mensagem e então redireciona
    setTimeout(() => {
      window.location.href = communityRedirectURL;
    }, 1500); // Atraso de 1.5 segundos
  });

});
