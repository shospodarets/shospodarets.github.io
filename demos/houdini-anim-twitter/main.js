(() => {
    const _3dClassName = '_3d_';
    const _3dBtn = document.querySelector('._3d_mode-btn');

    _3dBtn.addEventListener('click', () => {
        // switch a class
        if (document.body.classList.contains(_3dClassName)) {
            document.body.classList.remove(_3dClassName);
        }else{
            document.body.classList.add(_3dClassName);
        }
    });
})();