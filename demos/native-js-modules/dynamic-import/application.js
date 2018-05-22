const componentsPath = './components';

// classic Promise
import(`${componentsPath}/modal.js`).then(({modal}) => {
    modal.open();
});

// with async/await
async function openModal() {
    const {modal} = await import(`${componentsPath}/modal.js`);
    modal.open();
}

openModal();