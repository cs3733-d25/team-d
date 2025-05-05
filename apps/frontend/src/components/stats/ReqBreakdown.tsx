"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES } from "common/src/constants.ts";

export type ServiceReqBreakdown = {
    Type: keyof typeof chartConfig;
    num: number;
};

const chartConfig = {
    num: { label: "Num", color: "" },
    Translator: { label: "Translator", color: "#1C398E" },
    Equipment: { label: "Equipment", color: "#ADDDE5" },
    Security: { label: "Security", color: "#46989E" },
    Sanitation: { label: "Sanitation", color: "#A8C3ED" },
} satisfies ChartConfig;

export default function ReqBreakdown() {
    /* state */
    const [data, setData] = useState<ServiceReqBreakdown[]>([]);
    const [zoom, setZoom] = useState(false);

    /* fetch */
    useEffect(() => {
        axios
            .get(`${API_ROUTES.SERVICEREQS}/typeBreakdown`)
            .then(({ data }) => setData(data))
            .catch(console.error);
    }, []);

    /* reusable chart */
    const Chart = (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] w-full [&_.recharts-text]:fill-background"
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent nameKey="Type" hideLabel />}
                />
                <Pie
                    data={data}
                    dataKey="num"
                    labelLine
                    innerRadius={60}
                    label={({ payload, ...props }) => (
                        <text
                            cx={props.cx}
                            cy={props.cy}
                            x={props.x}
                            y={props.y}
                            textAnchor={props.textAnchor}
                            dominantBaseline={props.dominantBaseline}
                        >
                            {payload.Type}
                        </text>
                    )}
                >
                    {data.map((entry, idx) => (
                        <Cell key={idx} fill={chartConfig[entry.Type]?.color} />
                    ))}

                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy ?? 0) - 3}
                                            className="fill-foreground text-3xl font-bold"
                                        >
                                            {data.reduce((s, i) => s + i.num, 0)}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy ?? 0) + 18}
                                            className="fill-muted-foreground"
                                        >
                                            Requests
                                        </tspan>
                                    </text>
                                );
                            }
                            return null;
                        }}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>
    );

    /* render */
    return (
        <>
            {/* card */}
            <Card
                onClick={() => setZoom(true)}
                className="cursor-pointer shadow-lg rounded-2xl border bg-white w-full h-full"
            >
                <CardHeader className="items-center pb-0">
                    <CardTitle>Service Request Type</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">{Chart}</CardContent>
                <CardFooter />
            </Card>

            {/* pop‑up */}
            {zoom && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setZoom(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center justify-center gap-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold">Service Request Type</h2>

                        <div className="flex items-center justify-center h-[500px] w-full flex-1">
                            <div className="w-[500px]">{Chart}</div>
                        </div>

                        <button
                            onClick={() => setZoom(false)}
                            className="px-4 py-2 bg-slate-700 text-white rounded-lg self-center"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}


