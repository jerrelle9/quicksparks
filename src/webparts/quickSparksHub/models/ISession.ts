export interface ISession {
    id: number;
    title: string;
    sessionDate: Date;
    description: string;
    badgeImageUrl: string;
    category: string;
    isUpcoming: boolean;
}
