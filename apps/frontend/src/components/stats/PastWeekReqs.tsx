"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {API_ROUTES} from "common/src/constants.ts";
import {useEffect, useState} from "react";
import axios from "axios";


export type newNcompletedCount = {
    date: string;
    numOfNewReq: number;
    numOfCompletedReq: number;
};

const chartConfig = {
    count: {
        label: "Service Reqs",
    },
    numOfNewReq: {
        label: "New Service Request",
        color: "#1C398E",
    },
    numOfCompletedReq: {
        label: "Completed Service Request",
        color: "#ADDDE5",
    },
} satisfies ChartConfig

export function PastWeekReqs() {
    const [data, setData] = useState<newNcompletedCount[]>([]);
    const fetchData = async () => {
        try {
            const dataResponse = await axios.get(API_ROUTES.SERVICEREQS+'/past7days');
            setData(dataResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Card className="w-3xl h-110">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row ">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Service Requests Past Week</CardTitle>
                    <CardDescription className="text-center">
                        New and Completed request over the past week
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#1C398E"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#1C398E"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#ADDDE5"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#ADDDE5"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={5}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="numOfNewReq"
                            type="natural"
                            fill="#1C398E"
                            stroke="#1C398E"
                            stackId="a"
                        />
                        <Area
                            dataKey="numOfCompletedReq"
                            type="natural"
                            fill="#ADDDE5"
                            stroke="#ADDDE5"
                            stackId="b"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default PastWeekReqs;