// Wait for GSAP and ScrollTrigger to load
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Target the AI Showdown card section
  const cardSection = document.querySelector('section[style*="will-change: transform"]');
  const card = cardSection.querySelector('.relative.bg-gradient-to-b');
  
  if (!card || !cardSection) {
    console.warn('Card element not found');
    return;
  }
  
  // Set initial transform origin to center for smooth scaling
  gsap.set(card, {
    transformOrigin: "center center",
    scale: 0.7, // Start slightly larger for better initial visibility
    opacity: 1 // Keep full opacity throughout
  });
  
  // Create the main scaling animation - stops when card reaches middle of screen
  gsap.to(card, {
    scale: 1.15, // Scale up to moderate size (115% instead of 140%) to keep background text visible
    duration: 1, // Duration doesn't matter much with ScrollTrigger
    ease: "power2.out", // Smooth easing for more refined animation
    scrollTrigger: {
      trigger: cardSection,
      start: "top bottom", // Start when top of section hits bottom of viewport
      end: "center center", // Stop when center of section reaches center of viewport (middle of screen)
      scrub: 1.5, // Increased smooth scrubbing for even smoother animation
      invalidateOnRefresh: true, // Recalculate on window resize
      
      // Optional: Add markers for debugging (remove in production)
      // markers: true,
      
      // Ensure smooth performance
      fastScrollEnd: true,
      preventOverlaps: true
    }
  });
  
  // Additional smooth entrance animation for other elements
  const cardContent = card.querySelector('.relative.z-20');
  if (cardContent) {
    gsap.fromTo(cardContent, 
      {
        y: 30,
        opacity: 0.9
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out", // Smoother easing
        scrollTrigger: {
          trigger: cardSection,
          start: "top 80%",
          end: "center center",
          scrub: 1.2, // Slightly smoother scrubbing
          invalidateOnRefresh: true
        }
      }
    );
  }
  
  // Smooth scaling for the robot image - keep it aligned with card center
  const robotImg = card.querySelector('img[src="PICS/robot.svg"]');
  if (robotImg) {
    // Keep original positioning from HTML, just add transform origin for smooth scaling
    gsap.set(robotImg, {
      transformOrigin: "center center",
      rotation: 0 // Set initial rotation to make base straight
    });
    
    // Optional: Set custom alignment via JavaScript
    // gsap.set(robotImg, {
    //   position: "absolute",
    //   top: "20%",    // Adjust vertical position (0% = top, 50% = center, 100% = bottom)
    //   left: "30%",   // Adjust horizontal position (0% = left, 50% = center, 100% = right)
    //   transformOrigin: "center center"
    // });
    
    gsap.to(robotImg, {
      scale: 1.05, // Reduced scale to match the more moderate card scaling
      rotation: 0, // Start from 90 and add 3 degrees during animation
      duration: 1,
      ease: "power2.out", // Smoother easing
      scrollTrigger: {
        trigger: cardSection,
        start: "top bottom",
        end: "center center", // Match the main card animation end point
        scrub: 1.8, // Even smoother scrubbing for the robot
        invalidateOnRefresh: true
      }
    });
  }
  
  // Move "Level Up for Pakistan's Biggest" text up
  const topText = card.querySelector('.text-center.mb-8 h3');
  if (topText) {
    gsap.set(topText, {
      y: -30 // Move it up by 30px
    });
  }
  
  // Parallax effect for the green glow - also stop at middle of screen
  const greenGlow = card.querySelector('.absolute.top-0.left-0');
  if (greenGlow) {
    gsap.to(greenGlow, {
      x: 80, // Reduced movement to match moderate scaling
      y: -40, // Reduced movement to match moderate scaling
      scale: 1.3, // Reduced scale to match moderate card scaling
      duration: 1,
      ease: "power2.out", // Smoother easing
      scrollTrigger: {
        trigger: cardSection,
        start: "top bottom",
        end: "center center", // Match the main card animation end point
        scrub: 2.2, // Even smoother scrubbing for the glow effect
        invalidateOnRefresh: true
      }
    });
  }
  
  // Refresh ScrollTrigger on window resize for responsive behavior
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
  
  // Optional: Add smooth scrolling behavior to the page
  gsap.registerPlugin(ScrollToPlugin);
  
  // Smooth scroll for sign up button
  const signUpButton = document.querySelector('button[class*="bg-white"]');
  if (signUpButton) {
    signUpButton.addEventListener('click', (e) => {
      e.preventDefault();
      gsap.to(window, {
        duration: 1.5,
        scrollTo: cardSection,
        ease: "power2.inOut"
      });
    });
  }
  
});

// Performance optimization: Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.set('*', {clearProps: 'all'});
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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