# QuickSparks Hub - Codebase Context Log

## Project Overview
**QuickSparks Hub** is a **SharePoint Framework (SPFx) Web Part** that serves as an employee engagement and gamification platform for Republic Bank. It displays training sessions, earned badges, attendance streaks, and leaderboard rankings.

---

## Architecture

### Technology Stack
- **Framework**: SharePoint Framework (SPFx) v1.20.0
- **UI Library**: React 17 + Fluent UI
- **Language**: TypeScript 4.7
- **Data Layer**: PnP Queryable (PnP JS) for SharePoint
- **Styling**: SCSS modules
- **Build Tool**: Gulp 4
- **Code Quality**: Biome 2.4.8 + ESLint

---

## Project Structure

```
src/webparts/quickSparksHub/
├── QuickSparksHubWebPart.ts           # Main web part entry
├── QuickSparksHubWebPart.manifest.json # Web part metadata
│
├── components/                         # React components (organized by feature)
│   ├── QuickSparksHub.tsx             # Main container (manages state & tabs)
│   ├── QuickSparksHub.module.scss     # Main styles
│   ├── AttendanceStreak/              # Attendance feature
│   │   ├── AttendanceStreak.tsx
│   │   └── AttendanceStreak.module.scss
│   ├── BadgeDashboard/                # Badge display feature
│   │   ├── BadgeDashboard.tsx
│   │   ├── BadgeDashboard.module.scss
│   │   └── BadgeCard/
│   │       ├── BadgeCard.tsx
│   │       └── BadgeCard.module.scss
│   ├── Leaderboard/                   # Ranking feature
│   │   ├── Leaderboard.tsx
│   │   ├── Leaderboard.module.scss
│   │   └── LeaderboardRow/
│   │       ├── LeaderboardRow.tsx
│   │       └── LeaderboardRow.module.scss
│   ├── UpcomingSessions/              # Session calendar feature
│   │   ├── UpcomingSessions.tsx
│   │   ├── UpcomingSessions.module.scss
│   │   └── SessionCard/
│   │       ├── SessionCard.tsx
│   │       └── SessionCard.module.scss
│   └── common/                         # Shared components
│       ├── ErrorBoundary/
│       ├── Header/
│       ├── TabNav/
│       ├── EmptyState/
│       └── Skeleton/
│
├── services/                           # Data layer (abstracted)
│   ├── IDataService.ts                # Data service interface (contract)
│   ├── ServiceFactory.ts              # Factory to select Mock vs SharePoint service
│   ├── MockDataService.ts             # Dummy data for testing/dev
│   └── SharePointDataService.ts       # Real SharePoint data fetcher
│
├── models/                             # TypeScript interfaces (data contracts)
│   ├── ISession.ts                    # Training session model
│   ├── IUserBadge.ts                  # Badge achievement model
│   ├── ILeaderboardEntry.ts           # Ranking entry model
│   ├── IEmployee.ts                   # Employee profile model
│   └── IAttendance.ts                 # Attendance tracking model
│
├── hooks/                              # Custom React hooks
│   ├── useBadges.ts
│   ├── useLeaderboard.ts
│   ├── useSessions.ts
│   └── useStreak.ts
│
├── config/                             # Configuration files
│   ├── spFieldNames.ts                # SharePoint list column mappings
│   └── theme.ts                       # Theme configuration
│
├── utils/                              # Utility functions
│   ├── constants.ts                   # App constants (skill studios, categories, countries)
│   ├── badgeUtils.ts                  # Badge calculation & derivation
│   ├── dateUtils.ts                   # Date & streak calculations
│
└── loc/                                # Localization
    ├── en-us.js
    └── mystrings.d.ts
```

---

## Data Flow

### 1. Web Part Entry Point
**File**: [QuickSparksHubWebPart.ts](src/webparts/quickSparksHub/QuickSparksHubWebPart.ts)

```
User/SharePoint
    ↓
WebPart onInit()
    ├─ Initialize PnP/SharePoint context (SPFI)
    └─ Create DataService via ServiceFactory
         ├─ If useMockData = true  → new MockDataService()
         └─ If useMockData = false → new SharePointDataService()
    ↓
WebPart render()
    └─ Pass dataService to QuickSparksHub component
```

**Key Property**: `useMockData` (toggleable in property pane)

---

### 2. Component Initialization
**File**: [QuickSparksHub.tsx](src/webparts/quickSparksHub/components/QuickSparksHub.tsx)

