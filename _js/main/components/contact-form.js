export default class ContactForm {
    constructor(data) {
        // data
        this.contactFormEl = data.contactFormEl;
        this.CONTACT_EMAIL = data.CONTACT_EMAIL + '@gmail.com';

        // DOM
        this.contactFormSubmitEl = this.contactFormEl.querySelector('[type="submit"]');

        this.classNames = {
            // by a state
            loading: 'contact-form-loading',
            reject: 'contact-form-reject',
            success: 'contact-form-success'
        };

        // events
        this.contactFormEl.addEventListener('submit', this.onSubmit);
    };

    // EVENTS
    // Classes
    resetClassNames = () => {
        Object.values(this.classNames).forEach((className) => {
            this.contactFormEl.classList.remove(className);
        });
    };

    addClassName = (state) => {
        this.contactFormEl.classList.add(
            this.classNames[state]
        );
    };

    removeClassName = (state) => {
        this.contactFormEl.classList.remove(
            this.classNames[state]
        );
    };

    // Disable form
    disableForm = () => {
        this.contactFormSubmitEl.setAttribute('disabled', '');
    };

    enableForm = () => {
        this.contactFormSubmitEl.removeAttribute('disabled');
    };

    // EVENTS
    onSubmit = (event) => {
        event.preventDefault();

        this.sendForm();
    };

    // STATES
    onSuccess = () => {
        this.disableForm();
        this.addClassName('success');

        this.onFinally();
    };

    onReject = () => {
        this.enableForm();
        this.addClassName('reject');

        this.onFinally();
    };

    onBeforeSend = () => {
        this.isSending = true;

        this.resetClassNames();
        this.addClassName('loading');
    };

    onFinally = () => {
        this.isSending = false;

        this.removeClassName('loading');
    };

    // ACTION
    sendForm = () => {
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
            .then((data) => {
                if (data.success) {
                    this.onSuccess();
                } else {
                    this.onReject();
                }
            })
            .catch(this.onReject);
    }
};