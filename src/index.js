// const { initializeCalendar } = require("./example")
const { initializeCalendar } = require("./google")

const initialize = async () => {
  const calendarData = await initializeCalendar()
  console.log("Events:", calendarData.data.items)
}

initialize()