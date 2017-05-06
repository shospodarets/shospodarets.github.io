registerPaint('cursor-follow-eyes', class {
    static get inputProperties() {
        return [
            '--origin-x',
            '--origin-y',
            '--mouse-x',
            '--mouse-y',
        ];
    }

    paint(ctx, size, styleMap) {
        console.log('paint');

        let smallerSize = Math.min(size.width, size.height);

        const originX = styleMap.get('--origin-x').value;
        const originY = styleMap.get('--origin-y').value;
        const mouseX = styleMap.get('--mouse-x').value;
        const mouseY = styleMap.get('--mouse-y').value;

        const pi2 = Math.PI * 2;

        // http://codepen.io/anon/pen/BRmpeX?editors=0010
        const Eye = function (opt) {
            this.xOrigin = opt.x;
            this.yOrigin = opt.y;
            this.x = opt.x;
            this.y = opt.y;
            this.scleraRadius = opt.scleraRadius;
            this.irisRadius = opt.irisRadius;
            this.pupilRadius = opt.pupilRadius;
            this.scleraColor = opt.scleraColor;
            this.irisColor = opt.irisColor;
            this.pupilColor = opt.pupilColor;
        };

        Eye.prototype.update = function () {
            const dx = mouseX - this.xOrigin,
                dy = mouseY - this.yOrigin,
                angle = Math.atan2(dy, dx),
                vx = Math.cos(angle) * smallerSize / 4,
                vy = Math.sin(angle) * smallerSize / 8;

            this.x = this.xOrigin + vx;
            this.y = this.yOrigin + vy;
        };

        Eye.prototype.render = function () {
            // Sclera Stroke
            ctx.beginPath();
            ctx.moveTo(this.xOrigin - this.scleraRadius, this.yOrigin);
            ctx.quadraticCurveTo(this.xOrigin, this.yOrigin - this.scleraRadius, this.xOrigin + this.scleraRadius, this.yOrigin);
            ctx.quadraticCurveTo(this.xOrigin, this.yOrigin + this.scleraRadius, this.xOrigin - this.scleraRadius, this.yOrigin);
            ctx.closePath();
            ctx.stroke();

            // Sclera Fill
            ctx.beginPath();
            ctx.moveTo(this.xOrigin - this.scleraRadius, this.yOrigin);
            ctx.quadraticCurveTo(this.xOrigin, this.yOrigin - this.scleraRadius, this.xOrigin + this.scleraRadius, this.yOrigin);
            ctx.quadraticCurveTo(this.xOrigin, this.yOrigin + this.scleraRadius, this.xOrigin - this.scleraRadius, this.yOrigin);
            ctx.fillStyle = this.scleraColor;
            ctx.fill();
            ctx.save();
            ctx.clip();

            // Iris
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.irisRadius, 0, pi2, false);
            ctx.fillStyle = this.irisColor;
            ctx.fill();

            // Pupil
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.pupilRadius, 0, pi2, false);
            ctx.fillStyle = this.pupilColor;
            ctx.fill();

            ctx.restore();
        };

        // DRAW
        const eye = new Eye({
            x: smallerSize / 2,// 583
            y: smallerSize / 4, // 136
            scleraRadius: smallerSize / 2,
            irisRadius: smallerSize / 4,
            pupilRadius: smallerSize / 8,
            scleraColor: '#fff',
            irisColor: 'hsla(100, 80%, 60%, 1)',
            pupilColor: '#111'
        });
        eye.update();
        eye.render();

    }
});