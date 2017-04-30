registerAnimator('scroll-worklet', class {
    static get elements() {
        return [
            {name: 'avatar', inputProperties: [], outputProperties: ['transform']},
            {name: 'small-avatar', inputProperties: [], outputProperties: ['transform']}
        ]
    };

    static get timelines() {
        return [
            {
                type: 'scroll', options: {
                orientation: 'vertical',
                endScrollOffset: '136px'
            }
            },
        ]
    };

    animate(elementMap, timelines) {
        const currentScroll = timelines[0].currentTime;
        const currentPercent = currentScroll*100;

        // currentPercent: 0 to 100 at endScrollOffset
        //
        // translateY():
        // avatar: from 0% to -100%
        // small-avatar: from 100% to 0

        elementMap.get('avatar').forEach(elem => {
            elem.outputStyleMap.set('transform',
                new CSSTransformValue(
                    [
                        new CSSTranslation(0, new CSSSimpleLength(-currentPercent, '%'), 0)
                    ]
                )
            );
        });

        elementMap.get('small-avatar').forEach(elem => {
            elem.outputStyleMap.set('transform',
                new CSSTransformValue(
                    [
                        new CSSTranslation(0, new CSSSimpleLength(100 - currentPercent, '%'), 0)
                    ]
                )
            );
        });
    }
});