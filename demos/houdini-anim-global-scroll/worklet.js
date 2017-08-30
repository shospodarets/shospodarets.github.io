registerAnimator('scroll-position-worklet', class ScrollPositionAnimator {
    static get elements() {
        return [{
            name: 'scrollerElementReference',
            inputProperties: [],
            outputProperties: ['transform']
        }]
    };

    static get timelines() {
        return [
            {type: 'scroll', options: {orientation: 'vertical'}}
        ]
    };

    animate(elementMap, timelines) {
        elementMap.get('scrollerElementReference').forEach(elem => {
            elem.outputStyleMap.set('transform', new CSSTransformValue([
                new CSSTranslation(
                    new CSSSimpleLength(
                        parseFloat(timelines[0].currentTime) * 100, '%'
                    ),
                    0,
                    0
                )]
            ));
        });
    }
});