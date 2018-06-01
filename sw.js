self.addEventListener('install', function (event) {
    var indexPage = new Request('geolocation.html');
    event.waitUntil(
      fetch(indexPage).then(function (response) {
        caches.open('pwabuilder-offline').then(function (cache) {
          console.log('[PWA Builder] Cached index page during Install' + response.url);
          return cache.addAll([
            '/biblioteca/',
            '/biblioteca/geolocation.html',
            '/biblioteca/manifest.json',
            '/biblioteca/css/style.css',
            '/biblioteca/css/img/icons/icon-72x72.png',
            '/biblioteca/css/img/icons/icon-96x96.png',
            '/biblioteca/css/img/icons/icon-128x128.png',
            '/biblioteca/css/img/icons/icon-144x144.png',
            '/biblioteca/css/img/icons/icon-152x152.png',
            '/biblioteca/css/img/icons/icon-192x192.png',
            '/biblioteca/css/img/icons/icon-384x384.png',
            '/biblioteca/css/img/icons/icon-512x512.png',
            '/biblioteca/css/img/ICON.png',
            '/biblioteca/css/img/LOGO.png',
            '/biblioteca/css/img/usuario-marker.png',
            '/biblioteca/js/mapa.js',
            '/biblioteca/salvos.html',
            '/biblioteca/js/handlebars.js',
            '/biblioteca/js/persistencia.js',
            '/biblioteca/css/salvos.css'

          ]);
        });
      })
    );
  });
  
  
  //If any fetch fails, it will look for the request in the cache and serve it from there first
  self.addEventListener('fetch', function (event) {
    var updateCache = function (request) {
      return caches.open('pwabuilder-offline').then(function (cache) {
        return fetch(request).then(function (response) {
          console.log('[PWA Builder] add page to offline' + response.url)
          return cache.put(request, response);
        });
      });
    };
  
    event.waitUntil(updateCache(event.request));
  
    event.respondWith(
      fetch(event.request).catch(function (error) {
        console.log('[PWA Builder] Network request Failed. Serving content from cache: ' + error);
  
        //Check to see if you have it in the cache
        //Return response
        //If not in the cache, then return error page
        return caches.open('pwabuilder-offline').then(function (cache) {
          return cache.match(event.request).then(function (matching) {
            var report = !matching || matching.status == 404 ? Promise.reject('no-match') : matching;
            return report
          });
        });
      })
    );
  })
  