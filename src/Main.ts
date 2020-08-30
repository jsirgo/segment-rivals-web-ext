import "../css/main.css"
import { SegmentHelper } from "./helpers/SegmentHelper";

var userId: string;
var lang: string;

startSegmentRivals();

function startSegmentRivals(){

    loadUserId();
    loadLanguage();

    if(userId == null || lang == null){
        console.error("Error: Can´t parse userId or language");
        return;
    }

    let starredSegmentsTable = document.querySelector("table.starred-segments.striped");
    if(starredSegmentsTable != null) {
        loadSegmentRivalsOnStarredSegments(starredSegmentsTable);
    } else {
        let mySegmentsTable = document.querySelector("table.my-segments.striped");
        if(mySegmentsTable != null) {
            loadSegmentRivalsOnMySegments(mySegmentsTable);
        } else {
            let activitySegmentsTable = document.querySelector("section.segments-list table.segments");
            if(activitySegmentsTable != null) {
                loadSegmentRivalsOnActivity(activitySegmentsTable);
            }
        }
    }
}

function loadSegmentRivalsOnStarredSegments(segmentsTable: Element){
    let segmentsTrList = segmentsTable.querySelectorAll("tbody tr");
    segmentsTrList.forEach((segmentTr) => {
        let segmentDiv = segmentTr.querySelector("td [data-react-props]");
        if(segmentDiv != null){
            let segmentString = segmentDiv.getAttribute("data-react-props");
            if(segmentString != null){
                let segment = JSON.parse(segmentString);
                if(segment.segmentId != null && userId != null){
                    SegmentHelper.getSegmentFriendsLeaderboard(segment.segmentId, userId).then(athleteEfforts => {
                        let userEffort = athleteEfforts.find(athleteEffort => athleteEffort.athleteId == userId);
                        if(userEffort != null){
                            DataTableHelper.addDataToTable(userEffort, athleteEfforts, segmentTr, segmentsTable, lang);
                        }
                    });
                }
            }
        }
    });
}

function loadSegmentRivalsOnMySegments(segmentsTable: Element){
    let segmentsTrList = segmentsTable.querySelectorAll("tbody tr");
    segmentsTrList.forEach((segmentTr) => {
        // Try to get segmentId from segment link
        let segmentLink = segmentTr.querySelector("td a[href*='/segments/']");
        if(segmentLink != null){
            const segmentLinkHref = segmentLink.getAttribute("href");
            if(segmentLinkHref != null){
                const segmentIdMatcherResult = segmentLinkHref.match(/segments\/(\d+)/);
                if(segmentIdMatcherResult != null && segmentIdMatcherResult.length > 1){
                    if(segmentIdMatcherResult[1] != null && segmentIdMatcherResult[1]){
                        SegmentHelper.getSegmentFriendsLeaderboard(segmentIdMatcherResult[1], userId).then(athleteEfforts => {
                            let userEffort = athleteEfforts.find(athleteEffort => athleteEffort.athleteId == userId);
                            if(userEffort != null){
                                DataTableHelper.addDataToTable(userEffort, athleteEfforts, segmentTr, segmentsTable, lang);
                            }
                        });
                    }
                }
            }
        }
    });
}

function loadSegmentRivalsOnActivity(segmentsTable: Element){
    let segmentsTrList = segmentsTable.querySelectorAll("tbody tr");
    segmentsTrList.forEach((segmentTr) => {
        // Try to get segmentId from segment effort
        const segmentEffortId = segmentTr.getAttribute("data-segment-effort-id");
        if(segmentEffortId != null && segmentEffortId){
            SegmentHelper.getSegmentIdFromEffort(segmentEffortId).then((segmentId) => {
                if(segmentId != null){
                    SegmentHelper.getSegmentFriendsLeaderboard(segmentId, userId).then(athleteEfforts => {
                        let userEffort = athleteEfforts.find(athleteEffort => athleteEffort.athleteId == userId);
                        if(userEffort == null){
                            let loadedUserEffort = DataTableHelper.loadUserEffortFromActivityTable(userId, segmentId, athleteEfforts, segmentTr, lang);
                            if(loadedUserEffort != null){
                                DataTableHelper.addDataToTable(loadedUserEffort, athleteEfforts, segmentTr, segmentsTable, lang);
                            }
                        }else{
                            DataTableHelper.addDataToTable(userEffort, athleteEfforts, segmentTr, segmentsTable, lang);
                        }
                    });
                }
            });
        }
    });
}

function loadUserId(){
    // Parse userId from profile link
    let userProfileLink = document.querySelector("li[class*='user-menu'] a[class*='nav-link']");
    if(userProfileLink != null){
        const userLink = userProfileLink.getAttribute("href");
        if(userLink != null){
            const matcherResult = userLink.match(/athletes\/(\d+)/);
            if(matcherResult != null && matcherResult.length > 1){
                if(matcherResult[1] != null){
                    userId = matcherResult[1];
                }
            }
        }
    }
}

function loadLanguage() {
    let html = document.getElementsByTagName("html")[0];
    let val = html.getAttribute("lang");
    if(val != null){
        lang = val;
    }
}
