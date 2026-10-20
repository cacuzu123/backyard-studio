
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
    '.process-orbit',
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

  const heroStage = document.querySelector('[data-hero-stage]');
  const heroCopy = heroStage?.querySelector('.hero-copy');
  const heroVisual = heroStage?.querySelector('[data-hero-visual]');
  const heroLines = heroStage?.querySelector('[data-hero-lines]');
  let heroFrame;

  if (heroStage && heroLines && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const lineCount = 18;
    heroLines.innerHTML = Array.from({ length: lineCount }, (_, index) => {
      const y = 6 + index * 5.2;
      return `<line x1="0%" y1="${y}%" x2="100%" y2="${y}%" />`;
    }).join('');

    const updateHeroMotion = () => {
      heroFrame = undefined;
      const progress = Math.max(-0.2, Math.min(1, -heroStage.getBoundingClientRect().top / Math.max(heroStage.offsetHeight, 1)));
      if (heroCopy) heroCopy.style.transform = `translate3d(0, ${progress * -32}px, 0)`;
      if (heroVisual) heroVisual.style.transform = `translate3d(0, ${progress * 48}px, 0) rotate(${progress * 2.5}deg)`;
      heroStage.style.setProperty('--hero-progress', progress);
    };

    const requestHeroMotion = () => {
      if (heroFrame) return;
      heroFrame = window.requestAnimationFrame(updateHeroMotion);
    };

    updateHeroMotion();
    window.addEventListener('scroll', requestHeroMotion, { passive: true });
    window.addEventListener('resize', requestHeroMotion);
  }

  const motionSections = Array.from(document.querySelectorAll('body > section:not(#politicas)'));
  let sectionMotionFrame;
  const pageColorField = document.createElement('div');
  pageColorField.className = 'page-scroll-color-field';
  pageColorField.setAttribute('aria-hidden', 'true');
  document.body.prepend(pageColorField);
  const pageColorStops = ['#3e57ad', '#171a22', '#c7b1fa', '#ffffff', '#f28c28', '#b8e52f', '#b65a9d', '#3e57ad', '#ffdf27'];

  motionSections.forEach((section, index) => {
    section.setAttribute('data-motion-section', '');
    section.style.setProperty('--section-delay', `${(index % 3) * 90}ms`);
  });

  const mixHexColors = (from, to, progress) => {
    const start = from.replace('#', '');
    const end = to.replace('#', '');
    const channel = (offset) => {
      const startValue = Number.parseInt(start.slice(offset, offset + 2), 16);
      const endValue = Number.parseInt(end.slice(offset, offset + 2), 16);
      return Math.round(startValue + (endValue - startValue) * progress);
    };
    return `rgb(${channel(0)}, ${channel(2)}, ${channel(4)})`;
  };

  const updateSectionMotion = () => {
    sectionMotionFrame = undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pageColorField.style.backgroundColor = pageColorStops[0];
      return;
    }

    const viewportCenter = window.innerHeight * 0.52;
    const sectionCenters = motionSections.map((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
    const scrollPosition = viewportCenter;
    let colorProgress = 0;
    if (sectionCenters.length > 1) {
      let colorIndex = sectionCenters.findIndex((center) => center >= scrollPosition);
      if (colorIndex < 0) colorIndex = sectionCenters.length - 1;
      if (colorIndex > 0) {
        const previousCenter = sectionCenters[colorIndex - 1];
        const nextCenter = sectionCenters[colorIndex];
        const localProgress = Math.max(0, Math.min(1, (scrollPosition - previousCenter) / Math.max(nextCenter - previousCenter, 1)));
        colorProgress = colorIndex - 1 + localProgress;
      }
    }
    const colorIndex = Math.min(Math.floor(colorProgress), pageColorStops.length - 2);
    const colorMix = colorProgress - colorIndex;
    pageColorField.style.backgroundColor = mixHexColors(pageColorStops[colorIndex], pageColorStops[colorIndex + 1], colorMix);

    motionSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distance = (sectionCenter - viewportCenter) / Math.max(window.innerHeight, 1);
      const progress = Math.max(-1, Math.min(1, distance));
      section.style.setProperty('--section-progress', progress.toFixed(3));
    });
  };

  const requestSectionMotion = () => {
    if (sectionMotionFrame) return;
    sectionMotionFrame = window.requestAnimationFrame(updateSectionMotion);
  };

  updateSectionMotion();
  window.addEventListener('scroll', requestSectionMotion, { passive: true });
  window.addEventListener('resize', requestSectionMotion);

  const processSection = document.getElementById('metodo');
  const processOrbit = processSection?.querySelector('[data-process-orbit]');
  const processLines = processOrbit?.querySelector('[data-process-lines]');
  const processNode = processOrbit?.querySelector('[data-process-node]');
  const processNumber = processOrbit?.querySelector('[data-process-number]');
  const processNextNumber = processOrbit?.querySelector('[data-process-next-number]');
  const processIcon = processOrbit?.querySelector('[data-process-icon]');
  const processNextIcon = processOrbit?.querySelector('[data-process-next-icon]');
  const processNodeLabel = processOrbit?.querySelector('[data-process-node-label]');
  const processNextLabel = processOrbit?.querySelector('[data-process-next-label]');
  const processData = [
    { name: 'Escuchamos', icon: 'lightbulb', color: '#b8e52f' },
    { name: 'Diseñamos', icon: 'palette', color: '#c7b1fa' },
    { name: 'Producimos', icon: 'movie', color: '#f28c28' },
    { name: 'Activamos', icon: 'rocket_launch', color: '#b65a9d' }
  ];
  const processPositions = [[18, 27], [81, 20], [68, 76], [27, 69]];
  let processAnimationFrame;
  let processAnimationStart;

  const hexToRgb = (hex) => {
    const value = hex.replace('#', '');
    return {
      r: Number.parseInt(value.slice(0, 2), 16),
      g: Number.parseInt(value.slice(2, 4), 16),
      b: Number.parseInt(value.slice(4, 6), 16)
    };
  };

  const mixColors = (from, to, progress) => {
    const start = hexToRgb(from);
    const end = hexToRgb(to);
    const channel = (key) => Math.round(start[key] + (end[key] - start[key]) * progress);
    return `rgb(${channel('r')}, ${channel('g')}, ${channel('b')})`;
  };

  const createOrbitLines = () => {
    if (!processLines) return;
    const anchors = [];
    for (let y = 8; y <= 92; y += 12) {
      anchors.push([2, y], [98, y]);
    }
    for (let x = 14; x <= 86; x += 12) {
      anchors.push([x, 2], [x, 98]);
    }
    processLines.innerHTML = anchors.map(([x, y], index) =>
      `<line data-orbit-line="${index}" x1="${x}%" y1="${y}%" x2="${x}%" y2="${y}%" />`
    ).join('');
  };

  const updateOrbit = (timestamp) => {
    if (!processOrbit || !processNode) return;
    if (!processAnimationStart) processAnimationStart = timestamp;
    const elapsed = timestamp - processAnimationStart;
    const segmentDuration = 3800;
    const moveDuration = 1800;
    const cycleDuration = segmentDuration * processPositions.length;
    const segmentTime = elapsed % cycleDuration;
    const index = Math.floor(segmentTime / segmentDuration) % processPositions.length;
    const nextIndex = (index + 1) % processPositions.length;
    const segmentProgress = segmentTime % segmentDuration;
    const localProgress = Math.min(
      1,
      Math.max(0, (segmentProgress - (segmentDuration - moveDuration)) / moveDuration)
    );
    const eased = 1 - Math.pow(1 - localProgress, 3);
    const x = processPositions[index][0] + (processPositions[nextIndex][0] - processPositions[index][0]) * eased;
    const y = processPositions[index][1] + (processPositions[nextIndex][1] - processPositions[index][1]) * eased;
    const current = processData[index];
    const next = processData[nextIndex];
    const animatedColor = mixColors(current.color, next.color, eased);
    const iconProgress = Math.min(1, localProgress * 9);

    processNode.style.left = `${x}%`;
    processNode.style.top = `${y}%`;
    processNode.style.backgroundColor = animatedColor;
    processNumber.textContent = `0${index + 1}`;
    processNextNumber.textContent = `0${nextIndex + 1}`;
    processIcon.textContent = current.icon;
    processNextIcon.textContent = next.icon;
    processNode.style.setProperty('--icon-progress', iconProgress);
    processNode.style.setProperty('--number-progress', iconProgress);
    processNodeLabel.textContent = current.name;
    processNextLabel.textContent = next.name;
    processNode.style.setProperty('--label-progress', iconProgress);

    processLines.querySelectorAll('line').forEach((line) => {
      const x1 = Number.parseFloat(line.getAttribute('x1'));
      const y1 = Number.parseFloat(line.getAttribute('y1'));
      line.setAttribute('x2', `${x}%`);
      line.setAttribute('y2', `${y}%`);
      line.style.stroke = animatedColor;
      const distance = Math.hypot(x - x1, y - y1);
      const distanceProgress = Math.min(1, distance / 105);
      const lineOpacity = 0.62 - distanceProgress * 0.5;
      line.style.opacity = lineOpacity.toFixed(3);
    });

    processAnimationFrame = window.requestAnimationFrame(updateOrbit);
  };

  if (processOrbit && processLines) {
    createOrbitLines();
    window.addEventListener('resize', () => {
      window.cancelAnimationFrame(processAnimationFrame);
      processAnimationStart = performance.now();
      processAnimationFrame = window.requestAnimationFrame(updateOrbit);
    });
    processAnimationFrame = window.requestAnimationFrame(updateOrbit);
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
