(function () {
    /**
     * PROCESSING TEMPLATES
     */
    function insertTemplates() {
        // VARS
        var wrapperEl = document.querySelector('.image-zoom-blocks');

        // PREPARING TEMPLATES
        var imageZoomBlockHtml = document.querySelector("#image-zoom-block-template").innerHTML;
        var imageZoomBlockTmpl = Handlebars.compile(imageZoomBlockHtml);

        var zoomSteps = [], i;
        var minZoomStep = 2;
        var maxZoomStep = 6;
        for (i = minZoomStep; i <= maxZoomStep; i++) {
            zoomSteps.push({
                zoomSteps: i
            });
        }

        // INSERTING TEMPLATES
        zoomSteps.forEach(function (zoomStep) {
            wrapperEl.innerHTML += imageZoomBlockTmpl(zoomStep);
        });
    }

    /**
     * PROCESSING TEMPLATE ACTIONS
     */
    function ZoomControl(imageZoomBlock) {
        // VARS
        this.scale = undefined;

        // DOM
        this.image = imageZoomBlock.querySelector('.image');
        this.minusBtn = imageZoomBlock.querySelector('.minusBtn');
        this.plusBtn = imageZoomBlock.querySelector('.plusBtn');
        this.indicator = imageZoomBlock.querySelector('.indicator');
        this.zoom = imageZoomBlock.querySelector('[data-zoom]');

        // getting Maximum Zoom Step from CSS
        var maxZoomStepCssValue = window.getComputedStyle(this.zoom).getPropertyValue('font-family');
        //var maxZoomStepCssValue = window.getComputedStyle(this.indicator, ':after').getPropertyValue('content')
        maxZoomStepCssValue = this.normalizeCssValue(
            maxZoomStepCssValue
        );
        this.maxZoomStep = JSON.parse(maxZoomStepCssValue).maxZoomStep;// parse JSON

        // INIT
        this.setScale(1);
        this.setDisabledState();

        // EVENTS
        this.minusBtn.addEventListener('click', this.onMinusClick.bind(this));
        this.plusBtn.addEventListener('click', this.onPlusClick.bind(this));
        this.zoom.addEventListener('click', this.onZoomClick.bind(this));
    }

    ZoomControl.prototype.onMinusClick = function () {
        if (this.scale > 1) {
            this.scale--;
        }
        this.setScale();
        this.setDisabledState();
    };

    ZoomControl.prototype.onPlusClick = function () {
        if (this.scale < this.maxZoomStep) {
            this.scale++;
        }
        this.setScale();
        this.setDisabledState();
    };

    ZoomControl.prototype.onZoomClick = function (e) {
        var zoomBoundingRect = this.zoom.getBoundingClientRect();
        var relativeClickX = e.clientX - zoomBoundingRect.left;
        var zoomWidth = zoomBoundingRect.right - zoomBoundingRect.left;
        var scaleSectionWidth = zoomWidth / this.maxZoomStep;

        var numberOfSectionClicked = Math.ceil(relativeClickX / scaleSectionWidth);
        this.setScale(numberOfSectionClicked);
        this.setDisabledState();
    };

    ZoomControl.prototype.setScale = function (scale) {
        scale = scale || this.scale;
        // set class
        this.zoom.className = 'zoom' + scale;
        // set transform
        this.image.style.webkitTransform = 'scale(' + scale + ')';
        this.image.style.msTransform = 'scale(' + scale + ')';
        this.image.style.transform = 'scale(' + scale + ')';

        // set model scale level
        this.scale = scale;
    };

    ZoomControl.prototype.normalizeCssValue = function (string) {
        if (string[0] === "'" || string[0] === "\"") {// first symbol
            string = string.substring(1);
        }
        if (string[string.length - 1] === "'" || string[string.length - 1] === "\"") {// last symbol
            string = string.substring(0, string.length - 1)
        }
        string = string.replace(/\\"/g, "\"");// normalize quotes (FF)
        return string;
    };

    ZoomControl.prototype.setDisabledState = function () {
        if (this.scale === 1) {
            this.minusBtn.classList.add('disabled');
            this.plusBtn.classList.remove('disabled');
        } else if (this.scale === this.maxZoomStep) {
            this.minusBtn.classList.remove('disabled');
            this.plusBtn.classList.add('disabled');
        } else {
            this.minusBtn.classList.remove('disabled');
            this.plusBtn.classList.remove('disabled');
        }
    };

    function addTemplateActions() {
        Array.prototype.slice.call(document.querySelectorAll('.image-zoom-block'), 0)
            .forEach(function (imageZoomBlock) {
                new ZoomControl(imageZoomBlock);
            });
    }

    /**
     * INIT
     */
    insertTemplates();
    addTemplateActions();
}());