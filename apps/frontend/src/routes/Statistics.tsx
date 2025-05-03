import ReqBreakdown from "@/components/stats/ReqBreakdown.tsx";
import PriorityBreakdown from "@/components/stats/priorityBreakdown.tsx";
import PastWeekReqs from "@/components/stats/PastWeekReqs.tsx";
import DepartmentBreakdown from "@/components/stats/DepartmentBreakdown.tsx";

export function Statistics() {
    return (
        <div className="flex flex-col items-center max-w-screen-xl mx-auto gap-8 p-6">
            <h1 className="text-4xl md:text-5xl font-bold font-nunito text-center mb-8">
                Service Request&nbsp;Statistics
            </h1>
            <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

            <div className="w-full mt-8">
                <PastWeekReqs/>
            </div>
        </div>

    );
}

export default Statistics;
