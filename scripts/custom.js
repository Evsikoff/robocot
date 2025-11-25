(function () {
  const styleId = 'robocot-cleanup-style';
  const logoStyleId = 'robocot-logo-style';
  const logoContainerId = 'robocot-logo-container';

  function injectHidingStyles() {
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      nav._8578b a[href="/kodedager"],
      nav._8578b button._54d8a,
      nav._8578b button._6ba2f,
      ._30648,
      .fe408,
      svg._08ab7,
      svg._08ab7 * {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  function injectLogoStyles() {
    if (document.getElementById(logoStyleId)) return;

    const style = document.createElement('style');
    style.id = logoStyleId;
    style.textContent = `
      #${logoContainerId} {
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        pointer-events: none;
      }

      #${logoContainerId} img {
        display: block;
        max-width: 200px;
        height: auto;
      }

      @media screen and (min-width: 600px) {
        #${logoContainerId} img {
          max-width: 300px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function isInGameMode() {
    // Проверяем наличие canvas - это явный признак игры
    const canvas = document.querySelector('canvas');
    if (!canvas) return false;

    // Убеждаемся, что canvas достаточно большой (игровой)
    const rect = canvas.getBoundingClientRect();
    return rect.width > 100 && rect.height > 100;
  }

  function injectLogo() {
    if (document.getElementById(logoContainerId)) return;

    const logoContainer = document.createElement('div');
    logoContainer.id = logoContainerId;

    const logoImg = document.createElement('img');
    logoImg.src = '/logo.png';
    logoImg.alt = 'Logo';

    logoContainer.appendChild(logoImg);
    document.body.appendChild(logoContainer);
  }

  function updateLogoVisibility() {
    const logoContainer = document.getElementById(logoContainerId);

    if (isInGameMode()) {
      // В режиме игры - скрываем логотип
      if (logoContainer && logoContainer.style.display !== 'none') {
        logoContainer.style.transition = 'opacity 0.5s ease-out';
        logoContainer.style.opacity = '0';
        setTimeout(() => {
          logoContainer.style.display = 'none';
        }, 500);
      }
    } else {
      // На главном экране - показываем логотип
      if (!logoContainer) {
        injectLogo();
      } else if (logoContainer.style.display === 'none') {
        logoContainer.style.display = '';
        logoContainer.style.opacity = '0';
        setTimeout(() => {
          logoContainer.style.transition = 'opacity 0.5s ease-in';
          logoContainer.style.opacity = '1';
        }, 10);
      }
    }
  }

  function setupLogoHiding() {
    // Начальная проверка и установка видимости
    updateLogoVisibility();

    // Отслеживаем изменения в DOM
    const observer = new MutationObserver(function(mutations) {
      updateLogoVisibility();
    });

    // Начинаем наблюдение за изменениями в body
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    injectHidingStyles();
    injectLogoStyles();
    setupLogoHiding();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
