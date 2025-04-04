import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
type translatorRequestForm = {
    languageFrom: string;
    languageTo: string;
    roomNumber: string;
    startDateTime: string;
    endDateTime: string;
}

const ReturnRequest = (props: translatorRequestForm) => {

    return (
        <div className="grid place-items-center h-full items-center">
            <Card className="w-1/3">
                <CardHeader className="place-content-center">
                    <CardTitle className="text-3xl">Request Summary</CardTitle>
                </CardHeader>

                    <CardContent>
                        <Label htmlFor="languageFrom">Language From</Label>
                            <p>{props.languageFrom}</p>
                        <Label htmlFor="languageTo">Language To</Label>
                            <p>{props.languageTo}</p>
                        <Label htmlFor="roomNumber">Room Number</Label>
                            <p>{props.roomNumber}</p>
                        <Label htmlFor="startDateTime">Start Date and Time</Label>
                            <p>{props.startDateTime}</p>
                        <Label htmlFor="endDateTime">End Date and Time</Label>
                            <p>{props.endDateTime}</p>

                    </CardContent>
            </Card>
        </div>
    );
}

export default ReturnRequest;