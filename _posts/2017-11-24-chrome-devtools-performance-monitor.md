---
layout: post
title: Chrome DevTools- Performance monitor
tags: [Browsers, Chrome]
share_image: https://static.hospodarets.com/img/blog/1511527599607549000.png
share_description: Chrome DevTools Performance monitor allows easily measure your app perfomance in real-time
---

How often have you applied the JavaScript or CSS solution considered as an optimization,
and after couldn't find an easy way to measure how effective it was?<br>
Of course, you have the performance timeline recording, but in most cases, it provides the retrospective data, not the life-updated.<br>
For this and other performance-measuring techniques, Chrome DevTools added the
"Performance Monitor" tab which represents the real-time app performance metrics:

<span class="smaller-img">
    <img src="https://static.hospodarets.com/img/blog/1511527599607549000.png" />
</span>

<div class="more"></div>

To open the "Performance Monitor":

1. Open Chrome DevTools (CMD/CTRL + SHIFT + I);
2. Press "Esc" to open the additional panel with tabs;
3. Choose the "Performance monitor" in the drawer;
4. Enable/disable the metrics via click.

<span class="smaller-img">
    <img src="https://static.hospodarets.com/img/blog/1511533584492544000.gif" />
</span>

This is available in Chrome 63 and provides you many different metrics,
most of which are very useful and we could/can measure them in Chrome in some ways
(e.g. in Timeline, Performance Tab etc.)

But there are couple new I'd like to share:

- "Layouts / sec" and
- "Style recalcs / sec"

They allow you to measure in the the real-time how performant your CSS solutions are.
For example:<br>
thank's to [csstriggers.com](https://csstriggers.com/) we know,
that change of the [top](https://csstriggers.com/top) and [left](https://csstriggers.com/left)
CSS properties triggers the whole Pixel Rendering pipeline stages: paint, layout, and composition.
If we use these properties for the animation, it will trigger dozens/hundreds of operations
per a second.

But if you switch the animation to use "transform" CSS Property with "translateX/Y",
you will find out, that [it won't trigger paint and layout, only the composite stage](https://csstriggers.com/top),
which is done on GPU and will decrease your CPU usage nearly to 0%.

All this was described in the Paul Irish's article
[Why Moving Elements With Translate() Is Better Than Pos:abs Top/left](https://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/).
For measuring the difference, Paul used the "Timeline", which showed the triggered Paint/Layout actions.
But latest years Paul is working on Chrome DevTools improvements, so I'm not surprised we finally have
a proper way to measure the CSS performance in the real-time
(I forked his demo to represent the animation props switching):

<p>
    <a href="https://codepen.io/malyw/pen/QOQvyz">
        <img src="https://static.hospodarets.com/img/blog/1511532158184634000.gif" />
    </a>
</p>

<p>
    <a class="sh-btn" flavor="text-width"
       href="https://codepen.io/malyw/pen/QOQvyz"
       target="_blank">
        Demo
    </a>
</p>

In general, there are many usages for Performance monitor in Chrome
and finally, you have the real-time app performance data available.