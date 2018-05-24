    // This example requires the Places library. Include the libraries=places
    // parameter when you first load the API. For example:
    // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
    var map;
    var infowindow;
    var pos;

    function initMap() {
      var pyrmont = {
        lat: -32.0328672,
        lng: -52.1005346
      };

      map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
      });
      // infowindow = new google.maps.InfoWindow();
      // var service = new google.maps.places.PlacesService(map);
      // service.nearbySearch({
      //   location: pyrmont,
      //   radius: 500,
      //   type: ['library']
      // }, callback);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
      // infowindow = new google.maps.InfoWindow();
      // var service = new google.maps.places.PlacesService(map);
      //     service.nearbySearch({
      //       location: pos,
      //       radius: 500,
      //       type: ['library']
      //     }, callback);
          let usuario_marker = new google.maps.Marker({
            map: map,
            title: 'usuario',
            icon: 'css/img/usuario-marker.png'
          });
          usuario_marker.setPosition(pos);
          map.setCenter(pos); //colocar a posicao atual
          map.setZoom(17);

        }, function () {
          handleLocationError(true, usuario_marker, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, usuario_marker, map.getCenter());
      }
    }

    function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      }
    }

    function createMarker(place) {
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });
      google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
      });
    }