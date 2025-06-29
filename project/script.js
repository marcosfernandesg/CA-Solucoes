// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        menuBtn.classList.remove('active');
    } else {
        mobileMenu.classList.add('active');
        menuBtn.classList.add('active');
    }
}

// WhatsApp Quick Messages Toggle
function toggleQuickMessages() {
    const quickMessages = document.getElementById('quickMessages');
    const whatsappIcon = document.getElementById('whatsappIcon');
    
    if (quickMessages.classList.contains('active')) {
        quickMessages.classList.remove('active');
        whatsappIcon.textContent = '💬';
    } else {
        quickMessages.classList.add('active');
        whatsappIcon.textContent = '✕';
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const header = document.querySelector('.header');
    
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        if (!header.contains(event.target)) {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    }
});

// Close quick messages when clicking outside
document.addEventListener('click', function(event) {
    const quickMessages = document.getElementById('quickMessages');
    const whatsappFloat = document.getElementById('whatsappFloat');
    const whatsappIcon = document.getElementById('whatsappIcon');
    
    if (quickMessages && quickMessages.classList.contains('active')) {
        if (!whatsappFloat.contains(event.target)) {
            quickMessages.classList.remove('active');
            if (whatsappIcon) {
                whatsappIcon.textContent = '💬';
            }
        }
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Form validation and submission
function submitBudgetForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'service', 'description'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const value = formData.get(field);
        if (!value || value.trim() === '') {
            isValid = false;
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
                input.style.borderColor = '#ef4444';
                input.focus();
            }
        }
    });
    
    if (!isValid) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return false;
    }
    
    // Format urgency text
    const urgencyText = formData.get('urgency') === 'urgent' ? '🚨 URGENTE' : '📋 Normal';
    
    // Create WhatsApp message
    const whatsappMessage = `💰 *SOLICITAÇÃO DE ORÇAMENTO*

${urgencyText}

👤 *Cliente:* ${formData.get('name')}
📞 *Telefone:* ${formData.get('phone')}
📧 *Email:* ${formData.get('email') || 'Não informado'}
📍 *Endereço:* ${formData.get('address') || 'Não informado'}

🔧 *Serviço:* ${formData.get('service')}

📝 *Descrição detalhada:*
${formData.get('description')}

Aguardo orçamento! 🙏`;

    // Open WhatsApp
    window.open(`https://wa.me/5527992472266?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    
    // Show success message
    alert('Redirecionando para o WhatsApp com sua solicitação!');
    
    return false;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .service-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.href || this.href.includes('javascript:')) return;
            
            const originalText = this.innerHTML;
            this.innerHTML = '<span>Carregando...</span>';
            
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .feature, .testimonial, .stat');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Phone number formatting
function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 7) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    
    input.value = value;
}

// Add phone formatting to phone inputs
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhone(this);
        });
    });
});