import { AthleteEffort } from '../models/AthleteEffort';
import { Utils } from '../Utils';
import axios from "axios";

export namespace SegmentHelper {
    axios.defaults.headers.common["Accept-Language"] = "en-US";
    axios.defaults.headers.common["Accept"] = "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript";
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    export function getSegmentIdFromEffort(segmentEffortId: string): Promise<string> {
        return axios.get(`https://www.strava.com/segment_efforts/${segmentEffortId}`).then((response) => {
            if(response.status == 200){
                return response.data.segment_id;
            }
            return null;
        }).catch(() => {
            return null;
        });
    }
    
    export function getSegmentFriendsLeaderboard(segmentId:string, userId:string): Promise<Array<AthleteEffort>>{
        return axios.get(`https://www.strava.com/segments/${segmentId}/leaderboard?raw=true&page=1&per_page=50&filter=following`).then((response) => {
            if(response.status == 200){
                return convertLeaderboardToAthleteEffort(response.data, userId);
            }
            return new Array<AthleteEffort>();
        }).catch(() => {
            return new Array<AthleteEffort>();
        });
    }

    function convertLeaderboardToAthleteEffort(data: any, userId: string): Array<AthleteEffort>{
        const results: any[] = data.top_results;
        if(results != null && results.length > 0){
            const unitSystem = Utils.getUnitSystem(results[0].avg_speed);
            // Accept-Language seems not being working and the response seems to be returned according to the user session locale
            // Check speed string for decimal separator, '.' by default
            let decimalSeparator = ".";
            const index = results.findIndex(item => (<string>item.avg_speed).includes(","));
            if(index >= 0){
                decimalSeparator = ",";
            }
            let athleteEfforts = new Array<AthleteEffort>();
            for (let result of data.top_results) {
                athleteEfforts.push({
                    id: result.id, 
                    athleteId: result.athlete_id.toString(),
                    name: result.athlete_id != userId ? result.display_name_raw : "You",
                    segmentId: result.segment_id.toString(),
                    activityId: result.activity_id.toString(), 
                    distance: result.distance,
                    rank: result.rank,
                    date: new Date(result.start_date_local_raw),
                    speed: Utils.getFloatFromString(result.avg_speed, decimalSeparator),
                    heartrate: result.avg_heart_rate != null ? Math.round(result.avg_heart_rate) : null,
                    power: result.avg_watts != null ? Math.round(result.avg_watts) : null,
                    hasPowerMeter: result.has_watts,
                    timeSeconds: result.elapsed_time_raw,
                    unitSystem: unitSystem
                });
            };
            return athleteEfforts;
        }
        return new Array<AthleteEffort>();
    }
}