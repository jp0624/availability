const express = require("express")
const path = require("path")
const fs = require("fs")
const app = express()
const port = 3003

let data = JSON.parse(fs.readFileSync("data.json"))

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/api/data", (req, res) => {
	res.json(data) // Return data as JSON response
})

app.put("/api/data", (req, res) => {
	const { start, finish } = req.body

	// Format start and finish dates to "YYYY-MM-DD hh:mm AM/PM" format
	const formattedStart = formatDateTime(start)
	const formattedFinish = formatDateTime(finish)

	if (!data.bookedBlocks) {
		// If no bookedBlocks exist, create a new array with the new booking
		data.bookedBlocks = [[formattedStart, formattedFinish]]
	} else {
		// Check if the timeslot already exists in bookedBlocks
		const existingTimeslot = data.bookedBlocks.find(
			([existingStart, existingFinish]) =>
				existingStart === formattedStart &&
				existingFinish === formattedFinish
		)

		if (!existingTimeslot) {
			// If the timeslot doesn't exist, add it to bookedBlocks
			data.bookedBlocks.push([formattedStart, formattedFinish])
		}
	}

	fs.writeFileSync("data.json", JSON.stringify(data))

	res.sendStatus(200)
})

// Helper function to format date and time
const formatDateTime = (dateTimeString) => {
	const dateTime = new Date(dateTimeString)
	const options = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	}
	return dateTime.toLocaleString("en-US", options)
}

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
