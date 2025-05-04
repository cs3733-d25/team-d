import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {useAuth0} from "@auth0/auth0-react";
import {Label} from "@/components/ui/label.tsx";
type Employee = {
    employeeId: number;
    email: string;
    firstName: string;
    middleInitial?: string;
    lastName: string;
    occupation: string;
    userType: string;
    dateOfBirth: string;
    phoneNumber: string;
    pronoun: string;
};

const EmployeeInfoSettings = () => {
    const { user } = useAuth0();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [form, setForm] = useState<Partial<Employee>>({});
    const [loading, setLoading] = useState(true);
    const userEmail = user?.email;

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                // Change to fetch by ID if necessary
                console.log(userEmail);
                const res = await axios.get(`/api/employee/user/${userEmail}`); // hardcoded for demo; ideally dynamic
                setEmployee(res.data);
                setForm(res.data);
            } catch (err) {
                console.error("Failed to fetch employee:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, []);

    const handleChange = (field: keyof Employee, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const saveEmployee = async () => {
        if (!employee) return;

        try {
            console.log(userEmail);
            await axios.put(`/api/employee/user/${userEmail}`, form);
            alert("Employee info updated successfully");
        } catch (err) {
            console.error("Failed to update employee:", err);
            alert("Something went wrong while updating employee info");
        }
    };

    if (loading) return <p className="text-gray-500">Loading employee info...</p>;

    if (!employee) return <p className="text-red-500">Employee data not available.</p>;

    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Edit Your Information</h1>

            <div className="space-y-4">
                <Label className="" htmlFor="firstName">First name</Label>
                <Input
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                    value={form.firstName || ""}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                />

                <Label className="" htmlFor="middleInitial">Middle Initial</Label>
                <Input
                    type="text"
                    placeholder="Middle Initial"
                    id="middleInitial"
                    value={form.middleInitial || ""}
                    onChange={(e) => handleChange("middleInitial", e.target.value)}
                />

                <Label className="" htmlFor="lastName">Last Name</Label>
                <Input
                    type="text"
                    placeholder="Last Name"
                    id="lastName"
                    value={form.lastName || ""}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                />

                <Label className="" htmlFor="email">Email</Label>
                <Input
                    type="email"
                    placeholder="Email"
                    id="email"
                    value={form.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                />

                <Label className="" htmlFor="occupation">Occupation</Label>
                <Input
                    type="text"
                    placeholder="Occupation"
                    id="occupation"
                    value={form.occupation || ""}
                    onChange={(e) => handleChange("occupation", e.target.value)}
                />

                <Label className="" htmlFor="userType">User Type</Label>
                <Input
                    type="text"
                    placeholder="User Type"
                    id="userType"
                    value={form.userType || ""}
                    onChange={(e) => handleChange("userType", e.target.value)}
                />

                <Label className="" htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                    type="date"
                    placeholder="Date of Birth"
                    id="dateOfBirth"
                    value={form.dateOfBirth?.substring(0, 10) || ""}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                />

                <Label className="" htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    type="text"
                    placeholder="Phone Number"
                    id="phoneNumber"
                    value={form.phoneNumber || ""}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                />

                <Label className="" htmlFor="pronoun">Pronoun</Label>
                <Input
                    type="text"
                    placeholder="Pronoun"
                    id="pronoun"
                    value={form.pronoun || ""}
                    onChange={(e) => handleChange("pronoun", e.target.value)}
                />
            </div>

            <Button
                className="mt-6 bg-blue-900 text-white hover:bg-blue-800"
                onClick={saveEmployee}
            >
                Save Changes
            </Button>
        </div>
    );
};

export default EmployeeInfoSettings;
