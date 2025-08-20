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
  const targetScale = isMobile ? 1.15 : Math.min((windowWidth - margin) / imageWidth, 2.2); // Increased max scale for more dramatic effect
  
  if (isMobile) {
    // MOBILE BEHAVIOR: Position card down a bit, same animation as desktop
    
    // Calculate negative margin to pull the card up into the viewport
    const cardHeight = cardSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    const navHeight = 80; // Fixed nav height
    
    // Show only 1/3 of the card initially, hide 2/3 below viewport
    const visiblePortion = 0.33; // Show only 1/3 of the card
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
      const newVisiblePortion = 0.33; // Show only 1/3 of the card
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
  // Initialize registration section video player
  initializeRegistrationVideoPlayer();
  
  // Initialize FAQ accordion scroll behavior
  initializeFAQScroll();
  
});

// Performance optimization: Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.set('*', {clearProps: 'all'});
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}

// Registration Video Player Functionality (mirrors initializeVideoPlayer for the registration section)
function initializeRegistrationVideoPlayer() {
  const video = document.getElementById('registrationVideo');
  const videoSection = document.getElementById('registrationVideoSection');
  const videoTimer = document.getElementById('registrationVideoTimer');
  const fallbackBg = document.querySelector('.registration-fallback-bg');

  if (!video || !videoSection || !videoTimer) {
    return;
  }

  let timerInterval;
  let isVideoLoaded = false;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    let secsString = secs.toString();
    if (secsString.length < 2) {
      secsString = '0' + secsString;
    }
    return mins + ':' + secsString;
  }

  function updateTimer() {
    if (video.duration && isFinite(video.duration)) {
      const currentTime = video.currentTime;
      const totalTime = video.duration;
      videoTimer.textContent = formatTime(currentTime) + ' / ' + formatTime(totalTime);
    }
  }

  function startTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  video.addEventListener('loadedmetadata', function() {
    isVideoLoaded = true;
    updateTimer();
    if (fallbackBg) {
      fallbackBg.style.display = 'none';
    }
  });

  video.addEventListener('error', function() {
    if (fallbackBg) {
      fallbackBg.style.display = 'block';
    }
    videoTimer.style.display = 'none';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        if (isVideoLoaded) {
          video.play().then(function() {
            startTimer();
          }).catch(function() {});
        }
      } else {
        video.pause();
        video.currentTime = 0;
        stopTimer();
        updateTimer();
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px'
  });

  observer.observe(videoSection);

  video.addEventListener('timeupdate', function() {
    if (timerInterval) {
      updateTimer();
    }
  });

  window.addEventListener('beforeunload', function() {
    stopTimer();
    observer.disconnect();
  });
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

// FAQ Scroll Behavior Initialization
function initializeFAQScroll() {
  const faqAccordion = document.getElementById('faq-accordion');
  const faqSection = document.querySelector('.bg-gray-100.py-12.md\\:py-16.relative.z-40.px-5.md\\:px-\\[100px\\]');
  
  if (!faqAccordion || !faqSection) {
    console.warn('FAQ elements not found');
    return;
  }
  
  // Set initial height to 1/3 of viewport height
  // const initialHeight = window.innerHeight * 0.33;
  // faqAccordion.style.maxHeight = initialHeight + 'px';
  
  // Create scroll trigger for FAQ section
  ScrollTrigger.create({
    trigger: faqSection,
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      // Calculate progress (0 to 1)
      const progress = self.progress;
      
      // Calculate target height: from 1/3 viewport to full height
      const minHeight = window.innerHeight * 0.33;
      const maxHeight = 100; // 900px to show 5 questions
      const targetHeight = minHeight + (progress * (maxHeight - minHeight));
      
      // Apply smooth height transition
      // faqAccordion.style.transition = 'max-height 0.3s ease-out';
      // faqAccordion.style.maxHeight = targetHeight + 'px';
    },
    onEnter: () => {
      // When section enters viewport, start expanding
      // faqAccordion.style.transition = 'max-height 0.5s ease-out';
    },
    onLeave: () => {
      // When section leaves viewport, contract back to 1/3
      // faqAccordion.style.transition = 'max-height 0.3s ease-out';
      // faqAccordion.style.maxHeight = (window.innerHeight * 0.33) + 'px';
    },
    onEnterBack: () => {
      // When scrolling back up, expand again
      // faqAccordion.style.transition = 'max-height 0.5s ease-out';
    },
    onLeaveBack: () => {
      // When scrolling back up and leaving, contract
      // faqAccordion.style.transition = 'max-height 0.3s ease-out';
      // faqAccordion.style.maxHeight = (window.innerHeight * 0.33) + 'px';
    }
  });
  
  // Handle window resize
  // window.addEventListener('resize', () => {
  //   const newInitialHeight = window.innerHeight * 0.33;
  //   if (faqAccordion.style.maxHeight === (window.innerHeight * 0.33) + 'px') {
  //     faqAccordion.style.maxHeight = newInitialHeight + 'px';
  //   }
  // });
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
    content.style.transform = 'scaleY(0.8)';
    content.style.transformOrigin = 'top';
    
    // Animate the content opening
    setTimeout(() => {
      content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      content.style.opacity = '1';
      content.style.maxHeight = content.scrollHeight + 'px';
      content.style.transform = 'scaleY(1)';
    }, 10);
    
    // Animate the icon
    icon.style.transition = 'transform 0.3s ease-in-out';
    icon.classList.remove('fa-chevron-right');
    icon.classList.add('fa-chevron-down');
    icon.style.transform = 'rotate(0deg)';
    
  } else {
    // Hide content with smooth animation
    content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    content.style.opacity = '0';
    content.style.maxHeight = '0';
    content.style.transform = 'scaleY(0.8)';
    
    // Animate the icon
    icon.style.transition = 'transform 0.3s ease-in-out';
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-right');
    icon.style.transform = 'rotate(0deg)';
    
    // Hide the content after animation
    setTimeout(() => {
      content.style.display = 'none';
      content.style.transform = 'scaleY(1)';
    }, 400);
  }
}


