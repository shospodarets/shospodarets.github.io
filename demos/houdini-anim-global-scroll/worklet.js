registerAnimator('global-scroll-position-worklet', class CanBeNamed {
    static get elements() {
        return [
            {name: 'scrollerElelementReference', inputProperties: [], outputProperties: ['transform']}
        ]
    };

    static get timelines() {
        return [
            {type: 'scroll', options: {orientation: 'vertical'}}
        ]
    };

    animate(elementMap, timelines) {

        elementMap.get('scrollerElelementReference').forEach(elem => {
            elem.outputStyleMap.set('transform', new CSSTransformValue(
                [
                    new CSSTranslation(
                        new CSSSimpleLength(parseFloat(timelines[0].currentTime) * 100, '%'),
                        0,
                        0
                    )
                ]
            ));
        });
    }
});