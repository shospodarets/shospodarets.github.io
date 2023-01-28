/**
 * The Component Form element adds JS processing to the HTML forms.
 * USAGE EXAMPLE:
 * ---
 * <form
 *         class="component__form js-component-form"
 *         action="{{ site.subscribe.form_action }}"
 *         method="post"
 * >
 *     <label class="component__form-block">
 *         <span class="component__form-label">Name</span>
 *         <input placeholder="Your Name" class="input" type="text" name="name" required autocomplete='name'/>
 *     </label>
 *     <div class="component__form-block">
 *         <button class="sh-btn" type="submit">
 *             Send
 *         </button>
 *     </div>
 * </form>
 * ---
 *
 */
export default class ComponentForm {
    constructor(data) {
        /** * PROPERTIES ***/
        // data
        this.componentFormEl = data.componentFormEl;

        // form data
        this.componentFormAction = this.componentFormEl.action;
        this.componentFormMethod = this.componentFormEl.method;

        // DOM
        this.componentFormSubmitEl = this.componentFormEl.querySelector('[type="submit"]');
        // add UI state to the submit button UI
        this.componentFormSubmitEl.innerHTML += `
            <span class="component__form-icon-wrapper">
                <span class="component__form-icon component-form-loading">
                    <span class="loader component__form-loading"></span>
                </span>
                <span class="component__form-icon component-form-reject">
                    <span class="component__form-reject"></span>
                </span>
                <span class="component__form-icon component-form-success">
                    <span class="component__form-success">
                </span>
            </span>
        `;

        this.classNames = {
            // by a state
            loading: 'component-form-loading',
            reject: 'component-form-reject',
            success: 'component-form-success'
        };

        /** * METHODS ***/
        // EVENTS
        // Classes
        this.resetClassNames = () => {
            Object.values(this.classNames)
                .forEach((className) => {
                    this.componentFormEl.classList.remove(className);
                });
        };

        this.addClassName = (state) => {
            this.componentFormEl.classList.add(this.classNames[state]);
        };

        this.removeClassName = (state) => {
            this.componentFormEl.classList.remove(this.classNames[state]);
        };

        // Disable form
        this.disableForm = () => {
            this.componentFormSubmitEl.setAttribute('disabled', '');
        };

        this.enableForm = () => {
            this.componentFormSubmitEl.removeAttribute('disabled');
        };

        // EVENTS
        this.onSubmit = (event) => {
            event.preventDefault();

            this.sendForm();
        };

        // STATES
        this.onSuccess = () => {
            this.disableForm();
            this.addClassName('success');

            this.onFinally();
        };

        this.onReject = () => {
            this.enableForm();
            this.addClassName('reject');

            this.onFinally();
        };

        this.onBeforeSend = () => {
            this.isSending = true;

            this.resetClassNames();
            this.addClassName('loading');
        };

        this.onFinally = () => {
            this.isSending = false;

            this.removeClassName('loading');
        };

        // ACTION
        this.sendForm = () => {
            if (this.isSending) {
                return;
            }

            this.onBeforeSend();

            let fetchForm;
            if (this.componentFormMethod === 'post') {
                fetchForm = fetch(this.componentFormAction, {
                    method: 'post',
                    headers: new Headers({
                        'Accept': 'application/json'
                    }),
                    body: new FormData(this.componentFormEl) // collect form data
                });
            } else {
                fetchForm = fetch(this.componentFormAction);
            }
            fetchForm
                .then((res) => res.json())
                .then((_data) => {
                    if (_data.ok) {
                        this.onSuccess();
                    } else {
                        this.onReject();
                    }
                })
                .catch(this.onReject);
        };

        /** * INIT ***/
        // events
        this.componentFormEl.addEventListener('submit', this.onSubmit);
    }
}
