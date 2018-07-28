// worklet execution context
registerPaint('triangle-chart', class TriangleChartWorklet {
    static get inputProperties() {
        return [
            // ToDo triangle-chart-WIDTH AND HEIGHT in percent of the wrapper OR THE WRAPPER SIZE animate
            '--triangle-values',
            '--triangle-colors',
            '--triangle-stroke-color',
            '--triangle-stroke-opacity',
        ];
    }

    static stroke(ctx, triangleStrokeOpacity, triangleStrokeColor) {
        ctx.globalAlpha = triangleStrokeOpacity;
        ctx.strokeStyle = triangleStrokeColor;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    static getXIndentInRectangularQuadrilateral(width, height) {

    };

    paint(ctx, geom, styleMap) {
        const triangleWidth = geom.width;
        const triangleHeight = geom.height;
        const baseAngle = Math.atan(triangleHeight / (triangleWidth / 2)); // as triangle is an isosceles

        const triangleValues = styleMap.get('--triangle-values').toString().trim().split(',').map(Number);
        const triangleColors = styleMap.get('--triangle-colors').toString().trim().split(',');
        const triangleStrokeColor = styleMap.get('--triangle-stroke-color').toString().trim();
        const triangleStrokeOpacity = styleMap.get('--triangle-stroke-opacity').toString().trim();

        // Pie values
        let triangleValuesSum = 0;
        triangleValues.forEach(pieValue => {
            triangleValuesSum += pieValue;
        });

        const triangleHeightValues = triangleValues.map(
            (triangleValue) => (triangleValue / triangleValuesSum) * triangleHeight
        );

        // Pie angles
        const piecesData = [];
        let currentPieceBottom = triangleHeight; // Y axis starts from the bottom
        let currenPieceLeftBottomX = 0;
        triangleValues.forEach((pieValue, i) => {
            const currentPieceHeight = triangleHeightValues[i];
            const currentPieceTop = currentPieceBottom - currentPieceHeight;

            const currentPieceLeftIndent = currentPieceHeight / Math.tan(baseAngle);
            const currentPieceLeftTopX = currenPieceLeftBottomX + currentPieceLeftIndent;

            piecesData.push({
                leftTop: {
                    x: currentPieceLeftTopX,
                    y: currentPieceTop
                },
                leftBottom: {
                    x: currenPieceLeftBottomX,
                    y: currentPieceBottom
                },
                rightBottom: {
                    x: triangleWidth - currenPieceLeftBottomX,
                    y: currentPieceBottom
                },
                rightTop: {
                    x: triangleWidth - currentPieceLeftTopX,
                    y: currentPieceTop
                },
            });

            // for the next loop
            currentPieceBottom = currentPieceTop;
            currenPieceLeftBottomX = currentPieceLeftTopX;
        });

        // DRAW
        triangleValues.forEach((pieValue, i) => {
            const pieceData = piecesData[i];
            let pieceColor = triangleColors[i];
            if (!pieceColor) pieceColor = '#fff'; // default color

            ctx.fillStyle = pieceColor;
            ctx.beginPath();

            ctx.moveTo(pieceData.leftTop.x, pieceData.leftTop.y); // move to start

            ctx.lineTo(pieceData.leftBottom.x, pieceData.leftBottom.y);
            ctx.lineTo(pieceData.rightBottom.x, pieceData.rightBottom.y);
            ctx.lineTo(pieceData.rightTop.x, pieceData.rightTop.y);
            ctx.lineTo(pieceData.rightTop.x, pieceData.rightTop.y);

            ctx.lineTo(pieceData.leftTop.x, pieceData.leftTop.y); // back

            TriangleChartWorklet.stroke(ctx, triangleStrokeOpacity, triangleStrokeColor);

            ctx.fill();
        });
    }
});