function addHoverEffects() {
  const elements = document.querySelectorAll('[style*="background: linear-gradient(to top right, #166534 0%, #292F6F 60%, #292F6F 100%)"]');
  
  elements.forEach(element => {
    // Add transition and cursor
    element.style.transition = 'all 0.3s ease';
    element.style.cursor = 'pointer';
    
    // Add hover event listeners
    element.addEventListener('mouseenter', function() {
      if (this.tagName === 'BUTTON') {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 20px -5px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.1)';
        this.style.filter = 'brightness(0.85)';
      } else if (this.tagName === 'FOOTER') {
        this.style.filter = 'brightness(0.98)';
      }
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
      this.style.filter = '';
    });
  });
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', addHoverEffects);


let currentActiveStep = 0;
const totalSteps = 5;

function updateTimeline(activeStep) {
    const progressLine = document.getElementById('progressLine');
    
    // Calculate progress percentage based on active step
    let progressPercent = 0;
    if (activeStep > 0) {
        // Progress to the current active step
        progressPercent = (activeStep / totalSteps) * 100;
    }
    
    progressLine.style.height = progressPercent + '%';
    
    // Update dots and steps
    for (let i = 1; i <= totalSteps; i++) {
        const dot = document.getElementById(`dot${i}`);
        const step = document.getElementById(`step${i}`);
        
        if (i < activeStep) {
            // Completed steps
            dot.classList.remove('active');
            dot.classList.add('completed');
            step.classList.remove('active');
        } else if (i === activeStep) {
            // Current active step
            dot.classList.remove('completed');
            dot.classList.add('active');
            step.classList.add('active');
        } else {
            // Future steps
            dot.classList.remove('active', 'completed');
            step.classList.remove('active');
        }
    }
    
    currentActiveStep = activeStep;
}

function isElementCentered(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const screenCenter = windowHeight / 2;
    
    // Element is considered "centered" when its center is within 20% of screen center
    const threshold = windowHeight * 0.2;
    return Math.abs(elementCenter - screenCenter) < threshold;
}

function handleScroll() {
    let newActiveStep = 0;
    
    // Check each step to see which one is currently centered
    for (let i = 1; i <= totalSteps; i++) {
        const stepElement = document.getElementById(`step${i}`);
        if (isElementCentered(stepElement)) {
            newActiveStep = i;
            break;
        }
    }
    
    // If no step is perfectly centered, find the closest one that's visible
    if (newActiveStep === 0) {
        const timelineContainer = document.getElementById('timelineContainer');
        const containerRect = timelineContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // If timeline is visible
        if (containerRect.top < windowHeight && containerRect.bottom > 0) {
            for (let i = 1; i <= totalSteps; i++) {
                const stepElement = document.getElementById(`step${i}`);
                const stepRect = stepElement.getBoundingClientRect();
                
                // If step is visible and above center, it should be active
                if (stepRect.top < windowHeight / 2 && stepRect.bottom > 0) {
                    newActiveStep = i;
                }
            }
        }
    }
    
    // Only update if the active step has changed
    if (newActiveStep !== currentActiveStep) {
        updateTimeline(newActiveStep);
    }
}

// Initialize timeline
updateTimeline(0);

// Add scroll event listener with throttling for better performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Handle initial state on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(handleScroll, 100); // Small delay to ensure proper layout
});