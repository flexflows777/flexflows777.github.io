// ================================================
// MOSAARTS - JavaScript Interactions
// Premium website functionality
// ================================================

// --- SMOOTH SCROLL ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// --- MOBILE MENU TOGGLE ---
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            // If it's the dropdown toggle on mobile, do not close the menu
            if (link.classList.contains('dropdown-toggle') && window.matchMedia('(max-width: 768px)').matches) {
                return;
            }
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });}

// --- HEADER SCROLL EFFECT ---
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        header.classList.remove('scroll-down');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// --- INTERSECTION OBSERVER FOR ANIMATIONS ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements that should animate on scroll
document.querySelectorAll('.gallery-item, .process-step, .testimonial').forEach(el => {
    observer.observe(el);
});

// --- FILE UPLOAD HANDLING ---
const fileInput = document.getElementById('foto');
const fileLabel = document.querySelector('.file-label');
const fileName = document.querySelector('.file-name');

if (fileInput && fileLabel && fileName) {
    fileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            fileName.textContent = file.name;
            fileLabel.classList.add('has-file');
        } else {
            fileName.textContent = '';
            fileLabel.classList.remove('has-file');
        }
    });

    // Drag and drop functionality
    fileLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileLabel.classList.add('drag-over');
    });

    fileLabel.addEventListener('dragleave', () => {
        fileLabel.classList.remove('drag-over');
    });

    fileLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        fileLabel.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            const file = e.dataTransfer.files[0];
            fileName.textContent = file.name;
            fileLabel.classList.add('has-file');
        }
    });
}

// --- FORM VALIDATION & SUBMISSION ---
const orderForm = document.getElementById('orderForm');

if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const nome = document.getElementById('nome').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const tamanho = document.getElementById('tamanho').value;
        const mensagem = document.getElementById('mensagem').value;
        const foto = document.getElementById('foto').files[0];
        
        // Basic validation
        if (!nome || !whatsapp || !tamanho) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        if (!foto) {
            showNotification('Por favor, envie uma foto.', 'error');
            return;
        }
        
        // Format WhatsApp message
        const whatsappNumber = whatsapp.replace(/\D/g, '');
        let message = `*Novo Pedido MOSAARTS*\n\n`;
        message += `*Nome:* ${nome}\n`;
        message += `*Tamanho:* ${tamanho}\n`;
        if (mensagem) {
            message += `*Observações:* ${mensagem}\n`;
        }
        message += `\n_Foto será enviada separadamente_`;
        
        // Encode message for WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=${encodedMessage}`;
        
        // Show success message
        showNotification('Redirecionando para WhatsApp...', 'success');
        
        // Open WhatsApp in new window
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1000);
        
        // Reset form after 2 seconds
        setTimeout(() => {
            orderForm.reset();
            fileName.textContent = '';
            fileLabel.classList.remove('has-file');
        }, 2000);
    });
}

// --- NOTIFICATION SYSTEM ---
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✓' : '⚠'}
            </span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        z-index: 10000;
        padding: 1.5rem 2rem;
        background-color: ${type === 'success' ? '#C6A75E' : '#DC2626'};
        color: ${type === 'success' ? '#0D0D0D' : '#FFFFFF'};
        border-radius: 4px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        font-family: 'Work Sans', sans-serif;
        font-size: 1rem;
        font-weight: 500;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.4s ease;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 5000);
}

// --- WHATSAPP MASK ---
const whatsappInput = document.getElementById('whatsapp');

if (whatsappInput) {
    whatsappInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            value = value.replace(/^(\d*)/, '($1');
        }
        
        e.target.value = value;
    });
}

// --- GALLERY IMAGE LOADING ---
// Simulate image loading with placeholders
const galleryPlaceholders = document.querySelectorAll('.gallery-placeholder');

galleryPlaceholders.forEach((placeholder, index) => {
    // In a real implementation, you would load actual images here
    // For demonstration, we're using the gradient animation
    placeholder.style.animationDelay = `${index * 0.5}s`;
});

// --- PARALLAX EFFECT ON HERO ---
const hero = document.querySelector('.hero');
const heroBackground = document.querySelector('.hero-background');

if (hero && heroBackground) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (scrolled < window.innerHeight) {
            heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// --- LAZY LOADING FOR IMAGES ---
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Load the image here if using data-src attributes
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    // Observe all images that should be lazy loaded
    document.querySelectorAll('.gallery-placeholder').forEach(img => {
        imageObserver.observe(img);
    });
}

