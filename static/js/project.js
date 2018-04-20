$(document).ready(function() {
    // set height & width of the map div w.r.t. window height & navbar dims
    function setMapDimensions() {
      mapHeight = $(window).innerHeight() - $('#navbar').innerHeight();
      $('#map').css('min-height', mapHeight);
      $('#map').css('max-width', $('#navbar').innerWidth());
    };
    setMapDimensions();

    $(window).resize(function() {
        setMapDimensions();
    });

    $('.navbar-toggler').click(function() {
        $('#sidebar').toggle();
    });
});

function initMap() {
    var home = {lat: 25.1241486, lng: 55.4002215};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: home
    });
    var marker = new google.maps.Marker({
        position: home,
        map: map
    });
}
