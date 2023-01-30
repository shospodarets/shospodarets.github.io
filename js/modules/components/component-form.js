/**
 * The Component Form element adds JS processing to the HTML forms, and includes captcha before the submit button.
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
import {loadScript} from '../utils/utils.js';

export default class ComponentForm {
    constructor(options) {
        /**
         * SET REQUIRED PREREQUISITE PROPS
         */
        this.options = options;

        // dom elements
        this.componentFormEl = options.componentFormEl;
        this.componentFormSubmitEl = this.componentFormEl.querySelector('[type="submit"]');

        // form data
        this.componentFormAction = this.componentFormEl.action;
        this.componentFormMethod = this.componentFormEl.method;

        /**
         * HELP FUNCTIONS
         */
        const addFormStateHTML = () => {
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
        };

        const addStateChangeClassesAndFunctions = () => {
            this.classNames = {
                // by a state
                loading: 'component-form-loading',
                reject: 'component-form-reject',
                success: 'component-form-success'
            };

            // State change functions
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

            this.disableForm = () => {
                this.componentFormSubmitEl.disabled = true;
            };

            this.enableForm = () => {
                this.componentFormSubmitEl.disabled = false;
            };
        };

        const addOnStateChangeLogic = () => {
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
        };

        const loadAndApplyCaptcha = () => {
            this.componentFormSubmitEl.disabled = true;

            const captchaEl = document.createElement('label');
            captchaEl.classList.add('component__form-block');
            captchaEl.innerHTML = `
                <span class="component__form-label-inline">Captcha:</span>
                <input placeholder="enter captcha 👆 answer" class="input jCaptcha" type="number" autocomplete='number' name="captchaAnswer" required/>
            `;

            this.componentFormSubmitEl.before(captchaEl);
            loadScript(`${this.options.SITE_BASE_URL}/js/libs/js-captcha.min.js`)
                .then(() => {
                    // eslint-disable-next-line new-cap
                    this.formCaptcha = new window.jCaptcha({
                        el: '.jCaptcha',
                        canvasClass: 'jCaptchaCanvas',
                        canvasStyle: {
                            // properties for captcha stylings
                            width: 100,
                            height: 16,
                            textBaseline: 'top',
                            font: 'bold 20px Roboto, Arial, sans-serif',
                            textAlign: 'left',
                            fillStyle: '#4183c4'
                        },
                        // validate() call triggers "callback" function below
                        callback: (response /*, $captchaInputElement, numberOfTries*/) => {
                            // response => 'success' | 'error'
                            this.captchaResponseIsValid = response === 'success';
                        }

                    });
                })
                .finally(() => {
                    this.componentFormSubmitEl.disabled = false;
                });
        };

        /**
         * ------------------- MAIN ------------------
         */

        /**
         * LOAD AND ADD NEEDED HTML, PROPERTIES AND METHODS
         */
        loadAndApplyCaptcha();
        addFormStateHTML(); // add Form UI State elements into the submit button
        addStateChangeClassesAndFunctions();// add functions to change Form UI State
        addOnStateChangeLogic();

        /**
         * FORM ACTIONS LOGIC
         */

        this.onSubmit = (event) => {
            event.preventDefault();

            this.formCaptcha.validate();

            if (this.captchaResponseIsValid) {
                this.sendForm();
            }
        };

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
        this.componentFormEl.addEventListener('submit', this.onSubmit);
    }
}
