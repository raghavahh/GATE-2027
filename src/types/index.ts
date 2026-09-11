export type PillarType = 'GA' | 'MATH' | 'CS';

export type LearningStatus = 'not-started' | 'learning' | 'practicing' | 'strong' | 'mastered';

export type ResourceType = 'official' | 'youtube' | 'notes' | 'book' | 'article' | 'reference';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  provider: string;
  description: string;
  duration?: string;
  language?: string;
  verified: boolean;
  recommended: boolean;
  topicId?: string;
  lessonId?: string;
  subjectCode?: string;
  pillar?: PillarType;
  lastChecked?: string;
}

export interface UserNote {
  id: string;
  lessonId: string;
  lessonTitle: string;
  subjectName: string;
  subjectCode: string;
  content: string;
  updatedAt: string;
}

export interface UserSettings {
  targetFloor: number;
  targetScore: number;
  targetStretch: number;
  dailyMode: 'college' | 'weekend' | 'custom';
  collegeStudyMinutes: number;
  weekendStudyMinutes: number;
  customStudyMinutes: number;
}

export interface ConceptNode {
  id: string;
  label: string;
  sub?: string;
}

export interface ConceptConnection {
  from: string;
  to: string;
  label?: string;
}

export interface ConceptMap {
  title: string;
  nodes: ConceptNode[];
  connections: ConceptConnection[];
  asciiDiagram?: string;
}

export interface FormulaRule {
  id: string;
  name: string;
  formula?: string;
  rule: string;
  condition?: string;
  subjectCode: string;
  lessonId: string;
  lessonTitle: string;
}

export interface WorkedExample {
  title: string;
  problem: string;
  solutionSteps: string[];
  keyInsight: string;
}

export interface CommonMistake {
  pitfall: string;
  whyItHappens: string;
  correction: string;
}

export interface LessonOverview {
  whyItMatters: string;
  whatYouWillLearn: string[];
  prerequisites: string[];
}

export interface LessonExplanation {
  definition: string;
  intuition: string;
  howItWorks: string[];
  keyTakeaway: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  moduleId: string;
  subjectId: string;
  title: string;
  durationMin: number;
  official: boolean;
  supporting: boolean;
  optional?: boolean;
  overview: LessonOverview;
  explanation: LessonExplanation;
  conceptMap?: ConceptMap;
  formulasAndRules: FormulaRule[];
  examples: WorkedExample[];
  commonMistakes: CommonMistake[];
  masterCheckCriteria: string[];
  nextLessonId?: string;
  prevLessonId?: string;
  resources?: Resource[];
}

export interface Topic {
  id: string;
  moduleId: string;
  subjectId: string;
  name: string;
  description: string;
  difficulty: 'Foundation' | 'Core' | 'Advanced';
  official: boolean;
  supporting: boolean;
  optional?: boolean;
  prerequisites?: string[];
  lessons: Lesson[];
}

export interface Module {
  id: string;
  subjectId: string;
  azLetter: string; // e.g., 'A', 'B', 'C' for A-Z organizing philosophy
  name: string;
  description: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  pillar: PillarType;
  officialSection: string;
  approxMarks: number;
  description: string;
  modules: Module[];
}

export interface UserLessonProgress {
  status: LearningStatus;
  masterCheck: boolean[]; // 6 items
  notes: string;
  bookmarked: boolean;
  lastStudied?: string;
}

export interface Phase {
  id: number;
  name: string;
  code: string;
  dates: string;
  startDate: string;
  endDate: string;
  primarySubjects: string[];
  secondarySubjects: string[];
  goals: string[];
}

export interface DayTask {
  subject: string;
  topic: string;
  lessonId: string;
  minutes: number;
  type: 'primary' | 'secondary' | 'ga' | 'math' | 'revision';
}

export interface WeekSchedule {
  weekNum: number;
  phaseId: number;
  dates: string;
  primarySubject: string;
  secondarySubject: string;
  gaFocus: string;
  mathFocus: string;
  topics: string[];
  subtopics: string[];
  estimatedHours: number;
  weeklyReviewMilestone: string;
  dayPlan: {
    dayName: string;
    focus: string;
  }[];
}

export interface DailyMission {
  date: string;
  mode: 'college' | 'weekend' | 'custom';
  totalMinutes: number;
  tasks: DayTask[];
}
