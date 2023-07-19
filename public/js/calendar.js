// calendar.js

import { fetchData } from "./getData.js"
import { updateDayView } from "./day.js"

let bookedBlocks = []

/**
 * Generates the calendar based on the available blocks.
 */
function generateCalendar() {
	// Selecting elements
	const currentDate = document.querySelector(".current-date") // Element to display current date
	const daysTag = document.querySelector(".days") // Element to display calendar days
	const prevNextIcon = document.querySelectorAll(".icons span") // Navigation icons for previous and next month

	// Getting new date, current year, and month
	let date = new Date()
	let currYear = date.getFullYear()
	let currMonth = date.getMonth()

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	]

	/**
	 * Searches for booked time blocks matching the given day, month, and year.
	 * @param {number} day - The day to search for.
	 * @param {number} month - The month to search for.
	 * @param {number} year - The year to search for.
	 * @returns {Array} - An array of matching time blocks.
	 */
	const searchBlocks = (day, month, year) => {
		const matchingBlocks = bookedBlocks.filter((block) => {
			const start = new Date(block[0])
			const end = new Date(block[1])

			return (
				start.getDate() === day &&
				start.getMonth() === month &&
				start.getFullYear() === year
			)
		})

		return matchingBlocks
	}

	/**
	 * Updates the event listeners for each calendar day.
	 */
	const updateEventListeners = () => {
		const activeCalendarDays = document.querySelectorAll(".days li")
		activeCalendarDays.forEach((value, index, array) => {
			value.addEventListener("click", () => {
				const specificDate = new Date(value.getAttribute("data-date"))

				console.log("un-sorted")
				let sortedTimeBlocks = []
				if (!!bookedBlocks) {
					if (bookedBlocks && bookedBlocks.length) {
						sortedTimeBlocks = sortTimeBlocks(bookedBlocks)
						console.log("sortedTimeBlocks: ", sortedTimeBlocks)
					}
				}
				console.log("sorted")
				updateDate(specificDate, sortedTimeBlocks)
				updateDayView(specificDate, sortedTimeBlocks)
			})
		})
	}

	/**
	 * Sorts the time blocks in ascending order based on the start time.
	 * @param {Array} timeBlocks - The time blocks to be sorted.
	 * @returns {Array} - The sorted time blocks.
	 */
	const sortTimeBlocks = (timeBlocks) => {
		const sortedTimeBlocks = timeBlocks.sort((a, b) => {
			const startTimeA = new Date(a[0])
			const startTimeB = new Date(b[0])

			if (startTimeA < startTimeB) {
				return -1
			} else if (startTimeA > startTimeB) {
				return 1
			} else {
				return 0
			}
		})
		return sortedTimeBlocks
	}

	/**
	 * Updates the selected date and time blocks.
	 * @param {Date} day - The selected date.
	 * @param {Array} timeBlocks - The time blocks for the selected date.
	 */
	const updateDate = (day, timeBlocks) => {
		if (Array.isArray(timeBlocks)) {
			timeBlocks.forEach((value, index, array) => {
				const start = new Date(value[0])
				const finish = new Date(value[1])
				// addBooking(start, finish)
			})
		} else {
			console.log("No time blocks available for the selected date.")
		}
	}

	/**
	 * Retrieves the time blocks for the given date.
	 * @param {string} date - The date to retrieve the blocks for.
	 * @returns {Array} - The matching time blocks.
	 */
	const getDateBlocks = (date) => {
		const selectedDate = new Date(date)
		selectedDate.setHours(0, 0, 0, 0) // Set the time to midnight for accurate comparison

		const matchingBlocks =
			bookedBlocks &&
			bookedBlocks.filter((block) => {
				const start = new Date(block[0])
				const end = new Date(block[1])

				return selectedDate >= start && selectedDate <= end
			})

		return matchingBlocks
	}

	/**
	 * Renders the calendar based on the current year and month.
	 */
	const renderCalendar = () => {
		let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay()
		let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate()
		let lastDayOfMonth = new Date(
			currYear,
			currMonth,
			lastDateOfMonth
		).getDay()
		let lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate()

		let liTag = ""

		// Generating list items for the inactive days of the previous month
		for (let index = firstDayOfMonth; index > 0; index--) {
			liTag += `<li class="inactive">${
				lastDateOfLastMonth - index + 1
			}</li>`
		}

		// Generating list items for the active days of the current month
		for (let index = 1; index <= lastDateOfMonth; index++) {
			let isToday =
				index === date.getDate() &&
				currMonth === new Date().getMonth() &&
				currYear === new Date().getFullYear()
					? "active"
					: ""
			liTag += `<li class="${isToday}" data-date="${currYear}-${
				currMonth + 1
			}-${index}">${index}</li>`
		}

		// Generating list items for the inactive days of the next month
		for (let index = lastDayOfMonth; index < 6; index++) {
			liTag += `<li class="inactive">${index - lastDayOfMonth + 1}</li>`
		}

		currentDate.innerText = `${months[currMonth]} ${currYear}`
		daysTag.innerHTML = liTag
		updateEventListeners()
	}

	renderCalendar()

	prevNextIcon.forEach((icon) => {
		icon.addEventListener("click", () => {
			currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1

			if (currMonth < 0 || currMonth > 11) {
				date = new Date(currYear, currMonth)
				currYear = date.getFullYear()
				currMonth = date.getMonth()
			} else {
				date = new Date()
			}

			renderCalendar()
		})
	})
}

/**
 * Retrieves the available blocks using the fetchData function and processes the result.
 */
async function updateBookedBlocks() {
	try {
		const result = await fetchData("/api/data")
		// console.log("result: ", result)

		// Convert the timestamps to Toronto EST
		const torontoTimeBlocks = result.bookedBlocks.map((block) => {
			const start = block[0]
			const finish = block[1]
			return [start, finish]
		})

		bookedBlocks = torontoTimeBlocks
		// console.log("bookedBlocks: ", bookedBlocks)
		return Promise.resolve()
	} catch (error) {
		console.error("Error:", error)
		return Promise.reject(error)
	}
}

/**
 * Calls the fetchData function and generates the calendar after the module is loaded.
 */
async function getData() {
	try {
		await updateBookedBlocks()
		generateCalendar()
		console.log("bookedBlocks: ", bookedBlocks)
	} catch (error) {
		console.error("Error:", error)
	}
}

window.addEventListener("load", getData)
