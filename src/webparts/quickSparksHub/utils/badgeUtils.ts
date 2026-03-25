import { IAttendance } from '../models/IAttendance';
import { ISession } from '../models/ISession';
import { IUserBadge } from '../models/IUserBadge';

export function deriveUserBadges(sessions: ISession[], attendance: IAttendance[], userEmail: string): IUserBadge[] {
    const userAttendance: Record<number, Date> = {};
    for (let i = 0; i < attendance.length; i++) {
        const record = attendance[i];
        if (record.employeeEmail.toLowerCase() === userEmail.toLowerCase()) {
            userAttendance[record.sessionId] = record.attendedDate;
        }
    }

    return sessions.map((session) => ({
        sessionId: session.id,
        title: session.title,
        badgeImageUrl: session.badgeImageUrl,
        category: session.category,
        earned: userAttendance[session.id] !== undefined,
        earnedDate: userAttendance[session.id] || null,
    }));
}

export function countEarnedBadges(badges: IUserBadge[]): number {
    let count = 0;
    for (let i = 0; i < badges.length; i++) {
        if (badges[i].earned) count++;
    }
    return count;
}

export function getUniqueCategories(badges: IUserBadge[]): string[] {
    const seen: Record<string, boolean> = {};
    const categories: string[] = [];
    for (let i = 0; i < badges.length; i++) {
        const cat = badges[i].category;
        if (!seen[cat]) {
            seen[cat] = true;
            categories.push(cat);
        }
    }
    return categories;
}

export function filterBadgesByCategory(badges: IUserBadge[], category: string): IUserBadge[] {
    return badges.filter((b) => b.category === category);
}

export function searchBadges(badges: IUserBadge[], query: string): IUserBadge[] {
    const lower = query.toLowerCase();
    return badges.filter(
        (b) => b.title.toLowerCase().indexOf(lower) !== -1 || b.category.toLowerCase().indexOf(lower) !== -1,
    );
}
