import { UnitSystem } from "./models/UnitSystem";

export namespace Utils {
    const METRIC_SYSTEM: UnitSystem = {
        SPEED: "km/h",
        DISTANCE: "km",
        HEIGHT: "m"
    }
    
    const IMPERIAL_SYSTEM: UnitSystem = {
        SPEED: "mi/h",
        DISTANCE: "mi",
        HEIGHT: "ft"
    }
    
    export function getUnitSystem(rawSpeed:string): UnitSystem{
        if (rawSpeed.includes("mi/h")) {
            return IMPERIAL_SYSTEM;
        }
        // If not imperial system, use metric
        return METRIC_SYSTEM;
    }

    export function timeStringToSeconds(time:string): number{
        const timeArray = time.split(":");
        const seconds = parseInt(timeArray[timeArray.length-1]);
        const minutes = timeArray.length > 1 ? parseInt(timeArray[timeArray.length-2]) : 0;
        const hours = timeArray.length > 2 ? parseInt(timeArray[timeArray.length-3]) : 0;
        return seconds + minutes*60 + hours*3600;
    }

    export function getDecimalSeparator(lang: string): string{
        const localeNum = (1.1).toLocaleString(lang);
        return localeNum.substring(2,1);
    }

    export function getFloatFromString(stringValue: string, decimalSeparator: string): number{
        if(decimalSeparator == ","){
            let val = stringValue.replace(".", "").replace(",", ".");
            return parseFloat(val);
        }else{
            return parseFloat(stringValue);
        }
    }

    export function secondsToHoursMinSecondsArray(value: number): number[]{
        let totalSeconds = Math.abs(value);
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return [hours,minutes,seconds];
    }

    export function secondsToTimeString(value: number): string{
        const timeArray = secondsToHoursMinSecondsArray(value);
        let h = `${timeArray[0]}:`;
        let m = `${timeArray[1]}:`;
        let s = `${timeArray[2]}`;
        if(timeArray[0] < 10){h = `0${h}`;}
        if(timeArray[1] < 10){m = `0${m}`;}
        if(timeArray[2] < 10){s = `0${s}`;}
        if(timeArray[0] > 0){
            return h + m + s;
        } else if(timeArray[1] > 0){
            return m + s;
        } else {
            return `${value}s`;
        }
    }
}