class RatingWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const maxStars = this.getAttribute('max') || 5;

        const starsContainer = document.createElement('div');
        starsContainer.classList.add('stars-container');

      
        for (let i = 1; i <= maxStars; i++) {
            const star = document.createElement('span');
            star.innerText = '★'; 
            star.setAttribute('data-rating', i);
            star.addEventListener('mouseover', this.onStarHover.bind(this));
            star.addEventListener('click', this.onStarClick.bind(this));
            starsContainer.appendChild(star);
        }

        this.shadowRoot.appendChild(starsContainer);

        const form = document.createElement('form');
        form.setAttribute('action', 'https://httpbin.org/post');
        form.setAttribute('method', 'POST');
        form.addEventListener('submit', this.onSubmit.bind(this));

        form.innerHTML = this.innerHTML;

        this.shadowRoot.appendChild(form);
    }

    connectedCallback() {
        this.updateStyles();
    }

    static get observedAttributes() {
        return ['max', 'selected-color', 'unselected-color'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'max') {
            this.updateStars();
        } else {
            this.updateStyles();
        }
    }

    updateStars() {
        const maxStars = this.getAttribute('max') || 5;
        const starsContainer = this.shadowRoot.querySelector('.stars-container');
        starsContainer.innerHTML = '';

        for (let i = 1; i <= maxStars; i++) {
            const star = document.createElement('span');
            star.innerText = '★';
            star.setAttribute('data-rating', i);
            star.addEventListener('mouseover', this.onStarHover.bind(this));
            star.addEventListener('click', this.onStarClick.bind(this));
            starsContainer.appendChild(star);
        }
    }

    updateStyles() {
        const selectedColor = this.getAttribute('selected-color') || 'gold';
        const unselectedColor = this.getAttribute('unselected-color') || 'gray';

        this.style.setProperty('--selected-color', selectedColor);
        this.style.setProperty('--unselected-color', unselectedColor);
    }

    onStarHover(event) {
        const rating = event.target.getAttribute('data-rating');
        this.highlightStars(rating);
    }

    onStarClick(event) {
        const rating = event.target.getAttribute('data-rating');
        this.submitRating(rating);
    }

    onSubmit(event) {
        event.preventDefault();
        const rating = this.querySelector('#rating').value;
        this.submitRating(rating);
    }

    highlightStars(rating) {
        const stars = this.shadowRoot.querySelectorAll('.stars-container span');
        stars.forEach(star => {
            const starRating = star.getAttribute('data-rating');
            star.style.color = starRating <= rating ? this.style.getPropertyValue('--selected-color') : this.style.getPropertyValue('--unselected-color');
        });
    }

    submitRating(rating) {
        const formData = new FormData(this.shadowRoot.querySelector('form'));
        formData.set('rating', rating);

        const headers = new Headers();
        headers.append('X-Sent-By', 'JS');

        fetch('https://httpbin.org/post', {
            method: 'POST',
            headers: headers,
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
    }
}

customElements.define('rating-widget', RatingWidget);
