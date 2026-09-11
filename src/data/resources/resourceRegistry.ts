import { Resource, PillarType, ResourceType } from '../../types';

export const resourceRegistry: Resource[] = [
  // ==========================================
  // OFFICIAL SOURCES (IIT Madras GATE 2027)
  // ==========================================
  {
    id: 'official-gate-2027-home',
    title: 'Official GATE 2027 IIT Madras Portal',
    url: 'https://gate2027.iitm.ac.in/',
    type: 'official',
    provider: 'IIT Madras',
    description: 'The definitive official entrance examination portal for GATE 2027 organizing institute IIT Madras.',
    verified: true,
    recommended: true,
    lastChecked: '2026-09-11'
  },
  {
    id: 'official-gate-2027-syllabus-pdf',
    title: 'GATE 2027 Official CS Syllabus Document',
    url: 'https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf',
    type: 'official',
    provider: 'IIT Madras',
    description: 'The authoritative, revised official curriculum document specifying exact topics for Computer Science & IT.',
    verified: true,
    recommended: true,
    lastChecked: '2026-09-11'
  },
  {
    id: 'official-gate-2027-pattern',
    title: 'GATE 2027 Question Paper Pattern & Marking Scheme',
    url: 'https://gate2027.iitm.ac.in/question_paper_pattern',
    type: 'official',
    provider: 'IIT Madras',
    description: 'Official test blueprint: 65 questions, 100 marks (15M GA, 13M Maths, 72M CS Core) across MCQ, MSQ, and NAT.',
    verified: true,
    recommended: true,
    lastChecked: '2026-09-11'
  },

  // ==========================================
  // OPERATING SYSTEMS (CS-OS)
  // ==========================================
  {
    id: 'res-os-neso-deadlocks',
    title: 'Neso Academy — Deadlocks in Operating Systems (Complete Series)',
    url: 'https://www.youtube.com/watch?v=rWFH6dfKwtM',
    type: 'youtube',
    provider: 'Neso Academy',
    description: 'Comprehensive coverage of Coffman 4 conditions, Resource Allocation Graphs, deadlock detection, and cycle rules.',
    duration: '45 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-OS',
    pillar: 'CS',
    topicId: 'os-t1',
    lessonId: 'os-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-os-gs-bankers',
    title: 'Gate Smashers — Banker\'s Algorithm for Deadlock Avoidance with Example',
    url: 'https://www.youtube.com/watch?v=T0FXvTHcYi4',
    type: 'youtube',
    provider: 'Gate Smashers',
    description: 'Step-by-step resolution of Allocation, Max, Need matrices and safe sequence verification for GATE NAT questions.',
    duration: '22 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-OS',
    pillar: 'CS',
    topicId: 'os-t1',
    lessonId: 'os-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-os-notes-deadlocks',
    title: 'Operating Systems Revision Notes — Synchronization & Deadlocks',
    url: 'https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/',
    type: 'notes',
    provider: 'GeeksforGeeks CS',
    description: 'Condensed formulas, Banker\'s algorithm safety criteria, and edge-case trap breakdowns.',
    verified: true,
    recommended: true,
    subjectCode: 'CS-OS',
    pillar: 'CS',
    topicId: 'os-t1',
    lessonId: 'os-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-os-book-silberschatz',
    title: 'Operating System Concepts (Silberschatz, Galvin, Gagne) — Chapter 8: Deadlocks',
    url: 'https://codex.cs.yale.edu/avi/os-book/OS10/index.html',
    type: 'book',
    provider: 'Yale University / Wiley',
    description: 'The standard recommended reference textbook for formal deadlock handling theorems and proof methods.',
    verified: true,
    recommended: false,
    subjectCode: 'CS-OS',
    pillar: 'CS',
    topicId: 'os-t1',
    lessonId: 'os-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-os-gs-paging',
    title: 'Gate Smashers — Paging, Page Tables, and Virtual Memory in OS',
    url: 'https://www.youtube.com/watch?v=pJ6qrCB8pDw',
    type: 'youtube',
    provider: 'Gate Smashers',
    description: 'In-depth explanation of logical to physical address translation, page size, frame size, and page fault rates.',
    duration: '28 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-OS',
    pillar: 'CS',
    topicId: 'os-t2',
    lessonId: 'os-l2',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-os-neso-tlb',
    title: 'Neso Academy — Effective Memory Access Time (EMAT) with TLB',
    url: 'https://www.youtube.com/watch?v=9g0H5P4B1_s',
    type: 'youtube',
    provider: 'Neso Academy',
    description: 'Mathematical deduction of multi-level page table EMAT, TLB hit/miss penalty, and frame calculations.',
    duration: '24 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-OS',
    pillar: 'CS',
    topicId: 'os-t2',
    lessonId: 'os-l2',
    lastChecked: '2026-09-11'
  },

  // ==========================================
  // DATABASE MANAGEMENT SYSTEMS (CS-DBMS)
  // ==========================================
  {
    id: 'res-db-gs-normalization',
    title: 'Gate Smashers — Normalization in DBMS: 1NF, 2NF, 3NF, BCNF with Easy Examples',
    url: 'https://www.youtube.com/watch?v=5dsrk3vfZS8',
    type: 'youtube',
    provider: 'Gate Smashers',
    description: 'Clear rules for prime/non-prime attributes, partial dependencies, transitive dependencies, and super key tests.',
    duration: '32 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-DBMS',
    pillar: 'CS',
    topicId: 'db-t1',
    lessonId: 'db-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-db-notes-fd',
    title: 'Functional Dependencies & Candidate Keys Guide for GATE',
    url: 'https://www.geeksforgeeks.org/finding-attribute-closure-and-candidate-keys-using-functional-dependencies/',
    type: 'notes',
    provider: 'GeeksforGeeks CS',
    description: 'Systematic algorithm for finding attribute closures, minimal covers, and all candidate keys of a relation.',
    verified: true,
    recommended: true,
    subjectCode: 'CS-DBMS',
    pillar: 'CS',
    topicId: 'db-t1',
    lessonId: 'db-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-db-book-navathe',
    title: 'Fundamentals of Database Systems (Elmasri & Navathe) — Chapter 14: Functional Dependencies and Normalization',
    url: 'https://www.pearson.com/en-us/subject-catalog/p/fundamentals-of-database-systems/P200000003310',
    type: 'book',
    provider: 'Pearson',
    description: 'Formal theory of Armstrong\'s axioms, lossless join decomposition, and dependency preservation proofs.',
    verified: true,
    recommended: false,
    subjectCode: 'CS-DBMS',
    pillar: 'CS',
    topicId: 'db-t1',
    lessonId: 'db-l1',
    lastChecked: '2026-09-11'
  },

  // ==========================================
  // COMPUTER NETWORKS (CS-CN)
  // ==========================================
  {
    id: 'res-cn-gs-cidr',
    title: 'Gate Smashers — CIDR & Subnetting Full Concept Explained',
    url: 'https://www.youtube.com/watch?v=s_Ntt6eTn94',
    type: 'youtube',
    provider: 'Gate Smashers',
    description: 'Slash notation, block allocation rules, finding network ID, broadcast address, and host IP ranges.',
    duration: '26 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-CN',
    pillar: 'CS',
    topicId: 'cn-t2',
    lessonId: 'cn-l2',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-cn-gs-sliding-window',
    title: 'Gate Smashers — Stop and Wait, Go Back N & Selective Repeat Protocol',
    url: 'https://www.youtube.com/watch?v=LnmVs_a_9G4',
    type: 'youtube',
    provider: 'Gate Smashers',
    description: 'Window size derivations, sequence number bounds, propagation delay, transmission delay, and channel efficiency formulas.',
    duration: '35 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-CN',
    pillar: 'CS',
    topicId: 'cn-t1',
    lessonId: 'cn-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-cn-book-kurose',
    title: 'Computer Networking: A Top-Down Approach (Kurose & Ross) — Transport & Network Layers',
    url: 'https://www.pearson.com/en-us/subject-catalog/p/computer-networking-a-top-down-approach/P200000003311',
    type: 'book',
    provider: 'Pearson',
    description: 'The premier reference text for sliding window protocols, congestion control, TCP window scaling, and IP routing.',
    verified: true,
    recommended: false,
    subjectCode: 'CS-CN',
    pillar: 'CS',
    topicId: 'cn-t2',
    lessonId: 'cn-l2',
    lastChecked: '2026-09-11'
  },

  // ==========================================
  // COMPUTER ORGANIZATION & ARCHITECTURE (CS-COA)
  // ==========================================
  {
    id: 'res-coa-neso-cache',
    title: 'Neso Academy — Cache Memory Mapping Techniques (Direct, Associative, Set-Associative)',
    url: 'https://www.youtube.com/watch?v=d_kvdP9Z15s',
    type: 'youtube',
    provider: 'Neso Academy',
    description: 'Bit partition breakdown into Tag, Set/Block, and Word Offset fields for 32-bit physical address spaces.',
    duration: '40 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-COA',
    pillar: 'CS',
    topicId: 'coa-t1',
    lessonId: 'coa-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-coa-neso-pipelining',
    title: 'Neso Academy — Pipelining Hazards, Stalls, and Speedup Calculations',
    url: 'https://www.youtube.com/watch?v=1K5Q_B1q6Z8',
    type: 'youtube',
    provider: 'Neso Academy',
    description: 'Structural, data, and control hazards analysis with pipeline cycle time, CPI calculation, and speedup formulas.',
    duration: '34 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-COA',
    pillar: 'CS',
    topicId: 'coa-t2',
    lessonId: 'coa-l2',
    lastChecked: '2026-09-11'
  },

  // ==========================================
  // PROGRAMMING & DATA STRUCTURES (CS-PDS)
  // ==========================================
  {
    id: 'res-pds-abdul-pointers',
    title: 'Jenny\'s Lectures — C Pointers, Double Pointers & Memory Layout in Depth',
    url: 'https://www.youtube.com/watch?v=zuegQmMdy8M',
    type: 'youtube',
    provider: 'Jenny\'s Lectures CS/IT',
    description: 'Pointer arithmetic (*p++, ++*p), operator precedence, array name decaying, and pointer arrays.',
    duration: '38 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-PDS',
    pillar: 'CS',
    topicId: 'pds-t1',
    lessonId: 'pds-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-pds-abdul-trees',
    title: 'Abdul Bari — Binary Trees, Traversals & Heap Construction',
    url: 'https://www.youtube.com/watch?v=HqPJF2L5h9U',
    type: 'youtube',
    provider: 'Abdul Bari',
    description: 'Tree property theorems (leaves vs degree-2 nodes, max nodes at height h), Build-Heap O(n) proof, and traversals.',
    duration: '45 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-PDS',
    pillar: 'CS',
    topicId: 'pds-t2',
    lessonId: 'pds-l2',
    lastChecked: '2026-09-11'
  },

  // ==========================================
  // ALGORITHMS (CS-ALGO)
  // ==========================================
  {
    id: 'res-algo-abdul-master',
    title: 'Abdul Bari — Master Theorem for Divide and Conquer Recurrences',
    url: 'https://www.youtube.com/watch?v=OynWkEj0KYE',
    type: 'youtube',
    provider: 'Abdul Bari',
    description: 'Cases 1, 2, and 3 of Master Theorem with polynomial difference requirements and extended cases.',
    duration: '25 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-ALGO',
    pillar: 'CS',
    topicId: 'algo-t1',
    lessonId: 'algo-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-algo-abdul-graphs',
    title: 'Abdul Bari — Dijkstra\'s and Bellman-Ford Shortest Path Algorithms',
    url: 'https://www.youtube.com/watch?v=XB4MIexjvY0',
    type: 'youtube',
    provider: 'Abdul Bari',
    description: 'Greedy choice property, relaxation operations, negative weight edge detection, and time complexities.',
    duration: '32 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-ALGO',
    pillar: 'CS',
    topicId: 'algo-t2',
    lessonId: 'algo-l2',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-algo-book-clrs',
    title: 'Introduction to Algorithms (Cormen, Leiserson, Rivest, Stein) — Chapters 3, 4 & 24',
    url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/',
    type: 'book',
    provider: 'MIT Press',
    description: 'The golden reference for asymptotic proofs, recurrence trees, and shortest path graph algorithms.',
    verified: true,
    recommended: false,
    subjectCode: 'CS-ALGO',
    pillar: 'CS',
    topicId: 'algo-t1',
    lessonId: 'algo-l1',
    lastChecked: '2026-09-11'
  },

  // ==========================================
  // THEORY OF COMPUTATION (CS-TOC)
  // ==========================================
  {
    id: 'res-toc-neso-dfa',
    title: 'Neso Academy — Theory of Computation: Finite Automata & Regular Languages',
    url: 'https://www.youtube.com/watch?v=58N2N7zJGrQ',
    type: 'youtube',
    provider: 'Neso Academy',
    description: 'DFA construction, state minimization table-filling method, NFA to DFA power-set conversion, and closure properties.',
    duration: '50 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-TOC',
    pillar: 'CS',
    topicId: 'toc-t1',
    lessonId: 'toc-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-toc-gs-rices',
    title: 'Gate Smashers — Decidability, Halting Problem & Rice\'s Theorem',
    url: 'https://www.youtube.com/watch?v=0hW6QfH2pUk',
    type: 'youtube',
    provider: 'Gate Smashers',
    description: 'Clear application criteria for Rice\'s theorem Part 1 and Part 2 on Turing machine language properties.',
    duration: '27 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-TOC',
    pillar: 'CS',
    topicId: 'toc-t2',
    lessonId: 'toc-l2',
    lastChecked: '2026-09-11'
  },

  // ==========================================
  // COMPILER DESIGN (CS-COMPILER)
  // ==========================================
  {
    id: 'res-comp-gs-parsers',
    title: 'Gate Smashers — LL(1) Parser Condition, FIRST and FOLLOW Sets',
    url: 'https://www.youtube.com/watch?v=PwnC_Fh2b2U',
    type: 'youtube',
    provider: 'Gate Smashers',
    description: 'Calculation of FIRST and FOLLOW sets, constructing the LL(1) parsing table, and identifying grammar conflicts.',
    duration: '30 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-COMPILER',
    pillar: 'CS',
    topicId: 'comp-t1',
    lessonId: 'comp-l1',
    lastChecked: '2026-09-11'
  },

  // ==========================================
  // DIGITAL LOGIC (CS-DL)
  // ==========================================
  {
    id: 'res-dl-neso-kmaps',
    title: 'Neso Academy — Boolean Algebra, K-Maps & 2\'s Complement Arithmetic',
    url: 'https://www.youtube.com/watch?v=RO5alU6Z-EE',
    type: 'youtube',
    provider: 'Neso Academy',
    description: 'Implicants, Prime Implicants, Essential Prime Implicants, Don\'t Care terms, and signed binary overflow rules.',
    duration: '42 mins',
    verified: true,
    recommended: true,
    subjectCode: 'CS-DL',
    pillar: 'CS',
    topicId: 'dl-t1',
    lessonId: 'dl-l1',
    lastChecked: '2026-09-11'
  },

  // ==========================================
  // ENGINEERING MATHEMATICS (MATH)
  // ==========================================
  {
    id: 'res-math-kg-discrete',
    title: 'Knowledge Gate — Propositional Logic & Predicate Calculus for GATE',
    url: 'https://www.youtube.com/watch?v=xlUFkMKSB3Y',
    type: 'youtube',
    provider: 'Knowledge Gate (Sanchit Jain)',
    description: 'Truth tables, logical equivalences, implication negation, and quantifier scope in first-order logic.',
    duration: '48 mins',
    verified: true,
    recommended: true,
    subjectCode: 'MATH-DM',
    pillar: 'MATH',
    topicId: 'dm-t1',
    lessonId: 'dm-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-math-mit-strang',
    title: 'MIT OpenCourseWare — Linear Algebra (Prof. Gilbert Strang)',
    url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/',
    type: 'reference',
    provider: 'MIT OpenCourseWare',
    description: 'World-renowned foundational course on matrix rank, vector spaces, eigenvalues, and system solvability.',
    verified: true,
    recommended: true,
    subjectCode: 'MATH-LA',
    pillar: 'MATH',
    topicId: 'la-t1',
    lessonId: 'la-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-math-gs-prob',
    title: 'Gate Smashers — Conditional Probability & Bayes\' Theorem',
    url: 'https://www.youtube.com/watch?v=OBhyM6y0gZ4',
    type: 'youtube',
    provider: 'Gate Smashers',
    description: 'Total probability theorem, Bayes\' formula for updating prior probabilities, and independent events.',
    duration: '26 mins',
    verified: true,
    recommended: true,
    subjectCode: 'MATH-PROB',
    pillar: 'MATH',
    topicId: 'prob-t1',
    lessonId: 'prob-l1',
    lastChecked: '2026-09-11'
  },

  // ==========================================
  // GENERAL APTITUDE (GA)
  // ==========================================
  {
    id: 'res-ga-neso-verbal',
    title: 'Neso Academy — Verbal Ability: Subject-Verb Agreement & Preposition Rules',
    url: 'https://www.youtube.com/watch?v=7uK3t2Pj5Z4',
    type: 'youtube',
    provider: 'Neso Academy',
    description: 'Core English grammar rules frequently tested in GATE 1-mark and 2-mark sentence correction questions.',
    duration: '35 mins',
    verified: true,
    recommended: true,
    subjectCode: 'GA-VERBAL',
    pillar: 'GA',
    topicId: 'ga-v-t1',
    lessonId: 'ga-v-l1',
    lastChecked: '2026-09-11'
  },
  {
    id: 'res-ga-gs-quant',
    title: 'Gate Smashers — Quantitative Aptitude: Percentages, Ratios & Time-Work',
    url: 'https://www.youtube.com/watch?v=1VqJ3f0Y9_A',
    type: 'youtube',
    provider: 'Gate Smashers',
    description: 'High-speed shortcut techniques for successive percentage changes, base invariance, and unitary method.',
    duration: '40 mins',
    verified: true,
    recommended: true,
    subjectCode: 'GA-QUANT',
    pillar: 'GA',
    topicId: 'ga-q-t1',
    lessonId: 'ga-q-l1',
    lastChecked: '2026-09-11'
  }
];

export const getAllResources = (): Resource[] => resourceRegistry;

export const getResourcesForLesson = (lessonId: string): Resource[] => {
  return resourceRegistry.filter(r => r.lessonId === lessonId);
};

export const getResourcesBySubject = (subjectCode: string): Resource[] => {
  return resourceRegistry.filter(r => r.subjectCode?.toUpperCase() === subjectCode.toUpperCase());
};

export const getResourcesByType = (type: ResourceType): Resource[] => {
  return resourceRegistry.filter(r => r.type === type);
};

export const getResourcesByPillar = (pillar: PillarType): Resource[] => {
  return resourceRegistry.filter(r => r.pillar === pillar);
};
