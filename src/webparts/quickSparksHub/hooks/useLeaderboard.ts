import * as React from 'react';
import { ILeaderboardEntry } from '../models/ILeaderboardEntry';
import { IDataService } from '../services/IDataService';

interface IUseLeaderboardResult {
    entries: ILeaderboardEntry[];
    loading: boolean;
    error: string | null;
}

export function useLeaderboard(dataService: IDataService): IUseLeaderboardResult {
    const [entries, setEntries] = React.useState<ILeaderboardEntry[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let cancelled = false;

        dataService
            .getLeaderboard()
            .then((result) => {
                if (!cancelled) {
                    setEntries(result);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError('failed to load leaderboard');
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [dataService]);

    return { entries, loading, error };
}
