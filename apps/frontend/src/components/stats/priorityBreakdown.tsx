"use client"

import {Bar, BarChart, CartesianGrid, Cell, Rectangle, XAxis} from "recharts"

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
import {API_ROUTES} from "common/src/constants.ts";
import {useEffect, useState} from "react";
import axios from "axios";

export type priorityBreakdown = {
    Priority: keyof typeof chartConfig;
    count: number;
};

const chartConfig = {
    count: {
        label: "count",
        color: "",
    },
    Low: {
        label: "Low",
        color: "#FFF59D",
    },
    Medium: {
        label: "Medium",
        color: "#FFB74D",
    },
    High: {
        label: "High",
        color: "#FF9800",
    },
    Emergency: {
        label: "Emergency",
        color: "#E53935",
    },
} satisfies ChartConfig

export function priorityBreakdown() {
    const [data, setData] = useState<priorityBreakdown[]>([]);
    const fetchData = async () => {
        try {
            const dataResponse = await axios.get(API_ROUTES.SERVICEREQS+'/priorityBreakdown');
            setData(dataResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Card className="shadow-lg rounded-2xl border bg-white w-full h-full">
            <CardHeader>
                <CardTitle>Service Request Priority</CardTitle>
                <CardDescription>Priority Breakdown</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-[250px]">
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="Priority"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]?.label
                            }
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey={"count"}>
                            {data.map((entry) => (
                                <Cell
                                     radius={8}
                                     fill={chartConfig[entry.Priority]?.color}/>
                            ))}
                        </Bar>

                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default priorityBreakdown
