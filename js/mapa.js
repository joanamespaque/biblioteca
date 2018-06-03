    var map;
    var infoWindow;
    var geocoder;

    function initMap() {
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      geocoder = new google.maps.Geocoder();
      map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: -15.7942287,
          lng: -47.8821658
        },
        zoom: 15
      });

      infoWindow = new google.maps.InfoWindow({
        map: map,
        maxWidth: 200
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          let usuario_marker = new google.maps.Marker({
            map: map,
            title: 'Você',
            icon: 'css/img/usuario-marker.png',
            animation: google.maps.Animation.DROP
          });

          usuario_marker.setPosition(pos);
          map.setCenter(pos);
          infoWindow = new google.maps.InfoWindow({
            maxWidth: 200
          });

          var service = new google.maps.places.PlacesService(map);
          service.nearbySearch({
            location: pos,
            radius: 5000,
            type: ['library']
          }, callback);

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

            // geocodePosition(pos);
            // function geocodePosition(pos) {
            //   geocoder.geocode({
            //     latLng: pos
            //   }, function(responses) {
            //     if (responses && responses.length > 0) {
            //       usuario_marker.formatted_address = responses[0].formatted_address;
            //     } else {
            //       usuario_marker.formatted_address = 'Cannot determine address at this location.';
            //     }
            //     infoWindow.setContent(usuario_marker.formatted_address + "<br>coordinates: " + usuario_marker.getPosition().toUrlValue(6));
            //     infoWindow.open(map, usuario_marker);
            //   });
            // }


            google.maps.event.addListener(marker, 'click', function () {
              service.getDetails(place, function (details, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  infoWindow.setContent(place.name + '<br> <button type="button" id="salvar">Salvar Endereço</button>');
                  console.log(details.formatted_address);
                  var buttonSalvar = document.querySelector("#salvar");
                  buttonSalvar.addEventListener('click', function (params) {
                    if (localStorage.getItem('bibliotecas') != null) {
                      if (localStorage.getItem('bibliotecas').indexOf(localStorage.getItem('nome')) === -1) {
                        Persistencia.adiciona(
                          'bibliotecas', {
                            nome: details.name,
                            endereco: details.formatted_address
                          });
                      }
                    } else {
                      Persistencia.adiciona(
                        'bibliotecas', {
                          nome: details.name,
                          endereco: details.formatted_address
                        });
                      localStorage.setItem('nome', details.name);

                    }
                  });
                }

                route(directionsService, directionsDisplay);

                function route(directionsService, directionsDisplay) {
                  directionsService.route({
                    origin: geocodePosition(pos),
                    destination: details.formatted_address,
                    travelMode: 'DRIVING'
                  }, function (response, status) {
                    if (status === 'OK') {
                      directionsDisplay.setDirections(response);
                    } else {
                      window.alert('Directions request failed due to ' + status);
                    }
                  });
                }

                function geocodePosition(pos) {
                  geocoder.geocode({
                    latLng: pos
                  }, function (responses) {
                    if (responses && responses.length > 0) {
                      usuario_marker.formatted_address = responses[0].formatted_address;
                    } else {
                      usuario_marker.formatted_address = 'Cannot determine address at this location.';
                    }
                  });
                  return usuario_marker.formatted_address;
                }
              });
              infoWindow.open(map, this);
            });

          }


        }, function () {
          handleLocationError(true, infoWindow, map.getCenter());
        }, {
          enableHighAccuracy: true,
          maximumAge: 20000,
          timeout: 20000
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }

    }
