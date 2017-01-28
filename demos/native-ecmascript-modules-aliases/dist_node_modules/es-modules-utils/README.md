# Native ECMAScript modules utilities

## Installation

* With npm: `npm install es-modules-utils`
* With yarn: `yarn add es-modules-utils`
* Manually: get [this file](https://raw.githubusercontent.com/malyw/es-modules-utils/master/es-js-script.js)

## Usage

### es-js-script

The utility script is expected to be included in HTML, e.g.:

```html
<script
        src="es-modules-utils/es-js-script-include.js"
        
        es="js/main-native.js"
        js="dist/app.bundle.js"
        add-global-class
></script>
```

Params:

- `es="%URL%"`: the URL of the script file, which will be loaded in case browser DOESN'T support native ECMAScript modules
- `js="%URL%"`: the URL of the script file, which will be loaded in case browser DOES support native ECMAScript modules
- `add-global-class`: the binary attribute, if present makes the script to add the 'esmodules'/'no-esmodules'
HTML classes to `<html>` element depending on the ES modules support in the browser

---

![alt](https://hospodarets.com/img/blog/1482849729640077000.png)