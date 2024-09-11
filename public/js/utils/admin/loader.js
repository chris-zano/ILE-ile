class LoadingSpinner {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.originalPosition = window.getComputedStyle(this.parentElement).position;

        if (this.originalPosition === 'static' || !this.originalPosition) {
            this.parentElement.style.position = 'relative';
        }

        this.overlay = document.createElement('div');
        this.overlay.className = 'loading-overlay';

        this.spinner = document.createElement('div');
        this.spinner.className = 'loading-spinner';

        // Append spinner to overlay
        this.overlay.appendChild(this.spinner);
    }

    show() {
        // Only append the overlay if it’s not already appended
        if (!this.overlay.parentElement) {
            this.parentElement.appendChild(this.overlay);
        }
    }

    hide() {
        if (this.overlay.parentElement) {
            this.overlay.parentElement.removeChild(this.overlay);
            // Reset parent element's position to its original value
            if (this.originalPosition === 'static' || !this.originalPosition) {
                this.parentElement.style.position = 'static';
            } else {
                this.parentElement.style.position = this.originalPosition;
            }
        }
    }
}












