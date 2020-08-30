import { AthleteEffort } from "../models/AthleteEffort";
import { Utils } from "../Utils";

export namespace DataTableHelper {    
    export function addDataToTable(userEffort: AthleteEffort, athleteEfforts: Array<AthleteEffort>, segmentTr: Element, segmentsTable: Element, lang: string) {
        let tableHeaderTr = segmentsTable.querySelector("thead tr");
        if(tableHeaderTr != null){
            let rivalTh = tableHeaderTr.querySelector("[id='rival_header']");
            if(rivalTh == null){
                let element = document.createElement("th");
                element.setAttribute("id", "rival_header");
                element.append(document.createTextNode("Rival"));
                tableHeaderTr.appendChild(element);
            }
        }
        let rivalTd = segmentTr.querySelector(`td[id='${userEffort.segmentId}_rival']`);
        if(rivalTd != null){
            rivalTd.innerHTML = '';
        }else{
            rivalTd = document.createElement("td");
            rivalTd.setAttribute("class", "rival");
            rivalTd.setAttribute("id", `${userEffort.segmentId}_rival`);
            segmentTr.appendChild(rivalTd);
        }
        let leader = athleteEfforts.find(athleteEffort => athleteEffort.rank == 1);
        if(leader != null && userEffort != null){
            let popoverDiv = document.createElement("div");
            popoverDiv.setAttribute("class", "popover__wrapper");
            let popoverLink = document.createElement("a");
            popoverLink.setAttribute("href", `https://www.strava.com/segments/${userEffort.segmentId}`);
            popoverLink.append(document.createTextNode(leader.name));
            popoverDiv.append(popoverLink);
            let popoverContentDiv = document.createElement("div");
            popoverContentDiv.setAttribute("class", "popover__content");
            popoverContentDiv.append(createTable(userEffort.athleteId, athleteEfforts, userEffort, lang));
            popoverDiv.append(popoverContentDiv);
            rivalTd.appendChild(popoverDiv);
        }
    }

    export function loadUserEffortFromActivityTable(userId: string, segmentId: string, athleteEfforts: Array<AthleteEffort>, segmentTr: Element, lang: string): AthleteEffort|null{
        const distanceSpan = <HTMLElement>segmentTr.querySelector("td.name-col div.stats span:first-child");
        const timeTd = <HTMLElement>segmentTr.querySelector("td.time-col");
        const speedTd = <HTMLElement>segmentTr.querySelector("td:nth-child(6)");
        const powerTd = <HTMLElement>segmentTr.querySelector("td:nth-child(7)");
        const hrTd = <HTMLElement>segmentTr.querySelector("td:nth-child(9)");

        const decimalSeperator = Utils.getDecimalSeparator(lang);
        if(distanceSpan != null && timeTd != null && speedTd != null && powerTd != null && hrTd != null){
            let data: AthleteEffort = {
                athleteId: userId,
                name: "You",
                segmentId: segmentId,
                distance: Utils.getFloatFromString(distanceSpan.innerText, decimalSeperator),
                speed: Utils.getFloatFromString(speedTd.innerText, decimalSeperator),
                heartrate: parseInt(hrTd.innerText),
                power: parseInt(powerTd.innerText),
                timeSeconds: Utils.timeStringToSeconds(timeTd.innerText),
                unitSystem: Utils.getUnitSystem(speedTd.innerText)
            }
            athleteEfforts.push(data);
            recalculateRanks(athleteEfforts);
            return data;
        }
        return null;
    }

    function recalculateRanks(athleteEfforts: Array<AthleteEffort>){
        athleteEfforts.sort((a, b) => {
            return a.timeSeconds-b.timeSeconds;
        });
        athleteEfforts.forEach((athleteEffort, index) => {
            athleteEffort.rank = index+1;
        });
    }

    function createTable(userId: string, athleteEfforts: Array<AthleteEffort>, userEffort: AthleteEffort, lang: string): Element{
        let table = document.createElement("table");
        table.append(createHeader());
        for(let athleteEffort of athleteEfforts){
            let tr = document.createElement("tr");
            if(athleteEffort.athleteId == userId){
                tr.setAttribute("class", "athlete_record");
            }

            let rankTd = document.createElement("td");
            rankTd.setAttribute("class", "rank");
            if(athleteEffort.rank != null){
                rankTd.append(document.createTextNode(athleteEffort.rank.toString()));
            }
            tr.append(rankTd);

            let nameTd = document.createElement("td");
            if(athleteEffort.name != null){
                nameTd.append(document.createTextNode(athleteEffort.name));
            }
            tr.append(nameTd);

            tr.appendChild(createSpeedTd(athleteEffort, userEffort, lang));
            tr.appendChild(createHRTd(athleteEffort));
            tr.appendChild(createPowerTd(athleteEffort, userEffort));
            tr.append(createTimeTd(athleteEffort, userEffort));

            table.append(tr);
        }
        return table;
    }