// --- SCROLL PROGRESS INDICATOR ---
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #C6A75E, #D4B876);
    width: 0%;
    z-index: 10001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// --- CONSOLE EASTER EGG ---
console.log('%cMOSAARTS', 'font-size: 40px; font-weight: bold; color: #C6A75E; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%cTransformando memórias em arte desde 2023', 'font-size: 14px; color: #FFFFFF; font-family: serif;');
console.log('%c\nDesenvolvido com ❤️ e café ☕', 'font-size: 12px; color: #737373;');
console.log('%c\nInteressado em trabalhar conosco? Entre em contato!', 'font-size: 12px; color: #C6A75E;');

// --- LOG PAGE LOAD TIME ---
window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`%c⚡ Página carregada em ${loadTime}ms`, 'color: #C6A75E; font-weight: bold;');
});


// --- NAV DROPDOWN (MOBILE) ---
const navDropdown = document.querySelector('.nav-dropdown');
const dropdownToggle = document.querySelector('.dropdown-toggle');

if (navDropdown && dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
        // Only toggle dropdown on mobile
        if (window.matchMedia('(max-width: 768px)').matches) {
            e.preventDefault();
            navDropdown.classList.toggle('open');
        }
    });
}


// --- FAQ ACCORDION ---
(function initFAQAccordion(){
    const items = Array.from(document.querySelectorAll('.faq-item'));
    if (!items.length) return;

    const closeItem = (item) => {
        item.classList.remove('is-open');
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        if (answer){
            answer.setAttribute('aria-hidden', 'true');
            answer.style.maxHeight = '0px';
        }
    };

    const openItem = (item) => {
        item.classList.add('is-open');
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (btn) btn.setAttribute('aria-expanded', 'true');
        if (answer){
            answer.setAttribute('aria-hidden', 'false');
            // set to scrollHeight for smooth animation
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    };

    items.forEach((item) => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = '0px';

        if (!btn) return;
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');
            // close others
            items.forEach(i => i !== item && closeItem(i));
            if (isOpen) closeItem(item);
            else openItem(item);
        });
    });

    // Recalculate heights on resize (keeps animation correct)
    window.addEventListener('resize', () => {
        items.forEach((item) => {
            if (!item.classList.contains('is-open')) return;
            const answer = item.querySelector('.faq-answer');
            if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        });
    });
})();


// --- CART SYSTEM ---
const MOSAARTS_STORE_WHATSAPP = '5561999999999';
const CART_STORAGE_KEY = 'mosaarts_cart_v1';
let mosaartsCart = [];

function loadCart() {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        mosaartsCart = saved ? JSON.parse(saved) : [];
    } catch (error) {
        mosaartsCart = [];
    }
}

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(mosaartsCart));
}

