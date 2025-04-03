import React, { FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

type loginForm = {
    username: string;
    password: string;
    rememberPassword: boolean;
};

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userType = queryParams.get('userType');

    const [form, setForm] = React.useState<loginForm>({
        username: '',
        password: '',
        rememberPassword: false,
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(form);

        if (userType === 'employee') {
            navigate('/servicerequest');
        } else {
            navigate('/map');
        }
    }

    return (
        <div className="grid place-items-center h-full items-center">
            <Card className="w-1/3">
                <CardHeader className="place-content-center">
                    <CardTitle>{userType === 'employee' ? 'Employee Login' : 'Patient Login'}</CardTitle>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            type="text"
                            id="username"
                            value={form.username}
                            onChange={(e) => setForm({
                                ...form,
                                username: e.target.value
                            })}
                        />

                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            value={form.password}
                            onChange={(e) => setForm({
                                ...form,
                                password: e.target.value
                            })}
                        />

                        <div className="checkbox-container flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="rememberPassword"
                                checked={form.rememberPassword}
                                onChange={() => setForm({
                                    ...form,
                                    rememberPassword: !form.rememberPassword
                                })}
                                className="mr-2"
                            />
                            <Label htmlFor="rememberPassword">Remember Password</Label>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Submit</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
