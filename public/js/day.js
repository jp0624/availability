// day.js

// Get the selected date heading element
const selectedDateHeading = document.querySelector(".date-wrapper")

// Get the time slots container element
const dayTimeSlots = document.querySelector(".time-wrapper")

const lang = "en-US"
const timeZone = "America/New_York"

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

const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
]

function generateTimeSlots(day, month, year) {
	const timeSlots = []
	const startDate = new Date(year, month - 1, day, 0, 0, 0) // Month is zero-based, so subtract 1 from the specified month

	let startTime = startDate

	for (let i = 0; i < 24; i++) {
		const endTime = new Date(startTime.getTime() + 30 * 60 * 1000)

		const timeSlot1 = startTime.toLocaleString("en-US", {
			month: "2-digit",
			day: "2-digit",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		})

		const timeSlot2 = endTime.toLocaleString("en-US", {
			month: "2-digit",
			day: "2-digit",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		})

		timeSlots.push([timeSlot1, timeSlot2])

		startTime = endTime
	}

	return timeSlots
}

function findArrayInArrayOfArrays(findArray, arrayOfArrays) {
	return arrayOfArrays.some((array) => {
		if (array.length !== findArray.length) {
			return false
		}

		for (let i = 0; i < array.length; i++) {
			if (array[i] !== findArray[i]) {
				return false
			}
		}

		return true
	})
}

/**
 * Updates the day with the provided date and time blocks.
 * @param {string} dayString - The selected day as a string.
 * @param {Array} timeBlocks - An array of time blocks.
 */

function updateDayView(dayString, timeBlocks) {
	// Update the selected date heading with the new dayString
	selectedDateHeading.innerText = `${days[dayString.getDay()]} ${
		months[dayString.getMonth()]
	} ${dayString.getDate()}`

	// Generate the HTML for the time slots
	let timeSlots = ""

	const openTimeSlots = generateTimeSlots(
		dayString.getDate(),
		dayString.getMonth(),
		dayString.getFullYear()
	)

	!!openTimeSlots &&
		openTimeSlots.forEach((timeBlock) => {
			const isBooked = findArrayInArrayOfArrays(timeBlock, timeBlocks)

			const startTime = new Date(timeBlock[0]),
				finishTime = new Date(timeBlock[1]),
				startHour = startTime.getHours(),
				startMinutes = startTime.getMinutes().toString(),
				startPM = startHour > 12,
				finishHour = finishTime.getHours(),
				finishMinutes = finishTime.getMinutes().toString(),
				finishPM = finishHour > 12
			// Generate the HTML for each time slot
			timeSlots += `<li class="time-slot ${
				isBooked ? "disabled" : "available"
			}" data-start='${startTime}' data-end='${finishTime}'><span>${
				startPM ? startHour - 12 : startHour
			}:${startMinutes.length === 1 ? "0" + startMinutes : startMinutes}${
				startPM ? "PM" : "AM"
			} - ${finishPM ? finishHour - 12 : finishHour}:${
				finishMinutes.length === 1 ? "0" + finishMinutes : finishMinutes
			}${finishPM ? "PM" : "AM"}</span></li>`
		})

	// Update the time slots container with the generated HTML
	dayTimeSlots.innerHTML = timeSlots

	// Add click event listeners to each time slot
	const activeCalendarDays = dayTimeSlots.querySelectorAll(".time-slot")

	activeCalendarDays.forEach((el) => {
		el.addEventListener("click", () => {
			const start = el.getAttribute("data-start")
			const end = el.getAttribute("data-end")

			addBooking(start, end)

			// Add "disabled" class and remove "available" class
			el.classList.add("disabled")
			el.classList.remove("available")
		})
	})
}

/**
 * Sends a PUT request to add a booking.
 * @param {string} start - The start time of the booking.
 * @param {string} finish - The end time of the booking.
 */
const addBooking = async (start, finish) => {
	try {
		const response = await fetch("/api/data", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ start, finish }),
		})

		if (response.ok) {
			console.log("Booking added successfully")
			// Perform any additional logic to handle the successful addition of the booking
		} else {
			console.error("Failed to add booking")
			// Perform any error handling or display appropriate messages
		}
	} catch (error) {
		console.error("Error:", error)
		// Perform any error handling or display appropriate messages
	}
}

// Export the updateDay function as a module
export { updateDayView }
