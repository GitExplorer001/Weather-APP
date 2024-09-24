# Simple Weather Forecast Map

This project is a simple weather forecast map built using **HTML**, **Bootstrap 5**, and **jQuery AJAX**. It integrates three different APIs to provide location-based weather data.

## APIs Used in This Project:

1. **OpenStreetMap API**:
    - This API is used for reverse geocoding, converting geographic coordinates into location names. It does not require an API key and has no limitations as long as data is provided.

2. **wft-geo-db API**:
    - This API provides city name suggestions while searching. You can find this API on [RapidAPI](https://rapidapi.com/wirefreethought/api/geodb-cities).
    - **API Key Requirement**: Yes, you need to log in to RapidAPI and subscribe to the free plan of wft-geo-db to obtain an API key.
    - **Limitations**:
        - Up to 10 pages of suggestions.
        - A radius limit of 100 KM.
        - 100 API calls per day.
        - 1 call per second.

3. **ai-weather-by-meteosource API**:
    - This is the main API used to obtain the place ID using coordinates, and then fetch current weather data, a 7-day daily forecast, and a 24-hour hourly forecast.
    - **API Key Requirement**: Yes, you can get a free trial key from [RapidAPI](https://rapidapi.com/MeteosourceWeather/api/ai-weather-by-meteosource).
    - **Limitations**:
        - Up to 20 API calls per minute.
        - Up to 100 calls per minute.

## Important Notes:

- You can substitute these APIs with others based on your requirements. If your application doesn’t need hourly and daily forecasts, consider using a different API as `ai-weather-by-meteosource` has a limited number of calls per month.

## Setting Up the Application:

1. Obtain your API keys for `ai-weather-by-meteosource` and `wft-geo-db` from [RapidAPI](https://rapidapi.com) (subscribe to their free plans).
2. Replace `YOUR-API-KEY-HERE` in the `script.js` file with your actual API keys (use `Ctrl + H` to find and replace all instances).

## Disclaimer:

This content is owned by **Anish Ghosh** ([GitHub Profile](https://github.com/GitExplorer001)) and is meant to be distributed for free. Any individual attempting to sell a copy may face consequences.

© [github.com/GitExplorer001](https://github.com/GitExplorer001)
