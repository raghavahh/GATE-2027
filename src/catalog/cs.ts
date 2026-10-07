import type { CatModule, CatSubject, CatTopic, Diff } from './types';

const slug = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const T = (name: string, diff: Diff, lesson?: string): CatTopic => ({ id: slug(name), name, diff, lesson });
const M = (letter: string, name: string, topics: CatTopic[]): CatModule => ({ letter, name, topics });
const S = (id: string, name: string, marks: string, focus: string, modules: CatModule[]): CatSubject => {
  const first = modules[0]?.topics[0];
  if (first) first.sample = true;
  modules.forEach(m => m.topics.forEach(t => (t.id = `${id}--${t.id}`)));
  return { id, name, marks, focus, modules };
};

/** GATE CS syllabus as an A–Z sheet. "marks" are typical recent ranges, for prioritising. */
export const CS_SUBJECTS: CatSubject[] = [
  S('ga', 'General Aptitude', '15', 'Same 15 marks in every paper. Highest return per hour of study.', [
    M('A', 'Verbal aptitude', [
      T('Grammar: articles, prepositions, tenses', 'E', 'ga-v-l1'),
      T('Subject–verb agreement and sentence correction', 'E', 'ga-v-l3'),
      T('Vocabulary, idioms and word usage', 'E'),
      T('Reading comprehension and inference', 'M', 'ga-v-l4'),
    ]),
    M('B', 'Quantitative aptitude', [
      T('Numbers, divisibility and remainders', 'E', 'ga-q-l1'),
      T('Percentages, ratio and proportion', 'E', 'ga-q-l2'),
      T('Time and work, speed and distance', 'M', 'ga-q-l3'),
      T('Profit, loss and interest', 'E'),
      T('Permutations, combinations and probability', 'M'),
      T('Data interpretation: tables and charts', 'M'),
    ]),
    M('C', 'Analytical and spatial', [
      T('Logical reasoning and deduction', 'M'),
      T('Seating and arrangements', 'M', 'ga-a-l1'),
      T('Number and letter series', 'E'),
      T('Spatial reasoning: cubes, folding, rotation', 'M', 'ga-s-l1'),
    ]),
  ]),
  S('dm', 'Discrete Mathematics', '5–7', 'Logic, sets and graphs appear every year. Practise PYQs heavily.', [
    M('A', 'Logic', [
      T('Propositional logic and equivalences', 'E', 'dm-l1'),
      T('First-order logic and quantifiers', 'M', 'dm-l2'),
    ]),
    M('B', 'Sets, relations and functions', [
      T('Sets, relations and their properties', 'E', 'dm-l3'),
      T('Partial orders, lattices and Hasse diagrams', 'M'),
      T('Functions and countability', 'M'),
      T('Groups and monoids', 'H'),
    ]),
    M('C', 'Combinatorics', [
      T('Counting, permutations and combinations', 'M'),
      T('Recurrence relations and generating functions', 'H'),
      T('Pigeonhole and inclusion–exclusion', 'M'),
    ]),
    M('D', 'Graph theory', [
      T('Graph basics, connectivity and trees', 'E', 'dm-l4'),
      T('Matching and colouring', 'H'),
      T('Euler and Hamiltonian graphs, planarity', 'M'),
    ]),
  ]),
  S('la', 'Linear Algebra', '2–3', 'Short, formula-driven. Rank and eigenvalues are almost guaranteed.', [
    M('A', 'Matrices', [
      T('Matrix operations, determinants and rank', 'E', 'la-l1'),
      T('Systems of linear equations', 'M'),
      T('Eigenvalues and eigenvectors', 'M', 'la-l2'),
      T('LU decomposition', 'M'),
    ]),
  ]),
  S('calc', 'Calculus', '1–2', 'Usually one quick question. Learn limits and maxima–minima.', [
    M('A', 'Single-variable calculus', [
      T('Limits, continuity and differentiability', 'E', 'calc-l1'),
      T('Maxima and minima', 'M'),
      T('Mean value theorem', 'M'),
      T('Integration', 'M'),
    ]),
  ]),
  S('prob', 'Probability & Statistics', '2–3', 'Conditional probability and expectation are the favourites.', [
    M('A', 'Probability', [
      T('Conditional probability and Bayes theorem', 'M', 'prob-l1'),
      T('Random variables, mean and variance', 'M'),
      T('Distributions: uniform, binomial, Poisson, normal, exponential', 'H'),
    ]),
    M('B', 'Statistics', [
      T('Mean, median, mode and standard deviation', 'E'),
      T('Correlation and regression', 'M'),
    ]),
  ]),
  S('dl', 'Digital Logic', '4–6', 'Scoring and predictable. Number systems and K-maps first.', [
    M('A', 'Number systems', [
      T('Number systems and complements', 'E', 'dl-l1'),
      T('Fixed and floating point (IEEE 754)', 'M'),
    ]),
    M('B', 'Boolean algebra', [
      T('Boolean algebra and minimisation (K-maps)', 'M', 'dl-l2'),
    ]),
    M('C', 'Circuits', [
      T('Combinational circuits: mux, decoder, adders', 'M'),
      T('Sequential circuits: latches and flip-flops', 'M'),
      T('Counters and registers', 'H'),
    ]),
  ]),
  S('coa', 'Computer Organization & Architecture', '7–10', 'Numerical-heavy. Cache and pipelining decide your rank.', [
    M('A', 'Basics', [
      T('Machine instructions and addressing modes', 'M'),
      T('ALU, data path and control unit', 'M'),
    ]),
    M('B', 'Pipelining', [
      T('Instruction pipelining and hazards', 'H', 'coa-l2'),
    ]),
    M('C', 'Memory hierarchy', [
      T('Cache memory: mapping and AMAT', 'H', 'coa-l1'),
      T('Main memory and secondary storage', 'M'),
    ]),
    M('D', 'I/O', [
      T('I/O interface: interrupt and DMA', 'M'),
    ]),
  ]),
  S('pds', 'Programming & Data Structures', '8–12', 'Largest share. Trace C code by hand and master trees.', [
    M('A', 'Programming in C', [
      T('C basics, operators and control flow', 'E'),
      T('Recursion and function calls', 'M'),
      T('Pointers, arrays and strings', 'H', 'pds-l1'),
      T('Scope, storage classes and parameter passing', 'M'),
    ]),
    M('B', 'Linear structures', [
      T('Arrays and linked lists', 'E'),
      T('Stacks and queues', 'E'),
    ]),
    M('C', 'Trees and heaps', [
      T('Binary trees, BST and traversals', 'M', 'pds-l2'),
      T('Binary heaps', 'M'),
      T('AVL trees and balancing', 'H'),
    ]),
    M('D', 'Graphs and hashing', [
      T('Graph representations', 'E'),
      T('Hashing and collision resolution', 'M'),
    ]),
  ]),
  S('algo', 'Algorithms', '7–9', 'Complexity analysis plus classic algorithms. Know every PYQ pattern.', [
    M('A', 'Analysis', [
      T('Asymptotic notation and complexity', 'E', 'algo-l1'),
      T('Recurrences and master theorem', 'M'),
    ]),
    M('B', 'Searching and sorting', [
      T('Searching and sorting algorithms', 'M'),
    ]),
    M('C', 'Design techniques', [
      T('Divide and conquer', 'M'),
      T('Greedy algorithms', 'M'),
      T('Dynamic programming', 'H'),
    ]),
    M('D', 'Graph algorithms', [
      T('Graph traversals: BFS and DFS', 'M'),
      T('Minimum spanning trees', 'M'),
      T('Shortest paths: Dijkstra and Bellman–Ford', 'H', 'algo-l2'),
    ]),
  ]),
  S('toc', 'Theory of Computation', '7–9', 'Concept-heavy. Regular languages and decidability are high-yield.', [
    M('A', 'Regular languages', [
      T('Regular expressions and finite automata', 'M'),
      T('DFA minimisation and closure properties', 'M', 'toc-l1'),
      T('Pumping lemma for regular languages', 'H'),
    ]),
    M('B', 'Context-free languages', [
      T('Context-free grammars', 'M'),
      T('Pushdown automata', 'H'),
      T('Pumping lemma for CFLs', 'H'),
    ]),
    M('C', 'Turing machines', [
      T('Turing machines and recursively enumerable languages', 'H'),
      T('Undecidability and reductions', 'H', 'toc-l2'),
    ]),
  ]),
  S('cd', 'Compiler Design', '4–6', 'Parsing is the core. FIRST/FOLLOW and LR tables come every year.', [
    M('A', 'Front end', [
      T('Lexical analysis', 'E'),
      T('Parsing: LL(1) and LR', 'H', 'cd-l1'),
      T('Syntax-directed translation', 'M'),
    ]),
    M('B', 'Back end', [
      T('Runtime environments', 'M'),
      T('Intermediate code generation', 'M'),
      T('Local optimisation', 'M'),
      T('Data-flow analysis: liveness and constant propagation', 'H'),
    ]),
  ]),
  S('os', 'Operating Systems', '8–10', 'Big and scoring. Scheduling, synchronisation and paging every year.', [
    M('A', 'Processes', [
      T('Processes, threads and system calls', 'E'),
      T('CPU scheduling', 'M'),
      T('Inter-process communication', 'M'),
    ]),
    M('B', 'Synchronisation', [
      T('Concurrency and synchronisation: semaphores', 'H'),
      T('Deadlock and Banker\'s algorithm', 'M', 'os-l1'),
    ]),
    M('C', 'Memory management', [
      T('Main memory management', 'M'),
      T('Paging and page tables', 'H', 'os-l2'),
      T('Virtual memory and page replacement', 'H'),
    ]),
    M('D', 'Storage', [
      T('File systems', 'M'),
      T('Disk scheduling', 'M'),
    ]),
  ]),
  S('dbms', 'Databases', '7–9', 'Normalisation and SQL are near-certain. Transactions follow.', [
    M('A', 'Data models', [
      T('ER model', 'E'),
      T('Relational model and relational algebra', 'M'),
      T('Tuple relational calculus', 'H'),
      T('SQL queries', 'M'),
    ]),
    M('B', 'Design', [
      T('Integrity constraints and normal forms', 'H', 'db-l1'),
    ]),
    M('C', 'Storage', [
      T('File organisation and indexing: B and B+ trees', 'H'),
    ]),
    M('D', 'Transactions', [
      T('Transactions and concurrency control', 'H', 'db-l2'),
    ]),
  ]),
  S('cn', 'Computer Networks', '6–9', 'Numericals on delays, windows and subnetting dominate.', [
    M('A', 'Foundations', [
      T('Layering: OSI and TCP/IP', 'E'),
      T('Switching: circuit, packet and message', 'E'),
    ]),
    M('B', 'Data link layer', [
      T('Framing, error detection and MAC', 'M'),
      T('Ethernet bridging and flow control', 'M', 'cn-l1'),
    ]),
    M('C', 'Network layer', [
      T('IPv4 addressing, CIDR and subnetting', 'H', 'cn-l2'),
      T('Routing: shortest path, flooding, distance vector, link state', 'H'),
      T('Fragmentation, ARP, DHCP and ICMP', 'M'),
    ]),
    M('D', 'Transport and application', [
      T('UDP, TCP and congestion control', 'H'),
      T('Sockets', 'M'),
      T('Application layer: DNS, SMTP, HTTP, FTP, email', 'E'),
    ]),
  ]),
];
