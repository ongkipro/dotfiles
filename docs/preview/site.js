document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const yearBadges = document.querySelectorAll('.year-badge');

  // Set current year
  const currentYear = new Date().getFullYear();
  yearBadges.forEach(badge => {
    badge.textContent = currentYear;
  });

  if (menuBtn && mobileNav) {
    const toggleMenu = () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileNav.classList.toggle('is-open');
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Escape key handling
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        toggleMenu();
        menuBtn.focus();
      }
    });

    // Close on navigation (if links are in-page, useful for single page, but good practice here)
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNav.classList.contains('is-open')) {
          toggleMenu();
        }
      });
    });
  }
});
