import { Subject } from '../../types';

export const computerScienceSubjects: Subject[] = [
  {
    id: 'cs-digital-logic',
    code: 'CS-DL',
    name: 'Digital Logic',
    pillar: 'CS',
    officialSection: 'Computer Science — Section 1',
    approxMarks: 5,
    description: 'Boolean algebra, minimization, combinational and sequential circuits, number representations, and computer arithmetic.',
    modules: [
      {
        id: 'cs-dl-a',
        subjectId: 'cs-digital-logic',
        azLetter: 'A',
        name: 'Number Representation & Arithmetic',
        description: 'Binary, octal, hex, unsigned/signed representations, 1\'s and 2\'s complements, fixed and floating point.',
        topics: [
          {
            id: 'dl-t1',
            moduleId: 'cs-dl-a',
            subjectId: 'cs-digital-logic',
            name: 'Number Systems & Complements',
            description: 'Signed magnitude, 1\'s complement, 2\'s complement, overflow conditions, and IEEE 754 floating point format.',
            difficulty: 'Foundation',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'dl-l1',
                topicId: 'dl-t1',
                moduleId: 'cs-dl-a',
                subjectId: 'cs-digital-logic',
                title: '2\'s Complement Arithmetic & Overflow Detection',
                durationMin: 45,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Fundamental to all hardware ALUs and a perennial 1-2 mark question in GATE.',
                  whatYouWillLearn: ['Range of n-bit signed integers', 'Sign extension rules', 'Hardware overflow detection formula (Cn ⊕ Cn-1)'],
                  prerequisites: ['Basic binary representation']
                },
                explanation: {
                  definition: '2\'s complement represents signed integers where the MSB has negative positional weight: -b_{n-1}*2^{n-1} + ∑ b_i*2^i.',
                  intuition: 'Negative zero is eliminated, giving 2\'s complement an extra negative number compared to signed magnitude.',
                  howItWorks: [
                    'Range for n-bit 2\'s complement: [-2^{n-1}, +2^{n-1} - 1].',
                    'Sign extension: Replicate the MSB to the left; numerical value remains invariant.',
                    'Overflow in 2\'s complement addition occurs iff: adding two positives yields a negative, OR adding two negatives yields a positive.',
                    'Hardware Overflow Flag: V = C_in ⊕ C_out into the MSB position.'
                  ],
                  keyTakeaway: 'Overflow CANNOT occur when adding two operands of opposite signs.'
                },
                conceptMap: {
                  title: '2\'s Complement Overflow Architecture',
                  nodes: [
                    { id: '1', label: 'Operand A (MSB)', sub: 'Sign bit A_{n-1}' },
                    { id: '2', label: 'Operand B (MSB)', sub: 'Sign bit B_{n-1}' },
                    { id: '3', label: 'Result (MSB)', sub: 'Sum bit S_{n-1}' },
                    { id: '4', label: 'Overflow Flag V', sub: 'C_n ⊕ C_{n-1}' }
                  ],
                  connections: [
                    { from: '1', to: '4', label: 'same sign test' },
                    { from: '2', to: '4', label: 'same sign test' },
                    { from: '3', to: '4', label: 'inverts' }
                  ],
                  asciiDiagram: '[Sign A] ──┐\n[Sign B] ──┼──> [Same Sign? Yes] ──> [Result Sign Inverted?] ──> [OVERFLOW V = 1]\n           └──> [Opposite Signs] ───────────────────────────────> [NEVER OVERFLOW V = 0]'
                },
                formulasAndRules: [
                  {
                    id: 'rule-overflow-xor',
                    name: 'Overflow Boolean Formula',
                    formula: 'V = C_{in_MSB} ⊕ C_{out_MSB}',
                    rule: 'Overflow occurs if and only if carry into MSB does not match carry out of MSB.',
                    subjectCode: 'CS-DL',
                    lessonId: 'dl-l1',
                    lessonTitle: '2\'s Complement Arithmetic & Overflow Detection'
                  },
                  {
                    id: 'rule-2comp-range',
                    name: '2\'s Complement Range',
                    formula: 'Range = [-2^{n-1}, 2^{n-1} - 1]',
                    rule: 'Asymmetric: exactly one more negative number than positive numbers.',
                    subjectCode: 'CS-DL',
                    lessonId: 'dl-l1',
                    lessonTitle: '2\'s Complement Arithmetic & Overflow Detection'
                  }
                ],
                examples: [
                  {
                    title: 'Detecting 4-bit Overflow',
                    problem: 'Add (+5) and (+4) in 4-bit 2\'s complement and check for overflow.',
                    solutionSteps: [
                      '+5 in 4-bit 2\'s complement = 0101.',
                      '+4 in 4-bit 2\'s complement = 0100.',
                      'Sum = 0101 + 0100 = 1001.',
                      'MSB of sum is 1 (representing a negative number: -7).',
                      'Carry into MSB = 1, Carry out of MSB = 0.',
                      'V = 1 ⊕ 0 = 1 (OVERFLOW occurred! +9 cannot fit in 4 bits [-8 to +7]).'
                    ],
                    keyInsight: 'Adding two positive numbers produced a negative number due to exceeding maximum positive capacity +7.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Thinking Carry Out (C_out) indicates overflow in signed numbers.',
                    whyItHappens: 'Confusing unsigned overflow with signed 2\'s complement overflow.',
                    correction: 'C_out indicates unsigned overflow. Signed overflow is strictly C_{in_MSB} ⊕ C_{out_MSB}.'
                  }
                ],
                masterCheckCriteria: [
                  'I can compute range and bit patterns for signed magnitude, 1\'s complement, and 2\'s complement',
                  'I can sign-extend any signed number to 8, 16, or 32 bits without error',
                  'I can evaluate overflow using the carry XOR rule: V = C_in ⊕ C_out',
                  'I know why adding opposite signed numbers can never generate an overflow',
                  'I can convert decimal fractional numbers to IEEE 754 single precision format',
                  'I understand biased exponent representation in IEEE 754'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'cs-dl-b',
        subjectId: 'cs-digital-logic',
        azLetter: 'B',
        name: 'Boolean Minimization & Circuits',
        description: 'Karnaugh maps, multiplexers, decoders, flip-flops, and counters.',
        topics: [
          {
            id: 'dl-t2',
            moduleId: 'cs-dl-b',
            subjectId: 'cs-digital-logic',
            name: 'Combinational & Sequential Logic',
            description: 'K-map prime implicants, MUX implementations, flip-flop conversions, and synchronous counter design.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'dl-l2',
                topicId: 'dl-t2',
                moduleId: 'cs-dl-b',
                subjectId: 'cs-digital-logic',
                title: 'K-Maps, Essential Prime Implicants & Multiplexers',
                durationMin: 50,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Essential Prime Implicants (EPIs) and MUX tree designs are among the highest scoring topics in GATE.',
                  whatYouWillLearn: ['Prime Implicants (PI) vs Essential Prime Implicants (EPI)', 'Don\'t care condition optimization', 'Implementing logic using 2^n : 1 MUX'],
                  prerequisites: ['Boolean algebra identities']
                },
                explanation: {
                  definition: 'K-map is a Gray-code ordered diagram to minimize Boolean SOP/POS equations.',
                  intuition: 'Adjacent cells differ by exactly 1 bit, allowing cancellation via x + x\' = 1.',
                  howItWorks: [
                    'Implicant: Any product term where function is 1.',
                    'Prime Implicant (PI): An implicant that cannot be merged into a larger group of size 2^k.',
                    'Essential Prime Implicant (EPI): A PI covering at least one minterm covered by NO other PI.',
                    'Multiplexer: An n-select line MUX implements any Boolean function of n+1 variables without extra gates.'
                  ],
                  keyTakeaway: 'Always circle EPIs first; they MUST appear in every minimal SOP expression.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-mux-capacity',
                    name: 'Shannon Expansion for MUX',
                    formula: 'f(w, x, y, z) = w\' * f(0, x, y, z) + w * f(1, x, y, z)',
                    rule: 'Decomposes any function across multiplexer data input pins.',
                    subjectCode: 'CS-DL',
                    lessonId: 'dl-l2',
                    lessonTitle: 'K-Maps, Essential Prime Implicants & Multiplexers'
                  }
                ],
                examples: [
                  {
                    title: 'Identifying Essential Prime Implicants',
                    problem: 'Given f(A,B,C) = ∑m(0, 1, 2, 5, 7), find all PIs and EPIs.',
                    solutionSteps: [
                      'Group (0, 1): A\'B\'. Group (0, 2): A\'C\'. Group (5, 7): AC.',
                      'Can (1, 5) group? minterms 1 (001) and 5 (101) differ in A: B\'C.',
                      'PIs: { A\'B\', A\'C\', AC, B\'C }.',
                      'Minterm 2 (010) is covered ONLY by A\'C\' ⇒ A\'C\' is an EPI.',
                      'Minterm 7 (111) is covered ONLY by AC ⇒ AC is an EPI.',
                      'Minterm 0 is covered by A\'B\' and A\'C\'. Minterm 1 is covered by A\'B\' and B\'C.',
                      'EPIs are strictly: { A\'C\', AC }.'
                    ],
                    keyInsight: 'An implicant is essential ONLY if at least one minterm in its group has no other coverage.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Forgetting that don\'t-care minterms (d) do NOT have to be covered by EPIs.',
                    whyItHappens: 'Treating don\'t-cares as mandatory 1s.',
                    correction: 'Don\'t cares can expand groups, but an EPI can never be justified solely by covering don\'t-cares.'
                  }
                ],
                masterCheckCriteria: [
                  'I can distinguish between Implicants, Prime Implicants, and Essential Prime Implicants',
                  'I can find minimal SOP and POS expressions with don\'t care conditions',
                  'I can implement any n-variable function using a 2^{n-1} to 1 MUX',
                  'I can design synchronous mod-N counters and find cycle sequences',
                  'I can derive characteristic and excitation equations for JK, SR, D, and T flip-flops',
                  'I can detect setup time and hold time violations in sequential paths'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cs-coa',
    code: 'CS-COA',
    name: 'Computer Organization & Architecture',
    pillar: 'CS',
    officialSection: 'Computer Science — Section 2',
    approxMarks: 7,
    description: 'Instruction sets, addressing modes, ALU, data path & control, memory hierarchy, cache mapping, I/O interfaces, and pipelining.',
    modules: [
      {
        id: 'cs-coa-a',
        subjectId: 'cs-coa',
        azLetter: 'A',
        name: 'Memory Hierarchy & Cache Memory',
        description: 'Locality of reference, cache organization, direct, associative, set-associative mapping, write policies, and performance.',
        topics: [
          {
            id: 'coa-t1',
            moduleId: 'cs-coa-a',
            subjectId: 'cs-coa',
            name: 'Cache Organization & Performance',
            description: 'Tag, Set, Word offset field calculations, hit ratio, AMAT, write-through vs write-back.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'coa-l1',
                topicId: 'coa-t1',
                moduleId: 'cs-coa-a',
                subjectId: 'cs-coa',
                title: 'Cache Address Mapping & AMAT Calculations',
                durationMin: 55,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Cache architecture is one of the highest weighted calculation subjects in GATE CS.',
                  whatYouWillLearn: ['Tag, Set Index, Word/Byte Offset bit decomposition', 'Average Memory Access Time (AMAT) with multi-level cache', 'Direct vs Fully Associative vs k-way Set Associative'],
                  prerequisites: ['Binary addressing powers of 2']
                },
                explanation: {
                  definition: 'Cache bridges the processor-memory speed gap by leveraging spatial and temporal locality.',
                  intuition: 'Main memory addresses are carved into three bit-fields: Offset (where in the block), Set Index (which shelf to check), and Tag (identity badge of the block).',
                  howItWorks: [
                    'Offset bits = log2(Block Size in Bytes).',
                    'Set Index bits = log2(Number of Sets). In k-way set associative: Number of Sets = Total Cache Lines / k.',
                    'Tag bits = Total Address Bits - (Set Index bits + Offset bits).',
                    'AMAT = Hit Time + (Miss Rate × Miss Penalty).'
                  ],
                  keyTakeaway: 'In direct mapped cache, k = 1. In fully associative cache, Number of Sets = 1 (Set bits = 0).'
                },
                conceptMap: {
                  title: 'Cache Address Bit Partitioning',
                  nodes: [
                    { id: '1', label: 'Main Memory Address', sub: 'e.g. 32 bits' },
                    { id: '2', label: 'TAG', sub: 'Address - (Set + Offset)' },
                    { id: '3', label: 'SET INDEX', sub: 'log2(Cache Lines / k)' },
                    { id: '4', label: 'WORD/BYTE OFFSET', sub: 'log2(Block Size)' }
                  ],
                  connections: [
                    { from: '1', to: '2', label: 'identifies block' },
                    { from: '1', to: '3', label: 'selects set' },
                    { from: '1', to: '4', label: 'selects byte' }
                  ],
                  asciiDiagram: '┌──────────────────┬─────────────────┬─────────────────┐\n│     TAG BITS     │  SET INDEX BITS │   OFFSET BITS   │\n│ (Identity Badge) │  (log2 #Sets)   │ (log2 BlockSz)  │\n└──────────────────┴─────────────────┴─────────────────┘'
                },
                formulasAndRules: [
                  {
                    id: 'rule-amat-1',
                    name: 'Average Memory Access Time (AMAT)',
                    formula: 'AMAT = H * T_c + (1 - H) * (T_c + T_m) = T_c + (1 - H) * T_m',
                    rule: 'Applies for hierarchical cache lookup where cache hit time is always paid.',
                    subjectCode: 'CS-COA',
                    lessonId: 'coa-l1',
                    lessonTitle: 'Cache Address Mapping & AMAT Calculations'
                  },
                  {
                    id: 'rule-cache-sets',
                    name: 'Number of Sets in k-way Set Associative',
                    formula: 'Sets = (Cache Size) / (k * Block Size)',
                    rule: 'Total sets determines the number of set-index bits needed.',
                    subjectCode: 'CS-COA',
                    lessonId: 'coa-l1',
                    lessonTitle: 'Cache Address Mapping & AMAT Calculations'
                  }
                ],
                examples: [
                  {
                    title: 'Finding Tag Bits for 4-way Set Associative Cache',
                    problem: 'Given 32-bit byte addressable memory, 64 KB cache, and 32-byte block size. For 4-way set associative, calculate Tag, Set, and Offset bits.',
                    solutionSteps: [
                      'Offset bits: Block size = 32 bytes = 2^5 bytes ⇒ Offset = 5 bits.',
                      'Total lines in cache: (64 KB) / (32 bytes) = (64 * 1024) / 32 = 2048 lines.',
                      'Number of sets: 2048 lines / 4 lines per set = 512 sets = 2^9 sets ⇒ Set bits = 9 bits.',
                      'Tag bits = 32 - (9 + 5) = 32 - 14 = 18 bits.',
                      'Field breakdown: Tag = 18 bits, Set = 9 bits, Offset = 5 bits.'
                    ],
                    keyInsight: 'Number of sets is always total cache lines divided by associativity k.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Dividing cache size by set size without converting KB to bytes.',
                    whyItHappens: 'Unit mismatch (KB vs Bytes).',
                    correction: 'Always convert Cache Size and Block Size to exact bytes (2^n) before division.'
                  }
                ],
                masterCheckCriteria: [
                  'I can compute Tag, Set, and Word offset bits for any direct, associative, or set-associative cache',
                  'I can compute AMAT for single-level and multi-level (L1, L2, Main Memory) setups',
                  'I understand write-through vs write-back and write-allocate vs no-write-allocate',
                  'I can track LRU replacement state transitions for a sequence of block addresses',
                  'I know how to calculate total cache overhead directory size including valid, dirty, and tag bits',
                  'I can calculate conflict, compulsory, and capacity misses'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'cs-coa-b',
        subjectId: 'cs-coa',
        azLetter: 'B',
        name: 'Instruction Pipelining & Hazards',
        description: 'Pipeline stages, throughput, speedup, structural, data (RAW, WAR, WAW), and control hazards.',
        topics: [
          {
            id: 'coa-t2',
            moduleId: 'cs-coa-b',
            subjectId: 'cs-coa',
            name: 'Pipelining, Hazards & Speedup',
            description: 'Ideal speedup, clock cycle time, pipeline stalls, operand forwarding, and branch penalties.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'coa-l2',
                topicId: 'coa-t2',
                moduleId: 'cs-coa-b',
                subjectId: 'cs-coa',
                title: 'Pipeline Stages, Hazards & Operand Forwarding',
                durationMin: 55,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Instruction pipelining problems appear almost every year and carry substantial weight.',
                  whatYouWillLearn: ['Clock period determination with buffer delays', 'RAW data hazard detection & forwarding', 'Speedup calculation with stalls'],
                  prerequisites: ['Instruction cycle phases (IF, ID, EX, MEM, WB)']
                },
                explanation: {
                  definition: 'Pipelining executes multiple instructions concurrently in overlapping stages.',
                  intuition: 'Like an industrial assembly line: individual latency per instruction remains high, but overall throughput reaches 1 instruction per cycle ideally.',
                  howItWorks: [
                    'Pipeline Cycle Time = max(Stage Delays) + Register/Buffer Overhead.',
                    'Total time for n instructions on k-stage pipeline with no stalls: T = (k + n - 1) * t_p.',
                    'Data Hazards: RAW (Read After Write - True dependency), WAR (Anti-dependency), WAW (Output dependency).',
                    'Operand Forwarding delivers ALU results directly to the next instruction\'s EX stage without waiting for MEM/WB.'
                  ],
                  keyTakeaway: 'Pipeline cycle time is strictly governed by the SLOWEST stage delay plus buffer latency.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-pipe-speedup',
                    name: 'Pipeline Speedup Formula',
                    formula: 'Speedup = (n * t_non_pipeline) / [ (k + n - 1 + Stalls) * t_pipeline ]',
                    rule: 'As n → ∞ under zero stalls, ideal Speedup approaches k * (t_non_pipe / ∑ stages).',
                    subjectCode: 'CS-COA',
                    lessonId: 'coa-l2',
                    lessonTitle: 'Pipeline Stages, Hazards & Operand Forwarding'
                  }
                ],
                examples: [
                  {
                    title: 'Speedup with Stage Delays and Buffer Overhead',
                    problem: 'A 5-stage pipeline has stage delays: 150ps, 120ps, 180ps, 160ps, 140ps with 20ps buffer overhead. What is the clock period and speedup for 1000 instructions compared to non-pipelined execution?',
                    solutionSteps: [
                      'Max stage delay = 180ps.',
                      'Pipeline clock period t_p = 180ps + 20ps = 200ps.',
                      'Non-pipelined cycle time = 150 + 120 + 180 + 160 + 140 = 750ps.',
                      'Non-pipelined time for 1000 instrs: 1000 * 750 = 750,000ps.',
                      'Pipelined time: (5 + 1000 - 1) * 200 = 1004 * 200 = 200,800ps.',
                      'Speedup = 750,000 / 200,800 ≈ 3.735.'
                    ],
                    keyInsight: 'Always add the buffer delay to the maximum stage delay to find the pipeline clock period.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Adding buffer delay to every stage when calculating non-pipelined time.',
                    whyItHappens: 'Forgetting that pipeline registers/buffers exist ONLY in pipelined processors.',
                    correction: 'Non-pipelined execution does not incur inter-stage pipeline register overhead.'
                  }
                ],
                masterCheckCriteria: [
                  'I can determine clock frequency from stage delay breakdown and register overhead',
                  'I can identify Read-After-Write (RAW) data dependencies in instruction sequences',
                  'I can calculate stall cycles with and without operand forwarding',
                  'I understand branch penalties and branch prediction techniques',
                  'I can distinguish between structural, data, and control hazards',
                  'I can compute CPI (Cycles Per Instruction) for instruction mixes with branch stalls'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cs-pds',
    code: 'CS-PDS',
    name: 'Programming & Data Structures',
    pillar: 'CS',
    officialSection: 'Computer Science — Section 3',
    approxMarks: 10,
    description: 'C programming, pointers, recursion, arrays, stacks, queues, linked lists, binary trees, BSTs, heaps, and graphs.',
    modules: [
      {
        id: 'cs-pds-a',
        subjectId: 'cs-pds',
        azLetter: 'A',
        name: 'C Programming & Pointers',
        description: 'Variables, data types, operators, pointer arithmetic, dynamic memory, arrays of pointers, and function pointers.',
        topics: [
          {
            id: 'pds-t1',
            moduleId: 'cs-pds-a',
            subjectId: 'cs-pds',
            name: 'Pointers & Memory Layout',
            description: 'Pointer arithmetic, double pointers, array decaying, string pointers, and memory layout (stack, heap, text, data).',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'pds-l1',
                topicId: 'pds-t1',
                moduleId: 'cs-pds-a',
                subjectId: 'cs-pds',
                title: 'Pointer Arithmetic, Array Decaying & Precedence',
                durationMin: 50,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'C pointer questions are famous for subtle operator precedence traps in GATE.',
                  whatYouWillLearn: ['Pointer increment semantics (*p++, (*p)++, *++p)', 'Multi-dimensional arrays and pointer type decays', 'Stack activation record variables'],
                  prerequisites: ['Basic C syntax']
                },
                explanation: {
                  definition: 'A pointer holds the memory address of another variable. Pointer arithmetic scales by sizeof(type).',
                  intuition: 'p + 1 does not add 1 byte; it steps forward by sizeof(*p) bytes into the next object slot.',
                  howItWorks: [
                    '*p++ evaluates as: dereference current p, then increment pointer p (due to postfix precedence).',
                    '(*p)++ increments the value pointed to by p after dereferencing.',
                    '*(++p) increments the pointer first, then dereferences the new location.',
                    'For an array int a[3][4], `a` decays to a pointer to an array of 4 ints: `int (*)[4]`.'
                  ],
                  keyTakeaway: 'Postfix `++` has higher precedence than unary `*`, but yields the un-incremented operand value during expression evaluation.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-ptr-prec',
                    name: 'Pointer Unary Precedence',
                    formula: 'Postfix (p++) > Prefix (++p) == Dereference (*p) [Right-to-Left]',
                    rule: '*p++ binds as *(p++): accesses *p, then increments pointer p.',
                    subjectCode: 'CS-PDS',
                    lessonId: 'pds-l1',
                    lessonTitle: 'Pointer Arithmetic, Array Decaying & Precedence'
                  }
                ],
                examples: [
                  {
                    title: 'Tracing Pointer Modifications',
                    problem: 'What is the output? int a[] = {10, 20, 30}; int *p = a; printf("%d, %d", *p++, *p);',
                    solutionSteps: [
                      'In printf arguments, order of evaluation is unspecified by C standard, but within sequence points:',
                      '*p++ evaluates: yields *p which is 10, then increments p to point to a[1].',
                      'At a[1], the value is 20.',
                      'Output will display 10 and 20.'
                    ],
                    keyInsight: 'Differentiate the value returned by the expression from the side-effect that takes place on the pointer variable.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Confusing int *arr[10] with int (*arr)[10].',
                    whyItHappens: 'Bracket precedence ambiguity.',
                    correction: 'int *arr[10] is an array of 10 pointers to int. int (*arr)[10] is a pointer to an array of 10 ints.'
                  }
                ],
                masterCheckCriteria: [
                  'I can evaluate *p++, (*p)++, and *++p expressions without getting tricked by precedence',
                  'I can compute memory addresses in row-major and column-major 2D/3D arrays',
                  'I know how 2D arrays decay into pointers upon passing to functions',
                  'I understand static, automatic, and dynamic storage lifetimes',
                  'I can trace deep recursive functions with static variables',
                  'I know undefined behaviors in C (e.g., modifying a variable twice between sequence points i = i++)'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'cs-pds-b',
        subjectId: 'cs-pds',
        azLetter: 'B',
        name: 'Trees, BSTs & Heaps',
        description: 'Binary tree properties, traversals, binary search tree search/insert/delete, and heapify operations.',
        topics: [
          {
            id: 'pds-t2',
            moduleId: 'cs-pds-b',
            subjectId: 'cs-pds',
            name: 'Binary Trees, BST & Priority Queues',
            description: 'Tree traversals, reconstruction from inorder + preorder, BST predecessor/successor, and min/max heap build time.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'pds-l2',
                topicId: 'pds-t2',
                moduleId: 'cs-pds-b',
                subjectId: 'cs-pds',
                title: 'Binary Tree Traversals, BST & Heap Construction',
                durationMin: 55,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Trees and heaps represent the highest concentration of marks in data structures.',
                  whatYouWillLearn: ['Unique tree reconstruction conditions', 'BST node deletion cases (2 children)', 'Linear time Build-Heap O(n) proof'],
                  prerequisites: ['Pointers and recursion']
                },
                explanation: {
                  definition: 'Hierarchical node data structures with at most 2 children per node.',
                  intuition: 'Inorder traversal of a valid BST ALWAYS produces a strictly ascending sorted sequence.',
                  howItWorks: [
                    'Unique binary tree reconstruction REQUIRES the Inorder traversal plus one other (Preorder or Postorder).',
                    'Preorder + Postorder does NOT uniquely reconstruct a general binary tree (unless it is strictly full/proper).',
                    'BST Deletion with 2 children replaces the deleted key with its Inorder Predecessor (max of left subtree) or Inorder Successor (min of right subtree).',
                    'Building a binary heap takes O(n) time, NOT O(n log n), because sum of (height / 2^height) converges.'
                  ],
                  keyTakeaway: 'Building an n-element heap using bottom-up heapify is strictly O(n); inserting n elements sequentially is O(n log n).'
                },
                formulasAndRules: [
                  {
                    id: 'rule-tree-leaves',
                    name: 'Binary Tree Leaves vs Degree-2 Nodes',
                    formula: 'n_0 = n_2 + 1',
                    rule: 'In any non-empty binary tree, the number of leaf nodes (degree 0) is always exactly 1 greater than degree 2 nodes.',
                    subjectCode: 'CS-PDS',
                    lessonId: 'pds-l2',
                    lessonTitle: 'Binary Tree Traversals, BST & Heap Construction'
                  },
                  {
                    id: 'rule-heap-build',
                    name: 'Build-Heap Time Complexity',
                    formula: 'T(n) = ∑_{h=0}^{⌊log n⌋} ⌈n / 2^{h+1}⌉ * O(h) = O(n)',
                    rule: 'Bottom-up heapify runs in linear time.',
                    subjectCode: 'CS-PDS',
                    lessonId: 'pds-l2',
                    lessonTitle: 'Binary Tree Traversals, BST & Heap Construction'
                  }
                ],
                examples: [
                  {
                    title: 'Reconstructing Binary Tree from Traversals',
                    problem: 'Inorder: D, B, E, A, F, C. Preorder: A, B, D, E, C, F. Find the postorder traversal.',
                    solutionSteps: [
                      'Preorder first element is root: A.',
                      'In Inorder, D, B, E are to the left of A; F, C are to the right of A.',
                      'Left subtree preorder: B, D, E. Root of left subtree is B.',
                      'In Inorder, D is left of B, E is right of B.',
                      'Right subtree preorder: C, F. Root is C. In Inorder, F is left of C.',
                      'Postorder (Left, Right, Root): D, E, B, F, C, A.'
                    ],
                    keyInsight: 'Preorder tells you the root; Inorder partitions the left and right subtrees.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Thinking Preorder and Postorder uniquely identify a binary tree.',
                    whyItHappens: 'Assuming two traversals are always sufficient.',
                    correction: 'Without Inorder, you cannot determine if a single child is a left child or a right child.'
                  }
                ],
                masterCheckCriteria: [
                  'I can reconstruct a tree from Inorder and Preorder/Postorder traversals',
                  'I know the proof of n_0 = n_2 + 1 for any binary tree',
                  'I can delete a BST node with two children and maintain BST invariants',
                  'I understand why bottom-up Build-Heap is O(n) while sequential insertion is O(n log n)',
                  'I can compute height, diameter, and node balance factors',
                  'I can implement BFS and DFS queue/stack states'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cs-algorithms',
    code: 'CS-ALGO',
    name: 'Algorithms',
    pillar: 'CS',
    officialSection: 'Computer Science — Section 4',
    approxMarks: 8,
    description: 'Asymptotic analysis, divide & conquer, greedy, dynamic programming, and graph algorithms (MST, shortest paths).',
    modules: [
      {
        id: 'cs-algo-a',
        subjectId: 'cs-algorithms',
        azLetter: 'A',
        name: 'Asymptotic Complexity & Divide and Conquer',
        description: 'Big-O, Omega, Theta definitions, Master theorem, Akra-Bazzi, and recurrence relations.',
        topics: [
          {
            id: 'algo-t1',
            moduleId: 'cs-algo-a',
            subjectId: 'cs-algorithms',
            name: 'Complexity & Recurrences',
            description: 'Asymptotic growth ordering, recurrence trees, Master theorem cases, and extended divide & conquer.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'algo-l1',
                topicId: 'algo-t1',
                moduleId: 'cs-algo-a',
                subjectId: 'cs-algorithms',
                title: 'Master Theorem, Recurrences & Asymptotic Bounds',
                durationMin: 45,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Guaranteed 2-3 marks in every GATE paper; foundation for analyzing all algorithms.',
                  whatYouWillLearn: ['Master theorem 3 cases and pitfalls', 'Extended Master theorem for log factors', 'Ranking function growth rates'],
                  prerequisites: ['Logarithm rules and limits']
                },
                explanation: {
                  definition: 'Solves recurrences of form T(n) = a T(n/b) + f(n) by comparing n^{log_b a} with f(n).',
                  intuition: 'A battle between work done at leaves (n^{log_b a}) vs work done at root/merging (f(n)).',
                  howItWorks: [
                    'Case 1: If f(n) = O(n^{log_b a - ε}), leaves dominate ⇒ T(n) = Θ(n^{log_b a}).',
                    'Case 2: If f(n) = Θ(n^{log_b a} * log^k n), balanced ⇒ T(n) = Θ(n^{log_b a} * log^{k+1} n).',
                    'Case 3: If f(n) = Ω(n^{log_b a + ε}) and regularity condition holds, root dominates ⇒ T(n) = Θ(f(n)).'
                  ],
                  keyTakeaway: 'The polynomial gap ε > 0 is mandatory for Cases 1 and 3. You cannot apply Master theorem if gap is only logarithmic unless using the extended Case 2.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-master-thm',
                    name: 'Master Theorem Formula',
                    formula: 'T(n) = a T(n/b) + Θ(n^k * log^p n) ⇒ compare log_b(a) with k',
                    rule: 'If log_b(a) > k: Θ(n^{log_b a}). If log_b(a) == k: Θ(n^k * log^{p+1} n).',
                    subjectCode: 'CS-ALGO',
                    lessonId: 'algo-l1',
                    lessonTitle: 'Master Theorem, Recurrences & Asymptotic Bounds'
                  }
                ],
                examples: [
                  {
                    title: 'Solving Tricky Recurrence',
                    problem: 'Solve T(n) = 2 T(n/2) + n / log n.',
                    solutionSteps: [
                      'Here a = 2, b = 2 ⇒ n^{log_b a} = n^1 = n.',
                      'f(n) = n / log n = n * (log n)^{-1}.',
                      'Notice that f(n) is asymptotically smaller than n, BUT the difference is NOT polynomial: n / (n / log n) = log n (not n^ε).',
                      'Standard Master Theorem Case 1 FAILS due to lack of polynomial gap.',
                      'Using substitution / recursion tree: T(n) = n * ∑ (1 / (log(n/2^i))) ⇒ Θ(n log log n).'
                    ],
                    keyInsight: 'Never force Master Theorem when the gap is purely logarithmic.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Applying Master Theorem when `a` is not constant (e.g. T(n) = 2^n T(n/2) + n).',
                    whyItHappens: 'Ignoring prerequisites.',
                    correction: 'Master theorem strictly requires `a ≥ 1` and `b > 1` to be CONSTANTS.'
                  }
                ],
                masterCheckCriteria: [
                  'I can state all 3 cases of the Master Theorem including the polynomial gap conditions',
                  'I know the extended Master theorem for polylogarithmic factors',
                  'I can rank growth rates of 2^n, n!, n^n, n^{log n}, (log n)^n',
                  'I can solve non-homogeneous recurrences using recursion tree methods',
                  'I understand little-o vs big-O and little-omega vs big-omega',
                  'I can analyze worst-case, best-case, and average-case complexities'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'cs-algo-b',
        subjectId: 'cs-algorithms',
        azLetter: 'B',
        name: 'Graph Algorithms & Dynamic Programming',
        description: 'Dijkstra, Bellman-Ford, Floyd-Warshall, Prim, Kruskal, and DP state transitions.',
        topics: [
          {
            id: 'algo-t2',
            moduleId: 'cs-algo-b',
            subjectId: 'cs-algorithms',
            name: 'Shortest Paths & Spanning Trees',
            description: 'Dijkstra with min-heaps, negative edge weights, Bellman-Ford, Prim vs Kruskal, and cut/cycle properties.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'algo-l2',
                topicId: 'algo-t2',
                moduleId: 'cs-algo-b',
                subjectId: 'cs-algorithms',
                title: 'Dijkstra, Bellman-Ford & MST Properties',
                durationMin: 55,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Graph algorithms are tested rigorously with edge cases on negative cycles and MST uniqueness.',
                  whatYouWillLearn: ['Dijkstra failure with negative weights', 'Bellman-Ford negative cycle detection', 'Cut property and Cycle property of MSTs'],
                  prerequisites: ['Adjacency list representations and priority queues']
                },
                explanation: {
                  definition: 'Algorithms finding minimum-weight structures spanning or routing across weighted graphs.',
                  intuition: 'Dijkstra assumes paths grow monotonically longer; negative edges violate this greedy invariant.',
                  howItWorks: [
                    'Dijkstra: O((V + E) log V) with binary min-heap. Fails if negative edge weights exist.',
                    'Bellman-Ford: O(V * E). Relaxes all edges V - 1 times. If a further relaxation reduces distance on the V-th pass, a negative cycle exists.',
                    'Cut Property: The minimum-weight edge crossing any cut (S, V-S) belongs to SOME MST. If all edge weights are unique, the MST is UNIQUE.'
                  ],
                  keyTakeaway: 'Adding a positive constant c to all edge weights DOES NOT change the MST, but it CAN change shortest paths.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-mst-add-const',
                    name: 'Adding Constant to Edges Rule',
                    formula: 'w\'(e) = w(e) + c ⇒ MST is INVARIANT, Shortest Path CAN CHANGE',
                    rule: 'Shortest paths penalize paths with more edges when a positive constant is added.',
                    subjectCode: 'CS-ALGO',
                    lessonId: 'algo-l2',
                    lessonTitle: 'Dijkstra, Bellman-Ford & MST Properties'
                  }
                ],
                examples: [
                  {
                    title: 'Shortest Path Invariance Fallacy',
                    problem: 'If we add 10 to every edge in graph G, does Dijkstra’s shortest path between s and t remain identical?',
                    solutionSteps: [
                      'Suppose Path 1 has 1 edge of weight 15. Path 2 has 2 edges of weight 7 + 7 = 14.',
                      'Originally Path 2 is shorter (14 < 15).',
                      'Add 10 to each edge: Path 1 becomes 15 + 10 = 25.',
                      'Path 2 becomes (7 + 10) + (7 + 10) = 34.',
                      'Now Path 1 is shorter! (25 < 34). The shortest path changed!',
                      'Answer: No, shortest paths do NOT stay invariant when adding constants.'
                    ],
                    keyInsight: 'Adding a constant adds k*c to a path containing k edges, penalizing paths with more hops.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Running Dijkstra by adding a constant to eliminate negative edges.',
                    whyItHappens: 'Believing adding a constant preserves shortest path order.',
                    correction: 'Adding constants distorts path lengths by number of edges. Use Johnson\'s algorithm (reweighting via potentials) instead.'
                  }
                ],
                masterCheckCriteria: [
                  'I understand why Dijkstra fails on graphs with negative edge weights',
                  'I know how Bellman-Ford detects negative weight cycles in V passes',
                  'I can apply the Cut Property and Cycle Property to prove MST inclusions',
                  'I understand why MST is unique when all edge weights are distinct',
                  'I can formulate DP states and recurrence transitions (0/1 Knapsack, LCS, Matrix Chain)',
                  'I know the time and space complexity of Floyd-Warshall (O(V^3) and O(V^2))'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cs-toc',
    code: 'CS-TOC',
    name: 'Theory of Computation',
    pillar: 'CS',
    officialSection: 'Computer Science — Section 5',
    approxMarks: 8,
    description: 'Regular languages, finite automata (DFA, NFA), pumping lemma, context-free languages, pushdown automata, Turing machines, and undecidability.',
    modules: [
      {
        id: 'cs-toc-a',
        subjectId: 'cs-toc',
        azLetter: 'A',
        name: 'Regular Languages & Finite Automata',
        description: 'DFA minimization, NFA to DFA powerset construction, regular expressions, closure properties, and pumping lemma.',
        topics: [
          {
            id: 'toc-t1',
            moduleId: 'cs-toc-a',
            subjectId: 'cs-toc',
            name: 'Finite Automata & Regular Properties',
            description: 'Myhill-Nerode theorem, table-filling minimization, closure properties, and regularity proofs.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'toc-l1',
                topicId: 'toc-t1',
                moduleId: 'cs-toc-a',
                subjectId: 'cs-toc',
                title: 'DFA Minimization & Regular Language Closures',
                durationMin: 55,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'DFA state counting and regular language closure questions are consistent scoring opportunities.',
                  whatYouWillLearn: ['Table-filling equivalence partitioning', 'Trap/dead state significance in DFA vs NFA', 'Closure properties of Regular Languages'],
                  prerequisites: ['Set relations and strings']
                },
                explanation: {
                  definition: 'Regular languages are those recognized by deterministic finite automata (DFA).',
                  intuition: 'A finite automaton has finite memory (fixed states); it CANNOT count unbounded values or match arbitrary balances.',
                  howItWorks: [
                    'DFA minimization produces the UNIQUE minimal state machine for any regular language.',
                    'Regular languages are closed under: Union, Intersection, Complement, Concatenation, Kleene Star, Reversal, Homomorphism.',
                    'Languages requiring infinite counting (like a^n b^n) are NOT regular.'
                  ],
                  keyTakeaway: 'If recognizing a language requires counting an arbitrary number of items without an upper bound, it is NOT regular.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-reg-closure',
                    name: 'Regular Language Closure Rule',
                    formula: 'Regular closed under: ∪, ∩, ¬, ·, *, Reversal, Difference',
                    rule: 'Regular languages form a Boolean algebra closed under all standard set operations.',
                    subjectCode: 'CS-TOC',
                    lessonId: 'toc-l1',
                    lessonTitle: 'DFA Minimization & Regular Language Closures'
                  }
                ],
                examples: [
                  {
                    title: 'Testing Regularity',
                    problem: 'Is L = { w w^R | w ∈ {0, 1}* } regular?',
                    solutionSteps: [
                      'w^R is the reverse of string w (palindromes of even length).',
                      'To verify w w^R, an automaton must remember the exact sequence of characters in w in reverse order.',
                      'Because w can be arbitrarily long, an unbounded number of states is needed.',
                      'By Pumping Lemma, choosing s = 0^p 1 1 0^p shows pumping y = 0^k breaks the palindrome.',
                      'Therefore, L is NOT regular (it is deterministic context-free).'
                    ],
                    keyInsight: 'Checking palindromes requires LIFO memory (a stack), which a finite state machine lacks.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Believing subset of a regular language must be regular.',
                    whyItHappens: 'Assuming closure under subsets.',
                    correction: 'Regular languages are NOT closed under subsets! {a^n b^n} is a subset of regular language a*b*, but is NOT regular.'
                  }
                ],
                masterCheckCriteria: [
                  'I can minimize any DFA using the table-filling / partition equivalence method',
                  'I know the exact closure table for Regular, CFL, DCFL, CSL, Recursive, and RE languages',
                  'I can apply the Pumping Lemma to prove non-regularity with a clean contradiction',
                  'I can convert non-deterministic finite automata to minimal DFAs',
                  'I understand the difference between dead states in DFA vs NFA',
                  'I can write clean regular expressions for complex string constraints'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'cs-toc-b',
        subjectId: 'cs-toc',
        azLetter: 'B',
        name: 'Turing Machines & Undecidability',
        description: 'Turing machine model, halting problem, Rice\'s theorem, and reductions.',
        topics: [
          {
            id: 'toc-t2',
            moduleId: 'cs-toc-b',
            subjectId: 'cs-toc',
            name: 'Decidability & Rice\'s Theorem',
            description: 'Halting problem, Post Correspondence Problem (PCP), non-trivial language properties, and reduction techniques.',
            difficulty: 'Advanced',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'toc-l2',
                topicId: 'toc-t2',
                moduleId: 'cs-toc-b',
                subjectId: 'cs-toc',
                title: 'Undecidability, Reductions & Rice\'s Theorem',
                durationMin: 50,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Decidability questions are pure reasoning and appear in 100% of GATE exams.',
                  whatYouWillLearn: ['Rice\'s Theorem for semantic language properties', 'Halting problem diagonalization proof', 'Decidable vs Turing-Recognizable vs Non-RE'],
                  prerequisites: ['Turing machines and formal languages']
                },
                explanation: {
                  definition: 'A language is decidable if a Turing machine halts and decides membership for all inputs. Undecidable languages have no such halting decider.',
                  intuition: 'You cannot write a generic program that inspects another program and predicts its behavior without running it to completion.',
                  howItWorks: [
                    'Rice\'s Theorem: Any non-trivial semantic property of the language recognized by a Turing machine is UNDECIDABLE.',
                    'Semantic property: Depends on the language L(M), NOT on the syntactic structure or code of M.',
                    'Non-trivial: True for some TMs, False for some TMs.'
                  ],
                  keyTakeaway: 'If the question asks whether L(M) has ANY language property (is it empty? finite? regular? contains "00"?), Rice\'s Theorem guarantees it is UNDECIDABLE.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-rices-thm',
                    name: 'Rice’s Theorem',
                    formula: 'P is a non-trivial property of RE languages ⇒ { <M> | L(M) has property P } is UNDECIDABLE',
                    rule: 'Applies strictly to properties of L(M), never to structural properties of the machine itself (e.g., has 5 states).',
                    subjectCode: 'CS-TOC',
                    lessonId: 'toc-l2',
                    lessonTitle: 'Undecidability, Reductions & Rice\'s Theorem'
                  }
                ],
                examples: [
                  {
                    title: 'Applying Rice’s Theorem',
                    problem: 'Is the problem "Does a given Turing machine M accept a regular language?" decidable?',
                    solutionSteps: [
                      'Property P: "L(M) is regular".',
                      'Is P a property of the language L(M)? Yes, regularity is a language property.',
                      'Is P non-trivial? Yes: some TMs accept regular languages (e.g. L(M) = Σ*), while some accept non-regular languages (e.g. L(M) = {a^n b^n}).',
                      'By Rice\'s Theorem, the problem is UNDECIDABLE.'
                    ],
                    keyInsight: 'Check two questions: Is it about L(M)? Is it true for some and false for others? If yes to both, it is undecidable.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Applying Rice’s Theorem to syntactic properties: "Does M have more than 10 states?"',
                    whyItHappens: 'Forgetting that Rice\'s theorem applies only to SEMANTIC properties of the accepted language.',
                    correction: 'Counting states in M is a syntactic check on machine description, which is completely DECIDABLE.'
                  }
                ],
                masterCheckCriteria: [
                  'I know how to apply Rice\'s theorem to identify undecidable problems in under 30 seconds',
                  'I can identify syntactic properties (decidable) versus semantic language properties (undecidable)',
                  'I understand the reduction technique: if A ≤_m B and A is undecidable, then B is undecidable',
                  'I know that emptiness and equivalence are undecidable for CFLs, but decidable for Regular languages',
                  'I understand the Post Correspondence Problem (PCP) and its undecidability',
                  'I can classify languages into Recursive (Decidable), RE (Turing recognizable), and Non-RE'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cs-compiler',
    code: 'CS-COMPILER',
    name: 'Compiler Design',
    pillar: 'CS',
    officialSection: 'Computer Science — Section 6',
    approxMarks: 5,
    description: 'Lexical analysis, parsing (LL, LR, LALR), syntax-directed translation, runtime storage organization, intermediate code, and code optimization.',
    modules: [
      {
        id: 'cs-compiler-a',
        subjectId: 'cs-compiler',
        azLetter: 'A',
        name: 'Parsing & Grammars',
        description: 'FIRST and FOLLOW sets, LL(1) parse tables, LR(0), SLR(1), CLR(1), LALR(1) item sets, and conflict resolution.',
        topics: [
          {
            id: 'cd-t1',
            moduleId: 'cs-compiler-a',
            subjectId: 'cs-compiler',
            name: 'Top-Down & Bottom-Up Parsers',
            description: 'FIRST/FOLLOW computation, LL(1) condition, Shift-Reduce and Reduce-Reduce conflicts in LR parsers.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'cd-l1',
                topicId: 'cd-t1',
                moduleId: 'cs-compiler-a',
                subjectId: 'cs-compiler',
                title: 'LL(1) & LR Parsing: FIRST, FOLLOW & Conflict Resolution',
                durationMin: 55,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Parsing is the central core of Compiler Design in GATE, typically contributing 3-4 marks.',
                  whatYouWillLearn: ['FIRST and FOLLOW computation algorithms', 'LL(1) table conflicts', 'LR parser power hierarchy: LR(0) < SLR(1) < LALR(1) < CLR(1)'],
                  prerequisites: ['Context-free grammars and derivations']
                },
                explanation: {
                  definition: 'Parsers construct syntax trees from tokens according to grammar production rules.',
                  intuition: 'LL(1) is top-down predictive; LR(k) is bottom-up shift-reduce by finding handles.',
                  howItWorks: [
                    'A grammar is LL(1) iff for every non-terminal with multiple productions A → α | β:',
                    '1. FIRST(α) ∩ FIRST(β) = ∅.',
                    '2. If α ⇒* ε, then FIRST(β) ∩ FOLLOW(A) = ∅.',
                    'Parser power: LR(0) ⊂ SLR(1) ⊂ LALR(1) ⊂ CLR(1).',
                    'LALR(1) has the same number of states as SLR(1) and LR(0), but never introduces shift-reduce conflicts when merging CLR(1) states.'
                  ],
                  keyTakeaway: 'Merging CLR(1) states with identical cores to form LALR(1) can introduce Reduce-Reduce conflicts, but NEVER Shift-Reduce conflicts.'
                },
                conceptMap: {
                  title: 'Parser Class Hierarchy',
                  nodes: [
                    { id: '1', label: 'CLR(1)', sub: 'Most powerful LR parser; large state count' },
                    { id: '2', label: 'LALR(1)', sub: 'Merged states; compact table' },
                    { id: '3', label: 'SLR(1)', sub: 'Uses FOLLOW(A) for reductions' },
                    { id: '4', label: 'LR(0)', sub: 'Reduces in all lookaheads' }
                  ],
                  connections: [
                    { from: '4', to: '3', label: 'strictly less powerful' },
                    { from: '3', to: '2', label: 'strictly less powerful' },
                    { from: '2', to: '1', label: 'strictly less powerful' }
                  ],
                  asciiDiagram: 'LR(0) ─────> SLR(1) ─────> LALR(1) ─────> CLR(1)\n(Weakest)                               (Most Powerful)\n\nState Count:\n|States(LR0)| = |States(SLR1)| = |States(LALR1)| << |States(CLR1)|'
                },
                formulasAndRules: [
                  {
                    id: 'rule-ll1-cond',
                    name: 'LL(1) Necessary & Sufficient Condition',
                    formula: 'FIRST(α) ∩ FIRST(β) = ∅  AND  (if ε ∈ FIRST(α) ⇒ FIRST(β) ∩ FOLLOW(A) = ∅)',
                    rule: 'Ensures no cell in the LL(1) parsing table contains multiple entries.',
                    subjectCode: 'CS-COMPILER',
                    lessonId: 'cd-l1',
                    lessonTitle: 'LL(1) & LR Parsing: FIRST, FOLLOW & Conflict Resolution'
                  }
                ],
                examples: [
                  {
                    title: 'Testing LL(1) Compatibility',
                    problem: 'Is S → a S b | ε an LL(1) grammar?',
                    solutionSteps: [
                      'Here S has two productions: α = a S b, and β = ε.',
                      'FIRST(α) = {a}. FIRST(β) = {ε}.',
                      'FOLLOW(S): S is start symbol ⇒ $ ∈ FOLLOW(S). In S → a S b, b follows S ⇒ b ∈ FOLLOW(S).',
                      'FOLLOW(S) = {$, b}.',
                      'Check condition: Since β = ε, we must test FIRST(α) ∩ FOLLOW(S) = {a} ∩ {$, b} = ∅.',
                      'Intersection is empty! Therefore, S → a S b | ε IS an LL(1) grammar.'
                    ],
                    keyInsight: 'Always compute the full FOLLOW set of the left-hand non-terminal when ε is in FIRST.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Assuming left recursion can be parsed by an LL(1) parser.',
                    whyItHappens: 'Forgetting top-down infinite loop.',
                    correction: 'Any grammar with left recursion is NEVER LL(1). Eliminate left recursion first.'
                  }
                ],
                masterCheckCriteria: [
                  'I can compute FIRST and FOLLOW sets for any non-terminal systematically',
                  'I know why left-recursive and ambiguous grammars can NEVER be LL(1)',
                  'I understand why merging states in LALR(1) cannot create Shift-Reduce conflicts',
                  'I can construct LR(0) and SLR(1) canonical item sets with lookaheads',
                  'I can differentiate inherited from synthesized attributes in SDTs',
                  'I understand DAG representations and basic block local optimizations'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cs-os',
    code: 'CS-OS',
    name: 'Operating Systems',
    pillar: 'CS',
    officialSection: 'Computer Science — Section 7',
    approxMarks: 9,
    description: 'Processes, threads, CPU scheduling, synchronization, deadlocks, memory management, virtual memory, and file systems.',
    modules: [
      {
        id: 'cs-os-a',
        subjectId: 'cs-os',
        azLetter: 'A',
        name: 'Deadlocks',
        description: 'Necessary conditions, Resource Allocation Graphs (RAG), prevention, avoidance, Banker\'s algorithm, detection, and recovery.',
        topics: [
          {
            id: 'os-t1',
            moduleId: 'cs-os-a',
            subjectId: 'cs-os',
            name: 'Deadlock Characterization & Handling',
            description: 'The 4 Coffman conditions, RAG cycle detection, prevention strategies, Banker\'s safety algorithm, and recovery mechanisms.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'os-l1',
                topicId: 'os-t1',
                moduleId: 'cs-os-a',
                subjectId: 'cs-os',
                title: 'Deadlock Conditions, RAG & Banker\'s Algorithm',
                durationMin: 55,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Deadlocks is one of the most reliable scoring topics in OS, tested in nearly every GATE paper.',
                  whatYouWillLearn: [
                    '01 What is Deadlock & Coffman 4 Conditions',
                    '02 Resource Allocation Graph (RAG) cycle rules',
                    '03 Deadlock Prevention vs Avoidance vs Detection',
                    '04 Banker\'s Safety Algorithm matrix verification'
                  ],
                  prerequisites: ['Process state transitions and resource requests']
                },
                explanation: {
                  definition: 'A deadlock is a permanent state where a set of processes are blocked because each process holds resources that the others need.',
                  intuition: 'Imagine 4 cars entering a 4-way single-lane crossroads simultaneously; none can advance because each is blocked by the car in front.',
                  howItWorks: [
                    'The 4 Coffman Conditions (ALL four must hold simultaneously for deadlock):',
                    '  1. Mutual Exclusion: At least one resource is held in non-shareable mode.',
                    '  2. Hold and Wait: A process holds at least one resource and is waiting for additional resources held by others.',
                    '  3. No Preemption: Resources cannot be forcibly seized; only released voluntarily.',
                    '  4. Circular Wait: A closed chain of processes exists where P0 waits for P1, P1 waits for P2, ..., Pn waits for P0.',
                    'Resource Allocation Graph (RAG):',
                    '  - If every resource has SINGLE instance: A cycle in RAG is NECESSARY and SUFFICIENT for deadlock.',
                    '  - If resources have MULTIPLE instances: A cycle is NECESSARY, but NOT SUFFICIENT (can be false alarm if external processes release instances).',
                    'Banker\'s Algorithm: Avoidance algorithm that grants requests ONLY if the resulting system state remains in a SAFE sequence.'
                  ],
                  keyTakeaway: 'In multiple-instance systems, a cycle does NOT guarantee deadlock. Verify whether remaining processes can release resources.'
                },
                conceptMap: {
                  title: 'Deadlock Handling Framework',
                  nodes: [
                    { id: '1', label: 'Deadlock Conditions', sub: '4 Coffman conditions' },
                    { id: '2', label: 'Prevention', sub: 'Violate at least 1 condition' },
                    { id: '3', label: 'Avoidance (Banker\'s)', sub: 'Maintain Safe State dynamically' },
                    { id: '4', label: 'Detection & Recovery', sub: 'Periodic checks & preemption/kill' }
                  ],
                  connections: [
                    { from: '1', to: '2', label: 'design time guarantee' },
                    { from: '1', to: '3', label: 'runtime trajectory check' },
                    { from: '1', to: '4', label: 'reactive recovery' }
                  ],
                  asciiDiagram: '            ┌─── Mutual Exclusion\n            ├─── Hold and Wait\nDEADLOCK ───┼─── No Preemption\n            └─── Circular Wait\n                     │\n     ┌───────────────┴───────────────┐\n     ▼                               ▼\n[Single-Instance RAG]      [Multi-Instance RAG]\nCycle == DEADLOCK          Cycle != Guaranteed Deadlock\n(Necessary & Sufficient)   (Necessary ONLY)'
                },
                formulasAndRules: [
                  {
                    id: 'rule-deadlock-free',
                    name: 'Deadlock-Free Resource Bound',
                    formula: 'Total Resources R ≥ ∑ (Max_i - 1) + 1 = ∑ Max_i - n + 1',
                    rule: 'Guarantees that at least one process can satisfy its maximum demand and finish, releasing all resources.',
                    condition: 'n processes competing for instances of a single resource type',
                    subjectCode: 'CS-OS',
                    lessonId: 'os-l1',
                    lessonTitle: 'Deadlock Conditions, RAG & Banker\'s Algorithm'
                  },
                  {
                    id: 'rule-bankers-need',
                    name: 'Banker’s Need Matrix Formula',
                    formula: 'Need[i][j] = Max[i][j] - Allocation[i][j]',
                    rule: 'A process can be satisfied if Need[i] ≤ Available vector.',
                    subjectCode: 'CS-OS',
                    lessonId: 'os-l1',
                    lessonTitle: 'Deadlock Conditions, RAG & Banker\'s Algorithm'
                  }
                ],
                examples: [
                  {
                    title: 'Minimum Resources for Deadlock Freedom',
                    problem: 'A system has 3 processes each requiring a maximum of 4 units of a resource. What is the minimum number of units required to guarantee the system is deadlock-free?',
                    solutionSteps: [
                      'Worst-case deadlock scenario: Every process holds one less than its maximum requirement.',
                      'Each process holds: Max - 1 = 4 - 1 = 3 units.',
                      'Total resources held in deadlock: 3 processes * 3 units = 9 units.',
                      'Add 1 additional resource so at least one process can finish: 9 + 1 = 10 units.',
                      'Therefore, minimum resources R = 10.'
                    ],
                    keyInsight: 'Formula R ≥ n * (k - 1) + 1 guarantees deadlock freedom.'
                  },
                  {
                    title: 'Banker’s Safety Check',
                    problem: '5 processes P0-P4, 3 resource types A, B, C with Available = [3, 3, 2]. If Need of P1 is [1, 2, 2] and Allocation is [2, 0, 0], can P1 be executed?',
                    solutionSteps: [
                      'Compare Need(P1) = [1, 2, 2] with Available = [3, 3, 2].',
                      'Since 1 ≤ 3, 2 ≤ 3, and 2 ≤ 2, Need(P1) ≤ Available holds.',
                      'P1 can execute and finish.',
                      'Upon completion, P1 releases its allocation: New Available = Available + Allocation = [3, 3, 2] + [2, 0, 0] = [5, 3, 2].'
                    ],
                    keyInsight: 'Always add the process\'s ALLOCATION back to the Available pool when it finishes.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Asserting a cycle in a multi-instance RAG proves deadlock.',
                    whyItHappens: 'Ignoring alternative processes with available instances outside the cycle.',
                    correction: 'In multiple instance graphs, a cycle is only a necessary condition, never sufficient.'
                  },
                  {
                    pitfall: 'Adding Need back to Available instead of Allocation in Banker\'s Algorithm.',
                    whyItHappens: 'Careless vector manipulation.',
                    correction: 'A process releases what it currently HOLDS (its Allocation), not its Need.'
                  }
                ],
                masterCheckCriteria: [
                  'I can explain all 4 Coffman conditions without looking at notes',
                  'I understand why a cycle in a multi-instance RAG is NOT sufficient for deadlock',
                  'I can derive the minimum resources needed for deadlock freedom: R ≥ ∑(Max_i - 1) + 1',
                  'I can execute Banker\'s safety algorithm and find all valid safe sequences',
                  'I can distinguish between Deadlock Prevention (design time) and Deadlock Avoidance (dynamic safe state)',
                  'I can identify resource ordering methods to eliminate circular wait'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'cs-os-b',
        subjectId: 'cs-os',
        azLetter: 'B',
        name: 'CPU Scheduling & Memory Management',
        description: 'Scheduling algorithms (FCFS, SJF, SRTF, RR, Priority), Paging, Page Tables, TLB, and Virtual Memory.',
        topics: [
          {
            id: 'os-t2',
            moduleId: 'cs-os-b',
            subjectId: 'cs-os',
            name: 'Paging & Virtual Memory',
            description: 'Address translation, multi-level page tables, inverted page tables, TLB hit/miss EAT, and page replacement algorithms.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'os-l2',
                topicId: 'os-t2',
                moduleId: 'cs-os-b',
                subjectId: 'cs-os',
                title: 'Paging, Multi-level Page Tables & Effective Memory Access Time',
                durationMin: 55,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Paging and TLB Effective Access Time (EMAT) calculations appear in virtually every GATE OS section.',
                  whatYouWillLearn: ['Virtual address decomposition into Page Number and Offset', 'Effective Memory Access Time (EMAT) with TLB', 'Multi-level page table sizing calculations'],
                  prerequisites: ['Binary addresses and main memory organization']
                },
                explanation: {
                  definition: 'Virtual memory decouples logical process memory from physical RAM through page-to-frame translation.',
                  intuition: 'Each process lives in its own continuous virtual universe; page tables map those illusionary addresses to scattered physical frames.',
                  howItWorks: [
                    'Page Size = Frame Size = 2^k bytes ⇒ Offset = k bits.',
                    'Number of Pages = Virtual Address Space / Page Size.',
                    'Page Table Entry (PTE) contains Frame Number + Protection / Valid / Dirty bits.',
                    'Page Table Size = Number of Pages × PTE Size.',
                    'Effective Access Time with TLB: EAT = Hit_Ratio * (t_tlb + t_mem) + (1 - Hit_Ratio) * (t_tlb + (Levels + 1) * t_mem).'
                  ],
                  keyTakeaway: 'For an n-level page table, a TLB miss requires n main memory accesses to traverse the page tables plus 1 access to read data (total n+1 accesses).'
                },
                formulasAndRules: [
                  {
                    id: 'rule-emat-tlb',
                    name: 'EMAT with TLB (Single Level Page Table)',
                    formula: 'EMAT = c + (1 - h) * m + m = c + m + (1 - h) * m',
                    rule: 'Where c = TLB access time, m = Main Memory access time, h = TLB hit ratio.',
                    subjectCode: 'CS-OS',
                    lessonId: 'os-l2',
                    lessonTitle: 'Paging, Multi-level Page Tables & Effective Memory Access Time'
                  },
                  {
                    id: 'rule-multilevel-page',
                    name: 'Multi-level Page Table Level Condition',
                    formula: 'Entries per table node = (Page Size) / (PTE Size)',
                    rule: 'Each page table page must fit entirely within exactly one physical frame.',
                    subjectCode: 'CS-OS',
                    lessonId: 'os-l2',
                    lessonTitle: 'Paging, Multi-level Page Tables & Effective Memory Access Time'
                  }
                ],
                examples: [
                  {
                    title: 'Calculating Multi-level Page Table Size',
                    problem: '32-bit virtual address, 4 KB page size, 4-byte Page Table Entry (PTE). How many levels of page table are required so that each page table fits within one page?',
                    solutionSteps: [
                      'Offset bits = log2(4 KB) = 12 bits.',
                      'Virtual page number bits = 32 - 12 = 20 bits.',
                      'Entries that fit in one 4 KB frame: (4 KB) / (4 bytes) = 1024 entries = 2^10 entries.',
                      'Each page table level can index 10 bits.',
                      'Total page number bits to resolve = 20 bits.',
                      'Number of levels = 20 bits / 10 bits per level = 2 levels.',
                      'Breakdown: Level 1 (10 bits), Level 2 (10 bits), Offset (12 bits).'
                    ],
                    keyInsight: 'Divide remaining virtual page number bits by log2(Page Size / PTE Size).'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Forgetting the final data memory access in TLB miss calculations.',
                    whyItHappens: 'Only counting memory accesses taken to read page table entries.',
                    correction: 'Always add 1 extra memory access for fetching the actual operand byte after finding the frame number.'
                  }
                ],
                masterCheckCriteria: [
                  'I can partition virtual and physical addresses into page/frame numbers and offsets',
                  'I can compute total page table size and multi-level hierarchy structures',
                  'I can calculate EMAT with TLB for 1-level, 2-level, and inverted page tables',
                  'I know the difference between FIFO, LRU, and Optimal page replacement algorithms',
                  'I understand Belady\'s Anomaly and know which algorithms suffer from it (FIFO does, LRU/Optimal do not)',
                  'I understand thrashing and working set models'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cs-dbms',
    code: 'CS-DBMS',
    name: 'Database Management Systems',
    pillar: 'CS',
    officialSection: 'Computer Science — Section 8',
    approxMarks: 7,
    description: 'ER model, relational model, relational algebra, tuple calculus, SQL, integrity constraints, normalization, transactions, and concurrency control.',
    modules: [
      {
        id: 'cs-dbms-a',
        subjectId: 'cs-dbms',
        azLetter: 'A',
        name: 'Functional Dependencies & Normalization',
        description: 'Attribute closure, candidate key derivation, minimal cover, 1NF, 2NF, 3NF, BCNF, lossless join, and dependency preservation.',
        topics: [
          {
            id: 'db-t1',
            moduleId: 'cs-dbms-a',
            subjectId: 'cs-dbms',
            name: 'Candidate Keys & Normal Forms',
            description: 'Closure algorithm, prime attributes, 2NF/3NF/BCNF violation checks, and decomposition testing.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'db-l1',
                topicId: 'db-t1',
                moduleId: 'cs-dbms-a',
                subjectId: 'cs-dbms',
                title: 'Attribute Closure, Candidate Keys & Normal Forms (1NF–BCNF)',
                durationMin: 55,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Finding candidate keys and testing BCNF/3NF is guaranteed to appear in GATE CS every year.',
                  whatYouWillLearn: ['Attribute closure computation (X+)', 'Systematic candidate key derivation', 'BCNF vs 3NF conditions and lossless decomposition'],
                  prerequisites: ['Relational model definitions']
                },
                explanation: {
                  definition: 'Normalization eliminates redundancy and update anomalies by decomposing relations into well-behaved schemas.',
                  intuition: 'Every non-key attribute must provide a single-valued fact about the key, the whole key, and nothing but the key (so help me Codd).',
                  howItWorks: [
                    'Candidate Key: A minimal superkey whose closure covers all relation attributes.',
                    'Prime Attribute: An attribute belonging to AT LEAST ONE candidate key.',
                    'BCNF: For every non-trivial FD X → Y, X MUST be a superkey.',
                    '3NF: For every non-trivial FD X → Y, EITHER X is a superkey OR Y is a prime attribute.',
                    '2NF: No partial dependencies (no proper subset of any candidate key can determine a non-prime attribute).'
                  ],
                  keyTakeaway: '3NF permits X → Y when Y is prime even if X is not a superkey. BCNF strictly forbids this.'
                },
                conceptMap: {
                  title: 'Normal Form Hierarchy & Conditions',
                  nodes: [
                    { id: '1', label: '1NF', sub: 'Atomic values; no repeating groups' },
                    { id: '2', label: '2NF', sub: '1NF + No Partial Dependency' },
                    { id: '3', label: '3NF', sub: '2NF + No Transitive Dependency (X is Superkey OR Y is Prime)' },
                    { id: '4', label: 'BCNF', sub: '3NF + X must ALWAYS be a Superkey' }
                  ],
                  connections: [
                    { from: '1', to: '2', label: 'eliminate partial' },
                    { from: '2', to: '3', label: 'eliminate transitive' },
                    { from: '3', to: '4', label: 'strictly enforce superkey LHS' }
                  ],
                  asciiDiagram: '1NF ─────> 2NF ─────> 3NF ─────> BCNF\n[Atomic]   [No Partial] [X=SK or Y=Prime] [X MUST be SK]\n\nNote:\n- 3NF always guarantees BOTH Lossless Join AND Dependency Preservation.\n- BCNF always guarantees Lossless Join, but may NOT preserve all dependencies.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-lossless-test',
                    name: 'Lossless Join Decomposition Test',
                    formula: 'R1 ∩ R2 → R1  OR  R1 ∩ R2 → R2',
                    rule: 'Decomposition of R into (R1, R2) is lossless iff the common attributes form a superkey of at least one relation.',
                    subjectCode: 'CS-DBMS',
                    lessonId: 'db-l1',
                    lessonTitle: 'Attribute Closure, Candidate Keys & Normal Forms (1NF–BCNF)'
                  },
                  {
                    id: 'rule-bcnf-test',
                    name: 'BCNF Strict Definition',
                    formula: '∀ X → Y ∈ F^+: X is a Superkey (for Y ⊄ X)',
                    rule: 'Zero tolerance for non-superkey determinants.',
                    subjectCode: 'CS-DBMS',
                    lessonId: 'db-l1',
                    lessonTitle: 'Attribute Closure, Candidate Keys & Normal Forms (1NF–BCNF)'
                  }
                ],
                examples: [
                  {
                    title: 'Testing Normal Form of Relation',
                    problem: 'Given R(A, B, C, D) with FDs: { AB → C, C → D, D → A }. Determine the highest normal form.',
                    solutionSteps: [
                      'Find Candidate Keys:',
                      'Attribute B never appears on RHS ⇒ B MUST be in every candidate key.',
                      '(AB)+ = {A, B, C, D} ⇒ AB is a Candidate Key.',
                      '(CB)+ = {C, B, D, A} ⇒ BC is a Candidate Key.',
                      '(DB)+ = {D, B, A, C} ⇒ BD is a Candidate Key.',
                      'Candidate Keys: AB, BC, BD.',
                      'Prime Attributes: {A, B, C, D} (every attribute is prime!).',
                      'Check 3NF condition for each FD:',
                      '  AB → C: AB is superkey (Passes BCNF & 3NF).',
                      '  C → D: C is NOT a superkey, BUT D is a PRIME attribute! (Passes 3NF).',
                      '  D → A: D is NOT a superkey, BUT A is a PRIME attribute! (Passes 3NF).',
                      'Since all FDs satisfy 3NF, but C → D violates BCNF, highest normal form is 3NF.'
                    ],
                    keyInsight: 'When all attributes in a schema are prime, the relation is GUARANTEED to be in at least 3NF.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Claiming a relation is not in 3NF when LHS is not a superkey, forgetting to check if RHS is prime.',
                    whyItHappens: 'Remembering only BCNF rules.',
                    correction: '3NF allows non-superkey determinants as long as the dependent attribute on the RHS is prime.'
                  }
                ],
                masterCheckCriteria: [
                  'I can compute attribute closures (X+) systematically to derive all candidate keys',
                  'I can identify prime and non-prime attributes without omissions',
                  'I know why a schema where all attributes are prime is automatically in 3NF',
                  'I can verify lossless-join decomposition using common attribute closures',
                  'I can test dependency preservation across decomposed relational schemas',
                  'I can compute canonical minimal cover of functional dependencies'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'cs-dbms-b',
        subjectId: 'cs-dbms',
        azLetter: 'B',
        name: 'Transactions & Concurrency Control',
        description: 'ACID properties, serializability (conflict and view), recoverability, cascading aborts, and two-phase locking (2PL).',
        topics: [
          {
            id: 'db-t2',
            moduleId: 'cs-dbms-b',
            subjectId: 'cs-dbms',
            name: 'Serializability & Concurrency Protocols',
            description: 'Precedence graphs (conflict serializability), blind writes, recoverable/cascadeless schedules, and strict 2PL.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'db-l2',
                topicId: 'db-t2',
                moduleId: 'cs-dbms-b',
                subjectId: 'cs-dbms',
                title: 'Conflict Serializability, Precedence Graphs & 2PL',
                durationMin: 50,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Serializability schedules and lock protocols are asked with high frequency in GATE.',
                  whatYouWillLearn: ['Conflicting operation identification', 'Precedence graph cycle testing', 'Recoverable vs Cascadeless vs Strict schedules'],
                  prerequisites: ['Transaction operations (read, write, commit, abort)']
                },
                explanation: {
                  definition: 'Serializability ensures concurrent transaction execution yields identical database state to some sequential serial execution.',
                  intuition: 'Draw directed edges T_i → T_j when T_i accesses data before T_j with at least one write. If no cycles exist, order is consistent.',
                  howItWorks: [
                    'Conflicting operations: Two operations by DIFFERENT transactions on the SAME item with AT LEAST ONE write.',
                    'A schedule is conflict serializable iff its precedence graph has NO directed cycles.',
                    'Recoverable Schedule: If T_j reads data written by T_i, then T_i must COMMIT before T_j commits.',
                    'Cascadeless Schedule: If T_j reads data written by T_i, then T_i must commit BEFORE T_j reads it.'
                  ],
                  keyTakeaway: 'Strict ⊂ Cascadeless ⊂ Recoverable ⊂ All Schedules.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-prec-graph',
                    name: 'Conflict Serializability Rule',
                    formula: 'Graph G(V, E) is acyclic ⇔ Schedule is Conflict Serializable',
                    rule: 'Topological sort of the acyclic precedence graph gives the equivalent serial schedule.',
                    subjectCode: 'CS-DBMS',
                    lessonId: 'db-l2',
                    lessonTitle: 'Conflict Serializability, Precedence Graphs & 2PL'
                  }
                ],
                examples: [
                  {
                    title: 'Testing Conflict Serializability',
                    problem: 'Given schedule S: r1(x), r2(y), w1(x), r2(x), w2(x). Is S conflict serializable?',
                    solutionSteps: [
                      'Check conflicting pairs on x:',
                      'w1(x) happens before r2(x) ⇒ Edge T1 → T2.',
                      'w1(x) happens before w2(x) ⇒ Edge T1 → T2.',
                      'Check operations on y: only r2(y), no conflict.',
                      'Graph has nodes {T1, T2} and single directed edge T1 → T2.',
                      'Since there are NO directed cycles, S is CONFLICT SERIALIZABLE with equivalent serial order T1, T2.'
                    ],
                    keyInsight: 'Only consider operation pairs involving different transactions on the same item with at least one write.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Assuming a view serializable schedule must be conflict serializable.',
                    whyItHappens: 'Forgetting blind writes.',
                    correction: 'Conflict serializable is a STRICT SUBSET of view serializable. A schedule with blind writes may be view serializable without being conflict serializable.'
                  }
                ],
                masterCheckCriteria: [
                  'I can construct precedence graphs and test for cycles in under 45 seconds',
                  'I can identify the exact topological sort order of equivalent serial execution',
                  'I know the hierarchical relationship: Strict ⊂ Cascadeless ⊂ Recoverable',
                  'I understand why Basic 2PL guarantees serializability but can cause DEADLOCK',
                  'I know Strict 2PL prevents cascading aborts by holding exclusive locks until commit',
                  'I can calculate the number of nodes and search cost in B and B+ trees'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cs-networks',
    code: 'CS-CN',
    name: 'Computer Networks',
    pillar: 'CS',
    officialSection: 'Computer Science — Section 9',
    approxMarks: 7,
    description: 'Layering, switching, performance (delay/throughput), data link error detection & MAC, Ethernet, routing, IPv4, CIDR, NAT, TCP, socket API, DNS, and HTTP.',
    modules: [
      {
        id: 'cs-cn-a',
        subjectId: 'cs-networks',
        azLetter: 'A',
        name: 'Network Performance, Switching & Data Link',
        description: 'Transmission delay, propagation delay, bandwidth-delay product, error detection (CRC, checksum), and Ethernet MAC.',
        topics: [
          {
            id: 'cn-t1',
            moduleId: 'cs-cn-a',
            subjectId: 'cs-networks',
            name: 'Delays, Throughput & Flow Control',
            description: 'Packet transmission time, propagation delay, Stop-and-Wait efficiency, Go-Back-N, Selective Repeat, and CRC polynomials.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'cn-l1',
                topicId: 'cn-t1',
                moduleId: 'cs-cn-a',
                subjectId: 'cs-networks',
                title: 'Transmission Delay, Propagation Delay & Sliding Window Protocols',
                durationMin: 55,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Delay and sliding window calculations are high-frequency, formula-intensive numerical questions in GATE.',
                  whatYouWillLearn: ['Transmission delay (L/B) vs Propagation delay (d/v)', 'Parameter `a = T_p / T_t`', 'Window size formula for 100% sliding window efficiency'],
                  prerequisites: ['Basic dimensional units (bits, bytes, km/s, bps)']
                },
                explanation: {
                  definition: 'Network latency is governed by physical propagation speed and serialization link bandwidth.',
                  intuition: 'T_t is how long it takes to push the train onto the track; T_p is how long the train takes to travel from station A to B.',
                  howItWorks: [
                    'Transmission Delay: T_t = Length of Packet (bits) / Bandwidth (bps).',
                    'Propagation Delay: T_p = Distance (m) / Signal Speed (m/s).',
                    'Round Trip Time: RTT = 2 * T_p (ignoring queuing and processing).',
                    'Stop-and-Wait Efficiency: η = T_t / (T_t + 2 * T_p) = 1 / (1 + 2a), where a = T_p / T_t.',
                    'For 100% efficiency in Sliding Window: Window Size W ≥ 1 + 2a.'
                  ],
                  keyTakeaway: 'Always check bit vs byte units: 1 Mbps = 10^6 bps (decimal in networking), packet size often in Bytes (multiply by 8).'
                },
                conceptMap: {
                  title: 'Network Delay Components',
                  nodes: [
                    { id: '1', label: 'Transmission Delay T_t', sub: 'Packet Size / Bandwidth' },
                    { id: '2', label: 'Propagation Delay T_p', sub: 'Distance / Velocity' },
                    { id: '3', label: 'Efficiency Parameter a', sub: 'a = T_p / T_t' },
                    { id: '4', label: 'Sliding Window Size', sub: 'W = 1 + 2a for 100% link utilization' }
                  ],
                  connections: [
                    { from: '1', to: '3', label: 'denominator' },
                    { from: '2', to: '3', label: 'numerator' },
                    { from: '3', to: '4', label: 'determines optimal capacity' }
                  ],
                  asciiDiagram: 'Transmission (Push bits) ────> T_t = L / B\nPropagation (Travel speed) ───> T_p = Dist / Velocity\nRatio ────────────────────────> a = T_p / T_t\n\nSliding Window Minimum Window for 100% Efficiency:\nW = 1 + 2a'
                },
                formulasAndRules: [
                  {
                    id: 'rule-sliding-window-eff',
                    name: 'Sliding Window Optimal Window Size',
                    formula: 'W_optimal = 1 + 2 * (T_p / T_t)',
                    rule: 'Sequence numbers needed: Go-Back-N needs W + 1; Selective Repeat needs 2 * W.',
                    subjectCode: 'CS-CN',
                    lessonId: 'cn-l1',
                    lessonTitle: 'Transmission Delay, Propagation Delay & Sliding Window Protocols'
                  },
                  {
                    id: 'rule-csma-cd-minframe',
                    name: 'CSMA/CD Minimum Frame Size',
                    formula: 'L_{min} ≥ 2 * T_p * Bandwidth',
                    rule: 'Ensures sender detects collision while still transmitting frame.',
                    subjectCode: 'CS-CN',
                    lessonId: 'cn-l1',
                    lessonTitle: 'Transmission Delay, Propagation Delay & Sliding Window Protocols'
                  }
                ],
                examples: [
                  {
                    title: 'Minimum Frame Size in CSMA/CD',
                    problem: 'A 1 Gbps CSMA/CD network has distance 1 km with signal propagation speed 200,000 km/s. What is the minimum frame size in bytes?',
                    solutionSteps: [
                      'Bandwidth B = 1 Gbps = 10^9 bps.',
                      'T_p = Distance / Speed = 1 km / 200,000 km/s = 5 * 10^-6 s = 5 µs.',
                      'Round trip time 2 * T_p = 2 * 5 µs = 10 µs = 10^-5 s.',
                      'Minimum frame size in bits: L_min = 2 * T_p * B = (10^-5 s) * (10^9 bps) = 10^4 bits = 10,000 bits.',
                      'Convert to Bytes: 10,000 / 8 = 1,250 Bytes.'
                    ],
                    keyInsight: 'In networking formulas, decimal powers are used for rates (1 Gbps = 10^9 bps, not 2^30).'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Forgetting to multiply packet bytes by 8 when dividing by bandwidth in bps.',
                    whyItHappens: 'Mixing Bytes and bits.',
                    correction: 'Always convert packet size to bits (Bytes * 8) before dividing by bps.'
                  }
                ],
                masterCheckCriteria: [
                  'I convert between bps, Bps, and microsecond units without arithmetic slips',
                  'I know why CSMA/CD requires L_min ≥ 2 * T_p * Bandwidth',
                  'I can compute sequence number bit requirements for Go-Back-N vs Selective Repeat',
                  'I can calculate CRC polynomial remainder checking via XOR division',
                  'I know why exponential backoff prevents persistent broadcast collision storms',
                  'I understand throughput vs goodput vs bandwidth-delay product'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'cs-cn-b',
        subjectId: 'cs-networks',
        azLetter: 'B',
        name: 'Network Layer: IPv4, CIDR & Routing',
        description: 'Classless Inter-Domain Routing (CIDR), longest prefix match, subnet masks, fragmentation, Distance Vector, and Link State.',
        topics: [
          {
            id: 'cn-t2',
            moduleId: 'cs-cn-b',
            subjectId: 'cs-networks',
            name: 'IP Addressing, CIDR & Routing Algorithms',
            description: 'CIDR prefix aggregation, longest prefix matching, IPv4 header fragmentation offset, Bellman-Ford count-to-infinity, and Dijkstra link-state.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'cn-l2',
                topicId: 'cn-t2',
                moduleId: 'cs-cn-b',
                subjectId: 'cs-networks',
                title: 'CIDR Subnetting, Longest Prefix Match & IPv4 Fragmentation',
                durationMin: 55,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'CIDR longest prefix match and IPv4 fragmentation offset calculations appear every single year in GATE.',
                  whatYouWillLearn: ['CIDR /n prefix bit masking', 'Longest Prefix Match routing table lookup', 'IPv4 fragmentation offset calculation (8-byte units)'],
                  prerequisites: ['Binary IPv4 dotted-decimal representations']
                },
                explanation: {
                  definition: 'CIDR replaces classful addressing with variable-length prefix allocation; routers forward using longest prefix matching.',
                  intuition: 'A router is like a postal sorting facility: it matches the destination zip code against the most specific street match in its table.',
                  howItWorks: [
                    'In /k notation, the first k bits represent the network prefix; the remaining 32 - k bits are for host addresses.',
                    'Available usable hosts = 2^{32 - k} - 2 (subtract network ID and broadcast address).',
                    'Longest Prefix Match: If a packet matches multiple routing table entries, forward to the one with the LARGEST prefix length k.',
                    'IPv4 Fragmentation: Fragment Offset measures offset in units of 8-BYTE BLOCKS! Offset = (Bytes of payload preceding this fragment) / 8.'
                  ],
                  keyTakeaway: 'The Fragmentation Offset field in IPv4 headers is strictly measured in 8-byte chunks, NEVER single bytes.'
                },
                conceptMap: {
                  title: 'CIDR & Routing Table Lookup',
                  nodes: [
                    { id: '1', label: 'Destination IPv4', sub: '32-bit binary' },
                    { id: '2', label: 'Bitwise AND with Subnet Mask', sub: 'Applies /24, /26, /28' },
                    { id: '3', label: 'Match Candidates', sub: 'Filter matching table rows' },
                    { id: '4', label: 'Longest Prefix Match', sub: 'Select max prefix length k' }
                  ],
                  connections: [
                    { from: '1', to: '2', label: 'input' },
                    { from: '2', to: '3', label: 'identifies network' },
                    { from: '3', to: '4', label: 'tie-break by specificity' }
                  ],
                  asciiDiagram: 'Destination IP ──> [AND with Mask /28] ──> Match Interface A\n               ──> [AND with Mask /24] ──> Match Interface B\n\nLongest Prefix Match Winner: Interface A (/28 is more specific than /24)'
                },
                formulasAndRules: [
                  {
                    id: 'rule-frag-offset',
                    name: 'IPv4 Fragmentation Offset Rule',
                    formula: 'Offset = (Preceding Payload Bytes) / 8',
                    rule: 'Payload size in all non-terminal fragments MUST be a multiple of 8 bytes.',
                    subjectCode: 'CS-CN',
                    lessonId: 'cn-l2',
                    lessonTitle: 'CIDR Subnetting, Longest Prefix Match & IPv4 Fragmentation'
                  }
                ],
                examples: [
                  {
                    title: 'IPv4 Fragmentation Offset Calculation',
                    problem: 'A datagram of 4020 bytes (20 bytes header + 4000 bytes payload) passes through a link with MTU 1500 bytes. Find the offset and More Fragments (MF) flag of each fragment.',
                    solutionSteps: [
                      'MTU = 1500 bytes. Header = 20 bytes ⇒ Max payload per fragment = 1500 - 20 = 1480 bytes.',
                      'Check if 1480 is divisible by 8: 1480 / 8 = 185 (Yes, valid!).',
                      'Fragment 1: Payload = 1480 bytes. Preceding payload = 0. Offset = 0 / 8 = 0. MF = 1.',
                      'Fragment 2: Payload = 1480 bytes. Preceding payload = 1480. Offset = 1480 / 8 = 185. MF = 1.',
                      'Remaining payload = 4000 - (1480 + 1480) = 4000 - 2960 = 1040 bytes.',
                      'Fragment 3: Payload = 1040 bytes. Preceding payload = 2960. Offset = 2960 / 8 = 370. MF = 0.'
                    ],
                    keyInsight: 'Payload size of all fragments except the last must be a multiple of 8 to produce integer offset values.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Including the 20-byte IP header when computing the fragmentation offset.',
                    whyItHappens: 'Forgetting that Offset measures only DATA (payload) displacement.',
                    correction: 'Offset measures ONLY user data bytes preceding the current fragment, divided by 8.'
                  }
                ],
                masterCheckCriteria: [
                  'I can determine network address, broadcast address, and host ranges for any CIDR /n notation',
                  'I can apply Longest Prefix Matching across routing tables in under 30 seconds',
                  'I can calculate IPv4 fragment sizes, offsets (dividing by 8), and MF flag bits',
                  'I understand the Count-to-Infinity problem in Distance Vector routing and Split Horizon / Poison Reverse solutions',
                  'I know TCP 3-way handshake states, sequence numbers, and congestion window phases (Slow Start, Congestion Avoidance)',
                  'I understand DNS hierarchy, iterative vs recursive resolution, and HTTP 1.1 keep-alive vs HTTP/2 multiplexing'
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
