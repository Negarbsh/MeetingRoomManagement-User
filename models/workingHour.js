const TimeFormat = require('hh-mm-ss')


class WorkingHour {

    constructor(start_time_ms, end_time_ms) {
        this.start_time = start_time_ms
        this.end_time = end_time_ms
    }

    get_time_display(is_start_time) { //todo should this function be here?
        let displaying_time = this.end_time
        if (is_start_time) displaying_time = this.start_time

        try {
            // guide : TimeFormat.fromS(150, 'hh:mm:ss')  is '00:02:30'
            return TimeFormat.fromS(displaying_time, 'hh:mm:ss')      // '00:02:30'
        } catch (e) {
            return null
        }
    }

}

module.exports = WorkingHour