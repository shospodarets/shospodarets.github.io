const criticalCssStyleNode = document.querySelector('#critical-css');
const criticalCssUrl = '/css/critical-no-css-vars.css';

const nonCriticalCssLinkNode = document.querySelector('#non-critical-css');
const nonCriticalCssUrl = '/css/non-critical-no-css-vars.css';

const isCssVarsSupported = window.CSS && window.CSS.supports && window.CSS.supports('--a', 0);

if (!isCssVarsSupported) {
    // helpers
    const includeCss = function (href, onload) {
        const link = document.createElement("link");
        link.href = href;
        link.type = "text/css";
        link.rel = "stylesheet";

        document.head.appendChild(link);
        link.onload = onload;
    };

    const removeDomNode = function (node) {
        node.parentNode.removeChild(node);
    };

    // include new styles and remove previous ones
    includeCss(criticalCssUrl, () => {
        removeDomNode(criticalCssStyleNode);
    });

    includeCss(nonCriticalCssUrl, () => {
        removeDomNode(nonCriticalCssLinkNode);
    });
}