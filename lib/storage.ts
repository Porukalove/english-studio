
export type StudyData = {
  version: 1;
  completedUnits: number[];
  studyDates: string[];
  studyMinutes: number;
  dailyGoal: number;
};

export const initialData: StudyData = {
  version: 1,
  completedUnits: [],
  studyDates: [],
  studyMinutes: 0,
  dailyGoal: 15,
};

const STORAGE_KEY = "english-studio-data";

export function loadData(): StudyData {
  if (typeof window === "undefined") return initialData;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialData;

    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("version" in parsed) ||
      !("completedUnits" in parsed) ||
      !("studyDates" in parsed) ||
      !("studyMinutes" in parsed) ||
      !("dailyGoal" in parsed)
    ) {
      return initialData;
    }

    if (
      parsed.version !== 1 ||
      !Array.isArray(parsed.completedUnits) ||
      !parsed.completedUnits.every((value): value is number => typeof value === "number") ||
      !Array.isArray(parsed.studyDates) ||
      !parsed.studyDates.every((value): value is string => typeof value === "string") ||
      typeof parsed.studyMinutes !== "number" ||
      typeof parsed.dailyGoal !== "number"
    ) {
      return initialData;
    }

    return {
      version: 1,
      completedUnits: [...new Set(parsed.completedUnits)],
      studyDates: [...new Set(parsed.studyDates)],
      studyMinutes: parsed.studyMinutes,
      dailyGoal: parsed.dailyGoal,
    };
  } catch {
    return initialData;
  }
}

export function saveData(data: StudyData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function calculateStreak(dates: string[]): number {
  const dateSet = new Set(dates);
  const cursor = new Date();
  let streak = 0;

  if (!dateSet.has(getToday())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (dateSet.has(formatDate(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
