import React from 'react';
import z from 'zod';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
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

function App() {
    return (
        <h1>Home Page</h1>
    );
}

export default App;
