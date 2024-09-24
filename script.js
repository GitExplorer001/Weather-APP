$(document).ready(function () {
    // by default, get the location from browser and process
    getCurrentLocation();
    function getCurrentLocation() {
        // Check if Geolocation is supported by the browser
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                // Call function to get the location name
                getLocationName(latitude, longitude);

            }, function (error) {
                console.error('Error Code: ' + error.code);
                console.error('Error Message: ' + error.message);
                alert('Please allow location access or search for your city.');
            });
        } else {
            alert('Geolocation is not supported by this browser. Please search for your city.');
        }
    }

    // Function to get the location name using reverse geocoding
    function getLocationName(lat, lon) {
        $.ajax({
            url: 'https://nominatim.openstreetmap.org/reverse',
            data: {
                format: 'json',
                lat: lat,
                lon: lon
            },
            success: function (response) {
                var city = response.address.city || response.address.town || response.address.village;
                $('#city_name').text(city);
                console.log(city)
                find(city);
            },
            error: function () {
                alert('Unable to retrieve location name. Please search for your city.');
            }
        });
    }

    // suggest city names
    $('#city').on('input', function () {
        const query = $(this).val();
        if (query.length > 0) {
            $.ajax({
                url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`,
                method: 'GET',
                headers: {
                    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
                    'x-rapidapi-key': 'YOUR-API-KEY-HERE'
                },
                success: function (data) {
                    const suggestBox = $('#suggestBox');
                    suggestBox.empty(); // Clear previous suggestions

                    if (data.data && data.data.length > 0) {
                        data.data.forEach(city => {
                            const div = $('<div class="suggestion"></div>').text(city.name + ', ' + city.country);
                            div.on('click', function () {
                                $('#city').val(city.name + ', ' + city.country);
                                suggestBox.empty().css('visibility', 'hidden');
                            });
                            suggestBox.append(div);
                        });
                        suggestBox.css('visibility', 'visible');
                    } else {
                        suggestBox.css('visibility', 'hidden');
                    }
                },
                error: function () {
                    $('#suggestBox').css('visibility', 'hidden');
                }
            });
        } else {
            $('#suggestBox').css('visibility', 'hidden');
        }
    });

    $(document).on('click', function () {
        $('#suggestBox').css('visibility', 'hidden'); // Hide suggestions on outside click
    });

    // when submit button pressed
    $('form').submit(function (e) {
        e.preventDefault();
        city = $('#city').val() || 'Kolkata';
        find(city);
        city_name.innerHTML = city;
    });

    // function to find the city
    function find(city) {
        $('#loadingSpinnercontain').css('display', 'flex');
        const settings = {
            async: true,
            crossDomain: true,
            url: 'https://ai-weather-by-meteosource.p.rapidapi.com/find_places?text=' + encodeURIComponent(city),
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'YOUR-API-KEY-HERE',
                'x-rapidapi-host': 'ai-weather-by-meteosource.p.rapidapi.com'
            }
        };

        $.ajax(settings).done(function (response) {
            city_id = (response[0].place_id);
            fetchWeather(city_id)
            fetchDaily(city_id)
            fetchHourly(city_id)
        });

        $.ajax(settings).fail(function (jqXHR, textStatus, errorThrown) {
            $('#loadingSpinnercontain').hide();
            console.error('Error fetching data:', jqXHR.status);
            if (jqXHR.status === 429) {
                $('.card1').html('<h1 class="m-auto text-warning">The project uses a "FREE TRIAL" version of weather API. It has limited number of access, which was already used up. Please be patient untill the issue is sorted out.</h1><h3>Please notify to the owner if possible.</h3>');
            }
            else {
                alert('An error occurred while fetching data. Please try again later.');
            }

        });
    }

    // Function to post today's weather
    function fetchWeather(city_id) {
        const settings = {
            async: true,
            crossDomain: true,
            url: 'https://ai-weather-by-meteosource.p.rapidapi.com/current?place_id=' + encodeURIComponent(city_id) + '&units=metric',
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'YOUR-API-KEY-HERE',
                'x-rapidapi-host': 'ai-weather-by-meteosource.p.rapidapi.com'
            }
        };
        $.ajax(settings).done(function (response) {
            $('#loadingSpinnercontain').hide();
            temperature.innerHTML = response.current.temperature + '&#8451;'
            $('#temperature').append('<h5> Feels Like: ' + response.current.feels_like + '&#8451;</h5>')
            timezone_.innerHTML = response.timezone
            timezone = response.timezone
            icon.src = 'icons/' + response.current.icon_num + '.png'
            icon1.src = 'icons/' + response.current.icon_num + '.png'
            summary.innerHTML = response.current.summary
            summary1.innerHTML = response.current.summary
            rain.innerHTML = response.current.precipitation.total + 'mm (' + response.current.precipitation.type + ')'
            clouds.innerHTML = response.current.cloud_cover + '%'
            humid.innerHTML = response.current.humidity + '%'
            uv.innerHTML = response.current.uv_index
            pres.innerHTML = response.current.pressure + 'mbar'
            speed.innerHTML = response.current.wind.speed + 'km/h'
            gust.innerHTML = 'Gust: ' + response.current.wind.gusts + 'km/h'
            direct_img.src = '/dir_img/' + response.current.wind.dir + '.png'
            switch (response.current.wind.dir) {
                case 'N':
                    dir = 'North';
                    break;
                case 'NNE':
                    dir = 'North-Northeast';
                    break;
                case 'NE':
                    dir = 'Northeast';
                    break;
                case 'ENE':
                    dir = 'East-Northeast';
                    break;
                case 'E':
                    dir = 'East';
                    break;
                case 'ESE':
                    dir = 'East-Southeast';
                    break;
                case 'SE':
                    dir = 'Southeast';
                    break;
                case 'SSE':
                    dir = 'South-Southeast';
                    break;
                case 'S':
                    dir = 'South';
                    break;
                case 'SSW':
                    dir = 'South-Southwest';
                    break;
                case 'SW':
                    dir = 'Southwest';
                    break;
                case 'WSW':
                    dir = 'West-Southwest';
                    break;
                case 'W':
                    dir = 'West';
                    break;
                case 'WNW':
                    dir = 'West-Northwest';
                    break;
                case 'NW':
                    dir = 'Northwest';
                    break;
                case 'NNW':
                    dir = 'North-Northwest';
                    break;
                default:
                    dir = 'Unknown';
                    break;
            }
            dir1.innerHTML = dir
            updateTime(timezone);
            setBackgroundImage(response.current.icon_num);
            console.log(response.current.icon_num);
        });
    }
    // daily updater
    function fetchDaily(city_id) {
        const settings = {
            async: true,
            crossDomain: true,
            url: 'https://ai-weather-by-meteosource.p.rapidapi.com/daily?place_id=gobardanga&language=en&units=auto',
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'YOUR-API-KEY-HERE',
                'x-rapidapi-host': 'ai-weather-by-meteosource.p.rapidapi.com'
            }
        };
        $('#carouselExampleIndicators').carousel('dispose');
        $.ajax(settings).done(function (response) {
            let stat = "active";
            $('#daily-slider').html('')
            for (let k = 1; k < 8; k++) {
                let date = response.daily.data[k].day;
                let dateParts = date.split('-');
                let formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                let summary = response.daily.data[k].summary
                let summary_print = summary.split('.')[0] + '.';
                $('#daily-slider').append(
                    "<div class='carousel-item " + stat + "'>" +
                    "<div class='carousel-content'>" +
                    "<div id='daily-card' class='card m-auto' style='position: relative;'>" +
                    "<div class='card-body'>" +
                    "<div style='display: flex; justify-content: space-between; align-items: start;'>" +
                    "<h5 class='card-title'>" + formattedDate + "</h5>" +
                    "<img src='icon-forecast/" + response.daily.data[k].icon + ".png' alt='Weather Icon' style='height: 50px; width: 50px; position: absolute; top: 15px; right: 15px;'>" +
                    "</div>" +
                    "<h6 class='card-subtitle mb-2'>" + response.daily.data[k].temperature_max + "&#8451; / " + response.daily.data[k].temperature_min + "&#8451;</h6>" +
                    "<p class='card-text'>" + summary_print + "</p>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
                );
                stat = "";
                $('#carouselExampleIndicators').carousel();
            }
        });
    }

    // time updater
    function updateTime(timezone) {
        let currentDateTime = new Date().toLocaleString("en-US", {
            timeZone: timezone
        });
        currentDateTime = formatDateTime(currentDateTime)
        $('#current-time').text(currentDateTime);
    }

    // function to format the date and time
    function formatDateTime(isoDate) {
        let dateObj = new Date(isoDate);
        let time = dateObj.toLocaleTimeString("en-US", {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
        let date = dateObj.toLocaleDateString("en-GB", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        return `${time} ${date}`;
    }



    // Function to get hourly update
    function fetchHourly(city_id) {
        const settings = {
            async: true,
            crossDomain: true,
            url: 'https://ai-weather-by-meteosource.p.rapidapi.com/hourly?place_id=' + encodeURIComponent(city_id) + '&timezone=auto&language=en&units=metric',
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'YOUR-API-KEY-HERE',
                'x-rapidapi-host': 'ai-weather-by-meteosource.p.rapidapi.com'
            }
        };

        $.ajax(settings).done(function (response) {
            const hourlyCarouselInner = $('#hourlyCarouselInner');
            hourlyCarouselInner.empty(); // Clear any existing items

            let data = [];
            for (let i = 0; i < 24; i++) { // Assuming you have 24 hourly data points
                data.push(response.hourly.data[i]);
            }

            function updateTime(timezone) {
                let currentDateTime = new Date().toLocaleString("en-US", {
                    timeZone: timezone
                });
                return new Date(currentDateTime);
            }

            let currentTime = updateTime(response.timezone);

            // Loop through each hourly forecast and create a carousel item
            let carouselItems = '';
            data.forEach((hour, index) => {
                let time = formatDateTime(hour.date);
                let itemClass = index === 0 ? 'carousel-item active' : 'carousel-item';

                // Start a new group every 4 items
                if (index % 4 === 0) {
                    if (index !== 0) {
                        carouselItems += '</div></div>'; // Close previous group
                    }
                    carouselItems += `<div class="${itemClass}"><div class="row">`;
                }

                // Add the hourly forecast
                carouselItems += `
                <div class="col-3 text-center">
                    <p class="mb-0 hour_phone">${time}</p>
                    <img src="icon-forecast/${hour.icon}.png" class="mx-auto" alt="Weather Icon">
                    <p class="mb-0">${hour.temperature}&#8451;</p>
                </div>
            `;

                // Close the group if it's the last item
                if (index === data.length - 1) {
                    carouselItems += '</div></div>';
                }
            });

            // Append the constructed items to the carousel
            hourlyCarouselInner.append(carouselItems);

            // Custom carousel behavior for sliding one item at a time while showing four
            $('#hourlyCarousel').on('slide.bs.carousel', function (e) {
                const $e = $(e.relatedTarget);
                const idx = $e.index();
                const totalItems = $('.carousel-item').length;
                const itemsVisible = 1;

                if (idx >= totalItems - (itemsVisible - 1)) {
                    const it = itemsVisible - (totalItems - idx);
                    for (let i = 0; i < it; i++) {
                        // Append slides to end
                        if (e.direction === 'left') {
                            $('.carousel-item').eq(i).appendTo('.carousel-inner');
                        } else {
                            $('.carousel-item').eq(0).appendTo('.carousel-inner');
                        }
                    }
                }
            });
        });
    }


    // Add click event to daily forecast items
    $('#dailyCarousel .carousel-item .col').click(function () {
        $(this).addClass('bg-primary text-white').siblings().removeClass('bg-primary text-white');
    });

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Dark mode toggle
    $('#theme-toggle-checkbox').change(function () {
        if (this.checked) {
            $('body').addClass('dark-mode');
            $('.theme-toggle').addClass('dark');
        } else {
            $('body').removeClass('dark-mode');
            $('.theme-toggle').removeClass('dark');
        }
    });

    // Set background image based on weather summary
    function setBackgroundImage(num) {
        var backgroundUrl;
        console.log(num);
        num = num.toString();
        switch (num) {
            case '2':
                backgroundUrl = 'bg_images/clear.png';
                break;
            case '3':
            case '4':
                backgroundUrl = 'bg_images/cloudy.png';
                break;
            case '5':
            case '6':
            case '7':
            case '8':
                backgroundUrl = 'bg_images/cloudy2.png';
                break;
            case '9':
                backgroundUrl = 'bg_images/darkcloud.png';
                break;
            case '10':
            case '11':
            case '12':
            case '13':
                backgroundUrl = 'bg_images/rain.png';
                break;
            case '14':
            case '15':
                backgroundUrl = 'bg_images/thunderstorm.png';
                break;
            case '16':
            case '17':
            case '18':
            case '19':
            case '23':
            case '24':
            case '25':
                backgroundUrl = 'bg_images/snow.png';
                break;
            case '20':
            case '21':
            case '22':
                backgroundUrl = 'bg_images/snow_rain.png';
                break;
            case '26':
                backgroundUrl = 'bg_images/clear_night.png';
                break;
            case '27':
            case '28':
            case '29':
                backgroundUrl = 'bg_images/cloud_night.png';
                break;
            case '30':
            case '31':
                backgroundUrl = 'bg_images/cloud1_night.png';
                break;
            case '32':
            case '33':
                backgroundUrl = 'bg_images/rainy_night.png';
                break;
            case '34':
            case '35':
            case '36':
                backgroundUrl = 'bg_images/snowy_night.png';
                break;
            default:
                backgroundUrl = 'bg_images/default.png';
        }
        $('#weather-background').css('background-image', 'url(' + backgroundUrl + ')');
    }

    // Initial call to set background image
    setBackgroundImage($('#summary').text());

    //Add more function here


});
