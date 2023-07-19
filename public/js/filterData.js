// """
// Question

// Stan is looking to provide access to creators' calendars and enable fans to book meetings with them.
// Your assignment is to create an algorythm that will assess creator's calendar and return available slots for fans to book.

// """
// :param duration <int>: duration of the slot we're trying to book in minutes

// :param events <list<list<datetime>>>: list of start and end dates of time slots that are already taken
//     i.e. [["2023-06-20 00:00AM", "2023-06-20 00:30AM"],["2023-06-20 11:00AM", "2023-06-20 11:30AM"], ["2023-06-20 03:00PM", "2023-06-20 04:00PM"] ]

// :return <list<list<datetime>>>: list of slots a fan may book
// [[0,30],[660,690],[900,960]]

function fetch_available_slots(duration, events) {
	const bookedDateMap = events.map((value) => {
		value[0] = new Date(value[0].replace(/\s/g, "T"))
		value[1] = new Date(value[1].replace(/\s/g, "T"))
		return value
	})

	console.log(bookedDateMap)
}

fetch_available_slots(30, [
	["2023-06-20 00:00 AM", "2023-06-20 00:30 AM"],
	["2023-06-20 11:00 AM", "2023-06-20 11:30 AM"],
	["2023-06-20 03:00 PM", "2023-06-20 04:00 PM"],
])
