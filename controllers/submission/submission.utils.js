export const getStartDate = (value) => {
    const now = new Date();
    let startDate;
    switch (parseInt(value, 10)) {
        case 0: // Today
            startDate = now;
            break;
        case 1: // Tomorrow, 6:00
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 6, 0, 0);
            break;
        case 2: // In two days, 6:00
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 6, 0, 0);
            break;
        default:
            startDate = undefined;
    }
    return startDate;
}

export const getEndDate = (value) => {
    const now = new Date();
    let endDate;
    switch (parseInt(value, 10)) {
        case 0: // Tomorrow, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 0);
            break;
        case 1: // In two days, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 23, 59, 0);
            break;
        case 2: // In one week, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 0);
            break;
        case 3: // In two weeks, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 23, 59, 0);
            break;
        case 4: // In three weeks, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 21, 23, 59, 0);
            break;
        case 5: // In one month, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate(), 23, 59, 0);
            break;
        case 6: // In two months, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate(), 23, 59, 0);
            break;
        case 7: // In three months, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate(), 23, 59, 0);
            break;
        default:
            endDate = undefined;
    }
    return endDate;
}

export const convertToMilliseconds = (date) => {
    return date.getTime();
}