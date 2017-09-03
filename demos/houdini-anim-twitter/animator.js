window.animationWorkletPolyfill.addModule('worklet.js')
    .then(() => {
        const scrollSource = document.querySelector('.world-inner');
        const smallAvatar = document.querySelector('.small-avatar');
        const avatarWrapper = document.querySelector('.avatar-wrapper');

        const scrollRange = (scrollSource.scrollHeight - scrollSource.clientHeight);

        const scrollPositionAnimation = // animator instance
            // WorkletAnimation extends Web Animation
            // Unlike other animations the worklet animation’s current time does not directly determine
            // the animation effect’s local time (via its inherited time).
            // Instead the associated animator instance controls the animation effect’s local time directly.
            new WorkletAnimation(
                'scroll-position-animator',// animation animator name
                // animation effect(s) (one object or the list)
                // for array will be WorkletGroupEffect, allows its child effect’s local times to be mutated individually.
                [
                    // avatarWrapper: translateY() from 0% to -100%
                    new KeyframeEffect(avatarWrapper, [
                            {
                                'transform': 'translateY(0%)'
                            },
                            {
                                'transform': 'translateY(-100%)'
                            }
                        ],
                        {
                            duration: 100, iterations: 1,
                            fill: 'both'// When the scroll offset is less than startScrollOffset, the timeline’s current time is 0. When the scroll offset is greater than endScrollOffset, the timeline’s current time is its effective time range.
                        }),

                    // small-avatar: translateY() from 100% to 0
                    new KeyframeEffect(smallAvatar, [
                            {
                                'transform': 'translateY(100%)'
                            },
                            {
                                'transform': 'translateY(0%)'
                            }
                        ],
                        {
                            duration: 100, iterations: 1,
                            fill: 'both'// When the scroll offset is less than startScrollOffset, the timeline’s current time is 0. When the scroll offset is greater than endScrollOffset, the timeline’s current time is its effective time range.
                        }),
                ],
                // animation timeline
                // Scroll for now (e.g. touch/pointer input in the future)
                // defines an animation timeline whose time value depends on the scroll position of a scroll container
                // https://wicg.github.io/scroll-animations/ Scroll-linked Animations
                new ScrollTimeline({
                    scrollSource,
                    orientation: 'vertical'
                }),
                // animation options
                {
                    avatarTimeline: new ScrollTimeline({
                        scrollSource,
                        orientation: 'vertical',
                        endScrollOffset: '136px',// constitutes the end of the range in which the trigger is activated
                        timeRange: 136 // A time duration that allows mapping between a distance scrolled, and quantities specified in time units, such as an animation’s duration and start delay.
                    }),
                });

        scrollPositionAnimation.play();
    }).catch(console.error);