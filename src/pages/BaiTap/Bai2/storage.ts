import type { StudyTrackerData, Subject } from './types';

const STORAGE_KEY = 'study_tracker_bai2_v1';
const DEFAULT_SUBJECTS = ['Toán', 'Văn', 'Anh', 'Khoa học', 'Công nghệ'];

export const generateId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const createDefaultSubjects = (): Subject[] =>
	DEFAULT_SUBJECTS.map((name, index) => ({
		id: `default_${index + 1}`,
		name,
		createdAt: new Date().toISOString(),
	}));

export const createDefaultData = (): StudyTrackerData => ({
	subjects: createDefaultSubjects(),
	sessions: [],
	goals: [],
});

export const loadStudyTrackerData = (): StudyTrackerData => {
	if (typeof window === 'undefined') return createDefaultData();
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return createDefaultData();
		const parsed = JSON.parse(raw) as Partial<StudyTrackerData>;
		return {
			subjects: Array.isArray(parsed.subjects) && parsed.subjects.length > 0 ? parsed.subjects : createDefaultSubjects(),
			sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
			goals: Array.isArray(parsed.goals) ? parsed.goals : [],
		};
	} catch (error) {
		return createDefaultData();
	}
};

export const saveStudyTrackerData = (data: StudyTrackerData) => {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

