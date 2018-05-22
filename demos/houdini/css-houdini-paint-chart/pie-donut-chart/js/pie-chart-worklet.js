// worklet execution context
registerPaint('pie-chart', class PieChartWorklet {
    static get inputProperties() {
        return [
            // ToDo pie-chart-radius in percent of the wrapper OR THE WRAPPER SIZE animate
            '--pie-donut-radius',
            '--pie-rotate-angle',
            '--pie-stroke-color',
            '--pie-stroke-opacity',
            '--pie-values',
            '--pie-colors',
        ];
    }

    static clearCircle(ctx, x, y, radius, pieStrokeOpacity, pieStrokeColor) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, true);

        PieChartWorklet.stroke(ctx, pieStrokeOpacity, pieStrokeColor);

        ctx.clip();
        ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
        ctx.restore();
    }

    static rotateCanvasAroundCenter(ctx, geom, degree) {
        // Move registration point to the center of the canvas
        ctx.translate(geom.width / 2, geom.height / 2); // center

        // Rotate
        ctx.rotate(degree * Math.PI / 180);

        // Move registration point back to the top left corner of canvas
        ctx.translate(-geom.width / 2, -geom.height / 2);
    }


    static stroke(ctx, pieStrokeOpacity, pieStrokeColor) {
        ctx.globalAlpha = pieStrokeOpacity;
        ctx.strokeStyle = pieStrokeColor;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    paint(ctx, geom, styleMap) {
        const radius = Math.min(geom.width / 2, geom.height / 2);
        const pieValues = styleMap.get('--pie-values').toString().trim().split(',').map(Number);
        const pieColors = styleMap.get('--pie-colors').toString().trim().split(',');
        const pieStrokeColor = styleMap.get('--pie-stroke-color').toString().trim();
        const pieStrokeOpacity = styleMap.get('--pie-stroke-opacity').toString().trim();
        const pieDonutRadius = (styleMap.get('--pie-donut-radius') && styleMap.get('--pie-donut-radius').toString().trim()) || 0;
        const pieRotateAngle = (styleMap.get('--pie-rotate-angle') && styleMap.get('--pie-rotate-angle').toString().trim()) || 0;

        PieChartWorklet.rotateCanvasAroundCenter(ctx, geom, pieRotateAngle);

        // Pie values
        let pieValuesSum = 0;
        pieValues.forEach(pieValue => {
            pieValuesSum += pieValue;
        });

        // Pie angles
        const piecesData = []; // radians
        pieValues.forEach((pieValue, i) => {
            const pieAngleStart = (piecesData[i - 1] && piecesData[i - 1].end) || 0; // previous pieAngleEnd or 0
            const pieAngleEnd = pieAngleStart + (Math.PI * 2 * (pieValue / pieValuesSum));
            const pieAngleMiddle = (pieAngleStart + pieAngleEnd) / 2;

            piecesData.push({
                start: pieAngleStart,
                end: pieAngleEnd,
                centerX: radius * Math.cos(pieAngleMiddle) / 2,
                centerY: radius * Math.sin(pieAngleMiddle) / 2,
            });
        });

        // DRAW
        pieValues.forEach((pieValue, i) => {
            const pieceData = piecesData[i];
            let pieColor = pieColors[i];
            if (!pieColor) pieColor = '#fff'; // default color

            ctx.fillStyle = pieColor;
            ctx.beginPath();
            ctx.moveTo(geom.width / 2, geom.height / 2); // center

            ctx.arc(
                geom.width / 2, geom.height / 2, // from center
                radius,
                pieceData.start, // startingAngle (radians)
                pieceData.end // endingAngle (radians)
            );
            ctx.lineTo(geom.width / 2, geom.height / 2); // center

            PieChartWorklet.stroke(ctx, pieStrokeOpacity, pieStrokeColor);

            ctx.fill();
        });

        PieChartWorklet.clearCircle(
            ctx,
            geom.width / 2, geom.height / 2, // from center
            pieDonutRadius / 100 * radius,
            pieStrokeOpacity, pieStrokeColor
        );


    }
});