document.addEventListener('DOMContentLoaded', () => {

    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 500,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // --- Typewriter Effect for Home Section ---
    const dynamicTextElement = document.querySelector('.dynamic-text');
    const roles = ["Web Developer", "Frontend Developer", "Computer Engineering Student", "Problem Solver", "Tech Enthusiast", "AI Learner", "Creative Coder"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
        const currentRole = roles[roleIndex];
        const currentText = isDeleting ? currentRole.substring(0, charIndex--) : currentRole.substring(0, charIndex++);

        dynamicTextElement.textContent = currentText;

        const typingSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex > currentRole.length) {
            setTimeout(() => {
                isDeleting = true;
            }, 1000); // Pause before deleting
        } else if (isDeleting && charIndex < 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }

        setTimeout(typeWriter, typingSpeed);
    };

    typeWriter();

    // --- Smooth Scrolling & Active Link Highlighting ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', throttle(() => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    }, 100));

    // --- Hamburger Menu Toggle for Mobile ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navbar = document.querySelector('.navbar');

    hamburgerMenu.addEventListener('click', () => {
        navbar.classList.toggle('active');
        
        // Animate hamburger icon
        const icon = hamburgerMenu.querySelector('i');
        if (navbar.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when a link is clicked
    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            const icon = hamburgerMenu.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // --- Enhanced Contact Form with Better Validation ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Enhanced validation
            if (!name || name.length < 2) {
                showNotification('Please enter a valid name (at least 2 characters)', 'error');
                return;
            }

            if (!email || !validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            if (!message || message.length < 10) {
                showNotification('Please enter a message (at least 10 characters)', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('.btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Email validation function
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // --- NEW: Download Resume Functionality (downloads as a PDF) ---
    const downloadResumeBtn = document.getElementById('downloadResume');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const resumeUrl = 'https://drive.google.com/file/d/1S6F_oxJKbEI24EvR2RXNeeiP0vlKweLt/view?usp=drive_link';

            const originalText = downloadResumeBtn.textContent;
            downloadResumeBtn.textContent = 'Preparing...';
            downloadResumeBtn.disabled = true;

            showNotification('Preparing your resume...', 'info');

            try {
                const response = await fetch(resumeUrl, { mode: 'cors' });
                if (!response.ok) throw new Error('Network response was not ok');

                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));

                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'Harshvardhan_Dusane_Resume.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();

                
                window.URL.revokeObjectURL(blobUrl);

                showNotification('Resume downloaded successfully.', 'success');
            } catch (err) {
                showNotification('Could not download directly. Opening resume in a new tab...', 'warning');
                window.open(resumeUrl, '_blank', 'noopener');
            } finally {
                downloadResumeBtn.textContent = originalText;
                downloadResumeBtn.disabled = false;
            }
        });
    }

// Chatbot Functionality 
const initChatbot = () => {
    
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const optionButtons = document.querySelectorAll('.option-btn');

    console.log('Chatbot elements found:', {
        button: !!chatbotButton,
        window: !!chatbotWindow,
        close: !!chatbotClose,
        messages: !!chatbotMessages,
        options: optionButtons.length
    });

    if (!chatbotButton || !chatbotWindow) {
        console.error('Chatbot elements not found!');
        return;
    }

    // Predefined Responses
    const responses = {
    about: {
        title: "About Me",
        content: "I'm Harshvardhan Vijay Dusane, a Computer Engineering student at SPPU (7.5 SGPA). Passionate about building modern web apps and solving real-world problems through code."
    },
    skills: {
        title: "My Skills",
        content: "🔧 Tech: HTML, CSS, JavaScript, Python, Java, Databases<br><br>💼 Tools: Git, Problem Solving, Teamwork, Communication"
    },
    projects: {
        title: "My Projects",
        content: "🚀 Smart Finance System – AI-powered dashboard<br><br>💻 Portfolio Website – Interactive and responsive<br><br>"
    },
    contact: {
        title: "Contact",
        content: "📧 harsh@example.com<br>📱 +91 9876543210<br>💼 LinkedIn: linkedin.com/in/harsh<br>💻 GitHub: github.com/harsh"
    }
        
    };

    // Toggle Chat Window Function
    const toggleChatWindow = () => {
        console.log('Toggle chatbot clicked');
        chatbotWindow.classList.toggle('active');
        
        // Change icon when window is open/closed
        const icon = chatbotButton.querySelector('i');
        if (chatbotWindow.classList.contains('active')) {
            console.log('Chatbot opened');
            icon.classList.remove('fa-comments');
            icon.classList.add('fa-comment-dots');
        } else {
            console.log('Chatbot closed');
            icon.classList.remove('fa-comment-dots');
            icon.classList.add('fa-comments');
        }
    };

    // Add Message to Chat Function
    const addMessage = (content, isUser = false) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'bot-message';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = content;
        
        messageDiv.appendChild(messageContent);
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    // Handle Option Click Function
    const handleOptionClick = (option) => {
        console.log('Option clicked:', option);
        const response = responses[option];
        
        if (response) {
            // Add user message
            addMessage(`Tell me about: ${response.title}`, true);
            
            // Add bot response after a short delay
            setTimeout(() => {
                addMessage(response.content);
                
                // Show options again after response
                setTimeout(() => {
                    addMessage("What else would you like to know?");
                }, 1000);
            }, 500);
        }
    };

    // Event Listeners
    chatbotButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Chatbot button clicked');
        toggleChatWindow();
    });

    if (chatbotClose) {
        chatbotClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked');
            toggleChatWindow();
        });
    }

    // Option buttons event listeners
    optionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const option = e.target.getAttribute('data-option');
            console.log('Option button clicked:', option);
            handleOptionClick(option);
        });
    });

    // Close chatbot when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.chatbot-widget') && chatbotWindow.classList.contains('active')) {
            console.log('Clicked outside, closing chatbot');
            toggleChatWindow();
        }
    });

    // Prevent closing when clicking inside the chat window
    chatbotWindow.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Add welcome notification dot after delay
    setTimeout(() => {
        if (!chatbotWindow.classList.contains('active')) {
            const notificationDot = document.createElement('div');
            notificationDot.className = 'notification-dot';
            notificationDot.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                width: 12px;
                height: 12px;
                background: #ef4444;
                border-radius: 50%;
                animation: pulse 2s infinite;
                z-index: 10;
            `;
            chatbotButton.appendChild(notificationDot);
            
            // Remove dot when chatbot is opened
            chatbotButton.addEventListener('click', () => {
                const dot = chatbotButton.querySelector('.notification-dot');
                if (dot) {
                    dot.remove();
                }
            }, { once: true });
        }
    }, 3000);

    console.log('Chatbot initialized successfully');
};

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    // DOM is already ready
    initChatbot();
}

    // --- NEW: Scroll to Top Button ---
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Show/Hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top functionality
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- NEW: Enhanced Notification System ---
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
            font-family: 'Poppins', sans-serif;
        `;

        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 14px;
            margin-left: auto;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close functionality
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });

        // Auto hide after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                hideNotification(notification);
            }
        }, 5000);
    }

    function hideNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 300);
    }

    function getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-triangle',
            'warning': 'fa-exclamation-circle',
            'info': 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    function getNotificationColor(type) {
        const colors = {
            'success': 'linear-gradient(135deg, #10b981, #059669)',
            'error': 'linear-gradient(135deg, #ef4444, #dc2626)',
            'warning': 'linear-gradient(135deg, #f59e0b, #d97706)',
            'info': 'linear-gradient(135deg, #6366f1, #4f46e5)'
        };
        return colors[type] || colors.info;
    }

    // --- NEW: Interactive Contact Links ---
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const linkType = link.classList[1]; // Gets the second class (email, whatsapp, etc.)
            
            if (linkType === 'email') {
                // For email, we'll show a notification instead of opening mail client
                e.preventDefault();
                showNotification('Email address copied to clipboard!', 'success');
                
                // Copy email to clipboard
                navigator.clipboard.writeText('harshsonar8725@gmail.com').catch(() => {
                    showNotification('Please manually copy: harsh@example.com', 'info');
                });
            }
            
            // For WhatsApp, LinkedIn, and GitHub, let the default behavior happen
            // but show a nice notification
            if (linkType === 'whatsapp') {
                setTimeout(() => {
                    showNotification('Opening WhatsApp...', 'info');
                }, 100);
            }
        });
    });

    // --- Enhanced Card Hover Effects ---
    const cards = document.querySelectorAll('.skill-card, .project-card, .certificate-card, .education-card, .achievement-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // --- Smooth scroll for navigation links ---
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

    // --- Loading animation on page load ---
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Add a subtle loading animation to main content
        const homeSection = document.querySelector('.home');
        if (homeSection) {
            homeSection.style.opacity = '0';
            homeSection.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                homeSection.style.transition = 'all 0.8s ease-out';
                homeSection.style.opacity = '1';
                homeSection.style.transform = 'translateY(0)';
            }, 200);
        }
    });

    // --- Performance optimization: Throttle scroll events ---
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply throttling to scroll events
    window.addEventListener('scroll', throttle(() => {
        // Existing scroll functionality is already handled above
        // This is just to ensure smooth performance
        }, 16)); // ~
    
    // --- NEW: Fade-in Effect for Sections on Scroll ---
    const allSections = document.querySelectorAll('section');

    const handleScroll = () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);

    // Trigger the scroll handler on page load to show visible sections
    handleScroll();
    
    });