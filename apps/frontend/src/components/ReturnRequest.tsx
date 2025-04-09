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
        <div className="grid  h-full items-center">
            <div className="">
                <div className="place-content-center">
                    <CardTitle className="text-3xl">Request Summary</CardTitle>
                </div>

                    <div>
                        <div className="my-5">
                            <Label htmlFor="languageFrom">Language From</Label>
                            <p>{props.languageFrom}</p>
                        </div>

                        <div className="my-5">
                            <Label htmlFor="languageTo">Language To</Label>
                            <p>{props.languageTo}</p>
                        </div>
                        <div className="my-5">
                            <Label htmlFor="roomNumber">Room Number</Label>
                            <p>{props.roomNumber}</p>
                        </div>

                        <div className="my-5">
                            <Label htmlFor="startDateTime">Start Date and Time</Label>
                            <p>{props.startDateTime}</p>
                        </div>

                        <div className="my-5">
                            <Label htmlFor="endDateTime">End Date and Time</Label>
                            <p>{props.endDateTime}</p>
                        </div>



                    </div>
            </div>
        </div>
    );
}

export default ReturnRequest;