function formatBRL(value) {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getCartCount() {
    return mosaartsCart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
    return mosaartsCart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function openCart() {
    const overlay = document.querySelector('.cart-overlay');
    const drawer = document.querySelector('.cart-drawer');
    if (overlay) overlay.classList.add('is-open');
    if (drawer) drawer.classList.add('is-open');
    document.body.classList.add('cart-open');
}

function closeCart() {
    const overlay = document.querySelector('.cart-overlay');
    const drawer = document.querySelector('.cart-drawer');
    if (overlay) overlay.classList.remove('is-open');
    if (drawer) drawer.classList.remove('is-open');
    document.body.classList.remove('cart-open');
}

function updateCartBadge() {
    const count = getCartCount();
    document.querySelectorAll('.cart-fab-count').forEach(el => {
        el.textContent = count;
    });
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartWhatsappBtn = document.getElementById('cartWhatsappBtn');
    if (!cartItems || !cartTotal || !cartWhatsappBtn) return;

    if (!mosaartsCart.length) {
        cartItems.innerHTML = '<div class="cart-empty">Seu carrinho está vazio. Adicione um quadro e finalize pelo WhatsApp.</div>';
        cartTotal.textContent = formatBRL(0);
        cartWhatsappBtn.disabled = true;
        cartWhatsappBtn.style.opacity = '0.55';
        cartWhatsappBtn.style.pointerEvents = 'none';
        updateCartBadge();
        return;
    }

    cartItems.innerHTML = mosaartsCart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-top">
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatBRL(item.price)} cada</div>
                </div>
                <button type="button" class="cart-remove" onclick="removeFromCart(${index})">Remover</button>
            </div>
            <div class="cart-qty">
                <button type="button" class="cart-qty-btn" onclick="changeCartQuantity(${index}, -1)">−</button>
                <span class="cart-qty-value">${item.quantity}</span>
                <button type="button" class="cart-qty-btn" onclick="changeCartQuantity(${index}, 1)">+</button>
            </div>
        </div>
    `).join('');

    cartTotal.textContent = formatBRL(getCartTotal());
    cartWhatsappBtn.disabled = false;
    cartWhatsappBtn.style.opacity = '1';
    cartWhatsappBtn.style.pointerEvents = 'auto';
    updateCartBadge();
}

function addToCart(name, price) {
    const existingItem = mosaartsCart.find(item => item.name === name && Number(item.price) === Number(price));
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        mosaartsCart.push({ name, price: Number(price), quantity: 1 });
    }
    saveCart();
    renderCart();
    openCart();
    showNotification(`${name} adicionado ao carrinho.`, 'success');
}

function removeFromCart(index) {
    mosaartsCart.splice(index, 1);
    saveCart();
    renderCart();
}

function changeCartQuantity(index, delta) {
    const item = mosaartsCart[index];
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        mosaartsCart.splice(index, 1);
    }
    saveCart();
    renderCart();
}

function clearCart() {
    mosaartsCart = [];
    saveCart();
    renderCart();
    showNotification('Carrinho limpo.', 'success');
}

function finalizeCartOnWhatsApp() {
    if (!mosaartsCart.length) {
        showNotification('Seu carrinho está vazio.', 'error');
        return;
    }

    let lines = ['*Novo pedido MOSAARTS*', ''];
    mosaartsCart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        lines.push(`*${index + 1}.* ${item.name}`);
        lines.push(`Qtd: ${item.quantity}`);
        lines.push(`Valor base: ${formatBRL(item.price)}`);
        lines.push(`Subtotal: ${formatBRL(subtotal)}`);
        lines.push('');
    });

    lines.push(`*Total base do carrinho:* ${formatBRL(getCartTotal())}`);
    lines.push('');
    lines.push('Quero finalizar esse pedido pelo WhatsApp.');
    lines.push('Obs.: entendo que os valores podem variar conforme personalização, tamanho e acabamento.');

    window.open(`https://wa.me/${MOSAARTS_STORE_WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
}

function buildCartUI() {
    if (document.querySelector('.cart-fab')) return;

    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'cart-fab';
    fab.setAttribute('aria-label', 'Abrir carrinho');
    fab.innerHTML = `
        <svg class="cart-fab-icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 4H5L7.2 14.4C7.295 14.85 7.545 15.253 7.907 15.538C8.269 15.823 8.719 15.973 9.18 15.96H17.49C17.951 15.973 18.401 15.823 18.763 15.538C19.125 15.253 19.375 14.85 19.47 14.4L20.8 8H6.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9.5" cy="19" r="1.5" fill="currentColor"/>
            <circle cx="17.5" cy="19" r="1.5" fill="currentColor"/>
        </svg>
        <span>Carrinho</span>
        <span class="cart-fab-count">0</span>
    `;
    fab.addEventListener('click', openCart);

    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.addEventListener('click', closeCart);

    const drawer = document.createElement('aside');
    drawer.className = 'cart-drawer';
    drawer.setAttribute('aria-label', 'Carrinho de compras');
    drawer.innerHTML = `
        <div class="cart-header">
            <h2 class="cart-title">Carrinho</h2>
            <button type="button" class="cart-close" aria-label="Fechar carrinho">×</button>
        </div>
        <div class="cart-body" id="cartItems"></div>
        <div class="cart-footer">
            <div class="cart-summary">
                <div class="cart-summary-label">Total base</div>
                <div class="cart-summary-total" id="cartTotal">R$ 0,00</div>
            </div>
            <div class="cart-note">O pedido é enviado para o WhatsApp para confirmar personalização, frete, prazo e acabamento.</div>
            <div class="cart-actions">
                <button type="button" class="btn btn-primary btn-large" id="cartWhatsappBtn">Finalizar no WhatsApp</button>
                <button type="button" class="btn btn-secondary" id="cartClearBtn">Limpar carrinho</button>
            </div>
        </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    drawer.querySelector('.cart-close').addEventListener('click', closeCart);
    drawer.querySelector('#cartWhatsappBtn').addEventListener('click', finalizeCartOnWhatsApp);
    drawer.querySelector('#cartClearBtn').addEventListener('click', clearCart);
}

function bindAddToCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.productName;
            const price = Number(button.dataset.productPrice);
            addToCart(name, price);
        });
    });
}

loadCart();
buildCartUI();
bindAddToCartButtons();
renderCart();

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeCart();
    }
});
