# visibility-classes

**visibility-classes** is a set of classes which you can use in your HTML to show elements based on a screen width.

## Demo

[Visibility classes demo](http://blog.hospodarets.com/demos/visibility-classes/)

## Install

Library is available via **bower**:

```bash
bower install visibility-classes --save
```

or you can just download it [from Github](https://github.com/malyw/visibility-classes)

## Include

### Sass

Import `sass/visibility-classes.scss` library file:

```sass
@import "bower_components/visibility-classes/sass/visibility-classes";
```

### CSS

Include `css/visibility-classes.min.css` CSS library file in your HTML:

```html
<link rel="stylesheet" href="bower_components/visibility-classes/css/visibility-classes.min.css"/>
```

## Usage

You can use set of HTML classes to show elements depending on a screen width.

Library provides the following **breakpoints**:

```
phone-portrait: 480px,
phone-landscape:640px,
tablet-portrait: 768px,
tablet-landscape: 1024px,
desktop-small: 1200px
```

They can be changed pre-defining the `$mediaBreakPoints` Sass map variable before including the library *.scss file
(check `sass/mixins/_media-queries-mixin.scss` for details).

Also ***visibility classes prefix*** is set to:

`show-for-`

(can be customized pre-defining `$visibilityClassesPrefix` Sass variable)

Using this prefix and any key from the list, you can use visibility classes like:

* **`.show-for-BREAKPOINT_NAME-only`**

Description: Shows element only for the specific screen width

Example: `.show-for-desktop-small-only`

* **`.show-for-BREAKPOINT_NAME-down`**

Description: Shows element only when the screen width is equal or smaller then specified

Example: `.show-for-tablet-landscape-down`

* **`.show-for-BREAKPOINT_NAME-up`**

Description: Shows element only when the screen width is equal or bigger then specified

Example: `.show-for-tablet-portrait-up`

### Media Breakpoints Sass Mixin

In addition the library contains the `media` Sass mixin which you can use to provide custom media queries rules.
It reuses media breakpoints provided in the `$mediaBreakPoints` Sass map variable.
Usage examples:

```scss
// styles to be applied for 'phoneLandscape' and smaller (2 equal options to use):
@include media($smaller: 'phone-landscape') {...}
@include media('', 'phone-landscape') {...}

// styles to be applied for 'tabletPortrait' and bigger (2 equal options):
@include media($bigger: 'tablet-portrait') {...}
@include media('tablet-portrait', '') {...}

// styles to be applied for tablets (2 options):
@include media('tablet-portrait', 'tablet-landscape') {...}
@include media($bigger: 'tablet-portrait', $smaller: 'tablet-landscape') {...}
```

## Run the build and watch

```bash
npm install
grunt
```