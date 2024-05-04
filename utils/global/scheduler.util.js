/**
 * 
 * @param {Array} user_schedules an array of existing user schedules. >>> user_schedules.length < 3
 * @param {Number} start_time The proposed start time for the class
 * @param {Number} duration The proposed duration of the class
 * @returns {Array}
 */
const checkUserAvailabilityStatus = (user_schedules = [], start_time = 8, duration = 1) => {
    let schedules = []
    let difference_in_time = false;

    /**
     * the array must contain less than 3 elements
     * class starts at 8 am and ends at 16 pm
     * start_time must not be before 8, start time must not be 16 or greater
     * the duration of the class cannot go beyond 16 pm
    */
    if ((user_schedules.length >= 3) || (start_time < 8 || start_time >= 16) || ((start_time + duration) > 16)) {
        return user_schedules;
    }

    //now that all above conditions are satisfied...

    //if there is nothing in the array, add the class to the schedule
    if (user_schedules.length === 0) {
        return [{ start_time, duration }];
    }

    // if there is one and only one item in the array...
    if (user_schedules.length === 1) {
        const schedule = user_schedules[0];

        // check for conflict
        if (schedule.start_time === start_time) {
            return user_schedules;
        }
        else {

            /** if the start time is before the existing schedule, check if there is
             * enough time to have a class before the existing schedule.
            */
            if ((start_time < schedule.start_time) && ((start_time + duration) <= schedule.start_time)) {
                schedules[0] = { start_time: start_time, duration: duration }
                schedules[1] = user_schedules[0];
                return schedules;
            }
            else {
                /** if the start time is after the existing schedule, check if there is
                * enough time to have a class before the after schedule.
                */
                if ((schedule.start_time + schedule.duration) <= start_time) {
                    schedules[0] = user_schedules[0];
                    schedules[1] = { start_time: start_time, duration: duration }

                    return schedules;
                }
                else {
                    //not enough time to have the class after the existing schedule
                    return user_schedules;
                }
            }
        }
    }

    
    if (user_schedules.length === 2) {
        let first_schd = user_schedules[0];
        let second_schd = user_schedules[1];

        difference_in_time = (second_schd.start_time + second_schd.duration) - (first_schd.start_time + first_schd.duration);

        if (difference_in_time >= (start_time + duration)) {
            schedules[0] = user_schedules[0];
            schedules[1] = { start_time: start_time, duration: duration }
            schedules[2] = user_schedules[1];
            
            return schedules;
        }
        
        else if ((start_time < first_schd.start_time) && ((start_time + duration) <= first_schd.start_time)) {
            schedules[0] = { start_time: start_time, duration: duration }
            schedules[1] = user_schedules[0];
            schedules[2] = user_schedules[1];
            
            return schedules;
        }
        
        else if ((second_schd.start_time + second_schd.duration) <= start_time) {
            schedules[0] = user_schedules[0];
            schedules[1] = user_schedules[1];
            schedules[2] = { start_time: start_time, duration: duration }

            return schedules
        }

        else {
            return userSchedules;
        }
    }

    return user_schedules;
};

module.exports = checkUserAvailabilityStatus;