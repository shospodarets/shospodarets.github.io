class css3dCube {
    constructor() {
        this.worldEl = document.querySelector('#world');

        this.worldZ = 0;
        this.worldXAngle = 0;
        this.worldYAngle = 0;

        this.bindEvents();
    }

    // CSS
    updateView() {
        this.worldEl.style.setProperty('--translateZ', this.worldZ);
        this.worldEl.style.setProperty('--rotateX', this.worldXAngle);
        this.worldEl.style.setProperty('--rotateY', this.worldYAngle);
    }

    // EVENTS
    onMouseWheel(e) {
        e.preventDefault();

        let delta;
        if (e.detail) {
            delta = e.detail * -5;
        } else if (e.wheelDelta) {
            delta = e.wheelDelta / 8;
        } else {
            delta = e.deltaY;
        }

        if (!delta) return;

        this.worldZ += delta * 5;
        this.updateView();
    };

    onMouseMove(e) {
        this.worldXAngle = (.5 - (e.clientY / window.innerHeight)) * 180;
        this.worldYAngle = -(.5 - (e.clientX / window.innerWidth)) * 180;
        this.updateView();
    };

    bindEvents() {
        window.addEventListener('mousewheel', this.onMouseWheel.bind(this));
        window.addEventListener('DOMMouseScroll', this.onMouseWheel.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    };
}

new css3dCube();