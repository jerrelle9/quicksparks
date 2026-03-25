import { IDataService } from './IDataService';
import { MockDataService } from './MockDataService';

export function createDataService(useMockData: boolean): IDataService {
    if (useMockData) {
        return new MockDataService();
    }

    return new MockDataService();
}
