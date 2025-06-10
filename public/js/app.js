const video1 = document.getElementById('projectVideo1');
const video2 = document.getElementById('projectVideo2');
const video3 = document.getElementById('projectVideo3');
const video4 = document.getElementById('projectVideo4');

// Sidebar elements //
const sideBar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon')


const hoverSign = document.querySelector('.hover-sign');

const videoList =[video1, video2, video3, video4];

videoList.forEach (function(video){
    video.addEventListener("mouseover", function(){
        video.play()
        hoverSign.classList.add("active")
    })
    video.addEventListener("mouseout", function(){
    video.pause();
    hoverSign.classList.remove("active")
})
})

// Sidebar elements //
menu.addEventListener("click", function(){
    sideBar.classList.remove("close-sidebar")
    sideBar.classList.add("open-sidebar")
});

closeIcon.addEventListener("click", function(){
    sideBar.classList.remove("open-sidebar");
    sideBar.classList.add("close-sidebar");
    
})

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Auto Blur Animation
    const autoBlurElements = document.querySelectorAll('.autoBlur');
    const autoBlurObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            const progress = entry.intersectionRatio;
            
            if (entry.isIntersecting) {
                // Calculate blur and opacity based on scroll progress
                const blurValue = Math.max(0, 40 - (progress * 40));
                const opacityValue = progress > 0.3 ? 1 : progress;
                
                element.style.filter = `blur(${blurValue}px)`;
                element.style.opacity = opacityValue;
            } else {
                element.style.filter = 'blur(40px)';
                element.style.opacity = 0;
            }
        });
    }, {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px 0px -100px 0px'
    });

    autoBlurElements.forEach(el => autoBlurObserver.observe(el));

    // Auto Display Animation
    const autoDisplayElements = document.querySelectorAll('.autoDisplay');
    const autoDisplayObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            const progress = entry.intersectionRatio;
            
            if (entry.isIntersecting) {
                // Animate from initial state to final state
                const blurValue = Math.max(0, 10 - (progress * 10));
                const scaleValue = 0 + (progress * 1);
                const translateYValue = -200 + (progress * 200);
                const opacityValue = progress;
                
                element.style.filter = `blur(${blurValue}px)`;
                element.style.transform = `translateY(${translateYValue}px) scale(${scaleValue})`;
                element.style.opacity = opacityValue;
            } else {
                element.style.filter = 'blur(10px)';
                element.style.transform = 'translateY(-200px) scale(0)';
                element.style.opacity = 0;
            }
        });
    }, {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px 0px -50px 0px'
    });

    autoDisplayElements.forEach(el => autoDisplayObserver.observe(el));

    // Fade In Left Animation
    const fadeInLeftElements = document.querySelectorAll('.fadein-left');
    const fadeInLeftObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            const progress = entry.intersectionRatio;
            
            if (entry.isIntersecting) {
                // Animate from left to center
                const translateXValue = -500 + (progress * 500);
                const scaleValue = 0.2 + (progress * 0.8);
                const blurValue = Math.max(0, 10 - (progress * 10));
                const opacityValue = progress;
                
                element.style.transform = `translateX(${translateXValue}px) scale(${scaleValue})`;
                element.style.filter = `blur(${blurValue}px)`;
                element.style.opacity = opacityValue;
            } else {
                element.style.transform = 'translateX(-500px) scale(0.2)';
                element.style.filter = 'blur(10px)';
                element.style.opacity = 0;
            }
        });
    }, {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px 0px -50px 0px'
    });

    fadeInLeftElements.forEach(el => fadeInLeftObserver.observe(el));
});

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');
        const submitBtn = document.getElementById('submitBtn');
        const formStatus = document.getElementById('formStatus');


        // Validate name
        nameInput.addEventListener('blur', function () {
            if (nameInput.value.trim() === '') {
                nameInput.classList.add('error');
                nameError.textContent = 'Name is required';
            } else {
                nameInput.classList.remove('error');
                nameError.textContent = '';
            }
        });

        // Validate email
        emailInput.addEventListener('blur', function () {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                emailInput.classList.add('error');
                emailError.textContent = 'Email is required';
            } else if (!emailPattern.test(emailInput.value)) {
                emailInput.classList.add('error');
                emailError.textContent = 'Please enter a valid email address';
            } else {
                emailInput.classList.remove('error');
                emailError.textContent = '';
            }
        });

        // Validate message
        messageInput.addEventListener('blur', function () {
            if (messageInput.value.trim() === '') {
                messageInput.classList.add('error');
                messageError.textContent = 'Message is required';
            } else if (messageInput.value.trim().length < 10) {
                messageInput.classList.add('error');
                messageError.textContent = 'Message must be at least 10 characters';
            } else {
                messageInput.classList.remove('error');
                messageError.textContent = '';
            }
        });

        // Form submission using fetch API to backend endpoint
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Validate all fields before submission
            let isValid = true;

            if (nameInput.value.trim() === '') {
                nameInput.classList.add('error');
                nameError.textContent = 'Name is required';
                isValid = false;
            } else {
                nameInput.classList.remove('error');
                nameError.textContent = '';
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                emailInput.classList.add('error');
                emailError.textContent = 'Email is required';
                isValid = false;
            } else if (!emailPattern.test(emailInput.value)) {
                emailInput.classList.add('error');
                emailError.textContent = 'Please enter a valid email address';
                isValid = false;
            } else {
                emailInput.classList.remove('error');
                emailError.textContent = '';
            }

            if (messageInput.value.trim() === '') {
                messageInput.classList.add('error');
                messageError.textContent = 'Message is required';
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                messageInput.classList.add('error');
                messageError.textContent = 'Message must be at least 10 characters';
                isValid = false;
            } else {
                messageInput.classList.remove('error');
                messageError.textContent = '';
            }

            if (!isValid) {
                return;
            }

            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
            formStatus.innerHTML = '';

            try {
                // Get current time in IST
                const currentDate = new Date();
                const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes
                const istDate = new Date(currentDate.getTime() + istOffset);
                const timeString = istDate.toISOString().replace('T', ' ').substring(0, 19);

                // Prepare form data
                const formData = {
                    name: nameInput.value.trim(),
                    from_email: emailInput.value.trim(),
                    message: messageInput.value.trim(),
                    time: timeString, // Add time for EmailJS template
                };

                // Send data to backend endpoint
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();
                console.log('Response from server:', result);

                if (response.ok) {
                    formStatus.innerHTML = '<div class="success">Message sent successfully! I\'ll get back to you soon.</div>';
                    contactForm.reset();
                    nameInput.classList.remove('error');
                    emailInput.classList.remove('error');
                    messageInput.classList.remove('error');
                    nameError.textContent = '';
                    emailError.textContent = '';
                    messageError.textContent = '';
                } else {
                    formStatus.innerHTML = `<div class="error">${result.message || 'Failed to send message. Please try again.'}</div>`;
                }
            } catch (error) {
                formStatus.innerHTML = '<div class="error">An error occurred. Please try again later or contact me directly via email.</div>';
                console.error('Error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bx bx-send"></i> Send Message';
            }
        });
    }
});