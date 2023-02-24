import { DateTime } from 'luxon'
export const utilService = {
    delay,
    getRandomInt,
    makeId,
    cleanQueryParams,
    deepSearch,
    getDeepVal,
    padNum,
    DateTime
};

function delay(ms = 1500) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function makeId(length = 8) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

export function cleanQueryParams(filterBy) {
    return Object.keys(filterBy).reduce((acc, key) => {
        const currVal = filterBy[key];
        const isArray = Array.isArray(currVal);
        if ((!!currVal && !isArray) || (isArray && currVal.length > 0) || (currVal === false)) {
            acc[key] = filterBy[key];
        }
        return acc;
    }, {});
}



/**@param {*} val * @param {*} searchVal * @param {Boolean} isIgnoreCase * @param {Boolean} isIncluded*/
export function deepSearch(val, searchVal, isIgnoreCase = true, isIncluded = true) {
    if (val === searchVal) return true;
    if (typeof (val) === 'object') {
        for (let key in val) {
            let curr = val[key];
            if (curr === searchVal) return true;
            else if (typeof (curr) === 'string' && typeof (searchVal) === 'string') {
                if (isIgnoreCase) {
                    let lowerSearchVal = searchVal.toLowerCase();
                    if (isIncluded && curr.toLowerCase().includes(lowerSearchVal)) return true;
                    else if (!isIncluded && curr.toLowerCase() === lowerSearchVal) return true;
                }
                else if (isIncluded && curr.includes(searchVal)) return true;
            }
            else if (deepSearch(curr, searchVal, isIgnoreCase)) return true;
        }
    }
    return false;
}

//input: ({adress: {city: Jerusalem}}, 'adress.city') || output: 'jerusalem';
/**@param {Object} obj * @param {String} field */
export function getDeepVal(obj, field) {
    const splited = field.split('.');
    let val = obj;
    for (const curr of splited) {
        if (val[curr] !== 0 && !val[curr]) {
            val = null;
            break;
        } else val = val[curr];
    }
    return val;
}

export function padNum(num = 1, toFixed = 2) {
    const numStr = num + ''
    return (numStr.length < toFixed) ? '0'.repeat(toFixed - numStr.length) + num : numStr;
}

export function deepClone(value) {
    if (value instanceof Date) return new Date(value);
    if (typeof value === 'object') {
        if (Array.isArray(value)) {
            return value.map(v => deepClone(v))
        }
        const newObj = {}
        for (const key in value) {
            newObj[key] = deepClone(value[key])
        }
        return newObj
    }
    return value
}

export function mapDateStrsToWeekStart(dateStrs) {
    if (!Array.isArray(dateStrs)) dateStrs = [dateStrs]
    return dateStrs.map(str => DateTime.fromISO(str).toFormat('dd/MM'));
}

export function mapDayStrsToDay(dateStrs) {
    if (!Array.isArray(dateStrs)) dateStrs = [dateStrs]
    return dateStrs.map(str => DateTime.fromISO(str).toFormat('ccc').toUpperCase())
}

// for demo mode


export function getTimeLabels(len, timeGroup = 'day', isToday = false) {
    let currTime = (isToday) ? DateTime.now().toMillis() : DateTime.now().minus({ [timeGroup]: 1 }).toMillis();

    const dates = []
    for (var i = 0; i < len; i++) {
        const d = DateTime.fromMillis(currTime)
        const timeStr = timeGroup === 'day' ? d.toISODate() : d.startOf(timeGroup).toISODate()
        dates.push(timeStr)
        currTime = d.minus({ [timeGroup]: 1 }).toMillis()
    }
    return dates.reverse()
}

export function formatClockTime(time, unit = 'ms') {
    const unitMap = {
        ms: 1,
        sec: 1000,
        min: 1000 * 60,
        hour: 1000 * 60 * 60
    }
    time *= unitMap[unit]

    var hour = Math.floor(time / unitMap.hour)
    time -= hour * unitMap.hour
    var min = Math.floor(time / unitMap.min)
    time -= min * unitMap.min
    var sec = Math.floor(time / 1000)
    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

export function cleanDecPoint(data, digCount = 0) {
    if (typeof data === 'object') {
        if (!Array.isArray(data)) data = { ...data }
        for (const key in data) {
            data[key] = cleanDecPoint(data[key])
        }
    }
    else if (typeof data === 'number') return Math.round(data)
    return data
}

export function formatDate(date, format = 'D T') {
    if (!date || !Object.keys(date).length) return null
    if (!(date instanceof Date)) date = new Date(date)
    return DateTime.fromJSDate(date).setLocale('en-UK').toFormat(format)


    // 'D T' - 1/1/2020 12:00
    // More formats -  https://moment.github.io/luxon/#/formatting?id=table-of-tokens
}

export function dateTimeFormat(date, timeGroup = 'day') {
    const d = DateTime.fromISO(date)

    if (timeGroup === 'month') {
        return d.toFormat('MM/yyyy')
    } else {
        return d.toFormat('dd/MM')
    }
}

export { DateTime }