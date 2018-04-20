$(document).ready(function() {
    // set height & width of the map div w.r.t. window height & navbar dims
    function setMapDimensions() {
        mapHeight = $(window).innerHeight() - $('#navbar').innerHeight();
        $('#map').css('min-height', mapHeight);
        $('#map').css('max-width', $('#navbar').innerWidth());
        if (typeof google != "undefined") {
            google.maps.event.trigger(map, "resize");
        }
    };
    setMapDimensions();

    $(window).resize(function() {
        setMapDimensions();
    });

    $('.navbar-toggler').click(function() {
        $('#sidebar').toggle();
        setMapDimensions();
    });
});

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: {lat: 25.18, lng: 55.35}
    });

    mosques.forEach(function(mosque) {
        new google.maps.Marker({
            position: {lat: mosque.lat, lng: mosque.lng},
            map: map
        });
    })
}
