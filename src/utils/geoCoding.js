import google from 'google';
export function geoCode(searchString){
  return new Promise((resolve) => {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': searchString}, function(results) {
      console.log(results);
      resolve(results);
    });
  });
}
