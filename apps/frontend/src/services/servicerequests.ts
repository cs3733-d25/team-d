import axios from 'axios';

import { SERVICEREQS } from 'packages/common/src/constants.ts'

const requests = () => {
    const services = axios.get(SERVICEREQS);
    return services.data;
}

export default requests;