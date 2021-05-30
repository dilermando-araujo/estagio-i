export default class TimeUtil {
    static minutesToMill(minutes) {
        return minutes * 60000; 
    }

    static fromUnixToObjTime(unix) {
        const time = {
            hours: 0,
            minutes: 0,
            seconds: 0
        };
        
        let accumulator = Math.trunc(Number(unix));

        time.hours = Math.trunc(accumulator / 3600);
        accumulator = accumulator - (time.hours * 3600);

        time.minutes = Math.trunc(accumulator / 60);
        accumulator = accumulator - (time.minutes * 60);

        time.seconds = accumulator;

        return time;
    }
}