
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
