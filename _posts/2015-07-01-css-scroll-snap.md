---
layout: post
title: Native CSS Scroll Snap Points
tags: [CSS, JavaScript]
share_image: https://i.imgur.com/hndMbNo.png
share_description: Native CSS Scroll Snap Points
---

Scrolling effects are increasingly popular these days.

Scroll snapping is used widely for a better separation of the provided content (vertical full height pages)
or, for example, to emulate galleries behavior.

There are many popular plugins
([fullPage.js](http://alvarotrigo.com/fullPage/), [jQuery.panelSnap](http://guidobouman.github.io/jquery-panelsnap/), [jQuery Scrollify](http://projects.lukehaas.me/scrollify/#configuration) etc.)
which provide such functionality.

Can you imagine how easy would be creating such effects using CSS only?

Meet the [CSS Scroll Snap Points specification](http://dev.w3.org/csswg/css-snappoints/)!

<a href="{{ site.baseurl }}/demos/scroll-snap-full-screen/"
   target="_blank"
   class="btn-pulse">
    <span class="wrapper">
        <span class="inner"></span>
    </span>
    <span class="text">Demo</span>
</a>

<a href="{{ site.baseurl }}/demos/scroll-snap-full-screen/">
    <img src="https://i.imgur.com/MwDPVuP.gif" alt=""/>
</a>

<div class="more"></div>

# Description

### `scroll-snap-type` for a scrolling container

First- you have to set how strictly are snap points used. For that use:

```css
scroll-snap-type: none | mandatory | proximity;
```

`mandatory` sets that scroll has to be always on the closest snap poin-
in the end of scrolling, on adding content etc.

`proximity` means that scroll may come to rest on a snap point.
There is no clear description of that behavior, so if you want to be sure
your Scroll Snap Points work- use `mandatory`

### `scroll-snap-points-x` and `scroll-snap-points-y` for a scrolling container

These rules set the positioning of snap points inside a scroll container. Syntax is:

```css
scroll-snap-points-x: none | repeat(< length >)
scroll-snap-points-y: none | repeat(< length >)
```

`repeat(< length >)` is measured from the start of a container and provides an interval at which snap points are defined.

E.g. `scroll-snap-points-x: repeat(100%);` defines that scroll has to be snapped after the each length of the container horizontally.

`scroll-snap-points-y: repeat(100px);` sets scroll to snap each 100px vertically etc.

### `scroll-snap-destination` for a scrolling container

Defines the position within the scrolling container which snap points align with.

It means, that `scroll-snap-destination: 50% 50%;` sets all snapping points to be aligned with the center of a container.

Default value is: `scroll-snap-destination: 0px 0px;` - akigning with a starting point of a container.

### `scroll-snap-coordinate` for items inside of a scrolling container

For an element you can define the Snap Point which would be aligned with the closest element with a scroll. In general it looks like:

```css
scroll-snap-coordinate: none | < position >;
```

You can set it as the following:

```css
.item{
    /*
    Aligns the center of the .item
    with a scroll container snap-destination.
    */
    scroll-snap-coordinate: 50% 50%;
}
```

# Demo

For the demo I decided to implement one page with the galleries and another one- with the full page vertical scrolling effect.

## Scrolling galleries

<a href="{{ site.baseurl }}/demos/scroll-snap-galleries/"
   target="_blank"
   class="btn-pulse">
    <span class="wrapper">
        <span class="inner"></span>
    </span>
    <span class="text">Demo</span>
</a>

There is a block of common CSS rules for all galleries:

```css
.gallery {
    /*
    Enables the Scroll Snapping,
    saying it is mandatory (hard snap)
    */
    scroll-snap-type: mandatory;

    /*
    Make a Native Smooth Scrolling work: blog.gospodarets.com/native_smooth_scrolling/
    After that browser starts to scroll blocks
    when you use anchors: http://help.typepad.com/anchor-tags.html
    It adds smooth scrolling instead of "jumping"
    when you press number of a slide to scroll to.
    */
    scroll-behavior: smooth;
}
```

### Horizontal gallery

[Horizontal gallery]({{ site.baseurl }}/demos/scroll-snap-galleries/#horizontal-gallery) is implemented using the following CSS rules:

```css
.horizontal-gallery {
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;

    /*
    Sets the scroll snapping to the each point which is
    on the X*GALLERY_WIDTH distance horizontally from start.
    Images width are the same as containers.
    That's why the scroll snaps to the beginning of the each image.
    */
    scroll-snap-points-x: repeat(100%);
}
```

<div class="open-close-wrapper">
    <label>
        <input type="checkbox"/>
        <span class="text">Watch the Horizontal Gallery in action</span>
        <i class="icon"></i>
        <div class="open-close">
            <a href="{{ site.baseurl }}/demos/scroll-snap-galleries/#horizontal-gallery">
                <div style="
                    background: url(https://i.imgur.com/zAC2TNG.gif) no-repeat 0 0;
                    width:522px;
                    height:322px;
                ">
                </div>
            </a>
        </div>
    </label>
</div>

### Vertical gallery

[Vertical gallery]({{ site.baseurl }}/demos/scroll-snap-galleries/#vertical-gallery) implementation is similar, but vertical repeat is used instead:

```css
.vertical-gallery {
    overflow-y: auto;
    overflow-x: hidden;

    /*
    Sets the scroll snapping to the each point which is
    on the X*GALLERY_HEIGHT distance vertically from start.
    Images height are the same as containers.
    That's why the scroll snaps to the beginning of the each image.
    */
    scroll-snap-points-y: repeat(100%);
}
```

<div class="open-close-wrapper">
    <label>
        <input type="checkbox"/>
        <span class="text">Watch the Vertical Gallery in action</span>
        <i class="icon"></i>
        <div class="open-close">
            <a href="{{ site.baseurl }}/demos/scroll-snap-galleries/#vertical-gallery">
                <div style="
                    background: url(https://i.imgur.com/Q6UEyOU.gif) no-repeat 0 0;
                    width:512px;
                    height:324px;
                ">
                </div>
            </a>
        </div>
    </label>
</div>

### "People You May Know" gallery

["People You May Know" gallery]({{ site.baseurl }}/demos/scroll-snap-galleries/#youmayknow-gallery) shows a different type of snapping:
snapping to the center/left of the image.
Similar effect (showing part of the nearby images) is used, e.g. in the [Facebook "People You May Know" block](https://i.imgur.com/KYuC2Lk.gif).

In these examples Scroll Snapping alignement is set to the left/center of the gallery and can be switched using the checkboxes.

```css
.youmayknow-gallery {
    overflow-x: auto;
    overflow-y: hidden;
}

/*
SCROLL SNAPPING ALIGNMENT
*/
/* CENTER */
#align-to-center:checked ~ .gallery-wrapper .youmayknow-gallery{
    /*
    Defines that each snap coordinate has to be aligned
    with the center of the gallery wrapper
    */
    scroll-snap-destination: 50% 50%;
}

#align-to-center:checked ~ .gallery-wrapper .item{
    /*
    Sets the center of each gallery item
    as the Scroll Snapping point
    */
    scroll-snap-coordinate: 50% 50%;
}

/* LEFT */
#align-to-left:checked ~ .gallery-wrapper .youmayknow-gallery{
    /*
    Defines that each snap coordinate has to be aligned
    with the left edge of the gallery wrapper
    */
    scroll-snap-destination: 0 50%;
}

#align-to-left:checked ~ .gallery-wrapper .item{
    /*
    Sets the left edge of each gallery item
    as the Scroll Snapping point
    */
    scroll-snap-coordinate: 0 50%;
}
```

<div class="open-close-wrapper">
    <label>
        <input type="checkbox"/>
        <span class="text">Watch the "People You May Know" Gallery in action</span>
        <i class="icon"></i>
        <div class="open-close">
            <a href="{{ site.baseurl }}/demos/scroll-snap-galleries/#youmayknow-gallery">
                <div style="
                    background: url(https://i.imgur.com/JJuHxoZ.gif) no-repeat 0 0;
                    width:260px;
                    height:192px;
                ">
                </div>
            </a>
        </div>
    </label>
</div>


## Full page height blocks vertical scrolling

Another popular examples of using Scroll Snap is a full page height block scrolling.

For eaxample, check the [jQuery Scrollify Demo](http://projects.lukehaas.me/scrollify/).

Let's implement the same functionality using CSS only. Common HTML structure:

```html
<div class="box-wrapper">
    <div class="box-bg">
        <div id="screen1" data-section-name="screen1" class="box">
            Screen 1
        </div>
        ...
    </div>
</div>
```

Let's provide for boxes the same height as the browser window + a vertical scroll:

```css
.box-wrapper {
    overflow-x: hidden;
    overflow-y: auto;
}

.box {
    height: 100vh;
}
```

And the last one- just add Scroll Snapping to the beggining of the each box:

```css
.box-wrapper {
    scroll-snap-type: mandatory;
    scroll-snap-points-y: repeat(100%);
}
```

That's it, we have set up a vertical full page height blocks with a scroll snapping.

All the other additions you can add on top of it:

* Specific %ID% to each block to use then links with `href="%ID%"` to scroll to that box
* `scroll-behavior, smooth;` to make the above scrolling smooth (check the [Smooth Scrolling article](//blog.gospodarets.com/native_smooth_scrolling/) for details)
* Using the links from the item 1 you can add boxes switcher and specific links like "scroll to the next slide"/"scroll to top"..

As always, to make it work in browsers without a Snap Point support- the JavaScript Plugin is used ([jQuery Scrollify](http://projects.lukehaas.me/scrollify/)):

```js
var isScrollSnapSupported = 'scrollSnapType' in document.documentElement.style ||
    'webkitScrollSnapType' in document.documentElement.style;

if (!isScrollSnapSupported) {
    $.scrollify({
        section: '.box'
    });
}
```

<div class="open-close-wrapper">
    <label>
        <input type="checkbox"/>
        <span class="text">Watch the Full page height scrolling demo in action</span>
        <i class="icon"></i>
        <div class="open-close">
            <a href="{{ site.baseurl }}/demos/scroll-snap-full-screen/">
                <div style="
                    background: url(https://i.imgur.com/MwDPVuP.gif) no-repeat 0 0;
                    width:240px;
                    height:234px;
                ">
                </div>
            </a>
        </div>
    </label>
</div>

<a href="{{ site.baseurl }}/demos/scroll-snap-full-screen/"
   target="_blank"
   class="btn-pulse">
    <span class="wrapper">
        <span class="inner"></span>
    </span>
    <span class="text">Demo</span>
</a>

# How to detect Scroll Snap is supported in a browser

It's quite easy- for JavaScript:

```javascript
var isScrollSnapSupported = 'scrollSnapType' in document.documentElement.style ||
        'webkitScrollSnapType' in document.documentElement.style;

if (!isScrollSnapSupported) {
    // APPLY SOME PLUGIN TO EMULATE THE SAME BEHAVIOR
}
```

All browsers which have the new CSS Scroll Snap bahavior (in Internet Explorer it was implemented with an old syntax)
also support CSS feature detection ([CSS Feature Queries](http://caniuse.com/#feat=css-featurequeries)).
So we can use [`@support` CSS at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports):

```css
@supports ( (scroll-snap-type: mandatory) or (-webkit-scroll-snap-type: mandatory) ) {
    /* SCROLL SNAP or some specific rules */
}

@supports ( not ((scroll-snap-type: mandatory) or (-webkit-scroll-snap-type: mandatory)) ) {
    /* rules to be applied when SCROLL SNAP is NOT supported */
}
```

# Browser support

It is interesting that Scroll Snap Points [were first implemented by Microsoft in IE10 (works in IE10+)](https://msdn.microsoft.com/en-us/library/windows/apps/hh466066.aspx)
([but with another syntax](http://generatedcontent.org/post/66817675443/setting-native-like-scrolling-offsets-in-css-with)).

Then Firefox team announced [intent to implement the support (FF 39+)](https://groups.google.com/forum/#!topic/mozilla.dev.platform/HX9lwWZ250o),
[Chrome](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/g1Kb-8AGE2Y) and, finally,
Apple also announced [their support in Safari 9.0](https://developer.apple.com/library/prerelease/mac/releasenotes/General/WhatsNewInSafari/Articles/Safari_9.html#//apple_ref/doc/uid/TP40014305-CH9-SW21)!

You might be surprised, but it is already implemented in [Firefox stable and many next versions of browsers](http://caniuse.com/#feat=css-snappoints):

<div class="caniuse" data-feature="css-snappoints"></div>

If you want to play with Scroll Snap Points today, you can either download
[Webkit Nightly](http://nightly.webkit.org/)
or
just run Firefox.

Don't forget to provide a `-webkit` vendor prefix for Safari.

# Bugs/missed parts

<ul>
    <li>
        In Safari when you scroll using a scrollbox (not a wheel)- scroll snapping doesn't work, scroll just stops in the same place.
        <div class="open-close-wrapper">
            <label>
                <input type="checkbox"/>
                <span class="text">Check the video</span>
                <i class="icon"></i>
                <div class="open-close">
                    <a href="{{ site.baseurl }}/demos/scroll-snap-galleries/#youmayknow-gallery">
                        <div style="
                    background: url(https://i.imgur.com/axmOqf3.gif) no-repeat 0 0;
                    width:522px;
                    height:322px;
                ">
                        </div>
                    </a>
                </div>
            </label>
        </div>
    </li>
    <li>
        There is no clear way to set a scroll snap points to the end of a scrollable content.
        That's why you might have problems with the last items in your scrollable areas (e.g. manual scrolling in FF).
        <div class="open-close-wrapper">
            <label>
                <input type="checkbox"/>
                <span class="text">Check the video</span>
                <i class="icon"></i>
                <div class="open-close">
                    <a href="{{ site.baseurl }}/demos/scroll-snap-galleries/#youmayknow-gallery">
                        <div style="
                    background: url(https://i.imgur.com/V90oXsC.gif) no-repeat 0 0;
                    width:522px;
                    height:354px;
                ">
                        </div>
                    </a>
                </div>
            </label>
        </div>

        <p>
            For the demo it was fixed (thanks to the <a href="https://disqus.com/by/bigbosssnk/">BigBossSNK</a> <a href="//blog.gospodarets.com/css-scroll-snap/#comment-2114038202">comment</a>) providing:
        </p>

        <div class="highlight">
            <pre><code class="language-css" data-lang="css">.youmayknow-gallery .item:last-child{
    scroll-snap-coordinate: 0 50%;
}</code></pre>
        </div>
    </li>
    <li>
        <p>
        In Firefox when <code>scroll-snap-points-y: repeat(100%);</code> is used for a gallery
        (when you have images as items in a scroll area),
        scroll snap points are defined to the end of the real images height
        (not the visual sizes which are set by CSS).
        </p>
        <p>
            This behavior is reproducible in the <a href="{{ site.baseurl }}/demos/scroll-snap-galleries/#vertical-gallery">Vertical gallery</a>.
        </p>

        <div class="open-close-wrapper">
            <label>
                <input type="checkbox"/>
                <span class="text">Check the video</span>
                <i class="icon"></i>
                <div class="open-close">
                    <a href="{{ site.baseurl }}/demos/scroll-snap-galleries/#vetical-gallery">
                        <div style="
                    background: url(https://i.imgur.com/Zd0rUPC.gif) no-repeat 0 0;
                    width:524px;
                    height:328px;
                ">
                        </div>
                    </a>
                </div>
            </label>
        </div>
    </li>
</ul>

# Links

* [Scroll Snap Points on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type)
* [Specification (Draft)](http://dev.w3.org/csswg/css-snappoints/)
* [CSS Scroll Snap Points implementation status in Chrome](https://www.chromestatus.com/feature/5721832506261504)
* [Native Smooth Scrolling](http://blog.gospodarets.com/native_smooth_scrolling/)