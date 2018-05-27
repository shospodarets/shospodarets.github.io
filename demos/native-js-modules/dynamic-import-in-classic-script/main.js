import(`./components/modal.js`)
    .then(({modal}) => {
        console.log('modal.js ES module is loaded asynchronously from the classic script', modal)
    }).catch(console.error);