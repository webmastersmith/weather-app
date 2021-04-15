import hh from "hyperscript-helpers"
import * as R from "ramda"
import { h } from "virtual-dom"
import { newCity, deleteCity, addCityName } from "./Controller"
import './styles/index.css'
import './icons/style.css'

const { pre, div, h1, label, input, button, p, i } = hh(h)

const createCity = (dispatch, model) => model.cities.map(city => div({
	className: `flex p-2 even:bg-gray-200`
}, [
	div({ className: `flex-grow` }, [
		label({ className: `text-sm font-semibold` }, 'Location'),
		p({ className: `text-2xl font-semibold` }, city.city)
	]),
	div({ className: `w-60 flex justify-center` }, [
		// 3 temps
		div({ className: `flex-grow flex flex-col items-center` }, [
			label({ className: `font-semibold` }, 'Temp'),
			p({ className: `` }, city.temp)

		]),
		div({ className: `flex-grow flex flex-col items-center` }, [
			label({ className: `font-semibold` }, 'Low'),
			p({ className: `` }, city.low)
		]),
		div({ className: `flex-grow flex flex-col items-center` }, [
			label({ className: `font-semibold` }, 'High'),
			p({ className: `` }, city.high)
		]),
	]),
	div({ className: `w-8 flex justify-end items-start` }, [
		button({ className: ``, onclick: e => dispatch(deleteCity(city.id)) }, [
			i({ className: `icon-x text-blue-500` },)
			// div({ className: `bg-x w-4 h-4 bg-no-repeat bg-contain` },),
		])
	])
]))

const cityTemplate = (model) => { return { id: model.nextId, city: model.city, temp: '?', low: '?', high: '?' } }

// total page view
const view = (dispatch, model) => {
	return div({ className: `container mx-auto pt-20 flex justify-center` }, [
		div({ className: `text-black w-60%` }, [
			h1({ className: `text-4xl font-bold border-b-2 border-black w-100 mb-5` }, "Weather"),

			// input box
			label({ className: `font-semibold focus:ring-blue-500` }, "Location"),
			div({ className: `relative w-80 mt-1` }, [
				input({
					className: `border-black border w-100 h-10 pl-2`,
					value: model.city,
					oninput: e => dispatch(addCityName(e.target.value))
				}),
				button({
					className: `absolute top-0 right-0 border-black border-l px-3 py-2 h-100 focus:ring-blue-300 focus:ring-2 focus:ring-opacity-75 focus:outline-none`,
					type: 'button',
					onclick: e => R.pipe(cityTemplate, newCity, dispatch)(model)
				}, 'Add')
			]),

			// display cities if exist
			model.cities.length === 0
				? ''
				: div({ className: `my-10 border-2 border-gray-400` }, [...createCity(dispatch, model)]),

			pre(JSON.stringify(model, null, 2))
		])
	])
}

export default view
