"use client"

import { TrendingUp } from "lucide-react"
import {Cell, Label, LabelList, Pie, PieChart, ResponsiveContainer} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {useEffect, useState} from "react";
import axios from "axios";
import {API_ROUTES} from "common/src/constants.ts";

export type ServiceReqBreakdown = {
    Type: keyof typeof chartConfig;
    num: number;
};

const chartConfig = {
    num: {
        label: "Num",
    },
    Translator: {
        label: "Translator",
        color: "#012D5A",
    },
    Equipment: {
        label: "Equipment",
        color: "#ADDDE5",
    },
    Security: {
        label: "Security",
        color: "#46989E",
    },
    Sanitation: {
        label: "Sanitation",
        color: "#95A8EB",
    },
} satisfies ChartConfig

export function Statistics() {
    const [data, setData] = useState<ServiceReqBreakdown[]>([]);
    const fetchData = async () => {
        try {
            const dataResponse = await axios.get(API_ROUTES.SERVICEREQS+'/typeBreakdown');
            setData(dataResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Card className="flex flex-col shadow-md border border-muted bg-white">
        <CardHeader className="items-center pb-0">
                <CardTitle>Service Request Type Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[500px] [&_.recharts-text]:fill-background"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <ChartTooltip
                                content={<ChartTooltipContent nameKey="Type" hideLabel />}
                            />
                            <Pie data={data} dataKey="num" labelLine={true} innerRadius={50}
                                 label={({ payload, ...props }) => {
                                     return (
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
                                     )
                                 }}>
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={chartConfig[entry.Type]?.color}
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
                                                        y={(viewBox.cy || 0) - 1}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {data.reduce((sum, item) => sum + item.num, 0)}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 19}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Requests
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                            {/*<Pie data={data} dataKey="num" className={"bg-blue-50"}>*/}

                            {/*</Pie>*/}
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
            </CardFooter>
        </Card>
    )
}

export default Statistics;
