---
layout: post
title: Provide a cool effects for the 1 of April with CSS filters
tags: [CSS]
share_image: http://i.imgur.com/VnF9zsP.png
share_description: Implement wonderful
---

And here is the April 1st!

We already have some jokes from Google like [com.google](https://com.google/) and [Pac-Man in Google Maps](http://www.theguardian.com/cities/2015/apr/01/pac-man-google-maps).

There is [the list of others](http://www.theguardian.com/world/live/2015/apr/01/april-fools-day-jokes-2015-the-best-from-around-the-world).

So, want to provide some nice effect for your site/page? It's easy to do adding only one line of CSS- [CSS filter](http://blog.gospodarets.com/CSS_filters_in_action/).

<div class="text-center">
    <p>
        <a href="{{ site.baseurl }}/demos/april_fools_day_css_filters/">
            <img class="rounded" width="400" src="http://i.imgur.com/HwT3PvG.gif" alt=""/>
        </a>
    </p>

    <div>
        <a href="{{ site.baseurl }}/demos/april_fools_day_css_filters/"
           target="_blank"
           class="btn-pulse">
            <span class="wrapper">
                <span class="inner"></span>
            </span>
            <span class="text">Demo</span>
        </a>
    </div>
</div>

<div class="more"></div>

## Script

Let's provide a JavaScript which automatically applies one of the predefined CSS filters to your page with some frequency.

```javascript
/**----------------
 * APRIL FOOLS' DAY CSS FILTERS
 ------------------*/

/**
 * Filters values to be applied (one might be applied)
 * @type {Array}
 */
var FILTER_VALUES = [
    'hue-rotate(72deg) saturate(3) sepia(0.2)',
    'brightness(0.9) hue-rotate(180deg) invert(1)',
    'grayscale(0.1) saturate(1) sepia(0.6)',
    'grayscale(1)',
    'blur(1px)',
    'hue-rotate(180deg)',
    'saturate(2)'
];

/**
 * Return css string
 * @param prop {String}
 * @param value {String}
 * @returns {String}
 */
function getCssDeclaration(prop, value) {
    return prop + ':' + value + ';';
}

/**
 * Checks which vendor prefix has to be used for "filter" in CSS
 */
var filterCssProperty = (function () {
    var el = document.createElement('div'),
            vendors = [
                '-moz-filter',
                '-webkit-filter',
                '-ms-filter'
            ],
            valueToCheck = 'invert(0.1)',
            i, length, vendor,
            _filterProperty;
    for (i = 0, length = vendors.length; i < length; i++) {
        vendor = vendors[i];
        el.style.cssText = getCssDeclaration(vendor, valueToCheck);
        if (el.style.length) {
            _filterProperty = vendor;
            break;
        }
    }
    if (!_filterProperty) {// vendor isn't needed
        _filterProperty = 'filter';
    }
    return _filterProperty;
}());

/**
 * Gets random filter form the list
 * @returns {String}
 */
function getCustomFilterValue() {
    return FILTER_VALUES[
            Math.floor(
                    Math.random() * FILTER_VALUES.length
            )
            ];
}

function applyFilter() {
    var filterValue = getCustomFilterValue();
    document.documentElement// <html/> ELEMENT
            .style[filterCssProperty] = filterValue;
    return filterCssProperty + ': ' + filterValue;
}

/**
 * INIT
 */
function init() {
    // CHECK THE DATE
    var checkDate = true;

    var dateNow = new Date();
    var day = dateNow.getDate();
    var month = dateNow.getMonth() + 1;
    if (checkDate) {
        if (day !== 1 || month !== 4) {// APPLY ONLY AT APRIL 1
            return;
        }
    }

    // FREQUENCY OF APPEARING
    var frequencyOfAppearing = '100%';
    frequencyOfAppearing = parseFloat(frequencyOfAppearing);
    if (Math.random() * 100 > (100 - frequencyOfAppearing)) {// APPLY IN COMMON ONCE PER 5 PAGE LOADS
        applyFilter();
    }
}

init();
```

## Settings

- If you want to make this joke work not only at April 1- set `checkDate` to `false`.
- To set frequency of appearing use `frequencyOfAppearing` (it takes percents from "0%" to "100%").
- Add you filter values to be applied to `FILTER_VALUES`. If you want to play with CSS filters and find the best- you can use range sliders in [CSS filters DEMO](http://blog.gospodarets.com/css-filters/)

<a href="{{ site.baseurl }}/demos/april_fools_day_css_filters/"
   target="_blank"
   class="btn-pulse">
            <span class="wrapper">
                <span class="inner"></span>
            </span>
    <span class="text">Demo</span>
</a>

