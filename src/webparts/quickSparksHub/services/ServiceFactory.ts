import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { IDataService } from './IDataService';
import { MockDataService } from './MockDataService';
import { SharePointDataService } from './SharePointDataService';

export function createDataService(useMockData: boolean, sp: SPFI | null, context: WebPartContext | null): IDataService {
    if (useMockData || !sp || !context) {
        return new MockDataService();
    }

    return new SharePointDataService(sp, context);
}
