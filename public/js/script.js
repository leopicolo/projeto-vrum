// Scroll suave para links
document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', () => {
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Controle do envio do formulário
const form = document.getElementById('contactForm');
const responseMessage = document.getElementById('responseMessage');
const phoneInput = document.getElementById('phone');

// Formatação do telefone: (XX) XXXXX-XXXX
phoneInput.addEventListener('input', () => {
    let phone = phoneInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (phone.length > 0 && phone.length <= 2) {
        phone = `(${phone}`;
    } else if (phone.length > 2 && phone.length <= 7) {
        phone = `(${phone.substring(0, 2)}) ${phone.substring(2)}`;
    } else if (phone.length > 7) {
        phone = `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7, 11)}`;
    }

    phoneInput.value = phone; // Atualiza o campo com a máscara
});

form.addEventListener('submit', async function (e) {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.replace(/\D/g, ''); // Apenas números
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validação dos campos
    if (!name || !phone || !email || !message) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (phone.length < 10 || phone.length > 11) {
        alert('O telefone deve conter DDD e 8 ou 9 dígitos.');
        return;
    }

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, email, message })
        });

        if (response.ok) {
            responseMessage.style.display = 'block';
            responseMessage.style.color = 'green';
            responseMessage.textContent = 'Mensagem enviada com sucesso!';
            form.reset();
        } else {
            throw new Error('Erro ao enviar mensagem.');
        }
    } catch (error) {
        console.error('Erro:', error);
        responseMessage.style.display = 'block';
        responseMessage.style.color = 'red';
        responseMessage.textContent = 'Erro ao enviar mensagem. Tente novamente.';
    }
});

// Alternância de menu para responsividade
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu ul');

if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        menu.classList.toggle('active');
    });
}

// Adicionando controle para ocultar mensagens de resposta
setTimeout(() => {
    if (responseMessage) {
        responseMessage.style.display = 'none';
    }
}, 5000);
