class CopyrightNotice extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        const wrapper = document.createElement('span');
        const year = new Date().getFullYear();
        const siteTitle = this.getAttribute('data-site-title') || 'Datakoko';
        wrapper.textContent = `© ${year} ${siteTitle}`;
        shadow.appendChild(wrapper);
    }
}

customElements.define('copyright-notice', CopyrightNotice);