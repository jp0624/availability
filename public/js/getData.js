// Define a function that performs the fetch and returns the result
async function fetchData(url) {
	const response = await fetch(url)
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`)
	}
	const data = await response.json()
	return data
}

// Export the fetchData function
export { fetchData }