    function createHeader(): Element{
        const headerColumns = ["Position", "Name", "Speed", "HR", "Power", "Time"];
        let tr = document.createElement("tr");
        headerColumns.forEach((column) => {
            let th = document.createElement("th");
            th.append(document.createTextNode(column));
            tr.append(th);
        });
        return tr;
    }

    function createSpeedTd(athleteEffort: AthleteEffort, userEffort: AthleteEffort, lang: string): Element{
        let element = document.createElement("td");
        if(athleteEffort.speed != null){
            populateElementWithValueAndUnit(element, athleteEffort.speed.toLocaleString(lang), athleteEffort.unitSystem.SPEED);
            if(athleteEffort.athleteId != userEffort.athleteId){
                if(userEffort.speed != null){
                    let diff =  athleteEffort.speed - userEffort.speed;
                    diff = Math.round(diff * 10) / 10;

                    if(diff != 0){
                        let span = document.createElement("span");
                        span.setAttribute("class", diff > 0 ? "diff_green" : "diff_red");
                        let sign = document.createTextNode(diff > 0 ? " +" : " ");
                        span.append(sign);
                        populateElementWithValueAndUnit(span, diff.toLocaleString(lang), athleteEffort.unitSystem.SPEED);
                        element.append(span);
                    }
                }
            }
        }
        return element;
    }
        
    function createHRTd(athleteEffort: AthleteEffort): Element{
        let element = document.createElement("td");
        if(athleteEffort.heartrate != null){
            populateElementWithValueAndUnit(element, athleteEffort.heartrate.toString(), "ppm");
        }
        return element;
    }
        
    function createPowerTd(athleteEffort: AthleteEffort, userEffort: AthleteEffort): Element{
        let element = document.createElement("td");
        if(athleteEffort.power != null){
            populateElementWithValueAndUnit(element, athleteEffort.power.toString(), "W");
            if(athleteEffort.athleteId != userEffort.athleteId){
                if(userEffort.power != null){
                    let diff = athleteEffort.power - userEffort.power;
                    if(diff != 0){
                        let span = document.createElement("span");
                        span.setAttribute("class", diff > 0 ? "diff_green" : "diff_red");
                        let sign = document.createTextNode(diff > 0 ? ` +${diff}` : ` ${diff}`);
                        span.append(sign);
                        element.append(span);
                    }
                }
            }
        }
        
        return element;
    }
        
    function createTimeTd(athleteEffort: AthleteEffort, userEffort: AthleteEffort): Element{
        let element = document.createElement("td");
        element.setAttribute("class", "time");
        const timeString = Utils.secondsToTimeString(athleteEffort.timeSeconds);
        element.append(document.createTextNode(timeString));
        if(athleteEffort.athleteId != userEffort.athleteId){
            if(athleteEffort.timeSeconds != null && userEffort.timeSeconds != null){
                const diff = athleteEffort.timeSeconds - userEffort.timeSeconds;
                const timeArray = Utils.secondsToHoursMinSecondsArray(diff);
                if(diff != 0){
                    let span = document.createElement("span");
                    span.setAttribute("class", diff > 0 ? "diff_red" : "diff_green");
                    let sign = document.createTextNode(diff > 0 ? " +" : " -");
                    span.append(sign);
                    if(timeArray[0] > 0){
                        populateElementWithValueAndUnit(span, timeArray[0].toString(), "h");
                    }
                    if(timeArray[1] > 0){
                        populateElementWithValueAndUnit(span, timeArray[1].toString(), "m");
                    }
                    if(timeArray[2] > 0){
                        populateElementWithValueAndUnit(span, timeArray[2].toString(), "s");
                    }
                    element.append(span);
                }
            }
        }
        return element;
    }

    function populateElementWithValueAndUnit(element:Element, value: string, unit: string){
        element.append(document.createTextNode(value.toString()));
        let abbr = document.createElement("abbr");
        abbr.setAttribute("class", "unit");
        abbr.append(document.createTextNode(unit));
        element.append(abbr);
        element.append(document.createTextNode(" "));
    }
}