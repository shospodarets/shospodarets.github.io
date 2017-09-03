// WorkletGlobalScope (can be many)

// worklet execution context

registerAnimator(
    'scroll-position-animator',// animator name
    class {
        constructor(options) {// Called when a new animator is instantiated.
            this.options = options;
            this.options.avatarTimeline.attach(this);
        }

        // KeyframeEffect, localTime, currentTime from Web Animation API
        animate(currentTime, effect) {// animate function with animation frame logic
            // also possible to pass via option params
            // const scrollPos = currentTime * this.options.scrollRange;
            // const endScrollOffset = this.options.endScrollOffset;

            // effect.children (WorkletGroupEffect) or effect (if one effect is passed, AnimationEffect)
            effect.children.forEach((children) => {
                children.localTime = this.options.avatarTimeline.currentTime;
            });
        }
    });