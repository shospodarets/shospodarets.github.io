// WorkletGlobalScope (can be many)
// worklet execution context

registerAnimator(
    'scroll-position-animator',// animator name
    class {
        constructor(options) {// Called when a new animator is instantiated.
            this.options = options;
        }

        // KeyframeEffect, localTime, currentTime from Web Animation API
        animate(currentTime, effect) {// animate function with animation frame logic
            // scroll position can be taken from option params
            // const scrollPos = currentTime * this.options.scrollRange;

            // effect.children (WorkletGroupEffect) or effect (if one effect is passed, AnimationEffect)
            effect.children.forEach((children) => {
                // localTime is a Number, which represent the vertical scroll position
                // (in percentages of the page height)
                children.localTime = currentTime * 100;
            });
        }
    });