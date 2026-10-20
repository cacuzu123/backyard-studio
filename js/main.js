
﻿// Mobile navigation behavior.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = !menu.classList.contains('hidden');
      menu.classList.toggle('hidden', isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    });

    menu.querySelectorAll('.mobile-menu-link').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
      });
    });
  }
});

// Shared cookie consent behavior.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-cookie-dismiss]').forEach((button) => {
    button.addEventListener('click', () => {
      const banner = document.getElementById('cookie-banner');
      if (banner) banner.style.display = 'none';
    });
  });
});

// Portfolio carousel with autoplay, directional zones, dots, and keyboard support.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-testimonials]').forEach((marquee) => {
    const track = marquee.querySelector('.testimonials-track');
    if (!track) return;

    Array.from(track.children).forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('[data-slide]'));
    const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
    const previousButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    if (!slides.length) return;

    let currentIndex = 0;
    let autoplayId;

    const showSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === currentIndex);
      });
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });
    };

    const startAutoplay = () => {
      window.clearInterval(autoplayId);
      autoplayId = window.setInterval(() => showSlide(currentIndex + 1), 3000);
    };

    const restartAutoplay = () => {
      startAutoplay();
    };

    if (previousButton) {
      previousButton.addEventListener('click', () => {
        showSlide(currentIndex - 1);
        restartAutoplay();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        showSlide(currentIndex + 1);
        restartAutoplay();
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        restartAutoplay();
      });
    });

    carousel.addEventListener('mouseenter', () => window.clearInterval(autoplayId));
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        showSlide(currentIndex - 1);
        restartAutoplay();
      }
      if (event.key === 'ArrowRight') {
        showSlide(currentIndex + 1);
        restartAutoplay();
      }
    });

    showSlide(0);
    startAutoplay();
  });
});
