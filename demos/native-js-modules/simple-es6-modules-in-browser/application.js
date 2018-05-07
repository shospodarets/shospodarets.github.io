// STATIC import
import dropdown from './components/dropdown.js';

console.log('dropdown', dropdown);


async function loadModal() { // ES6-ES8 features without transpiling
    // DYNAMIC import
    const {modal} = await import('./components/modal.js');
    console.log('modal', modal);
}

loadModal();