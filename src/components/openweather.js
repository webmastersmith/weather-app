const axios = require('axios')
require('dotenv').config()

const APPID = process.env.APPID

function weatherURL(city) {
	return `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${APPID}`
}

const url = weatherURL('Paris')

const request = { url }

const promise = axios(request)

promise.then((response, err) => {
	if (err) console.log(JSON.stringify(err, null, 2))
	console.log(JSON.stringify(response.data, null, 2))
})
