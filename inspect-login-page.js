const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://commitquality.com/login');
  await page.waitForLoadState('domcontentloaded');
  
  // Obtener todos los elementos interactivos
  const elements = await page.evaluate(() => {
    const interactive = [];
    
    // Inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
      interactive.push({
        type: 'input',
        index,
        tagName: input.tagName,
        type: input.type,
        id: input.id,
        name: input.name,
        placeholder: input.placeholder,
        'data-testid': input.getAttribute('data-testid'),
        'aria-label': input.getAttribute('aria-label'),
        className: input.className,
        text: input.value ? input.value.substring(0, 50) : ''
      });
    });
    
    // Buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
      interactive.push({
        type: 'button',
        index,
        text: button.innerText ? button.innerText.trim().substring(0, 50) : '',
        id: button.id,
        'data-testid': button.getAttribute('data-testid'),
        'aria-label': button.getAttribute('aria-label'),
        className: button.className
      });
    });
    
    // Links (a tags)
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
      interactive.push({
        type: 'link',
        index,
        text: link.innerText ? link.innerText.trim().substring(0, 50) : '',
        href: link.href,
        id: link.id,
        'data-testid': link.getAttribute('data-testid'),
        'aria-label': link.getAttribute('aria-label'),
        className: link.className
      });
    });
    
    return interactive;
  });
  
  console.log(JSON.stringify(elements, null, 2));
  
  await browser.close();
})();