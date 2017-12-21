const axios = require("axios");

// TODO Get API Key here: https://developers.google.com/maps/documentation/javascript/get-api-key
const GOOGLE_API_KEY = "<YOUR_API_KEY>"

const URL_TEMPLATE = "https://maps.googleapis.com/maps/api/geocode/json?address={{target}}&key={{GOOGLE_API_KEY}}"

// List pulled from: https://github.com/rhiever/optimal-roadtrip-usa/blob/gh-pages/europe-trip3.html
const destinations = ["Innsbruck, Austria", "Gozo, Malta", "Munich, Germany", "Pag, Croatia", "Venice, Italy", "Tuscany, Italy", "Florence, Italy", "Rome, Italy", "Vatican City", "Amalfi, Italy","Gozo, Malta", "Krakow, Poland", "Dubrovnik, Croatia", "Santorini, Thira, Greece", "Rila Monastery, Rilski manastir, Bulgaria", "Istanbul, Turkey", "Sighisoara, Mures County, Romania", "Budapest, Hungary", "Vienna, Austria", "Prague, Czech Republic","Krakow, Poland", "Edinburgh, United Kingdom", "Jägala, 74205 Harjumaa, Estonia", "Lapland, Finland", "ICEBAR, Marknadsvägen, Jukkasjärvi, Sweden", "Bergen, Norway", "Copenhagen, Denmark", "Berlin, Germany", "Amsterdam, Netherlands", "Keukenhof, Stationsweg, Lisse, Netherlands","Edinburgh, United Kingdom", "Pamplona, Spain", "Inverness, United Kingdom", "Ballybunion, Ireland", "Cliffs of Moher, Clare, Ireland", "Cornwall, England", "Stonehenge, Amesbury, United Kingdom", "London, United Kingdom", "Brussels, Belgium", "Paris, France","Pamplona, Spain", "Innsbruck, Austria", "Lagos, Portugal", "Granada, Spain", "Ibiza, Spain", "Barcelona, Spain", "Luberone, Bonnieux, France", "Nice, France", "Monte Carlo, Monaco", "Interlaken, Switzerland"]

var coordinates = []
var promises = []

destinations.forEach(function(e){
	var url = generateUrl(e)
	promises.push(axios.get(url))
})

axios
  .all(promises)
  .then(response => {
  		for(r of response){
  			if(r && r.data && r.data.results && r.data.results[0] && r.data.results[0].geometry && r.data.results[0].geometry && r.data.results[0].geometry.location){
  				var location = r.data.results[0].geometry.location
  				var latLong = [location.lat, location.lng]
  			coordinates.push(latLong)
  			}
  			else{
  				throw new Error("Failed to process response: " + JSON.stringify(r.data))
  			}
  		}
	  })
   .then(function(){
   		averages = calculateAverages(coordinates)
   		console.log(averages)
   })
   .catch(function (error) {
    console.log(error);
  });

function generateUrl(unsafeTarget){
	target = encodeURI(unsafeTarget)
	var url = URL_TEMPLATE.replace("{{target}}", target).replace("{{GOOGLE_API_KEY}}", GOOGLE_API_KEY)
	return url
}

function calculateAverages(coordinates){
	var sumLat = 0
	coordinates.forEach(function(c){
		sumLat += c[0];
	})
	var sumLng = 0
	coordinates.forEach(function(c){
		sumLng += c[1];
	})
	avgLat = sumLat / coordinates.length
	avgLng = sumLng / coordinates.length
	return [avgLat,avgLng]
}
