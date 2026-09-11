import { Phase } from '../../types';

export const roadmapPhases: Phase[] = [
  {
    id: 0,
    code: 'PHASE-0',
    name: 'Setup + Baseline',
    dates: 'September 9 – September 13',
    startDate: '2026-09-09',
    endDate: '2026-09-13',
    primarySubjects: ['Curriculum Baseline', 'Syllabus Calibration'],
    secondarySubjects: ['General Aptitude Habit', 'Maths Habit'],
    goals: [
      'Deconstruct the official IIT Madras GATE 2027 syllabus',
      'Lock in baseline knowledge targets (Floor: 60, Target: 75+, Stretch: 80)',
      'Establish daily study rhythm (3h 5m college day, 7h weekend)',
      'Install daily habit of 30 min GA and 30 min Engineering Maths'
    ]
  },
  {
    id: 1,
    code: 'PHASE-1',
    name: 'Foundation & High Confidence',
    dates: 'September 14 – September 30',
    startDate: '2026-09-14',
    endDate: '2026-09-30',
    primarySubjects: ['Programming & Data Structures', 'Algorithms', 'Digital Logic'],
    secondarySubjects: ['Discrete Mathematics', 'General Aptitude (Verbal & Quant)'],
    goals: [
      'Master C pointers, arrays, linked lists, stacks, queues, trees, and heaps',
      'Solidify asymptotic analysis, recurrences, divide & conquer, and sorting',
      'Master 2\'s complement arithmetic, Boolean algebra, and K-maps',
      'Build unshakeable momentum with high-yield, logical foundation subjects'
    ]
  },
  {
    id: 2,
    code: 'PHASE-2',
    name: 'Core Systems I (OS & DBMS)',
    dates: 'October 1 – October 31',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    primarySubjects: ['Operating Systems', 'Database Management Systems'],
    secondarySubjects: ['Linear Algebra', 'Analytical Aptitude', 'PDS / Algo Maintenance'],
    goals: [
      'Master OS process synchronization, semaphores, and deadlocks (Banker\'s algorithm)',
      'Master virtual memory, paging hierarchies, and page replacement policies',
      'Achieve 100% precision in DBMS Normalization (1NF–BCNF) and candidate keys',
      'Master relational algebra, SQL subqueries, and transaction serializability'
    ]
  },
  {
    id: 3,
    code: 'PHASE-3',
    name: 'Core Systems II (COA & CN)',
    dates: 'November 1 – November 30',
    startDate: '2026-11-01',
    endDate: '2026-11-30',
    primarySubjects: ['Computer Organization & Architecture', 'Computer Networks'],
    secondarySubjects: ['Calculus', 'Spatial Aptitude', 'OS & DBMS Revision'],
    goals: [
      'Master cache address mapping (Tag, Set, Word Offset) and AMAT calculations',
      'Master instruction pipelining, speedup formulas, and hazard stall analysis',
      'Master network delay calculations, sliding window flow control, and CRC',
      'Master CIDR subnetting, longest prefix match, and IPv4 fragmentation offsets'
    ]
  },
  {
    id: 4,
    code: 'PHASE-4',
    name: 'Theory of Computation & Compiler Design',
    dates: 'December 1 – December 31',
    startDate: '2026-12-01',
    endDate: '2026-12-31',
    primarySubjects: ['Theory of Computation', 'Compiler Design'],
    secondarySubjects: ['Probability & Statistics', 'Full Syllabus Completion'],
    goals: [
      'Master DFA minimization, regular grammar closures, and pumping lemma',
      'Master Rice\'s theorem and language decidability classifications',
      'Master LL(1) FIRST/FOLLOW parsing and LR parser shift-reduce / reduce-reduce conflicts',
      'Achieve 100% complete coverage of all 17 official GATE 2027 curriculum subjects'
    ]
  },
  {
    id: 5,
    code: 'PHASE-5',
    name: 'First Complete Revision',
    dates: 'January 1 – January 10',
    startDate: '2027-01-01',
    endDate: '2027-01-10',
    primarySubjects: ['Full CS Syllabus Revision (All 9 CS Subjects)'],
    secondarySubjects: ['Engineering Mathematics Revision', 'General Aptitude Revision'],
    goals: [
      'Zero new concepts; rigorous consolidation across all 11 subject areas',
      'Rapid run-through of all Master Check criteria',
      'Consolidate personal lesson notes and formula cheatsheets',
      'Identify and catalog remaining weak spots for targeted repair'
    ]
  },
  {
    id: 6,
    code: 'PHASE-6',
    name: 'Exam Mode & Final Mastery',
    dates: 'January 11 – January 31',
    startDate: '2027-01-11',
    endDate: '2027-01-31',
    primarySubjects: ['Targeted Weak-Topic Repair', 'High-Speed Formula Recalls'],
    secondarySubjects: ['Timed Conceptual Review Sessions', 'Calculations Speed Drills'],
    goals: [
      'Final revision of all formula sheets, edge cases, and common traps',
      'Strengthen tricky calculation areas (Cache AMAT, EMAT, CIDR, Master Theorem)',
      'Peak mental clarity and exam readiness for GATE 2027'
    ]
  }
];
