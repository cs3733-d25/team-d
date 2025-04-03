import React from 'react';
import z from 'zod';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";

type fieldItem = {
    name: string;
    field: 'languageFrom' | 'languageTo' | 'roomNumber' | 'startDateTime' | 'endDateTime';
};

const fields: fieldItem[] = [
    {
        field: 'languageFrom',
        name: 'Language From',
    },
    {
        field: 'languageTo',
        name: 'Language To',
    },
    {
        field: 'roomNumber',
        name: 'Room Number',
    },
    {
        field: 'startDateTime',
        name: 'Start',
    },
    {
        field: 'endDateTime',
        name: 'End',
    },
];

export default function ServiceRequest() {
    const formSchema = z.object({
        languageFrom: z.string(),
        languageTo: z.string(),
        roomNumber: z.string(),
        startDateTime: z.string(),
        endDateTime: z.string(),
    });



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            languageFrom: '',
            languageTo: '',
            roomNumber: '',
            startDateTime: '',
            endDateTime: '',
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    };

    return (
        <>
            <>
                <Card className={"w-[400px] place-content-center"}>
                    <CardHeader>
                        <CardTitle>Request a Translator</CardTitle>
                    </CardHeader>
                    <CardContent >
                        <Form {...form} >
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                {fields.map((item) => (
                                    <FormField
                                        control={form.control}
                                        name={item.field}
                                        key={item.field}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>{item.name}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={""} {...field} />
                                                </FormControl>
                                            </FormItem>

                                        )}/>
                                ))}
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

            </>
        </>
    );

    // return (
    //     <div id={"service-request"}>
    //         {/*TODO: replace <p> with actual page*/}
    //         <p>ServiceRequest</p>
    //     </div>
    //
    // );
}

