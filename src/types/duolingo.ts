export interface DuoUsersResponse {
  users: DuoUser[];
}

export interface DuoUser {
  id: number;
  username: string;
  name?: string | null;
  hasPlus?: boolean;
  emailVerified?: boolean;
  betaStatus?: string;
  roles?: string[];
  creationDate?: number;
  bio?: string;
  profileCountry?: string | null;
  picture?: string;
  learningLanguage?: string;
  fromLanguage?: string;
  currentCourseId?: string;
  courses?: DuoCourse[];
  totalXp?: number;
  streak?: number;
  siteStreak?: number;
  streakData?: {
    currentStreak?: {
      startDate?: string;
      endDate?: string;
      length?: number;
    };
  };
  joinedClassroomIds?: string[];
  observedClassroomIds?: string[];
  privacySettings?: unknown[];
  chinaUserModerationRecords?: unknown[];
  globalAmbassadorStatus?: Record<string, unknown>;
  hasFacebookId?: boolean;
  hasGoogleId?: boolean;
  hasPhoneNumber?: boolean;
  shakeToReportEnabled?: boolean | null;
  liveOpsFeatures?: unknown[];
  acquisitionSurveyReason?: string;
  motivation?: string;
  hasRecentActivity15?: boolean;
  classroomLeaderboardsEnabled?: boolean;
  _achievements?: unknown[];
  achievements?: unknown[];
}

export interface DuoCourse {
  id: string;
  title: string;
  learningLanguage: string;
  fromLanguage: string;
  xp: number;
  crowns?: number;
  authorId?: string;
  preload?: boolean;
  placementTestAvailable?: boolean;
  healthEnabled?: boolean;
}
