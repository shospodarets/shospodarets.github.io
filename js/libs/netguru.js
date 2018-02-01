const newtgureuWrapperEl = document.querySelector('.main-sidebar .scroller-area');

if (newtgureuWrapperEl) {
    newtgureuWrapperEl.innerHTML += `
        <div class="sidebar-box">
            <div class="sidebar-email">
                <a class="sidebar_netguru_logo" href="https://www.netguru.co/services/react-js">
                    Netguru - React.js Development
                </a>
            </div>
        </div>
        
        <style>
            .sidebar_netguru_logo{
                background: url(//www.netguru.co/hubfs/images/ico/favicon.ico) no-repeat 0 50%;
                background-size: auto 80%;
                padding-left: calc(3 * var(--spacer));
            }
        </style>
    `;
}