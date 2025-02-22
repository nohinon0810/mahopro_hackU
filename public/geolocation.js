function geoFindMe() {

    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');
    
    mapLink.href = '';
    mapLink.textContent = '';
    
    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(latitude);
      console.log(longitude);
      status.textContent = '';
      mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      mapLink.textContent = `Latitude: ${latitude} , Longitude: ${longitude} `;
    }
    
    function error() {
      status.textContent = 'Unable to retrieve your location';
    }
    
    if(!navigator.geolocation) {
      status.textContent = 'Geolocation is not supported by your browser';
    } else {
      status.textContent = 'Locating�c';
      navigator.geolocation.getCurrentPosition(success, error);
    }
    }

    function geoFindMe_latitude() {
      var latitude;

      function success(position) {
        latitude  = position.coords.latitude;
       }
      
      function error() {
        status.textContent = 'Unable to retrieve your location';
      }
      
      if(!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
      } else {
        console.log('Locating�c');
        navigator.geolocation.getCurrentPosition(success, error);
      }
      console.log(latitude);
//      return latitude;
      }

      function geoFindMe_longitude() {
        var longitude;
  
        function success(position) {
          longitude = position.coords.longitude;
        }
        
        function error() {
          status.textContent = 'Unable to retrieve your location';
        }
        
        if(!navigator.geolocation) {
          console.log('Geolocation is not supported by your browser');
        } else {
          console.log('Locating�c');
          navigator.geolocation.getCurrentPosition(success, error);
        }
        console.log(longitude);
//        return longitude;
        }