```
QuickSparksHub Component
    ↓
componentDidMount()
    └─ loadData()
        ├─ dataService.getUserBadges(email)          → state.badges
        ├─ dataService.getUpcomingSessions()         → state.sessions
        ├─ dataService.getUserAttendanceStreak(email)→ state.streak
        └─ dataService.getLeaderboard()              → state.leaderboard
    ↓
Render 5 Tabs:
    ├─ My Badges         (BadgeDashboard)
    ├─ Leaderboard       (Leaderboard)
    ├─ Attendance Streak (AttendanceStreak)
    ├─ Upcoming Sessions (UpcomingSessions)
    └─ [5th tab - TBD]
```

---

## Data Models

### 1. ISession (Training Sessions)
```typescript
{
  id: number,
  trainingCode: string,          // e.g., "1.1", "2.1"
  title: string,                 // e.g., "Say It So It Sticks"
  sessionDate: Date,
  skillStudio: string,           // e.g., "1.0 The Conversation Catalyst"
  category: string,              // Business Skills | Compliance | Credit | Leadership | Service/Support/Technical
  country: string,               // e.g., "RBL"
  isUpcoming: boolean
}
```

### 2. IUserBadge (Achievements)
```typescript
{
  sessionId: number,
  trainingCode: string,
  title: string,
  skillStudio: string,
  category: string,
  tier: BadgeTier,               // 'none' | 'bronze' | 'silver' | 'gold'
  points: number,
  earnedDate: Date | null,
  badgeImageUrl: string
}
```

### 3. ILeaderboardEntry (Rankings)
```typescript
{
  rank: number,
  branchUnit: string,            // Branch/department identifier
  country: string,
  totalBadges: number,
  totalPoints: number
}
```

### 4. IAttendance (Attendance Tracking)
(Used for streak calculations)

---

## Service Layer

### IDataService Interface (Contract)
**File**: [IDataService.ts](src/webparts/quickSparksHub/services/IDataService.ts)

```typescript
interface IDataService {
  getUserBadges(email: string): Promise<IUserBadge[]>
  getAllSessions(): Promise<ISession[]>
  getUpcomingSessions(): Promise<ISession[]>
  getUserAttendanceStreak(email: string): Promise<number>
  getLeaderboard(country?: string): Promise<ILeaderboardEntry[]>
  getCountries(): Promise<string[]>
  getCurrentUserEmail(): string
  getCurrentUserDisplayName(): string
}
```

### ServiceFactory (Strategy Pattern)
**File**: [ServiceFactory.ts](src/webparts/quickSparksHub/services/ServiceFactory.ts)

```typescript
function createDataService(useMockData, sp, context): IDataService
  ├─ If useMockData || !sp || !context
  │   └─ return new MockDataService()        // Returns dummy data
  └─ else
      └─ return new SharePointDataService()  // Fetches from SharePoint lists
```

### MockDataService
**File**: [MockDataService.ts](src/webparts/quickSparksHub/services/MockDataService.ts)

- **Default User**: Aidan Traboulay (aidan.traboulay@rfhl.com)
- **Mock Data Includes**:
  - 9+ training sessions (Jan-Feb 2026)
  - Multiple skill studios and categories
  - Derived badges based on sessions
  - Mock attendance streaks
  - Simulated leaderboards
- **Used For**: Development, testing without SharePoint backend

### SharePointDataService
**File**: [SharePointDataService.ts](src/webparts/quickSparksHub/services/SharePointDataService.ts)

- Fetches data from SharePoint lists via PnP/SP
- Maps SharePoint list columns to models via `spFieldNames.ts`
- Queries:
  - Sessions List
  - Badges List
  - Leaderboard List
  - User attendance records

---

## Component Tree

```
QuickSparksHub (Main Container)
    ├─ ErrorBoundary (Error handling wrapper)
    │
    ├─ Header (App title/branding)
    │
    ├─ TabNav (Tab navigation)
    │
    └─ Tab Content (renders based on activeTab):
        │
        ├─ BadgeDashboard (My Badges tab)
        │   └─ BadgeCard[] (Individual badge cards)
        │
        ├─ Leaderboard (Rankings tab)
        │   └─ LeaderboardRow[] (Ranking rows)
        │
        ├─ AttendanceStreak (Attendance tab)
        │
        ├─ UpcomingSessions (Sessions tab)
        │   └─ SessionCard[] (Session cards)
        │
        └─ [5th Tab - TBD]
```

---

## State Management

