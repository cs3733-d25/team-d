import axios from 'axios';

interface Department{
    departmentId: number;
    name: string;
    floor: number;
    suite: string;
    specialtyServices: string;
    hours: string;
    telephone: string;
}


export async function GetDirectory() {
    const data = (await axios.get('/api/department')).data;
    const cols = Object.keys(data[0]);
    const colsString = cols.join(',');
    const departments = data.map((row:Department) => cols.map((fieldName) =>
        JSON.stringify(row[fieldName as keyof Department])).join(',')
    );
    //join cols and body, and break into separate lines
    const csv = [colsString, ...departments].join('\r\n');
    const blob = new Blob([csv], { type: "text/csv;charset=UTF-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `directory.csv`;
    link.click();
    window.URL.revokeObjectURL(link.href);
    return (console.log(csv));
}

