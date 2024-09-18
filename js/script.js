const icon = document.querySelector('.iconn');
const dropdown = document.getElementById('dropdown');

icon.addEventListener('click', () => {
  dropdown.classList.toggle('active');
  icon.classList.toggle('bx-menu-alt-right');
  icon.classList.toggle('bx-x');
});

/* Close dropdown when clicking outside */
window.addEventListener('click', (e) => {
  if (!icon.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('active');
    icon.classList.remove('bx-x');
    icon.classList.add('bx-menu-alt-right');
  }
});

/* Hide dropdown and reset icon when screen gets larger */
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    dropdown.classList.remove('active');
    icon.classList.remove('bx-x');
    icon.classList.add('bx-menu-alt-right');
  }
});
ScrollReveal().reveal('.headline');
ScrollReveal().reveal('.tagline', { delay: 130 });
ScrollReveal().reveal('.punchline', { delay: 2000 });