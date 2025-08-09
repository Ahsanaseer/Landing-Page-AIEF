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
  
  // Set initial transform origin to center for smooth scaling
  gsap.set(heroImage, {
    transformOrigin: "center center",
    scale: 0.5, // Start smaller for more dramatic expansion
    opacity: 1 // Keep full opacity throughout
  });
  
    // Create the main scaling animation - stops when image reaches middle of screen
  // Calculate scale to fit viewport with small margins
  const windowWidth = window.innerWidth;
  const imageWidth = heroImage.offsetWidth;
  const margin = 40; // 20px margin on each side
  const targetScale = (windowWidth - margin) / imageWidth;
 
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



  
  // Refresh ScrollTrigger on window resize for responsive behavior
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
  

  
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