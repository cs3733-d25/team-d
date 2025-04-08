import axios from "axios";

export async function updateDirectory(){
    const input  = document.getElementById('directory') as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    if(!file){return;}
    const read = new FileReader();
    read.readAsText(file);
    const csvData: any[] = [];
    let attributes: string[] = [];
    await new Promise((resolve, reject) => {
        read.onload = (e) => {
            const csv = read.result as string;
            console.log(csv);
            const rows = csv.split('\r');
            console.log(rows);
            attributes = rows[0].split(',');
            console.log(attributes);
            for (let i = 1; i < rows.length; i++) {
                const columns = rows[i].split(/,\s*(?=\d|"|null)/);
                csvData.push(columns);
            }
            console.log(csvData);
            for (let i = 0; i < csvData.length; i++) {
                for (let j = 0; j < csvData[i].length; j++) {
                    if(csvData[i][j] === null|| csvData[i][j] === undefined){

                    }else {
                        csvData[i][j] = '"' + attributes[j] + '": ' + csvData[i][j];
                    }
                }
            }
            resolve(csvData);
        }
    });
    try {
        await axios.delete('/api/department/');
        console.log("Department data deleted successfully");
    }catch(err) {
        console.error(err);
    }

    for (let i = 0; i < csvData.length; i++) {
        try {
            await axios.post('/api/department', JSON.parse('{' + csvData[i].join(', ') + '}'));
            console.log("Department data posted successfully");
        } catch (error) {
            console.error("Error posting department data:", error);
        }

    }

}
