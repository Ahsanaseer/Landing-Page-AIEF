// Wait for GSAP and ScrollTrigger to load
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Target the AI Showdown hero image section
  const cardSection = document.querySelector('section[style*="will-change: transform"]');
  const heroImage = cardSection.querySelector('img[src*="AI showdown hero image"]');
  
  if (!heroImage || !cardSection) {
    console.warn('Hero image element not found');
    return;
  }
  
  // Detect if device is mobile
  const isMobile = window.innerWidth <= 768;
  
  // Set initial transform origin to center for smooth scaling (both mobile and desktop)
  gsap.set(heroImage, {
    transformOrigin: "center center",
    scale: isMobile ? 0.1 : 0.2, // Much more squeezed initial scale for more dramatic effect
    opacity: 1 // Keep full opacity throughout
  });
  
  // Calculate scale to fit viewport with margins
  const windowWidth = window.innerWidth;
  const imageWidth = heroImage.offsetWidth;
  const margin = isMobile ? 40 : 40; // 20px margin on each side
  const targetScale = isMobile ? 1.15 : Math.min((windowWidth - margin) / imageWidth, 1.5); // Force mobile to 2.0, desktop uses viewport calculation
  
  if (isMobile) {
    // MOBILE BEHAVIOR: Position card down a bit, same animation as desktop
    
    // Calculate negative margin to pull the card up into the viewport
    const cardHeight = cardSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    const navHeight = 80; // Fixed nav height
    
    // Show more of the card initially for better visibility on page load
    const visiblePortion = 0.1; // Increased to show more of the card (25% visible)
    const hiddenPortion = 1 - visiblePortion;
    const pullUpAmount = cardHeight * hiddenPortion;
    
    // Apply negative margin to pull card into viewport
    gsap.set(cardSection, {
      marginTop: `-${pullUpAmount}px`
    });
    
    // Use EXACTLY the same animation logic as desktop
    gsap.to(heroImage, {
      scale: targetScale,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: cardSection,
        start: "top bottom", // Exact same as desktop
        end: "center center", // Exact same as desktop  
        scrub: 0.5, // Same as desktop (was 0.3, now matching desktop exactly)
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        preventOverlaps: true
      }
    });
    
  } else {
    // DESKTOP BEHAVIOR: Keep existing animation unchanged
    
    gsap.to(heroImage, {
      scale: targetScale,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: cardSection,
        start: "top bottom",
        end: "center center",
        scrub: 0.5,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        preventOverlaps: true
      }
    });
  }
  
  // Refresh ScrollTrigger on window resize for responsive behavior
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth <= 768;
    
    if (newIsMobile) {
      // Recalculate positioning for mobile
      const newCardHeight = cardSection.offsetHeight;
      const newVisiblePortion = 0.1; // Updated to match the user's change
      const newHiddenPortion = 1 - newVisiblePortion;
      const newPullUpAmount = newCardHeight * newHiddenPortion;
      
      gsap.set(cardSection, { marginTop: `-${newPullUpAmount}px` });
      gsap.set(heroImage, { scale: 0.1 }); // Reset to mobile initial scale (much more squeezed)
    } else {
      // Reset for desktop
      gsap.set(cardSection, { marginTop: "0px" });
      gsap.set(heroImage, { scale: 0.2 }); // Reset to desktop initial scale (more squeezed)
    }
    
    ScrollTrigger.refresh();
  });
  
  // Force refresh ScrollTrigger to apply changes immediately
  ScrollTrigger.refresh();
  
  // Initialize video player
  initializeVideoPlayer();
  
});

// Performance optimization: Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.set('*', {clearProps: 'all'});
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}

// Video Player Functionality
function initializeVideoPlayer() {
  const video = document.getElementById('backgroundVideo');
  const videoSection = document.getElementById('videoSection');
  const videoTimer = document.getElementById('videoTimer');
  const fallbackBg = document.querySelector('.fallback-bg');
  
  if (!video || !videoSection || !videoTimer) {
    console.warn('Video elements not found');
    return;
  }
  
  let timerInterval;
  let isVideoLoaded = false;
  
  // Format time in MM:SS format
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Update timer display
  function updateTimer() {
    if (video.duration && isFinite(video.duration)) {
      const currentTime = video.currentTime;
      const totalTime = video.duration;
      videoTimer.textContent = `${formatTime(currentTime)} / ${formatTime(totalTime)}`;
    }
  }
  
  // Start timer updates
  function startTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    timerInterval = setInterval(updateTimer, 1000);
  }
  
  // Stop timer updates
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
  
  // Handle video load
  video.addEventListener('loadedmetadata', function() {
    isVideoLoaded = true;
    updateTimer();
    // Hide fallback background
    if (fallbackBg) {
      fallbackBg.style.display = 'none';
    }
  });
  
  // Handle video error
  video.addEventListener('error', function() {
    console.warn('Video failed to load, showing fallback background');
    if (fallbackBg) {
      fallbackBg.style.display = 'block';
    }
    videoTimer.style.display = 'none';
  });
  
  // Intersection Observer for play/pause behavior
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Video is 50% visible, start playing
        if (isVideoLoaded) {
          video.play().then(() => {
            startTimer();
          }).catch(error => {
            console.warn('Video autoplay failed:', error);
          });
        }
      } else {
        // Video is out of view, pause and reset
        video.pause();
        video.currentTime = 0;
        stopTimer();
        updateTimer(); // Update to show 0:00
      }
    });
  }, {
    threshold: 0.5, // Trigger when 50% visible
    rootMargin: '0px'
  });
  
  // Observe the video section
  observer.observe(videoSection);
  
  // Handle video time updates for smoother timer updates
  video.addEventListener('timeupdate', function() {
    if (timerInterval) {
      updateTimer();
    }
  });
  
  // Clean up on page unload
  window.addEventListener('beforeunload', function() {
    stopTimer();
    observer.disconnect();
  });
}

// FAQ Accordion Functionality
function toggleFAQ(headerElement) {
  const faqItem = headerElement.closest('.faq-item');
  const content = faqItem.querySelector('.faq-content');
  const icon = faqItem.querySelector('.faq-icon');
  
  // Toggle the content visibility with smooth animation
  if (content.style.display === 'none' || content.style.display === '') {
    // Show content with smooth animation
    content.style.display = 'block';
    content.style.opacity = '0';
    content.style.maxHeight = '0';
    content.style.overflow = 'hidden';
    
    // Animate the content opening
    setTimeout(() => {
      content.style.transition = 'all 0.3s ease-in-out';
      content.style.opacity = '1';
      content.style.maxHeight = content.scrollHeight + 'px';
    }, 10);
    
    // Animate the icon
    icon.style.transition = 'transform 0.3s ease-in-out';
    icon.classList.remove('fa-chevron-right');
    icon.classList.add('fa-chevron-down');
    icon.style.transform = 'rotate(0deg)';
    
  } else {
    // Hide content with smooth animation
    content.style.transition = 'all 0.3s ease-in-out';
    content.style.opacity = '0';
    content.style.maxHeight = '0';
    
    // Animate the icon
    icon.style.transition = 'transform 0.3s ease-in-out';
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-right');
    icon.style.transform = 'rotate(0deg)';
    
    // Hide the content after animation
    setTimeout(() => {
      content.style.display = 'none';
    }, 300);
  }
}