---
layout: post
title: Track JavaScript, AngularJS and jQuery errors with Google Analytics
tags: [AngularJS, jQuery, JavaScript, Analytics]
share_image: http://i.imgur.com/zp4lwnW.png
share_description: How to track JavaScript, AngularJS and jQuery errors with Google Analytics
---

Google Analytics is [the most popular website statistics service](http://en.wikipedia.org/wiki/Google_Analytics#Popularity).
It is used for many purposes: from tracking visitors and sessions to campaigns and events.

Ability to track any events provides us possibility to send and track any data in Google Analytics.
One of the most useful in that case for web developers might be errors analytics.

So far Google proposes 2 ways of tracking events:

1. Classic [**ga.js**](https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide) with the for tracking like `_gaq.push(...)`
2. Newer [**analytics.js**](https://developers.google.com/analytics/devguides/collection/analyticsjs/events) has syntax `ga('send', ...)` and is part of the new [**Universal Analytics**](https://support.google.com/analytics/answer/2790010)

Let's provide JavaScript, AngularJS and jQuery errors checking.

<div class="more"></div>

## Classic `ga.js`

This way works when you include Google Analytics in the next way:

```javascript
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-XXXXXXXX-X']);
_gaq.push(['_trackPageview']);
(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();
```

### JavaScript errors

The following code sends to GA data about all thrown JS errors (error message and place when error appeared).
`navigator.userAgent` provides info about the browser to simpify detecting problems in difficult cases.

```javascript
// Pure JavaScript errors handler
window.addEventListener('error', function (err) {
    var lineAndColumnInfo = err.colno ? ' line:' + err.lineno +', column:'+ err.colno : ' line:' + err.lineno;
    _gaq.push([
        '_trackEvent',
        'JavaScript Error',
        err.message,
        err.filename + lineAndColumnInfo + ' -> ' +  navigator.userAgent,
        0,
        true
    ]);
});
```

### AngularJS exceptions handler

AngularJS delegates all uncaught exceptions to [`$exceptionHandler` service](https://docs.angularjs.org/api/ng/service/$exceptionHandler).

```javascript
// AngularJS errors handler
angular.module('loggerApp')
        .config(function ($provide) {
            $provide.decorator("$exceptionHandler", function ($delegate) {
                return function (exception, cause) {
                    $delegate(exception, cause);
                    _gaq.push([
                        '_trackEvent',
                        'AngularJS error',
                        exception.message,
                        exception.stack,
                        0,
                        true
                    ]);
                };
            });
        });
```

### jQuery

#### jQuery errors

jQuery provides util method [.error()](http://api.jquery.com/jquery.error/) which is advised for developers to use for exceptions.

```javascript
// jQuery errors handler (jQuery API)
jQuery.error = function (message) {
    _gaq.push([
        '_trackEvent',
        'jQuery Error',
        message,
        navigator.userAgent,
        0,
        true
    ]);
}
```

#### jQuery AJAX errors handler

Whenever an Ajax request completes with an error, jQuery triggers the [`ajaxError` event](http://api.jquery.com/ajaxerror/).

```javascript
// jQuery AJAX errors handler (jQuery API)
$(document).ajaxError(function (event, request, settings) {
    _gaq.push([
        '_trackEvent',
        'jQuery Ajax Error',
        settings.url,
        JSON.stringify({
            result: event.result,
            status: request.status,
            statusText: request.statusText,
            crossDomain: settings.crossDomain,
            dataType: settings.dataType
        }),
        0,
        true
    ]);
});
```


## Modern `analytics.js`

You can use it when include the analytics like:

```javascript
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-XXXXXXXX-X', 'auto');
ga('send', 'pageview');
```

Here is [the manual](https://developers.google.com/analytics/devguides/collection/upgrade/reference/gajs-analyticsjs#events)
about updating Event Tracking to Universal Analytics (analytics.js)

### JavaScript errors

```javascript
// Pure JavaScript errors handler
window.addEventListener('error', function (err) {
    var lineAndColumnInfo = err.colno ? ' line:' + err.lineno +', column:'+ err.colno : ' line:' + err.lineno;
    ga(
        'send',
        'event',
        'JavaScript Error',
        err.message,
        err.filename + lineAndColumnInfo + ' -> ' +  navigator.userAgent,
        0,
        true
    );
});
```

### AngularJS exceptions handler

```javascript
// AngularJS errors handler
angular.module('loggerApp')
        .config(function ($provide) {
            $provide.decorator("$exceptionHandler", function ($delegate) {
                return function (exception, cause) {
                    $delegate(exception, cause);
                    ga(
                        'send',
                        'event',
                        'AngularJS error',
                        exception.message,
                        exception.stack,
                        0,
                        true
                    );
                };
            });
        });
```

### jQuery

#### jQuery errors

```javascript
// jQuery errors handler (jQuery API)
jQuery.error = function (message) {
    ga(
        'send',
        'event',
        'jQuery Error',
        message,
        navigator.userAgent,
        0,
        true
    );
}
```

#### jQuery AJAX errors handler

```javascript
// jQuery AJAX errors handler (jQuery API)
$(document).ajaxError(function (event, request, settings) {
    ga(
        'send',
        'event',
        'jQuery Ajax Error',
        settings.url,
        JSON.stringify({
            result: event.result,
            status: request.status,
            statusText: request.statusText,
            crossDomain: settings.crossDomain,
            dataType: settings.dataType
        }),
        0,
        true
    );
});
```


## Demo

In the prepared demos all output from developer console is shown in special block under buttons.

You can generate errors and check in "Network" tab that for each error GA sends request to:

1. `ga.js` - to `http://www.google-analytics.com/__utm.gif?...`
2. `analytics.js` - to `http://www.google-analytics.com/r/collect?...`

### Classic `ga.js`

<span data-height="270" data-theme-id="178" data-slug-hash="myLPeJ" data-user="malyw" data-default-tab="result" class="codepen"></span>

### Modern `analytics.js`

<span data-height="270" data-theme-id="178" data-slug-hash="MYGwzz" data-user="malyw" data-default-tab="result" class="codepen"></span>


## Checking analytics data in GA

In GA you can find two main reports for `Events`:

* **Real-Time Events**: GA :arrow_right: Real-Time :arrow_right: Events :arrow_right: Events (Last 30 min) (TAB)

<img src="http://i.imgur.com/xOGfMIo.png" alt="Real-Time Events"/>

* **Common Events Report**: GA :arrow_right: Behavior :arrow_right: Events :arrow_right: Overview :arrow_right: view full report (LINK)

<img src="http://i.imgur.com/YkUt26G.gif" alt="Common Events Report"/>

## `0, true` params in the end

These params mean respectively according [the manual](https://developers.google.com/analytics/devguides/collection/upgrade/reference/gajs-analyticsjs#events):

* `0` - opt_value (default value is `0`)

[Detailed info about this param](http://stackoverflow.com/a/22722302/1120798)

* `true` - opt_noninteraction (default value is `false`)

Is set to `true` to not affect the bounce rate. Here is [the description](http://stackoverflow.com/a/15651831/1120798) in more details


## Exceptions - Web Tracking (analytics.js)

[**Universal Analytics**](https://support.google.com/analytics/answer/2790010) proposes other way to track exceptions- [Exceptions - Web Tracking (analytics.js)](https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions).

But after some research it appeared that report for it is [not so easy to configure and even to find](http://stackoverflow.com/a/21718577/1120798).