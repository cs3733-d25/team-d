import axios from 'axios';

import { SERVICEREQS } from 'packages/common/src/constants.ts'

// const requests = () => {
//     const services = axios.get(SERVICEREQS);
//     return services.data;
// }

export interface TranslatorRequestForm {
    languageFrom: string;
    languageTo: string;
    roomNum: string;
    startDateTime: Date;
    endDateTime: Date;
}

export async function SubmitTranslatorRequest(request: TranslatorRequestForm) {
    await axios.post('/api/servicereqs', request);
}

// export default requests;