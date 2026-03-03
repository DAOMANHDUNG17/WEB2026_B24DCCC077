export type Subject = {
	id: string;
	name: string;
	createdAt: string;
};

export type StudySession = {
	id: string;
	subjectId: string;
	studyAt: string;
	durationMinutes: number;
	content: string;
	note?: string;
};

export type MonthlyGoal = {
	month: string;
	totalMinutesTarget?: number;
	subjectTargets: Record<string, number>;
	updatedAt: string;
};

export type StudyTrackerData = {
	subjects: Subject[];
	sessions: StudySession[];
	goals: MonthlyGoal[];
};

