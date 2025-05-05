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
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_ROUTES } from "common/src/constants.ts";

export type DepartmentBreakdown = {
    Type: string;
    num: number;
};

export default function DepartmentBreakdown() {
    /* state */
    const [data, setData] = useState<DepartmentBreakdown[]>([]);
    const [zoom, setZoom] = useState(false);

    /* fetch */
    useEffect(() => {
        axios
            .get(`${API_ROUTES.SERVICEREQS}/departmentBreakdown`)
            .then(({ data }) =>
                setData(
                    data.map((d: any) => ({
                        Type: d.Department,
                        num: d.count,
                    })),
                ),
            )
            .catch(console.error);
    }, []);

    /* chart */
    const chartConfig: ChartConfig = useMemo(() => {
        const colors = [
            "#1C398E",
            "#ADDDE5",
            "#80ccd1",
            "#46989E",
            "#A8C3ED",
            "#5974c2",
        ];
        const cfg: ChartConfig = { num: { label: "Count", color: "" } };
        data.forEach((d, idx) => {
            cfg[d.Type] = { label: d.Type, color: colors[idx % colors.length] };
        });
        return cfg;
    }, [data]);

    /* chart */
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
                        <Cell
                            key={idx}
                            fill={chartConfig[entry.Type]?.color || "#ccc"}
                        />
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
            {/* small dashboard card */}
            <Card
                onClick={() => setZoom(true)}
                className="cursor-pointer shadow-lg rounded-2xl border bg-white w-full h-full"
            >
                <CardHeader className="items-center pb-0">
                    <CardTitle>Department</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">{Chart}</CardContent>
                <CardFooter />
            </Card>

            {/* enlarged popup */}
            {zoom && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setZoom(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl flex flex-col items-center justify-center gap-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold">Department Breakdown</h2>

                        {/* 700 × 700 canvas for long labels */}
                        <div className="flex items-center justify-center h-[700px] w-full flex-1">
                            <div className="w-[700px]">{Chart}</div>
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
