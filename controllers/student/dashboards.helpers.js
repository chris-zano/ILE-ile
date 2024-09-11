
export const getNearestEvents = (schedule) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const currentDay = today.getDay(); // Returns 0-6 (0 = Sunday)

    // Map schedule entries to include date information
    const scheduleWithDates = schedule.map(event => {
        // Find the day difference from today
        const eventDayIndex = daysOfWeek.indexOf(event.day);
        let dayDifference = eventDayIndex - currentDay;
        
        if (dayDifference < 0) {
            dayDifference += 7; // If the event is earlier in the week, shift to the next week
        }

        // Create the actual event date (set time to start_time)
        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() + dayDifference);
        eventDate.setHours(event.start_time); // Assuming `start_time` is in 24-hour format
        eventDate.setMinutes(0); // Adjust if you have more detailed times
        eventDate.setSeconds(0);
        eventDate.setMilliseconds(0);

        return { ...event, eventDate };
    });

    // Sort by the closest date
    scheduleWithDates.sort((a, b) => a.eventDate - b.eventDate);

    // Return the nearest 5 events
    return scheduleWithDates.slice(0, 5);
};
