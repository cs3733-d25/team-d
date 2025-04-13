import { CardTitle } from '@/components/ui/card.tsx';
import { Label } from '@/components/ui/label.tsx';
interface SanitationRequest {
    roomNumber: string;
    type: string;
    status: string;
    comments: string;
    requestStatus: string;
    priority: string;
    employeeRequestedById: number;
    departmentUnderId: number;
}

const ReturnSanitationRequest = (props: SanitationRequest) => {
    return (
        <div className="grid  h-full items-center">
            <div className="">
                <div className="place-content-center">
                    <CardTitle className="text-3xl">Request Summary</CardTitle>
                </div>

                <div>
                    <div className="my-5">
                        <Label htmlFor="languageFrom">Employee ID</Label>
                        <p>{props.employeeRequestedById}</p>
                    </div>

                    <div className="my-5">
                        <Label htmlFor="languageFrom">Department ID</Label>
                        <p>{props.departmentUnderId}</p>
                    </div>

                    <div className="my-5">
                        <Label htmlFor="languageFrom">Room num</Label>
                        <p>{props.roomNumber}</p>
                    </div>

                    <div className="my-5">
                        <Label htmlFor="languageTo">Sanitation Type</Label>
                        <p>{props.type}</p>
                    </div>

                    <div className="my-5">
                        <Label htmlFor="roomNum">Room status</Label>
                        <p>{props.status}</p>
                    </div>

                    <div className="my-5">
                        <Label htmlFor="startDateTime">Additional Comments</Label>
                        <p>{props.comments}</p>
                    </div>

                    <div className="my-5">
                        <Label htmlFor="priority">Priority</Label>
                        <p>{props.priority}</p>
                    </div>

                    <div className="my-5">
                        <Label htmlFor="requestStatus">Request Status</Label>
                        <p>{props.requestStatus}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnSanitationRequest;
