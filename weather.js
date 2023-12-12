class WeatherWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        if (!navigator.onLine) {
            this.renderOffline();
        } else {
            this.fetchWeatherData();
        }
    }

    renderOffline() {
        this.shadowRoot.innerHTML = `<p>Current Weather Conditions Unavailable</p>`;
    }

    async fetchWeatherData() {
        try {
            const apiKey = '5e0e5e9d2fcc5ee2a5752b72b8ce1321';
            const location = 'La Jolla,US';

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
            const data = await response.json();

            if (response.ok) {
                this.renderWeather(data);
            } else {
                this.renderError(data.message);
            }
        } catch (error) {
            this.renderError('An error occurred while fetching weather data.');
        }
    }

    renderWeather(data) {
        const temperature = Math.round(data.main.temp - 273.15); 
        const condition = data.weather[0].main;
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

        this.shadowRoot.innerHTML = `
            <div>
                <p>Temperature: ${temperature} °C</p>
                <p>Condition: ${condition}</p>
                <img src="${iconUrl}" alt="Weather Icon">
            </div>
        `;
    }

    renderError(message) {
        this.shadowRoot.innerHTML = `<p>Error: ${message}</p>`;
    }
}

customElements.define('weather-widget', WeatherWidget);
