import { MongooseError } from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const logError = (error) => {
    if (error instanceof MongooseError) {
        const eMes = new MongooseError(error.message);
        console.error(eMes.stack);
    }
    else if (error instanceof ReferenceError) {
        const eMes = new ReferenceError(error.message)
        console.error(eMes.stack);
    }
    else if (error instanceof SyntaxError) {
        const eMes = new SyntaxError(error.message);
        console.error(eMes.stack);
    }
    else if (error instanceof TypeError) {
        const eMes = new TypeError(error.message);
        console.error(eMes.stack);
    }
    else {
        let unknown_error = new Error(error);
        console.log("An error occured: ", unknown_error.name, " :: ", unknown_error.message );
        console.log(unknown_error.stack);
    }
    return 0;
};

export const logSession = (username, ip, status = "") => {

    function addSuperscript(num) {
        const j = num % 10,
            k = num % 100;
        if (j === 1 && k !== 11) {
            return num + "st";
        }
        if (j === 2 && k !== 12) {
            return num + "nd";
        }
        if (j === 3 && k !== 13) {
            return num + "rd";
        }
        return num + "th";
    }

    try {
        const logFilePath = path.join(__dirname, '..', '..', 'logs', 'session.log');

        const datestamp = getSystemDate()
        const timestamp = getSystemTime()

        const logDate = `${datestamp.day},${addSuperscript(datestamp.date)}-${datestamp.month}-${datestamp.year}`;
        const logTime = `${timestamp.hours}:${timestamp.minutes}:${timestamp.seconds}`;

        const sessionLog = `${status.toUpperCase()}//:: ${logDate} at ${logTime} - Username:{${username}}, IP:= {${ip}}\n`;

        fs.appendFileSync(logFilePath, sessionLog);

        ('Session logged successfully.');
    } catch (error) {
        console.error('Error logging session:', error);
    }
}


export const getSystemDate = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date();

    return {
        day: days[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()],
        year: date.getFullYear()
    };
}

export const getSystemTime = () => {
    const time = new Date();

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    return {
        hours: hours < 10 ? "0"+ hours: hours,
        minutes: minutes < 10 ? "0"+minutes: minutes,
        seconds: seconds < 10 ? "0"+seconds: seconds
    }
}