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

  function injectLogo() {
    if (document.getElementById(logoContainerId)) return;

    const logoContainer = document.createElement('div');
    logoContainer.id = logoContainerId;
    logoContainer.style.display = 'none';
    logoContainer.style.opacity = '0';

    const logoImg = document.createElement('img');
    logoImg.src = '/logo.png';
    logoImg.alt = 'Logo';

    logoContainer.appendChild(logoImg);
    document.body.appendChild(logoContainer);
  }

  function setupLogoHiding() {
    const logoContainer = document.getElementById(logoContainerId);
    if (!logoContainer) return;

    let isVisible = false;

    const hideLogo = () => {
      if (!isVisible) return;

      isVisible = false;
      logoContainer.style.transition = 'opacity 0.5s ease-out';
      logoContainer.style.opacity = '0';
      setTimeout(() => {
        if (!isVisible) {
          logoContainer.style.display = 'none';
        }
      }, 500);
    };

    const showLogo = () => {
      if (isVisible) return;

      isVisible = true;
      logoContainer.style.display = 'block';
      requestAnimationFrame(() => {
        logoContainer.style.transition = 'opacity 0.3s ease-in';
        logoContainer.style.opacity = '1';
      });
    };

    const startScreenVisible = () => Boolean(document.querySelector('div._541cc'));

    const syncLogo = () => {
      if (startScreenVisible()) {
        showLogo();
      } else {
        hideLogo();
      }
    };

    const observer = new MutationObserver(syncLogo);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    syncLogo();
  }

  function hideAddBoardButton(root = document) {
    const button = Array.from(root.querySelectorAll('button, a')).find(
      (el) => el.textContent.trim() === 'Legg til brett'
    );

    if (button) {
      button.style.display = 'none';
      button.dataset.robocotHidden = 'true';
    }
  }

  function clearCodePlaceholder(root = document) {
    const input = root.querySelector('input[placeholder="Kode f.eks 6AXP"]');

    if (input) {
      input.placeholder = '';
      input.dataset.robocotPlaceholderCleared = 'true';
    }
  }

  function setupLevelSelectionTweaks() {
    const applyTweaks = () => {
      hideAddBoardButton();
      clearCodePlaceholder();
    };

    const observer = new MutationObserver(applyTweaks);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    applyTweaks();
  }

  function init() {
    injectHidingStyles();
    injectLogoStyles();
    injectLogo();
    setupLogoHiding();
    setupLevelSelectionTweaks();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
