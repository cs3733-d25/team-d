import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

const ReturnRequest = () => {

    return (
        <div className="grid place-items-center h-full items-center">
            <Card className="w-1/3">
                <CardHeader className="place-content-center">
                    <CardTitle className="text-3xl">Request a Translator</CardTitle>
                </CardHeader>

                    <CardContent>
                        <Label htmlFor="languageFrom">Language From</Label>
                            <p>Spanish</p>
                        <Label htmlFor="languageTo">Language To</Label>
                            <p>English</p>
                        <Label htmlFor="roomNumber">Room Number</Label>
                            <p>405</p>
                        <Label htmlFor="startDateTime">Start Date and Time</Label>
                            <p>06/25/2004</p>
                        <Label htmlFor="endDateTime">End Date and Time</Label>
                            <p>06/25/2004</p>
                        <br />
                        <p>Is this information correct?</p>
                        <button>Yes</button> <button>No</button>

                    </CardContent>
            </Card>
        </div>
    );
}

export default ReturnRequest;