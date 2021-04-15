import * as R from 'ramda'


const MSG = {
	CITY_NAME: 'CITY_NAME',
	NEW_CITY: 'NEW_CITY',
	DELETE_CITY: 'DELETE_CITY',
	HTTPS_SUCCESS: 'HTTPS_SUCCESS'
}

export function weatherURL(city) {
	return `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${process.env.APPID}&units=imperial`
}
export function addCityName(city) { return { type: MSG.CITY_NAME, city } }
export function newCity(city) { return { type: MSG.NEW_CITY, city } }
export function deleteCity(id) { return { type: MSG.DELETE_CITY, id } }

const httpsSuccessMsg = R.curry((id, response) => ({
	type: MSG.HTTPS_SUCCESS,
	id,
	response
}))

function update(msg, model) {
	switch (msg.type) {
		case MSG.CITY_NAME: {
			const { city } = msg
			return { ...model, city }
		}
		case MSG.NEW_CITY: {
			const { city } = msg.city
			const { cities: oldCities, nextId: oldNextId } = model
			const cities = R.append(msg.city)(oldCities)
			return [
				{ ...model, cities, nextId: oldNextId + 1, city: '' },
				{
					request: { url: weatherURL(city) },
					successMsg: httpsSuccessMsg(oldNextId),
				},
			]
		}
		case MSG.DELETE_CITY: {
			const { cities: oldCities } = model
			const cities = R.filter(R.complement(R.propEq('id', msg.id)))(oldCities)
			return { ...model, cities }
		}
		case MSG.HTTPS_SUCCESS: {
			const { id, response } = msg
			const { cities } = model
			const { temp, temp_min, temp_max } = R.pathOr({}, ['data', 'main'], response)
			const newCities = R.map(city => {
				if (city.id === id) {
					return {
						...city,
						temp: Math.round(temp),
						low: Math.round(temp_min),
						high: Math.round(temp_max)
					}
				}
				return city
			})(cities)
			return { ...model, cities: newCities }
		}
	}
	return model
}

export default update
