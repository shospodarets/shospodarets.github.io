/* JS (add a Worklet module) */
window.animationWorkletPolyfill.addModule('worklet.js')
    .then(() => {
        const scrollSource = document.querySelector('.page-wrapper');
        const scrollPosition = document.querySelector('.scroll-position');
        const photo = document.querySelector('.hacker4Chan');
        const subscribe = document.querySelector('.subscribe-wrapper');

        const scrollPositionAnimation = // animator instance
            // WorkletAnimation extends Web Animation
            // Unlike other animations the worklet animation’s current time does not directly determine
            // the animation effect’s local time (via its inherited time).
            // Instead the associated animator instance controls the animation effect’s local time directly.
            new WorkletAnimation(
                'scroll-position-animator', // animation animator name
                // animation effect(s) (one object or the list)
                // for array will be WorkletGroupEffect, allows its child effect’s local times to be mutated individually.
                [
                    new KeyframeEffect(scrollPosition, [
                            {
                                'transform': 'translateX(-100%)'
                            },
                            {
                                'transform': 'translateX(0%)'
                            }
                        ],
                        {duration: 100, iterations: 1, fill: 'both'}),
                    new KeyframeEffect(subscribe, [
                        {
                            'transform': 'scale(0.5)',
                            'opacity': 0
                        },
                        {
                            'transform': 'scale(1)',
                            'opacity': 1
                        }
                    ], {duration: 100, iterations: 1, fill: 'both'})
                ],
                // animation timeline
                // Scroll for now (e.g. touch/pointer input in the future)
                // defines an animation timeline whose time value depends on the scroll position of a scroll container
                // https://wicg.github.io/scroll-animations/ Scroll-linked Animations
                new ScrollTimeline({
                    scrollSource,
                    orientation: 'vertical'
                })
            );

        scrollPositionAnimation.play();
    }).catch(console.error);