**QuickSparksHub Component State**:
```typescript
{
  activeTab: TabId,                    // Current selected tab
  
  // Badges
  badges: IUserBadge[],
  badgesLoading: boolean,
  badgesError: string | null,
  
  // Sessions
  sessions: ISession[],
  sessionsLoading: boolean,
  sessionsError: string | null,
  
  // Streak
  streak: number,
  streakLoading: boolean,
  
  // Leaderboard
  leaderboard: ILeaderboardEntry[],
  leaderboardLoading: boolean,
  leaderboardError: string | null
}
```

---

## Constants & Configuration

### Constants.ts
**File**: [constants.ts](src/webparts/quickSparksHub/utils/constants.ts)

- **Skill Studios** (12 studios):
  - 1.0 The Conversation Catalyst
  - 2.0 Mind Over Maybes
  - 3.0 Outside In: The Mindset That Changes Everything
  - ... (9 more)

- **Categories** (6 categories):
  - Business Skills
  - Compliance
  - Credit
  - Leadership
  - Service/Support/Technical
  - Personal Development

- **Country Codes** (22 Republic Bank branches):
  - RBL = Republic Bank Limited
  - RBB = Republic Bank (Barbados) Limited
  - RGD, RGY, RSL, etc. (Caribbean & Africa expansions)

### Theme Configuration
**File**: [config/theme.ts](src/webparts/quickSparksHub/config/theme.ts)

- Defines color scheme, fonts, and Fluent UI theme overrides

### SharePoint Field Mapping
**File**: [config/spFieldNames.ts](src/webparts/quickSparksHub/config/spFieldNames.ts)

- Maps SharePoint list column names to TypeScript model properties

---

## Utility Functions

### Badge Utils
**File**: [utils/badgeUtils.ts](src/webparts/quickSparksHub/utils/badgeUtils.ts)

- `countEarnedBadges()` - Count badges by tier
- `deriveUserBadges()` - Calculate badges from session attendance

### Date Utils
**File**: [utils/dateUtils.ts](src/webparts/quickSparksHub/utils/dateUtils.ts)

- `calculateStreak()` - Calculate attendance streak from session dates

---

## UI/UX Features

### Loading States
- Skeleton loaders for data fetching
- Error messages if data fails to load
- Loading flags in state

### Error Handling
- ErrorBoundary component catches React errors
- Fallback UI displays errors gracefully
- Service errors set error messages in state

### Tab Navigation
- 5 main tabs for different features
- Active tab persists in state
- Tab labels defined in constants

### Responsive Design
- SCSS modules for scoped styling
- Fluent UI components for accessibility
- Mobile-friendly layouts

---

## Development Workflow

### Running the App
```bash
# Install dependencies
npm install

# Build
npm run build

# Dev server (auto-builds on changes)
npx gulp serve

# Navigate to SharePoint workbench
https://republicconnect.sharepoint.com/_layouts/workbench.aspx
```

### Toggling Mock Data
1. Web Part Property Pane → "Use mock data" toggle
2. True (default) = MockDataService
3. False = SharePointDataService (requires SharePoint connection)

### Build Artifacts
- `lib/` - Compiled JavaScript
- `dist/` - Distribution files for deployment
- `temp/` - Temporary build files

---

## Key Patterns Used

### 1. Factory Pattern (Service Selection)
ServiceFactory chooses between MockDataService and SharePointDataService

### 2. Strategy Pattern (Data Source Abstraction)
IDataService interface allows plugging in different data sources

### 3. Component Composition
Small, reusable components (BadgeCard, SessionCard, LeaderboardRow)

### 4. Error Boundaries
ErrorBoundary component isolates component errors

### 5. Loading States
Explicit loading flags and skeleton UI for async data

---

## Next Steps / TODOs

- [ ] Implement 5th tab (profile/details?)
- [ ] Connect to real SharePoint lists
- [ ] Verify badge tier calculations
- [ ] Performance optimization for large datasets
- [ ] Add user filtering/search
- [ ] Add data export/reporting
- [ ] Internationalization (beyond en-us)

---

## File Size Summary

| Module | Files | Purpose |
|--------|-------|---------|
| Components | 20+ | UI rendering |
| Services | 3 | Data fetching |
| Models | 5 | TypeScript interfaces |
| Utils | 3 | Helper functions |
| Config | 2 | Configuration |
| Hooks | 4 | Custom React hooks |
| Localization | 2 | Multi-language support |

---

**Last Updated**: March 31, 2026  
**Project**: QuickSparks Hub - SharePoint Framework Web Part
