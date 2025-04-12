import axios from 'axios';

import { API_ROUTES } from '../../../../packages/common/src/constants.ts';
import type {ServiceRequest} from 'src/routes/AllServiceRequests.tsx';

async function getAllRequests (): Promise<ServiceRequest> {
    const services = (await axios.get('/api/servicereqs/translator'));
    return services.data;
}

export default getAllRequests;