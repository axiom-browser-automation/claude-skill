---
title: Trigger a rollover
metaTitle: Trigger a mouse hover or rollover with the Rollover element step
description: Trigger a mouseover event on a dropdown menu or other hover-activated element using the Rollover element step or JavaScript.
video: https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=484&end=505
order: 10
---

To trigger a mouse hover or rollover (for example, to reveal a dropdown menu), use the [**Rollover element**](/docs/no-code-tool/reference/steps/rollover-element) step.

::HeroMedia
::

## Use the Rollover element step
***

Open the step finder, search for **roll**, and add the **Rollover element** step.

1. Click **Select** and choose the element to hover over.

## Trigger a rollover with JavaScript
***

When the **Rollover element** step doesn't trigger the desired behaviour, dispatch a `mouseover` event from the [**Write javascript**](/docs/tutorials/javascript) step.

### Example HTML

```html
<nav>
    <ul>
        <li class="menu-item">
            <a href="#" class="your-hover-element">Menu</a>
            <ul class="submenu">
                <li><a href="#">Option 1</a></li>
                <li><a href="#">Option 2</a></li>
                <li><a href="#">Option 3</a></li>
            </ul>
        </li>
    </ul>
</nav>
```

### Example JavaScript

```javascript
// Select the menu item
const menuItem = document.querySelector('.your-hover-element');

// Trigger mouseover event
const mouseOverEvent = new MouseEvent('mouseover', {
    bubbles: true,
    cancelable: true,
    view: window
});

menuItem.dispatchEvent(mouseOverEvent);

// Optionally, click the first submenu option after hover
setTimeout(() => {
    const firstOption = document.querySelector('.submenu li a');
    if (firstOption) {
        firstOption.click();
    }
}, 1000);
```

This script triggers the rollover, reveals the submenu, then clicks the first option after a one-second delay.