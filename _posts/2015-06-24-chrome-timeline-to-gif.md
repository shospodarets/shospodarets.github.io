---
layout: post
title: Convert a Chrome Timeline data to a GIF (video)
tags: [JavaScript]
share_image: https://i.imgur.com/ezQWlBV.gif
share_description: Convert a Chrome Timeline data to an animated GIF (video)
---

Recently the [ability to record a Filmstrip was added to Chrome](https://twitter.com/malyw/status/594137242655821826).

Now it's available in Canary and Dev Channel versions of the Chrome Browser as DevTools experiment and is supposed to be enabled by default in one of the next versions of Chrome.

To enable it:

* Open `chrome://flags/#enable-devtools-experiments` page in Chrome and activate the "Enable Developer Tools experiments" flag
* Reload Chrome
* Open the DevTools Settings
* Select the "Experiments" tab
* Press "SHIFT" button 6 times 😉 to show hidden DevTools experiments
* Check the "Filmstrip in Network and Timeline Panel" checkbox
* Reload (open/close) the DevTools
* In the "Timeline" check the "Screenshots" checkbox

<div class="more"></div>

![manual](https://i.imgur.com/0Q2bPXU.gif)

After that during the timeline recording screenshots would be automatically included and shown in the DevTools.

That functionality is really useful for step-by-step debugging any UI effects, animations, changes during the debug process and many other purposes.

Only one missed functionality for me so far- ability to save a recording as video/GIF.

There are many reasons to have such functionality:

* Making quick video demos (effects, functionality etc.);
* Small tutorials (click button 1, then 2...)
* To make a video of existing problems. E.g. tester want to raise a bug and add a video.
Usually some third party apps are used but now ability to use Chrome instead of them sounds really nice;

So I created a project where anyone can convert a saved Chrome Timeline Data to a GIF (video):

<p>
    <a class="sh-btn" flavor="text-width"
       href="{{ site.baseurl }}/demos/chrome-timeline-to-gif/"
       target="_blank">
        Demo
    </a>
</p>

<a href="{{ site.baseurl }}/demos/chrome-timeline-to-gif/">
    <img src="https://i.imgur.com/ezQWlBV.gif" alt="" />
</a>

## [Check the code on Github](https://github.com/malyw/chrome-timeline-to-gif-demo)


