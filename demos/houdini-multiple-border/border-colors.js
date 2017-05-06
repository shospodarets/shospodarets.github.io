/*
 Copyright 2017 Google, Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

registerPaint('border-colors', class {
    static get inputProperties() {
        return [
            '--worklet-border-top-width',
            '--worklet-border-right-width',
            '--worklet-border-bottom-width',
            '--worklet-border-left-width',
            '--worklet-border-top-color',
            '--worklet-border-right-color',
            '--worklet-border-bottom-color',
            '--worklet-border-left-color',
        ];
    }

    paint(ctx, size, styleMap) {
        const topWidth = styleMap.get('--worklet-border-top-width').value;
        const rightWidth = styleMap.get('--worklet-border-right-width').value;
        const bottomWidth = styleMap.get('--worklet-border-bottom-width').value;
        const leftWidth = styleMap.get('--worklet-border-left-width').value;

        const topBorderBeginning = topWidth;
        const rightBorderBeginning = size.width - rightWidth;
        const bottomBorderBeginning = size.height - bottomWidth;
        const leftBorderBeginning = leftWidth;

        // To make implementation simple
        // border width is just divided equally between assigned colors
        // (doesn't take each border color width in CSS)
        let topSquadSize, rightSquadSize, bottomSquadSize, leftSquadSize, borderColors;

        const updateProgression = function () {
            topSquadSize = topWidth / borderColors.length;
            rightSquadSize = rightWidth / borderColors.length;
            bottomSquadSize = bottomWidth / borderColors.length;
            leftSquadSize = leftWidth / borderColors.length;
        };

        // BORDER-TOP
        borderColors = this.getColors(styleMap, '--worklet-border-top-color');
        updateProgression();
        for (let i = 0; i < borderColors.length; i++) {
            this.fillQuad(ctx, borderColors[i].cssText,
                leftBorderBeginning - leftSquadSize * i, topBorderBeginning - topSquadSize * i,
                leftBorderBeginning - leftSquadSize * (i + 1), topBorderBeginning - topSquadSize * (i + 1),
                rightBorderBeginning + leftSquadSize * (i + 1), topBorderBeginning - topSquadSize * (i + 1),
                rightBorderBeginning + leftSquadSize * i, topBorderBeginning - topSquadSize * i);
        }

        // BORDER-RIGHT
        borderColors = this.getColors(styleMap, '--worklet-border-right-color');
        updateProgression();
        for (let i = 0; i < borderColors.length; i++) {
            this.fillQuad(ctx, borderColors[i].cssText,
                rightBorderBeginning + rightSquadSize * i, topBorderBeginning - topSquadSize * i,
                rightBorderBeginning + rightSquadSize * (i + 1), topBorderBeginning - topSquadSize * (i + 1),
                rightBorderBeginning + rightSquadSize * (i + 1), bottomBorderBeginning + bottomSquadSize * (i + 1),
                rightBorderBeginning + rightSquadSize * i, bottomBorderBeginning + bottomSquadSize * i);
        }

        // BORDER-BOTTOM
        borderColors = this.getColors(styleMap, '--worklet-border-bottom-color');
        updateProgression();
        for (let i = 0; i < borderColors.length; i++) {
            this.fillQuad(ctx, borderColors[i].cssText,
                rightBorderBeginning + rightSquadSize * i, bottomBorderBeginning + bottomSquadSize * i,
                rightBorderBeginning + rightSquadSize * (i + 1), bottomBorderBeginning + bottomSquadSize * (i + 1),
                leftBorderBeginning - leftSquadSize * (i + 1), bottomBorderBeginning + bottomSquadSize * (i + 1),
                leftBorderBeginning - leftSquadSize * i, bottomBorderBeginning + bottomSquadSize * i);
        }

        // BORDER-LEFT
        borderColors = this.getColors(styleMap, '--worklet-border-left-color');
        updateProgression();
        for (let i = 0; i < borderColors.length; i++) {
            this.fillQuad(ctx, borderColors[i].cssText,
                leftBorderBeginning - leftSquadSize * i, bottomBorderBeginning + bottomSquadSize * i,
                leftBorderBeginning - leftSquadSize * (i + 1), bottomBorderBeginning + bottomSquadSize * (i + 1),
                leftBorderBeginning - leftSquadSize * (i + 1), topBorderBeginning - topSquadSize * (i + 1),
                leftBorderBeginning - leftSquadSize * i, topBorderBeginning - topSquadSize * i);
        }
    }

    // HELPERS
    getColors(styleMap, propName) {
        return styleMap.getAll(propName);
    }

    fillQuad(ctx, fillColor, x1, y1, x2, y2, x3, y3, x4, y4) {
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.lineTo(x1, y1);
        ctx.fill();
    }
});