import React, { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

type emailInputForm = {
    email: string;
};

export default function EmailInputPage() {
    const navigate = useNavigate();

    const [form, setForm] = React.useState<emailInputForm>({
        email: '',
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.email.endsWith('@mgb.org')) {
            navigate('/login?userType=employee');
        } else {
            navigate('/login?userType=patient');
        }
    }

    return (
        <div className="grid place-items-center h-full items-center">
            <Card className="w-1/3">
                <CardHeader className="place-content-center">
                    <CardTitle>Enter Your Email</CardTitle>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            value={form.email}
                            onChange={(e) => setForm({
                                ...form,
                                email: e.target.value
                            })}
                            required
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Next</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
