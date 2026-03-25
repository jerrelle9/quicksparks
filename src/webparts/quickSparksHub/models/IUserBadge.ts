export interface IUserBadge {
    sessionId: number;
    title: string;
    badgeImageUrl: string;
    category: string;
    earned: boolean;
    earnedDate: Date | null;
}
