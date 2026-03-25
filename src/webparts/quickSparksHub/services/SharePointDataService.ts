import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { SP_ATTENDANCE_FIELDS, SP_LISTS, SP_SESSION_FIELDS } from '../config/spFieldNames';
import { IAttendance } from '../models/IAttendance';
import { ILeaderboardEntry } from '../models/ILeaderboardEntry';
import { ISession } from '../models/ISession';
import { IUserBadge } from '../models/IUserBadge';
import { deriveUserBadges } from '../utils/badgeUtils';
import { calculateStreak, isUpcoming } from '../utils/dateUtils';
import { IDataService } from './IDataService';

export class SharePointDataService implements IDataService {
    private _sp: SPFI;
    private _context: WebPartContext;

    constructor(sp: SPFI, context: WebPartContext) {
        this._sp = sp;
        this._context = context;
    }

    public async getAllSessions(): Promise<ISession[]> {
        const items = await this._sp.web.lists
            .getByTitle(SP_LISTS.sessions)
            .items.select(
                SP_SESSION_FIELDS.id,
                SP_SESSION_FIELDS.title,
                SP_SESSION_FIELDS.sessionDate,
                SP_SESSION_FIELDS.description,
                SP_SESSION_FIELDS.badgeImageUrl,
                SP_SESSION_FIELDS.category,
            )
            .orderBy(SP_SESSION_FIELDS.sessionDate, true)();

        return items.map((item: Record<string, string | number>) => ({
            id: item[SP_SESSION_FIELDS.id] as number,
            title: (item[SP_SESSION_FIELDS.title] as string) || '',
            sessionDate: new Date(item[SP_SESSION_FIELDS.sessionDate] as string),
            description: (item[SP_SESSION_FIELDS.description] as string) || '',
            badgeImageUrl: (item[SP_SESSION_FIELDS.badgeImageUrl] as string) || '',
            category: (item[SP_SESSION_FIELDS.category] as string) || '',
            isUpcoming: isUpcoming(new Date(item[SP_SESSION_FIELDS.sessionDate] as string)),
        }));
    }

    public async getUpcomingSessions(): Promise<ISession[]> {
        const all = await this.getAllSessions();
        return all.filter((s) => s.isUpcoming);
    }

    public async getUserBadges(email: string): Promise<IUserBadge[]> {
        const [sessions, attendance] = await Promise.all([this.getAllSessions(), this.getAttendance()]);
        return deriveUserBadges(sessions, attendance, email);
    }

    public async getUserAttendanceStreak(email: string): Promise<number> {
        const attendance = await this.getAttendance();
        const userDates: Date[] = [];
        for (let i = 0; i < attendance.length; i++) {
            if (attendance[i].employeeEmail.toLowerCase() === email.toLowerCase()) {
                userDates.push(attendance[i].attendedDate);
            }
        }
        return calculateStreak(userDates);
    }

    public async getLeaderboard(): Promise<ILeaderboardEntry[]> {
        const attendance = await this.getAttendance();
        const divisionStats: Record<string, { employees: Record<string, boolean>; total: number }> = {};
        const sessions = await this.getAllSessions();
        const pastSessionCount = sessions.filter((s) => !s.isUpcoming).length || 1;

        for (let i = 0; i < attendance.length; i++) {
            const record = attendance[i];
            if (!divisionStats[record.division]) {
                divisionStats[record.division] = { employees: {}, total: 0 };
            }
            divisionStats[record.division].employees[record.employeeEmail] = true;
            divisionStats[record.division].total++;
        }

        const entries: ILeaderboardEntry[] = [];
        const divisionNames = Object.keys(divisionStats);
        for (let i = 0; i < divisionNames.length; i++) {
            const division = divisionNames[i];
            const stats = divisionStats[division];
            const employeeCount = Object.keys(stats.employees).length;
            entries.push({
                rank: 0,
                division: division,
                totalEmployees: employeeCount,
                totalAttendances: stats.total,
                participationRate: Math.round((stats.total / (employeeCount * pastSessionCount)) * 100),
            });
        }

        entries.sort((a, b) => b.participationRate - a.participationRate);
        for (let i = 0; i < entries.length; i++) {
            entries[i].rank = i + 1;
        }

        return entries;
    }

    public getCurrentUserEmail(): string {
        return this._context.pageContext.user.loginName;
    }

    public getCurrentUserDisplayName(): string {
        return this._context.pageContext.user.displayName;
    }

    private async getAttendance(): Promise<IAttendance[]> {
        const items = await this._sp.web.lists
            .getByTitle(SP_LISTS.attendance)
            .items.select(
                SP_ATTENDANCE_FIELDS.sessionId,
                SP_ATTENDANCE_FIELDS.employeeEmail,
                SP_ATTENDANCE_FIELDS.employeeName,
                SP_ATTENDANCE_FIELDS.attendedDate,
                SP_ATTENDANCE_FIELDS.division,
            )();

        return items.map((item: Record<string, string | number>) => ({
            sessionId: item[SP_ATTENDANCE_FIELDS.sessionId] as number,
            employeeEmail: (item[SP_ATTENDANCE_FIELDS.employeeEmail] as string) || '',
            employeeName: (item[SP_ATTENDANCE_FIELDS.employeeName] as string) || '',
            attendedDate: new Date(item[SP_ATTENDANCE_FIELDS.attendedDate] as string),
            division: (item[SP_ATTENDANCE_FIELDS.division] as string) || '',
        }));
    }
}
