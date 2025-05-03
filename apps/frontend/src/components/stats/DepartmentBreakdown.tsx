"use client"

import {Cell, Label, Pie, PieChart} from "recharts"

import {
    Card,
    CardContent,
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
import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {API_ROUTES} from "common/src/constants.ts";

export type DepartmentBreakdown = {
    Type: string;
    num: number;
};

export function DepartmentBreakdown() {
    const [data, setData] = useState<DepartmentBreakdown[]>([]);

    const fetchData = async () => {
        try {
            const dataResponse = await axios.get(API_ROUTES.SERVICEREQS+'/departmentBreakdown');
            const normalizedData: DepartmentBreakdown[] = dataResponse.data.map((item: any) => ({
                Type: item.Department,
                num: item.count
            }));
            setData(normalizedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log("fetched data:", data)
    }, [data]);

    const chartConfig: ChartConfig = useMemo(() => {
        const colors = ["#1C398E", "#ADDDE5", "#80ccd1", "#46989E", "#A8C3ED", "#5974c2"]
        const config: ChartConfig = {
            num: {
                label: "Count",
                color: "",
            }
        }
        data.forEach((item, index) => {
            config[item.Type] = {
                label: item.Type,
                color: colors[index % colors.length],
            }
        })
        return config
    }, [data])

    return (
        //department breakdown
        <Card className="inline-flex flex flex-col shadow-md border border-muted bg-white w-700 h-100">
            <CardHeader className="items-center pb-0">
                <CardTitle>Department</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] w-full [&_.recharts-text]:fill-background"
                >
                    <PieChart>
                        <ChartTooltip cursor={false}
                                      content={<ChartTooltipContent nameKey="Type" hideLabel />}
                        />
                        <Pie data={data} dataKey="num" labelLine={true} innerRadius={60}
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
                                                    y={(viewBox.cy || 0) - 3}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {data.reduce((sum, item) => sum + item.num, 0)}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 18}
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
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
            </CardFooter>
        </Card>
    )
}

export default DepartmentBreakdown;
