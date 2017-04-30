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
        const showSmallAvatar = (currentScroll === 1);


        if (showSmallAvatar) {
            elementMap.get('avatar').forEach(elem => {
                elem.outputStyleMap.set('transform',
                    new CSSTransformValue(
                        [
                            new CSSTranslation(0, new CSSSimpleLength('-100','%'), 0)
                        ]
                    )
                );
            });

            elementMap.get('small-avatar').forEach(elem => {
                elem.outputStyleMap.set('transform',
                    new CSSTransformValue(
                        [
                            new CSSTranslation(0, 0, 0)
                        ]
                    )
                );
            });
        } else {
            // reset
            elementMap.get('avatar').forEach(elem => {
                elem.outputStyleMap.set('transform',
                    new CSSTransformValue(
                        [new CSSTranslation(0, 0, 0)]
                    ));
            });

            elementMap.get('small-avatar').forEach(elem => {
                elem.outputStyleMap.set('transform',
                    new CSSTransformValue(
                        [new CSSTranslation(0, new CSSSimpleLength('100','%'), 0)]
                    ));
            });
        }
    }
});