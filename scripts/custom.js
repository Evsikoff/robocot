--- START OF FILE custom.js ---

(function () {
  const styleId = 'robocot-cleanup-style';

  function injectStyles() {
    // Если стили уже есть, не добавляем их снова
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* --- ЗАМЕНА РОБОТА НА ЛОГОТИП --- */
      
      /* 1. Скрываем "внутренности" SVG (оригинального робота) */
      svg._0af90 > *,
      svg.cb15a > * {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }

      /* 2. Превращаем сам контейнер SVG в фон с логотипом */
      svg._0af90, 
      svg.cb15a {
        /* Ставим логотип как фон */
        background-image: url('logo.png') !important;
        
        /* Центрируем и вписываем логотип в размеры плавающего блока */
        background-repeat: no-repeat !important;
        background-position: center center !important;
        background-size: contain !important;
        
        /* Убираем векторную заливку, если она осталась */
        fill: transparent !important;
        stroke: none !important;
        
        /* Гарантируем, что элемент видим и занимает место */
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
      }

      /* --- СКРЫТИЕ ЛИШНИХ ЭЛЕМЕНТОВ ИНТЕРФЕЙСА (как было ранее) --- */
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

  // Скрытие кнопок в меню выбора уровней (логика осталась прежней)
  function setupLevelSelectionTweaks() {
    const hideElements = () => {
      // Кнопка "Добавить доску"
      const addBoardBtn = Array.from(document.querySelectorAll('button, a')).find(
        (el) => el.textContent.trim() === 'Legg til brett'
      );
      if (addBoardBtn) addBoardBtn.style.display = 'none';

      // Поле ввода кода
      const codeInput = document.querySelector('input[name="codeInput"]');
      if (codeInput) codeInput.style.display = 'none';

      // Placeholder
      const inputPlaceholder = document.querySelector('input[placeholder="Kode f.eks 6AXP"]');
      if (inputPlaceholder) inputPlaceholder.placeholder = '';
    };

    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });
    hideElements();
  }

  // Инициализация
  function init() {
    injectStyles();
    setupLevelSelectionTweaks();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
