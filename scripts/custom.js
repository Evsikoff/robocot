--- START OF FILE custom.js ---

(function () {
  const styleId = 'robocot-cleanup-style';

  // 1. Стили для скрытия лишних элементов (как было в оригинале)
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

  // 2. Основная логика: Замена SVG робота на logo.png
  // Работает на всех устройствах. Сохраняет класс для анимации и позиции.
  function setupLogoReplacement() {
    const replaceLogo = () => {
      // Ищем оригинальный SVG элемент с классом _0af90
      const svgLogo = document.querySelector('svg._0af90');
      
      // Если не нашли или уже заменили - выходим
      if (!svgLogo || svgLogo.dataset.robocotLogoReplaced === 'true') return;

      const img = document.createElement('img');
      // Используем относительный путь, как и требовалось
      img.src = 'logo.png';
      img.alt = 'Logo';
      
      // Метка, чтобы скрипт не пытался заменить этот элемент снова
      img.dataset.robocotLogoReplaced = 'true';

      // ВАЖНО: Копируем оригинальный класс (_0af90).
      // Это сохраняет позиционирование (bottom/right), размеры и CSS-анимацию плавания.
      img.className = svgLogo.getAttribute('class') || '';

      // Если у SVG были явно заданы размеры в атрибутах, переносим их в стили
      if (svgLogo.getAttribute('width')) {
        const width = svgLogo.getAttribute('width');
        img.style.width = width.endsWith('px') ? width : `${width}px`;
      }

      if (svgLogo.getAttribute('height')) {
        const height = svgLogo.getAttribute('height');
        img.style.height = height.endsWith('px') ? height : `${height}px`;
      }

      // Заменяем SVG на PNG
      svgLogo.replaceWith(img);
    };

    // Наблюдатель следит за изменениями на странице.
    // Как только React отрисует стартовый экран, робот будет мгновенно заменен на логотип.
    const observer = new MutationObserver(replaceLogo);
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Пробуем заменить сразу при инициализации, если элемент уже есть
    replaceLogo();
  }

  // 3. Скрытие кнопок в меню уровней (как было в оригинале)
  function hideAddBoardButton(root = document) {
    const button = Array.from(root.querySelectorAll('button, a')).find(
      (el) => el.textContent.trim() === 'Legg til brett'
    );

    if (button) {
      button.style.display = 'none';
      button.dataset.robocotHidden = 'true';
    }
  }

  function hideCodeInput(root = document) {
    const input = root.querySelector('input[name="codeInput"]');

    if (input) {
      input.style.display = 'none';
      input.dataset.robocotHidden = 'true';
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
      hideCodeInput();
      clearCodePlaceholder();
    };

    const observer = new MutationObserver(applyTweaks);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    applyTweaks();
  }

  // 4. Инициализация
  function init() {
    injectHidingStyles();       // Скрываем лишние элементы интерфейса
    setupLevelSelectionTweaks(); // Убираем поля ввода кодов
    setupLogoReplacement();      // Заменяем робота на логотип (ВЕЗДЕ)
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
