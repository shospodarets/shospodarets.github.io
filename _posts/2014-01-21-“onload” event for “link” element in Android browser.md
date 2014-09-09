---
layout: post
title:  “onload” event for CSS file in Android browser
tags: [Javascript, CSS, Android]
---

<p><span>Android browser doesn't support "onload" / "onreadystatechange" events for &lt;link&gt; element: http://pieisgood.org/test/script-link-events/</span></p>
<p>But it returns:</p>
<pre><code class="javascript">
"onload" in link === true
</code></pre>
<p>So, my solution is to detect Android browser from userAgent and then wait for some special css rule in your stylesheet (e.g., reset for "body" margins).<br />If it's not Android browser and it supports "onload" event- we will use it:</p>
<pre><code class="javascript">
var userAgent = navigator.userAgent,
    iChromeBrowser = /CriOS|Chrome/.test(userAgent),
    isAndroidBrowser = /Mozilla\/5.0/.test(userAgent) &amp;&amp; /Android/.test(userAgent) &amp;&amp; /AppleWebKit/.test(userAgent) &amp;&amp; !iChromeBrowser; 

addCssLink('PATH/NAME.css', function(){
    console.log('css is loaded');
});

function addCssLink(href, onload) {
    var css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("type", "text/css");
    css.setAttribute("href", href);
    document.head.appendChild(css);
    if (onload) {
        if (isAndroidBrowser || !("onload" in css)) {
            waitForCss({
                success: onload
            });
        } else {
            css.onload = onload;
        }
    }
}

// We will check for css reset for "body" element- if success-&gt; than css is loaded
function waitForCss(params) {
    var maxWaitTime = 1000,
        stepTime = 50,
        alreadyWaitedTime = 0;

    function nextStep() {
        var startTime = +new Date(),
            endTime;

        setTimeout(function () {
            endTime = +new Date();
            alreadyWaitedTime += (endTime - startTime);
            if (alreadyWaitedTime &gt;= maxWaitTime) {
                params.fail &amp;&amp; params.fail();
            } else {
                // check for style- if no- revoke timer
                if (window.getComputedStyle(document.body).marginTop === '0px') {
                    params.success();
                } else {
                    nextStep();
                }
            }
        }, stepTime);
    }

    nextStep();
}</code></pre>
<p><span>Demo:&nbsp;</span><a href="http://codepen.io/malyw/pen/AuCtH" rel="nofollow">http://codepen.io/malyw/pen/AuCtH</a></p>