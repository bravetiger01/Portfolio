// Custom cursor and directional animation logic
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorArrow = document.querySelector('.cursor-arrow');
    const trails = document.querySelectorAll('.cursor-trail');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let prevMouseX = 0, prevMouseY = 0;
    let trailPositions = [];
    
    // Initialize trail positions
    trails.forEach(() => {
        trailPositions.push({ x: 0, y: 0 });
    });

    // Update mouse position
    document.addEventListener('mousemove', function(e) {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        updateCursorDirection();
    });

    // Calculate and update cursor direction
    function updateCursorDirection() {
        const deltaX = mouseX - prevMouseX;
        const deltaY = mouseY - prevMouseY;
        
        // Calculate angle for directional arrow
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // Update cursor position
        cursor.style.left = mouseX - 10 + 'px';
        cursor.style.top = mouseY - 10 + 'px';
        
        // Update arrow position and rotation
        cursorArrow.style.left = mouseX - 12 + 'px';
        cursorArrow.style.top = mouseY - 12 + 'px';
        cursorArrow.style.transform = `rotate(${angle + 90}deg)`;
        
        // Show/hide arrow based on movement
        const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        cursorArrow.style.opacity = speed > 2 ? '0.8' : '0.3';
        
        // Scale cursor based on speed
        const scale = Math.min(1 + speed * 0.02, 1.5);
        cursor.style.transform = `scale(${scale})`;
    }

    // Animate cursor trails
    function animateTrails() {
        // Update trail positions with delay
        trailPositions[0].x = mouseX;
        trailPositions[0].y = mouseY;
        
        for (let i = 1; i < trailPositions.length; i++) {
            trailPositions[i].x += (trailPositions[i - 1].x - trailPositions[i].x) * 0.3;
            trailPositions[i].y += (trailPositions[i - 1].y - trailPositions[i].y) * 0.3;
        }
        
        // Apply positions to trail elements
        trails.forEach((trail, index) => {
            const pos = trailPositions[index];
            trail.style.left = pos.x - 4 + 'px';
            trail.style.top = pos.y - 4 + 'px';
            trail.style.opacity = (trails.length - index) / trails.length * 0.6;
        });
        
        requestAnimationFrame(animateTrails);
    }
    
    // Start trail animation
    animateTrails();

    // Hide cursor when leaving the page
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
        cursorArrow.style.opacity = '0';
        trails.forEach(trail => trail.style.opacity = '0');
    });

    // Show cursor when entering the page
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
        cursorArrow.style.opacity = '0.8';
    });

    // Profile image interaction enhancements
    const profileBox = document.querySelector('.profile-image-box');
    
    profileBox.addEventListener('mouseenter', function() {
        cursor.style.background = 'linear-gradient(45deg, #ec4899, #7c3aed)';
        cursor.style.transform = 'scale(1.3)';
    });
    
    profileBox.addEventListener('mouseleave', function() {
        cursor.style.background = 'linear-gradient(45deg, #4285f4, #7c3aed)';
        cursor.style.transform = 'scale(1)';
    });

    // Keyboard navigation support
    profileBox.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Performance optimization: Throttle resize events
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Recalculate positions if needed
        console.log('Window resized - recalculating cursor positions');
    }, 250);
});