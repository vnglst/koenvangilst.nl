// Dark mode toggle functionality
(function() {
  const themeToggle = document.getElementById('theme-toggle');

  if (!themeToggle) return;

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  }

  themeToggle.addEventListener('click', toggleTheme);
})();
