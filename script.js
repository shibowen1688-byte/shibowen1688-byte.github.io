// ============================================
// 页面初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initScrollAnimations();
    initInteractiveElements();
});

// ============================================
// 导航栏功能
// ============================================
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 汉堡菜单
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // 导航链接点击
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 移除所有活跃状态
            navLinks.forEach(l => l.classList.remove('active'));
            // 添加当前活跃状态
            link.classList.add('active');
            // 关闭菜单
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // 窗口滚动时更新导航
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// ============================================
// 平滑滚动
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // 减去导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// 滚动动画
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    document.querySelectorAll('.showcase-card, .service-card, .product-item, .heritage-item').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// 交互元素
// ============================================
function initInteractiveElements() {
    // 初始化轮播图
    initCarousel();

    // 展厅卡片点击
    document.querySelectorAll('.showcase-card').forEach(card => {
        card.addEventListener('click', function() {
            const sectionId = this.getAttribute('onclick').match(/#\w+/)?.[0];
            if (sectionId) {
                scrollToSection(sectionId.slice(1));
            }
        });
    });

    // CTA按钮
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            scrollToSection('showcases');
        });
    }

    // 订阅表单
    const subscribeBtn = document.querySelector('.subscribe-btn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', handleSubscribe);
    }

    // 白金卡申请
    const applyBtn = document.querySelector('.apply-button');
    if (applyBtn) {
        applyBtn.addEventListener('click', handlePlatinumApply);
    }

    // 特效鼠标跟随
    initMouseFollower();
}

// ============================================
// 辅助函数
// ============================================
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ============================================
// 表单处理
// ============================================
function handleSubscribe(e) {
    e.preventDefault();
    const emailInput = document.querySelector('.form-group input');
    const email = emailInput?.value;

    if (email && isValidEmail(email)) {
        showNotification('✓ 订阅成功！感谢您的关注。', 'success');
        emailInput.value = '';
    } else {
        showNotification('✗ 请输入有效的邮箱地址。', 'error');
    }
}

function handlePlatinumApply() {
    showNotification('感谢您对普高达白金卡的关注！我们会尽快与您联系。', 'info');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // 样式
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ============================================
// 鼠标跟随特效
// ============================================
function initMouseFollower() {
    const mouseCircles = [];

    // 创建跟随圆点
    for (let i = 0; i < 8; i++) {
        const circle = document.createElement('div');
        circle.style.cssText = `
            position: fixed;
            width: ${5 - i * 0.5}px;
            height: ${5 - i * 0.5}px;
            background: rgba(212, 165, 116, ${0.8 - i * 0.1});
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
        `;
        document.body.appendChild(circle);
        mouseCircles.push({
            element: circle,
            x: 0,
            y: 0,
            delay: i * 0.05
        });
    }

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 动画循环
    function animate() {
        let x = mouseX;
        let y = mouseY;

        mouseCircles.forEach((circle, index) => {
            circle.x += (x - circle.x) * (0.3 - index * 0.02);
            circle.y += (y - circle.y) * (0.3 - index * 0.02);

            circle.element.style.left = circle.x + 'px';
            circle.element.style.top = circle.y + 'px';
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// ============================================
// 页面加载完成后的特效
// ============================================
window.addEventListener('load', () => {
    // 添加页面加载完成效果
    document.body.style.opacity = '1';

    // 计数器动画
    animateCounters();

    // 视差滚动效果
    initParallax();
});

// ============================================
// 计数器动画
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1000 / 60);
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    });
}

// ============================================
// 视差滚动效果
// ============================================
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        // 英雄区视差
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        }

        // 其他视差效果
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const parallaxValue = element.getAttribute('data-parallax');
            element.style.transform = `translateY(${scrollPosition * parallaxValue}px)`;
        });
    });
}

// ============================================
// 页面隐藏时暂停动画
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面隐藏
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // 页面显示
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// ============================================
// 性能优化
// ============================================
const scrollListener = throttle(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', scrollListener);

function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return func(...args);
        }
    };
}

// ============================================
// 粒子效果 (可选)
// ============================================
function initParticles() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        pointer-events: none;
        z-index: 1;
    `;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.insertBefore(canvas, document.body.firstChild);

    const particles = [];

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = `rgba(212, 165, 116, ${Math.random() * 0.5})`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size -= 0.02;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 鼠标移动时创建粒子
    document.addEventListener('mousemove', (e) => {
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(e.clientX, e.clientY));
        }
    });

    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();

            if (particles[i].size <= 0) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    // 窗口调整大小
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============================================
// 增强的鼠标交互
// ============================================
function initEnhancedMouseInteraction() {
    // 光标跟随文字
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            cursor: auto;
        }

        a, button, .showcase-card, .product-item, .heritage-item, .service-card {
            cursor: pointer;
        }

        input, textarea {
            cursor: text;
        }
    `;
    document.head.appendChild(style);

    // 按钮悬停效果增强
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.letterSpacing = '2px';
        });

        button.addEventListener('mouseleave', function() {
            this.style.letterSpacing = 'initial';
        });
    });
}

// 初始化增强的鼠标交互
initEnhancedMouseInteraction();

// ============================================
// 页面加载完成时调用粒子效果
// ============================================
if (window.location.hash !== '#no-particles') {
    // initParticles(); // 可选，取消注释以启用粒子效果
}

// ============================================
// 轮播图功能
// ============================================
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // 隐藏所有幻灯片
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // 显示当前幻灯片
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000); // 每5秒切换一次
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // 事件监听器
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    // 指示器点击
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // 鼠标悬停时停止自动播放
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    }

    // 开始自动播放
    startAutoSlide();
}

// ============================================
// 导出函数供外部调用
// ============================================
window.scrollToSection = scrollToSection;
window.showNotification = showNotification;
