export type Diff = 'E' | 'M' | 'H';

export interface Video {
  id: string;
  title: string;
  channel: string;
}

export interface CatTopic {
  id: string;
  name: string;
  diff: Diff;
  /** Fully open without purchase (one per subject). */
  sample?: boolean;
}

export interface CatModule {
  letter: string;
  name: string;
  topics: CatTopic[];
}

export interface CatSubject {
  id: string;
  name: string;
  /** Typical marks in the paper, e.g. "8–10". */
  marks: string;
  /** Exam-focused one-liner shown on the sheet. */
  focus: string;
  modules: CatModule[];
}

export type PaperGroup = 'Engineering' | 'Science' | 'Other';
export type PaperStatus = 'live' | 'building' | 'soon';

export interface Paper {
  code: string;
  slug: string;
  name: string;
  group: PaperGroup;
  status: PaperStatus;
  note?: string;
}

export const DIFF_LABEL: Record<Diff, string> = { E: 'Easy', M: 'Medium', H: 'Hard' };
