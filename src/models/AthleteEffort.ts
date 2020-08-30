import { UnitSystem } from "./UnitSystem";

export interface AthleteEffort {
    id?: string,
    athleteId: string,
    segmentId: string,
    activityId?: string, 
    name: string,
    distance: number,
    rank?: number,
    date?: Date,
    speed: number,
    heartrate: number|null,
    power: number|null,
    hasPowerMeter?: boolean,
    timeSeconds: number,
    unitSystem: UnitSystem
}
