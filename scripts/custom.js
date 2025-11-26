--- START OF FILE custom.js ---

(function () {
  const styleId = 'robocot-cleanup-style';

  // 1. Стили
  function injectStyles() {
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* ВАЖНО: Скрываем оригинальный SVG робота, но оставляем его в DOM для React */
      svg._0af90 {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      /* Стили для скрытия лишних элементов меню (как было ранее) */
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

  // 2. Логика замены логотипа
  function ensureLogo() {
    // Ищем оригинальный SVG элемент (даже если он скрыт стилями)
    const svgLogo = document.querySelector('svg._0af90');
    
    // Если мы не на стартовом экране (элемента нет), ничего не делаем
    if (!svgLogo) return;

    const parent = svgLogo.parentNode;
    if (!parent) return;

    // Проверяем, есть ли уже наша картинка-заменитель рядом
    let imgLogo = parent.querySelector('img.robocot-logo-replacement');

    // Если картинки нет, создаем и добавляем её
    if (!imgLogo) {
      imgLogo = document.createElement('img');
      imgLogo.src = 'logo.png';
      imgLogo.alt = 'Logo';
      
      // ПРИСВАИВАЕМ ОРИГИНАЛЬНЫЙ КЛАСС _0af90
      // Это автоматически применяет к картинке:
      // 1. Позицию (bottom/right)
      // 2. Размеры
      // 3. Анимацию плавания (animation: _356f0)
      imgLogo.className = '_0af90 robocot-logo-replacement'; 
      
      // Добавляем картинку к родителю SVG
      parent.appendChild(imgLogo);
    }
  }

  // Используем requestAnimationFrame для непрерывной проверки.
  // Это гарантирует, что логотип останется на месте даже если React перерисует страницу.
  function loop() {
    ensureLogo();
    requestAnimationFrame(loop);
  }

  // 3. Скрытие кнопок в меню уровней (как было ранее)
  function hideAddBoardButton() {
    const button = Array.from(document.querySelectorAll('button, a')).find(
      (el) => el.textContent.trim() === 'Legg til brett'
    );
    if (button) {
      button.style.display = 'none';
      button.dataset.robocotHidden = 'true';
    }
  }

  function hideCodeInput() {
    const input = document.querySelector('input[name="codeInput"]');
    if (input) {
      input.style.display = 'none';
      input.dataset.robocotHidden = 'true';
    }
  }

  function clearCodePlaceholder() {
    const input = document.querySelector('input[placeholder="Kode f.eks 6AXP"]');
    if (input) {
      input.placeholder = '';
      input.dataset.robocotPlaceholderCleared = 'true';
    }
  }

  function setupLevelSelectionTweaks() {
    // Используем Observer для элементов меню, так как они менее динамичны
    const observer = new MutationObserver(() => {
      hideAddBoardButton();
      hideCodeInput();
      clearCodePlaceholder();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Первый запуск
    hideAddBoardButton();
    hideCodeInput();
    clearCodePlaceholder();
  }

  // 4. Инициализация
  function init() {
    injectStyles();
    setupLevelSelectionTweaks();
    
    // Запускаем "вечный" цикл проверки логотипа
    loop(); 
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
