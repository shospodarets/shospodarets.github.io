// import.meta hosts metadata about the current module
// !!! is populated runtime
// "typeof(import)" or "import && import.meta" throw errors

/**
 * @param {String} import.meta.url
 *  - URL to the current module
 *   to resolve resources relative to the module file
 *   (as __dirname not available)
 * @param {Object} import.meta.scriptElement
 *  - reference to the script which loaded modules
 *   to pass options e.g. <script data-option="value" />
 *   [as document.currentScript not available]
 * @param {String} import.meta.entryUrl (under review)
 *   to detect the main module
 *   (as process.mainModule not available)
 */
console.log(import.meta);