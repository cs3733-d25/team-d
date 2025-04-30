import ReqBreakdown from "@/components/stats/ReqBreakdown.tsx";
import PriorityBreakdown from "@/components/stats/priorityBreakdown.tsx";
import PastWeekReqs from "@/components/stats/PastWeekReqs.tsx";

export function Statistics() {
    return (
        <>
            <div className="inline-flex">
                <ReqBreakdown/>
            </div>
            <div className="inline-flex">
                <PriorityBreakdown/>
            </div>
            <div>
                <PastWeekReqs/>
            </div>
        </>

    );
}

export default Statistics;
