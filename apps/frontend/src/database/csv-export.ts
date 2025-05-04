import axios from 'axios';

type Department = {
    departmentId: number;
    name: string;
    floorNum: number;
    lat: number;
    lng: number;
    room: string;
    floorGraphId: number;
}

export async function GetDirectory(selectedHospital: number) {
    //get department data using get request
    let data;
    if(selectedHospital == 4){
        data = (await axios.get('api/department/all')).data;
    }else {
        data = (await axios.get('api/department/all/'+selectedHospital)).data;
    }
    //converting data from JSON format to CSV format
    const cols = Object.keys(data[0]);
    const colsString = cols.join(',');
    const departments = data.map((row:Department) => cols.map((fieldName) =>
        JSON.stringify(row[fieldName as keyof Department])).join(',')
    );
    //join cols and body, and break into separate lines
    const csv = [colsString, ...departments].join('\r\n');
    //creating a "file" for the CSV data
    const blob = new Blob([csv], { type: "text/csv;charset=UTF-8" });
    //downloads csv file to users' computer
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `directory.csv`;
    link.click();
    window.URL.revokeObjectURL(link.href);
    return (console.log(csv));
}

