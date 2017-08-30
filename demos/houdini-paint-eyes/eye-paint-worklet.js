registerPaint('eye-paint', class {
    static get inputProperties() {
        return [
            '--eye',
        ];
    }

    paint(ctx, size, styleMap) {

        const eyePropValue = styleMap.get('--eye').toString();
        const isLeftEye = (eyePropValue === 'left');
        let eyeBg = 'lightblue';

        if(isLeftEye){
            console.log(`%cpaint the ${isLeftEye ? 'left' : 'right'} eye`,`background:${eyeBg}; color: white; padding: 0 5px;`);
        }else{
            eyeBg = 'green';
            console.log(`%cpaint the ${isLeftEye ? 'left' : 'right'} eye`,`background:${eyeBg}; color: white; padding: 0 5px;`);
        }

        const smallerSize = Math.min(size.width, size.height);

        const mouseX = smallerSize / 2;
        const mouseY = smallerSize / 2;

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
            // left eye
            let dx = mouseX - this.xOrigin;
            let dy = mouseY - this.yOrigin;

            if (isLeftEye) {// right eye
                dx = mouseX + this.xOrigin;
                dy = mouseY + this.yOrigin;
            }

            const angle = Math.atan2(dy, dx);
            const vx = Math.cos(angle) * smallerSize / 4;
            const vy = Math.sin(angle) * smallerSize / 8;

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
        if(isLeftEye){

        }
        const eye = new Eye({
            x: size.width / 2,
            y: size.height / 2,
            scleraRadius: size.width / 4,
            irisRadius: size.width / 8,
            pupilRadius: size.width / 24,
            scleraColor: '#fff',
            irisColor: eyeBg,
            pupilColor: '#111'
        });
        eye.update();
        eye.render();

    }
});