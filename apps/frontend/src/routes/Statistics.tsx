import ReqBreakdown from "@/components/stats/ReqBreakdown.tsx";
import PriorityBreakdown from "@/components/stats/priorityBreakdown.tsx";
import PastWeekReqs from "@/components/stats/PastWeekReqs.tsx";
import DepartmentBreakdown from "@/components/stats/DepartmentBreakdown.tsx";

export function Statistics() {
    return (
        <div className="flex flex-col items-center gap-4 m-4">
            <div className="relative text-5xl z-10 mb-10 pb-4 flex top-x items-center justify-center justify-top mt-5 h-20  text-5xl font-bold font-nunito">
                Service Request Statistics
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="inline-flex">
                    <ReqBreakdown/>
                </div>
                <div className="inline-flex">
                    <PriorityBreakdown/>
                </div>
                <div className="inline-flex">
                    <DepartmentBreakdown/>
                </div>
            </div>

            <div>
                <PastWeekReqs/>
            </div>
        </div>

    );
}

export default Statistics;
