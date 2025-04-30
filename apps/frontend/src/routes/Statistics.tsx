import ReqBreakdown from "@/components/stats/ReqBreakdown.tsx";
import PriorityBreakdown from "@/components/stats/priorityBreakdown.tsx";
import PastWeekReqs from "@/components/stats/PastWeekReqs.tsx";

export function Statistics() {
    return (
        <div className="flex flex-col items-center gap-4 m-4">

            <div className="grid grid-cols-2 gap-4">
                <div className="inline-flex">
                    <ReqBreakdown/>
                </div>
                <div className="inline-flex">
                    <PriorityBreakdown/>
                </div>
            </div>

            <div>
                <PastWeekReqs/>
            </div>
        </div>

    );
}

export default Statistics;
