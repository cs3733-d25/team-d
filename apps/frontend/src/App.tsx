import React from 'react';
import z from 'zod';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";

function App() {


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
    }

    return (
        <>
            <div className={"background flex"}>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="languageFrom"
                            render={(field) => (
                                <FormItem>
                                    <FormLabel>Language From</FormLabel>
                                    <FormControl>

                                    </FormControl>
                                </FormItem>
                            )}/>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </>
    );
}

export default App;
