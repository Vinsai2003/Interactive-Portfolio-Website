document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- Navigation ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    }

    navToggle.addEventListener('click', toggleMobileMenu);

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    function handleNavbarScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }

    // Highlight active nav link based on scroll position
    function highlightActiveSection() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleNavbarScroll);
    window.addEventListener('scroll', highlightActiveSection);


    // --- Dark / Light Mode Toggle ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    function applyDarkMode(isDark) {
        body.classList.toggle('dark-mode', isDark);
        darkModeToggle.textContent = isDark ? '☀️' : '🌙';
        darkModeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        localStorage.setItem('darkMode', isDark);
    }

    // Restore saved preference
    applyDarkMode(localStorage.getItem('darkMode') === 'true');

    darkModeToggle.addEventListener('click', () => {
        applyDarkMode(!body.classList.contains('dark-mode'));
    });


    // ---  Scroll Reveal Animations ---
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    // --- Animated Counter ---
    const counterElements = document.querySelectorAll('.counter');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1500;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(eased * target) + '+';
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counterElements.forEach(el => counterObserver.observe(el));


    // --- Typing Animation ---
    const typedText = document.getElementById('typed-text');
    const phrases = ['people.', 'the web.', 'tomorrow.'];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
        const current = phrases[phraseIdx];

        if (isDeleting) {
            typedText.textContent = current.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typedText.textContent = current.substring(0, charIdx + 1);
            charIdx++;
        }

        let delay = isDeleting ? 60 : 120;

        if (!isDeleting && charIdx === current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(typeLoop, delay);
    }

    if (typedText) typeLoop();


    // --- Show / Hide Content (Read More) ---
    const readMoreBtn = document.getElementById('read-more-btn');
    const extraAbout = document.getElementById('extra-about');

    function toggleReadMore() {
        const isHidden = extraAbout.classList.contains('hidden');
        extraAbout.classList.toggle('hidden');
        readMoreBtn.textContent = isHidden ? 'Read Less ↑' : 'Read More ↓';
    }

    if (readMoreBtn && extraAbout) {
        readMoreBtn.addEventListener('click', toggleReadMore);
    }


    // --- Image Slider ---
    const slides = document.querySelectorAll('.slider-img');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const dotsContainer = document.getElementById('slider-dots');
    const counterEl = document.getElementById('slider-counter');
    let currentSlide = 0;
    let autoPlayTimer = null;

    function showSlide(index) {
        slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
        dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
        if (counterEl) counterEl.textContent = `${index + 1} / ${slides.length}`;
    }

    function goToSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        showSlide(currentSlide);
        resetAutoPlay();
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
    }

    // --- Build dots dynamically ---
    if (dotsContainer && slides.length > 0) {
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    }

    if (prevBtn && nextBtn && slides.length) {
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        resetAutoPlay();
    }

    // Keyboard arrow support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
        if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    });


    // --- To-Do List ---
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
    const todoCountEl = document.getElementById('todo-count');
    const clearDoneBtn = document.getElementById('clear-completed');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let tasks = JSON.parse(localStorage.getItem('portfolioTasks')) || [];
    let currentFilter = 'all';

    function saveTasks() {
        localStorage.setItem('portfolioTasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        todoList.innerHTML = '';

        const filtered = tasks.filter(t => {
            if (currentFilter === 'active') return !t.done;
            if (currentFilter === 'completed') return t.done;
            return true;
        });

        if (filtered.length === 0) {
            const emptyMsg = document.createElement('li');
            emptyMsg.className = 'todo-empty';
            emptyMsg.textContent = currentFilter === 'all'
                ? 'No tasks yet — add one above!'
                : `No ${currentFilter} tasks.`;
            todoList.appendChild(emptyMsg);
        }

        filtered.forEach(task => {
            const li = document.createElement('li');
            li.className = 'todo-item' + (task.done ? ' completed' : '');

            li.innerHTML = `
                <label class="todo-check-label">
                    <input type="checkbox" class="todo-checkbox" ${task.done ? 'checked' : ''}>
                    <span class="todo-checkmark"></span>
                </label>
                <span class="todo-text">${escapeHtml(task.text)}</span>
                <button class="delete-todo" aria-label="Delete task">&times;</button>
            `;

            li.querySelector('.todo-checkbox').addEventListener('change', () => {
                task.done = !task.done;
                saveTasks();
                renderTasks();
            });

            li.querySelector('.delete-todo').addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
            });

            todoList.appendChild(li);
        });

        const activeCount = tasks.filter(t => !t.done).length;
        if (todoCountEl) {
            todoCountEl.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`;
        }
    }

    function addTask() {
        const text = todoInput.value.trim();
        if (text === '' || text.length > 100) return;

        tasks.push({ id: Date.now(), text: text, done: false });
        saveTasks();
        renderTasks();
        todoInput.value = '';
        todoInput.focus();
    }

    // XSS prevention for user input
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', addTask);
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderTasks();
        });
    });

    if (clearDoneBtn) {
        clearDoneBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => !t.done);
            saveTasks();
            renderTasks();
        });
    }

    renderTasks();


    // ---  Form Validation ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoader = document.getElementById('btn-loader');

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');
    const charCount = document.getElementById('char-count');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    function validateName() {
        const value = nameInput.value.trim();
        if (value.length === 0) {
            showFieldError(nameInput, nameError, 'Name is required.');
            return false;
        }
        if (value.length < 5) {
            showFieldError(nameInput, nameError, 'Name must be at least 5 characters.');
            return false;
        }
        if (!/^[A-Za-z\s\-'.]+$/.test(value)) {
            showFieldError(nameInput, nameError, 'Name can only contain letters, spaces, hyphens, and apostrophes.');
            return false;
        }
        clearFieldError(nameInput, nameError);
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.length === 0) {
            showFieldError(emailInput, emailError, 'Email is required.');
            return false;
        }
        if (!emailRegex.test(value)) {
            showFieldError(emailInput, emailError, 'Please enter a valid email address.');
            return false;
        }
        clearFieldError(emailInput, emailError);
        return true;
    }

    function validateMessage() {
        const value = messageInput.value.trim();
        if (value.length === 0) {
            showFieldError(messageInput, messageError, 'Message is required.');
            return false;
        }
        if (value.length < 10) {
            showFieldError(messageInput, messageError, `Message must be at least 10 characters (${value.length}/10).`);
            return false;
        }
        clearFieldError(messageInput, messageError);
        return true;
    }

    function showFieldError(input, errorEl, msg) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        errorEl.textContent = msg;
        errorEl.classList.add('visible');
    }

    function clearFieldError(input, errorEl) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    }

    function showFormStatus(msg, type) {
        formStatus.textContent = msg;
        formStatus.className = `form-status ${type}`;
    }

    // --- Real-time validation on blur + input ---
    if (nameInput) {
        nameInput.addEventListener('blur', validateName);
        nameInput.addEventListener('input', () => {
            if (nameInput.classList.contains('invalid')) validateName();
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('invalid')) validateEmail();
        });
    }

    if (messageInput) {
        messageInput.addEventListener('input', () => {
            const len = messageInput.value.trim().length;
            if (charCount) {
                charCount.textContent = `${len} / 10 min characters`;
                charCount.classList.toggle('char-ok', len >= 10);
            }
            if (messageInput.classList.contains('invalid')) validateMessage();
        });
        messageInput.addEventListener('blur', validateMessage);
    }

    // --- Form submit ---
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            formStatus.textContent = '';
            formStatus.className = 'form-status hidden';

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isMessageValid = validateMessage();

            if (!isNameValid || !isEmailValid || !isMessageValid) {
                showFormStatus('Please fix the errors above before submitting.', 'error');
                return;
            }

            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Sending...';
            if (btnLoader) btnLoader.classList.remove('hidden');

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showFormStatus('🎉 Thanks! Your message has been sent successfully.', 'success');
                    contactForm.reset();
                    [nameInput, emailInput, messageInput].forEach(inp => inp.classList.remove('valid', 'invalid'));
                    [nameError, emailError, messageError].forEach(err => {
                        err.textContent = '';
                        err.classList.remove('visible');
                    });
                    if (charCount) {
                        charCount.textContent = '0 / 10 min characters';
                        charCount.classList.remove('char-ok');
                    }
                } else {
                    const data = await response.json();
                    showFormStatus(data.errors ? data.errors.map(err => err.message).join(', ') : 'Oops! Problem submitting the form.', 'error');
                }
            } catch (err) {
                showFormStatus('Network error — please try again later.', 'error');
            } finally {
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Send Message';
                if (btnLoader) btnLoader.classList.add('hidden');
            }
        });
    }


    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('scroll-progress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress);


    // --- Floating Back-to-Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');

    function toggleBackToTop() {
        if (!backToTopBtn) return;
        backToTopBtn.classList.toggle('visible', window.scrollY > 400);
    }

    window.addEventListener('scroll', toggleBackToTop);

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
