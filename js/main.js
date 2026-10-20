
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
  const revealTargets = [
    'body > section',
    '.problem-card',
    '.services-grid > div',
    '.creative-value-intro',
    '.creative-value-card',
    '.method-steps > div',
    '.trust-card',
    '[data-contact-form]'
  ];
  const revealElements = document.querySelectorAll(revealTargets.join(', '));

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach((element, index) => {
      element.classList.add('reveal-on-scroll');
      element.style.setProperty('--reveal-delay', `${(index % 4) * 80}ms`);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const service = String(data.get('service') || 'Conversación sobre un proyecto').trim();
      const status = form.parentElement.querySelector('[data-form-status]');
      const formType = form.getAttribute('data-form-type') === 'quote'
        ? 'Quiero solicitar una propuesta'
        : 'Quiero conversar sobre una idea';
      const message = `${formType}.\n\nNombre: ${name}\nCorreo: ${email}\nServicio: ${service}`;
      const whatsappUrl = `https://wa.me/51938153422?${new URLSearchParams({ text: message })}`;

      if (status) {
        status.textContent = 'Abriendo WhatsApp para continuar la conversación...';
        status.classList.remove('text-red-600');
        status.classList.add('text-green-700');
      }
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  });

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
