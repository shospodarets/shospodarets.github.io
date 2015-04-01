(function () {
    var appliedFilter = 'None filters are applied';

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
            appliedFilter = applyFilter();
        }
    }

    init();

    /**----------------
     * COMMON
     ------------------*/
    // VARS
    var btnReloadEl = document.querySelector('.btn-page-reload');
    var btnFilterRemoveEl = document.querySelector('.btn-filter-remove');

    document.querySelector('.applied-filter').innerHTML = appliedFilter;

    // EVENTS
    btnReloadEl.addEventListener('click', function () {
        window.location.reload();
    });

    btnFilterRemoveEl.addEventListener('click', function () {
        document.documentElement// <html/> ELEMENT
            .style[filterCssProperty] = '';
        document.querySelector('.applied-filter').innerHTML = '';
    });
}());