$(document).ready(function () {
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
    function setBackgroundImage(summary) {
        var backgroundUrl;
        switch (summary.toLowerCase()) {
            case 'clear':
                backgroundUrl = 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xlYXIlMjBza3l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60';
                break;
            case 'clouds':
            case 'overcast':
                backgroundUrl = 'https://images.unsplash.com/photo-1525087740718-9e0f2c58c7ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2xvdWR5JTIwc2t5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60';
                break;
            case 'rain':
                backgroundUrl = 'https://images.unsplash.com/photo-1428592953211-077101b2021b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmFpbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60';
                break;
            case 'snow':
                backgroundUrl = 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c25vd3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60';
                break;
            default:
                backgroundUrl = 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xlYXIlMjBza3l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60';
        }
        $('#weather-background').css('background-image', 'url(' + backgroundUrl + ')');
    }

    // Initial call to set background image
    setBackgroundImage($('#summary').text());

    // Handle search form submission
    $('#search-form').submit(function (e) {
        e.preventDefault();
        var city = $('#city-search').val();
        // Here you would typically make an API call to get weather data for the searched city
        // For demonstration, we'll just update the city name and weather summary
        $('#city_name').text(city);
        var newSummary = ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)];
        $('#summary').text(newSummary);
        setBackgroundImage(newSummary);
        alert('Weather updated for ' + city);
        // Reset the form
        this.reset();
    }); 
});