import google from 'google';
export function geoCode(searchString){
  return new Promise((resolve,reject) => {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': searchString}, function(results, status) {
      console.log(results);
      resolve(results);
    })
  });
}
