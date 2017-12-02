export default class ContactForm {
    constructor(data) {
        /** * PROPERTIES ***/
        // data
        this.contactFormEl = data.contactFormEl;
        this.CONTACT_EMAIL = `${data.CONTACT_EMAIL}@gmail.com`;

        // DOM
        this.contactFormSubmitEl = this.contactFormEl.querySelector('[type="submit"]');

        this.classNames = {
            // by a state
            loading: 'contact-form-loading',
            reject: 'contact-form-reject',
            success: 'contact-form-success'
        };


        /** * METHODS ***/
        // EVENTS
        // Classes
        this.resetClassNames = () => {
            Object.values(this.classNames).forEach((className) => {
                this.contactFormEl.classList.remove(className);
            });
        };

        this.addClassName = (state) => {
            this.contactFormEl.classList.add(
                this.classNames[state]
            );
        };

        this.removeClassName = (state) => {
            this.contactFormEl.classList.remove(
                this.classNames[state]
            );
        };

        // Disable form
        this.disableForm = () => {
            this.contactFormSubmitEl.setAttribute('disabled', '');
        };

        this.enableForm = () => {
            this.contactFormSubmitEl.removeAttribute('disabled');
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

            // https://formspree.io/
            fetch(`https://formspree.io/${this.CONTACT_EMAIL}`, {
                method: 'post',
                headers: new Headers({
                    'Accept': 'application/json'
                }),
                body: new FormData(this.contactFormEl)
            })
                .then((res) => res.json())
                .then((_data) => {
                    if (_data.success) {
                        this.onSuccess();
                    } else {
                        this.onReject();
                    }
                })
                .catch(this.onReject);
        };


        /** * INIT ***/
        // events
        this.contactFormEl.addEventListener('submit', this.onSubmit);
    }
}