"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { API_ROUTES } from "common/src/constants.ts";
import { useEffect, useState } from "react";
import axios from "axios";

export type PriorityBreakdown = {
    Priority: keyof typeof chartConfig;
    count: number;
};

const chartConfig = {
    count: { label: "count", color: "" },
    Low: { label: "Low", color: "#FFF59D" },
    Medium: { label: "Medium", color: "#FFB74D" },
    High: { label: "High", color: "#FF9800" },
    Emergency: { label: "Emergency", color: "#E53935" },
} satisfies ChartConfig;

export default function PriorityBreakdown() {
    /* state */
    const [data, setData] = useState<PriorityBreakdown[]>([]);
    const [zoom, setZoom] = useState(false);

    /* fetch */
    useEffect(() => {
        axios
            .get(`${API_ROUTES.SERVICEREQS}/priorityBreakdown`)
            .then(({ data }) => setData(data))
            .catch(console.error);
    }, []);

    /* chart */
    const Chart = (
        <ChartContainer config={chartConfig} className="max-h-[250px]">
            <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="Priority"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(v) => chartConfig[v as keyof typeof chartConfig]?.label}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count">
                    {data.map((entry) => (
                        <Cell
                            key={entry.Priority}
                            radius={8}
                            fill={chartConfig[entry.Priority]?.color}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ChartContainer>
    );

    /*render */
    return (
        <>
            {/* card */}
            <Card
                onClick={() => setZoom(true)}
                className="cursor-pointer shadow-lg rounded-2xl border bg-white w-full h-full"
            >
                <CardHeader>
                    <CardTitle>Service Request Priority</CardTitle>
                    <CardDescription>Priority Breakdown</CardDescription>
                </CardHeader>
                <CardContent>{Chart}</CardContent>
            </Card>

            {/* centered popup */}
            {zoom && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setZoom(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center justify-center gap-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">Service Request Priority</h2>

                        <div className="flex items-center justify-center h-[500px] w-full flex-1">
                            <div className="w-[500px]">{Chart}</div>
                        </div>

                        <button
                            onClick={() => setZoom(false)}
                            className="mt-6 px-4 py-2 bg-slate-700 text-white rounded-lg self-center"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
