import { Subject } from '../../types';

export const engineeringMathsSubjects: Subject[] = [
  {
    id: 'math-discrete',
    code: 'MATH-DM',
    name: 'Discrete Mathematics',
    pillar: 'MATH',
    officialSection: 'Engineering Mathematics — Section 1',
    approxMarks: 5,
    description: 'Propositional and first order logic, sets, relations, functions, partial orders, lattices, groups, graphs, combinatorics, and recurrences.',
    modules: [
      {
        id: 'math-dm-a',
        subjectId: 'math-discrete',
        azLetter: 'A',
        name: 'Mathematical Logic',
        description: 'Propositional calculus, truth tables, equivalences, normal forms, first-order logic, predicates, and quantifiers.',
        topics: [
          {
            id: 'dm-t1',
            moduleId: 'math-dm-a',
            subjectId: 'math-discrete',
            name: 'Propositional Logic & Normal Forms',
            description: 'Propositions, connectives, tautologies, CNF, DNF, and logical implications.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'dm-l1',
                topicId: 'dm-t1',
                moduleId: 'math-dm-a',
                subjectId: 'math-discrete',
                title: 'Logical Operators, Equivalence & Implications',
                durationMin: 45,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Forms the formal reasoning foundation for digital circuits, algorithm correctness, and formal verification.',
                  whatYouWillLearn: ['Truth table generation', 'De Morgan\'s laws & implication equivalences', 'Tautologies vs Contradictions'],
                  prerequisites: ['Basic Boolean truth evaluation']
                },
                explanation: {
                  definition: 'Propositional logic deals with declarative statements that are strictly either True or False.',
                  intuition: 'Conditional p → q only fails when promise p is True yet outcome q is False. If p is False, the statement is vacuously True.',
                  howItWorks: [
                    'Implication equivalence: p → q ≡ ¬p ∨ q.',
                    'Contrapositive: p → q ≡ ¬q → ¬p (always equivalent).',
                    'Converse: q → p (not equivalent to p → q).',
                    'A compound proposition is a tautology if it evaluates to True under all truth assignments.'
                  ],
                  keyTakeaway: 'Always replace p → q with ¬p ∨ q when applying algebraic equivalences.'
                },
                conceptMap: {
                  title: 'Implication & Equivalence Flow',
                  nodes: [
                    { id: '1', label: 'Implication: p → q', sub: 'Original statement' },
                    { id: '2', label: 'Contrapositive: ¬q → ¬p', sub: 'Logically Equivalent' },
                    { id: '3', label: 'Converse: q → p', sub: 'NOT Equivalent' },
                    { id: '4', label: 'Disjunctive Form: ¬p ∨ q', sub: 'Canonical Algebraic Form' }
                  ],
                  connections: [
                    { from: '1', to: '2', label: 'equivalent' },
                    { from: '1', to: '4', label: 'algebraic identity' },
                    { from: '1', to: '3', label: 'fallacy if equated' }
                  ],
                  asciiDiagram: '[p → q] ════(Equivalent)════> [¬q → ¬p]\n   │\n   ├───(Identity)───> [¬p ∨ q]\n   └───(NOT Eq)────> [q → p] (Converse)'
                },
                formulasAndRules: [
                  {
                    id: 'rule-dm-impl',
                    name: 'Implication Law',
                    formula: 'p → q ≡ ¬p ∨ q',
                    rule: 'Converts conditional statements into standard Boolean disjunction.',
                    subjectCode: 'MATH-DM',
                    lessonId: 'dm-l1',
                    lessonTitle: 'Logical Operators, Equivalence & Implications'
                  },
                  {
                    id: 'rule-dm-demorgan',
                    name: 'De Morgan’s Laws',
                    formula: '¬(p ∧ q) ≡ ¬p ∨ ¬q  and  ¬(p ∨ q) ≡ ¬p ∧ ¬q',
                    rule: 'Negation inverts conjunction to disjunction and vice-versa.',
                    subjectCode: 'MATH-DM',
                    lessonId: 'dm-l1',
                    lessonTitle: 'Logical Operators, Equivalence & Implications'
                  }
                ],
                examples: [
                  {
                    title: 'Testing Tautology via Negation',
                    problem: 'Determine if ((p → q) ∧ (q → r)) → (p → r) is a tautology.',
                    solutionSteps: [
                      'Assume expression is False.',
                      'A conditional A → B is False iff A is True and B is False.',
                      'So B = (p → r) must be False ⇒ p = True, r = False.',
                      'Now evaluate premise A = (p → q) ∧ (q → r) under p=T, r=F:',
                      'If q=T, then (q → r) = (T → F) = F.',
                      'If q=F, then (p → q) = (T → F) = F.',
                      'In either case, premise A is False, contradicting that A is True.',
                      'Since no truth assignment makes the proposition False, it is a Tautology.'
                    ],
                    keyInsight: 'Proof by falsification is often 3x faster than building a full 8-row truth table.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Assuming p → q implies q → p.',
                    whyItHappens: 'Everyday conversational ambiguity.',
                    correction: 'The converse is NOT logically equivalent to the conditional.'
                  }
                ],
                masterCheckCriteria: [
                  'I can prove propositions are tautologies using proof by falsification without writing 2^n rows',
                  'I can convert any propositional sentence into CNF and DNF',
                  'I recall contrapositive, inverse, and converse relations without hesitation',
                  'I can evaluate validity of arguments using resolution and inference rules',
                  'I know how to distribute disjunctions over conjunctions correctly',
                  'I can state De Morgan\'s laws for both propositional and predicate logic'
                ]
              },
              {
                id: 'dm-l2',
                topicId: 'dm-t1',
                moduleId: 'math-dm-a',
                subjectId: 'math-discrete',
                title: 'First-Order Logic, Predicates & Quantifiers',
                durationMin: 50,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Expresses relationships over domains; one of the highest weighted discrete math questions in GATE.',
                  whatYouWillLearn: ['Universal (∀) and Existential (∃) quantifiers', 'Quantifier negation rules', 'Order of mixed quantifiers (∀x∃y vs ∃y∀x)'],
                  prerequisites: ['Propositional logic']
                },
                explanation: {
                  definition: 'Extension of propositional logic incorporating variables, predicates P(x), and quantifiers over universes of discourse.',
                  intuition: '∀ is a generalized AND across all domain elements; ∃ is a generalized OR.',
                  howItWorks: [
                    'Negation: ¬(∀x P(x)) ≡ ∃x ¬P(x);  ¬(∃x P(x)) ≡ ∀x ¬P(x).',
                    '∀x ∃y P(x, y) does NOT imply ∃y ∀x P(x, y). The choice of y can depend on x in the former.',
                    'Scope binding: Free vs bound variables determine sentence truth value.'
                  ],
                  keyTakeaway: 'The order of mixed quantifiers matters fundamentally: ∃y∀x P(x,y) ⇒ ∀x∃y P(x,y), but the reverse is FALSE.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-quant-order',
                    name: 'Quantifier Interchange Rule',
                    formula: '∃y ∀x P(x, y) ⇒ ∀x ∃y P(x, y)  (Converse is NOT valid)',
                    rule: 'Finding one global y for all x is strictly stronger than finding a potentially different y for each x.',
                    subjectCode: 'MATH-DM',
                    lessonId: 'dm-l2',
                    lessonTitle: 'First-Order Logic, Predicates & Quantifiers'
                  }
                ],
                examples: [
                  {
                    title: 'Translating English to Predicate Logic',
                    problem: 'Translate: "Every student who loves computer science loves discrete math."',
                    solutionSteps: [
                      'Let S(x): x is a student, C(x): x loves computer science, D(x): x loves discrete math.',
                      'Condition on being a student who loves CS: (S(x) ∧ C(x)).',
                      'Implication to discrete math: (S(x) ∧ C(x)) → D(x).',
                      'Quantify universally over all entities: ∀x ((S(x) ∧ C(x)) → D(x)).'
                    ],
                    keyInsight: 'Universal statements almost always pair with implication (→), while existential statements pair with conjunction (∧).'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Writing ∀x (S(x) ∧ P(x)) when meaning "All students are programmers".',
                    whyItHappens: 'Conflating conditionality with conjunction.',
                    correction: '∀x (S(x) ∧ P(x)) asserts every object in the universe is both a student and a programmer. Use ∀x (S(x) → P(x)).'
                  }
                ],
                masterCheckCriteria: [
                  'I understand why ∀x∃y P(x,y) differs from ∃y∀x P(x,y)',
                  'I can negate nested quantified expressions accurately step-by-step',
                  'I know to use implication with ∀ and conjunction with ∃',
                  'I can translate complex English statements with multiple clauses into FOL',
                  'I can verify validity of first-order logic formulas on finite models',
                  'I understand the prenex normal form conversion process'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'math-dm-b',
        subjectId: 'math-discrete',
        azLetter: 'B',
        name: 'Sets, Relations & Functions',
        description: 'Set identities, equivalence relations, partial orders, Hasse diagrams, and lattices.',
        topics: [
          {
            id: 'dm-t2',
            moduleId: 'math-dm-b',
            subjectId: 'math-discrete',
            name: 'Relations, Posets & Lattices',
            description: 'Reflexive, symmetric, transitive closures, equivalence classes, partial orders, Hasse diagrams, and bounded lattices.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'dm-l3',
                topicId: 'dm-t2',
                moduleId: 'math-dm-b',
                subjectId: 'math-discrete',
                title: 'Equivalence Relations & Partial Orders (Posets)',
                durationMin: 45,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Equivalence partitions sets; posets model topological sorting and hierarchy in compilation.',
                  whatYouWillLearn: ['Reflexive, Symmetric, Antisymmetric, Transitive properties', 'Hasse diagrams and extreme elements', 'Lattice meet and join definitions'],
                  prerequisites: ['Binary relations basics']
                },
                explanation: {
                  definition: 'An equivalence relation is Reflexive, Symmetric, and Transitive. A Partial Order is Reflexive, Antisymmetric, and Transitive.',
                  intuition: 'Equivalence clumps elements into disjoint clusters; Partial Order stacks elements into a hierarchy without directed cycles.',
                  howItWorks: [
                    'Antisymmetric: If (a, b) ∈ R and (b, a) ∈ R then a = b.',
                    'In a Hasse diagram, transitive and reflexive edges are omitted; edges point upward.',
                    'Lattice: A poset where every pair of elements has a unique Greatest Lower Bound (Meet, ∧) and Least Upper Bound (Join, ∨).'
                  ],
                  keyTakeaway: 'A poset is a lattice iff EVERY pair of elements possesses both a unique LUB and unique GLB.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-lattice-1',
                    name: 'Lattice Condition',
                    formula: '∀ a, b ∈ L : ∃! sup(a, b) and ∃! inf(a, b)',
                    rule: 'If any pair has two minimal upper bounds (none smaller than the other), it is NOT a lattice.',
                    subjectCode: 'MATH-DM',
                    lessonId: 'dm-l3',
                    lessonTitle: 'Equivalence Relations & Partial Orders (Posets)'
                  },
                  {
                    id: 'rule-rel-count',
                    name: 'Number of Reflexive Relations',
                    formula: 'Count = 2^(n^2 - n)',
                    rule: 'On a set of n elements, the n diagonal pairs must be present, leaving n^2 - n pairs optional.',
                    subjectCode: 'MATH-DM',
                    lessonId: 'dm-l3',
                    lessonTitle: 'Equivalence Relations & Partial Orders (Posets)'
                  }
                ],
                examples: [
                  {
                    title: 'Checking if a Poset is a Lattice',
                    problem: 'Let S = {2, 3, 6, 12, 18, 36} ordered by divisibility. Is S a lattice?',
                    solutionSteps: [
                      'Check pair {12, 18}.',
                      'Upper bounds of 12 and 18: must be divisible by both 12 and 18. Common multiple in S is 36. LUB = 36.',
                      'Lower bounds of 12 and 18: divisors of both 12 and 18 in S are {2, 3, 6}.',
                      'Maximal element among {2, 3, 6} is 6. GLB = 6.',
                      'Check pair {2, 3}: Lower bounds: no common divisor in S! So GLB does not exist.',
                      'Since GLB(2, 3) does not exist in S, S is NOT a lattice.'
                    ],
                    keyInsight: 'Every single pair must have both GLB and LUB strictly belonging to the poset set.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Confusing asymmetric with antisymmetric.',
                    whyItHappens: 'Linguistic similarity.',
                    correction: 'Asymmetric means if (a,b) ∈ R then (b,a) ∉ R (never reflexive). Antisymmetric allows (a,a) ∈ R.'
                  }
                ],
                masterCheckCriteria: [
                  'I can compute the exact count of reflexive, symmetric, and antisymmetric relations on an n-element set',
                  'I can construct and interpret Hasse diagrams accurately',
                  'I can find maximal, minimal, greatest, and least elements in any finite poset',
                  'I can test whether a poset satisfies the lattice condition for every pair',
                  'I know the difference between distributive and complemented lattices',
                  'I understand the Fundamental Theorem of Equivalence Relations (partitioning)'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'math-dm-c',
        subjectId: 'math-discrete',
        azLetter: 'C',
        name: 'Combinatorics, Recurrences & Graph Theory',
        description: 'Counting principles, pigeonhole, recurrence relations, generating functions, connectivity, matching, and coloring.',
        topics: [
          {
            id: 'dm-t3',
            moduleId: 'math-dm-c',
            subjectId: 'math-discrete',
            name: 'Graph Theory & Combinatorics',
            description: 'Handshaking lemma, Euler/Hamilton graphs, planar graphs, chromatic number, matching, and counting principles.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'dm-l4',
                topicId: 'dm-t3',
                moduleId: 'math-dm-c',
                subjectId: 'math-discrete',
                title: 'Graph Properties, Connectivity, Matching & Coloring',
                durationMin: 50,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Graph theory is heavily tested both in Engineering Mathematics and in Algorithms.',
                  whatYouWillLearn: ['Handshaking theorem', 'Eulerian vs Hamiltonian conditions', 'Planar graph Euler formula', 'Bipartite matching and Hall\'s Marriage Theorem'],
                  prerequisites: ['Basic graph definitions']
                },
                explanation: {
                  definition: 'Study of vertices and edges representing pairwise relations.',
                  intuition: 'Handshaking guarantees the sum of degrees is even. Planar graphs cannot contain K5 or K3,3 minors (Kuratowski).',
                  howItWorks: [
                    'Handshaking: ∑ deg(v) = 2 |E|. The number of odd-degree vertices is always even.',
                    'A connected graph is Eulerian iff every vertex has an even degree.',
                    'Euler\'s Planar Formula: V - E + F = 2 for connected planar graphs.',
                    'A graph is 2-colorable (bipartite) iff it contains no odd-length cycles.'
                  ],
                  keyTakeaway: 'Always verify whether odd-length cycles exist when testing for bipartiteness.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-handshaking',
                    name: 'Handshaking Lemma',
                    formula: '∑ deg(v) = 2 |E|',
                    rule: 'Every edge contributes exactly 2 to the sum of vertex degrees.',
                    subjectCode: 'MATH-DM',
                    lessonId: 'dm-l4',
                    lessonTitle: 'Graph Properties, Connectivity, Matching & Coloring'
                  },
                  {
                    id: 'rule-euler-planar',
                    name: 'Euler’s Planar Formula',
                    formula: 'V - E + F = 2  (For connected planar graph)',
                    rule: 'Bound for simple planar graphs: E ≤ 3V - 6 (for V ≥ 3).',
                    subjectCode: 'MATH-DM',
                    lessonId: 'dm-l4',
                    lessonTitle: 'Graph Properties, Connectivity, Matching & Coloring'
                  }
                ],
                examples: [
                  {
                    title: 'Maximum Edges in Bipartite Graph',
                    problem: 'What is the maximum number of edges in a simple bipartite graph on n vertices?',
                    solutionSteps: [
                      'Let partition sizes be k and n - k.',
                      'Edges in complete bipartite graph K_{k, n-k} = k(n - k).',
                      'Maximizing k(n - k) occurs when k = ⌊n/2⌋.',
                      'Maximum edges = ⌊n/2⌋ × ⌈n/2⌋ = ⌊n^2 / 4⌋.'
                    ],
                    keyInsight: 'Balanced partitions maximize product when the sum is fixed.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Assuming an Eulerian path requires all vertices to have even degree.',
                    whyItHappens: 'Confusing Eulerian circuit (all even) with Eulerian path (exactly 2 or 0 odd vertices).',
                    correction: 'An Eulerian path allows exactly two vertices of odd degree (start and end).'
                  }
                ],
                masterCheckCriteria: [
                  'I can apply the Handshaking Lemma to solve degree constraints',
                  'I know the necessary and sufficient conditions for Eulerian circuits and paths',
                  'I can test planarity using Kuratowski\'s theorem and E ≤ 3V - 6',
                  'I can find chromatic number and chromatic polynomial for standard graph families',
                  'I can state and apply Hall\'s Marriage Condition for bipartite matchings',
                  'I can solve linear recurrence relations using characteristic equations'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'math-linear-algebra',
    code: 'MATH-LA',
    name: 'Linear Algebra',
    pillar: 'MATH',
    officialSection: 'Engineering Mathematics — Section 2',
    approxMarks: 3,
    description: 'Matrices, determinants, systems of linear equations, eigenvalues, eigenvectors, and LU decomposition.',
    modules: [
      {
        id: 'math-la-a',
        subjectId: 'math-linear-algebra',
        azLetter: 'A',
        name: 'Matrices, Rank & Systems of Equations',
        description: 'Matrix algebra, rank, row echelon form, consistency of linear equations, and LU decomposition.',
        topics: [
          {
            id: 'la-t1',
            moduleId: 'math-la-a',
            subjectId: 'math-linear-algebra',
            name: 'Rank & Systems of Linear Equations',
            description: 'Row operations, Gaussian elimination, consistency theorem, and degrees of freedom.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'la-l1',
                topicId: 'la-t1',
                moduleId: 'math-la-a',
                subjectId: 'math-linear-algebra',
                title: 'Matrix Rank, Echelon Form & Linear Systems',
                durationMin: 40,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'System solvability and rank are tested in almost every GATE exam without fail.',
                  whatYouWillLearn: ['Echelon form reduction', 'Rouché-Capelli consistency theorem', 'Homogeneous vs non-homogeneous solutions'],
                  prerequisites: ['Matrix multiplication and determinants']
                },
                explanation: {
                  definition: 'Rank is the maximum number of linearly independent rows or columns in a matrix.',
                  intuition: 'Rank measures the true dimensional span of the transformation; redundant rows vanish into all zeros.',
                  howItWorks: [
                    'For system Ax = b with augmented matrix [A|b]:',
                    'If rank(A) < rank([A|b]): Inconsistent (NO solution).',
                    'If rank(A) = rank([A|b]) = n (number of variables): Unique solution.',
                    'If rank(A) = rank([A|b]) = r < n: Infinitely many solutions with (n - r) free parameters.'
                  ],
                  keyTakeaway: 'Always compare rank(A) with rank([A|b]) and the variable count n.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-rank-nullity',
                    name: 'Rank-Nullity Theorem',
                    formula: 'Rank(A) + Nullity(A) = n (number of columns)',
                    rule: 'Fundamental dimension conservation for linear transformations.',
                    subjectCode: 'MATH-LA',
                    lessonId: 'la-l1',
                    lessonTitle: 'Matrix Rank, Echelon Form & Linear Systems'
                  }
                ],
                examples: [
                  {
                    title: 'Finding System Solvability Conditions',
                    problem: 'For what value of k does the system {x + y + z = 6, x + 2y + 3z = 10, x + 2y + kz = 12} have no solution?',
                    solutionSteps: [
                      'Form augmented matrix: [1 1 1 | 6; 1 2 3 | 10; 1 2 k | 12].',
                      'R2 ← R2 - R1: [0 1 2 | 4].',
                      'R3 ← R3 - R2: [0 0 k-3 | 2].',
                      'For no solution, rank(A) must be 2 while rank([A|b]) is 3.',
                      'This requires k - 3 = 0 ⇒ k = 3. Then last row is [0 0 0 | 2], which is 0 = 2 (inconsistent).'
                    ],
                    keyInsight: 'Set the pivot in the coefficient matrix to zero while leaving a non-zero augmented remainder.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Assuming homogeneous system Ax = 0 can have no solution.',
                    whyItHappens: 'Forgetting trivial zero solution.',
                    correction: 'Ax = 0 is ALWAYS consistent. It has either unique trivial solution (x=0) or infinitely many.'
                  }
                ],
                masterCheckCriteria: [
                  'I can reduce any 3x3 or 4x4 matrix to row echelon form',
                  'I know the exact rank criteria for unique, infinite, and zero solutions',
                  'I can compute LU decomposition using Doolittle\'s method',
                  'I can apply the Rank-Nullity theorem to determine null space dimensions',
                  'I understand why rank(AB) ≤ min(rank(A), rank(B))',
                  'I can find conditions for non-trivial solutions in homogeneous systems'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'math-la-b',
        subjectId: 'math-linear-algebra',
        azLetter: 'B',
        name: 'Eigenvalues & Eigenvectors',
        description: 'Characteristic equation, Cayley-Hamilton theorem, and properties of eigenvalues.',
        topics: [
          {
            id: 'la-t2',
            moduleId: 'math-la-b',
            subjectId: 'math-linear-algebra',
            name: 'Eigenvalues & Diagonalization',
            description: 'Characteristic polynomial, trace/determinant relations, symmetric matrix properties, and powers of matrices.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'la-l2',
                topicId: 'la-t2',
                moduleId: 'math-la-b',
                subjectId: 'math-linear-algebra',
                title: 'Eigenvalues, Eigenvectors & Cayley-Hamilton',
                durationMin: 45,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Extremely high yield: appears virtually every year in GATE CS.',
                  whatYouWillLearn: ['Characteristic equation det(A - λI) = 0', 'Trace and determinant eigenvalue shortcuts', 'Cayley-Hamilton theorem for matrix inverses and powers'],
                  prerequisites: ['Determinants of 2x2 and 3x3 matrices']
                },
                explanation: {
                  definition: 'Scalar λ is an eigenvalue of A if there exists a non-zero vector x such that Ax = λx.',
                  intuition: 'An eigenvector points in a direction along which the transformation purely stretches or shrinks space by factor λ without rotating.',
                  howItWorks: [
                    'Sum of eigenvalues = Trace(A) (sum of diagonal elements).',
                    'Product of eigenvalues = det(A).',
                    'Eigenvalues of A^k are λ_i^k.',
                    'Eigenvalues of A^-1 are 1/λ_i.',
                    'Real symmetric matrices always have strictly REAL eigenvalues.'
                  ],
                  keyTakeaway: 'Use Trace = ∑λ and Det = ∏λ to solve for unknown eigenvalues in seconds.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-eig-trace',
                    name: 'Trace & Determinant Shortcuts',
                    formula: '∑ λ_i = Trace(A)  and  ∏ λ_i = det(A)',
                    rule: 'Eliminates solving cubic polynomials in 90% of GATE eigenvalue questions.',
                    subjectCode: 'MATH-LA',
                    lessonId: 'la-l2',
                    lessonTitle: 'Eigenvalues, Eigenvectors & Cayley-Hamilton'
                  },
                  {
                    id: 'rule-ch-thm',
                    name: 'Cayley-Hamilton Theorem',
                    formula: 'Every square matrix satisfies its own characteristic equation: P(A) = 0',
                    rule: 'Multiply by A^-1 to compute matrix inverses algebraically.',
                    subjectCode: 'MATH-LA',
                    lessonId: 'la-l2',
                    lessonTitle: 'Eigenvalues, Eigenvectors & Cayley-Hamilton'
                  }
                ],
                examples: [
                  {
                    title: 'Finding Eigenvalues using Trace and Det',
                    problem: 'Find eigenvalues of A = [[1, 4], [2, 3]].',
                    solutionSteps: [
                      'Trace(A) = 1 + 3 = 4 ⇒ λ1 + λ2 = 4.',
                      'det(A) = (1)(3) - (4)(2) = 3 - 8 = -5 ⇒ λ1 * λ2 = -5.',
                      'Two numbers that sum to 4 and multiply to -5 are 5 and -1.',
                      'Eigenvalues are λ = 5, -1.'
                    ],
                    keyInsight: 'Avoid full expansion of det(A - λI) = 0 for 2x2 matrices; use sum and product directly.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Assuming eigenvectors corresponding to distinct eigenvalues are always orthogonal.',
                    whyItHappens: 'Confusing general square matrices with real symmetric matrices.',
                    correction: 'Orthogonality of eigenvectors for distinct eigenvalues only holds for symmetric/Hermitian matrices.'
                  }
                ],
                masterCheckCriteria: [
                  'I can verify eigenvalues in 15 seconds using Trace and Determinant checks',
                  'I can apply Cayley-Hamilton theorem to compute A^4 or A^-1',
                  'I know the eigenvalue properties of triangular, diagonal, and orthogonal matrices',
                  'I can find eigenvectors by solving (A - λI)x = 0',
                  'I understand algebraic vs geometric multiplicity',
                  'I can determine if a matrix is diagonalizable'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'math-calculus',
    code: 'MATH-CALC',
    name: 'Calculus',
    pillar: 'MATH',
    officialSection: 'Engineering Mathematics — Section 3',
    approxMarks: 2,
    description: 'Limits, continuity, differentiability, mean value theorems, maxima & minima, and integration.',
    modules: [
      {
        id: 'math-calc-a',
        subjectId: 'math-calculus',
        azLetter: 'A',
        name: 'Differential & Integral Calculus',
        description: 'L\'Hôpital\'s rule, Lagrange MVT, critical points, Taylor series, and definite integration.',
        topics: [
          {
            id: 'calc-t1',
            moduleId: 'math-calc-a',
            subjectId: 'math-calculus',
            name: 'Limits, Maxima-Minima & Theorems',
            description: 'Limit evaluation, Rolle\'s theorem, MVT, first & second derivative tests, and definite integrals.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'calc-l1',
                topicId: 'calc-t1',
                moduleId: 'math-calc-a',
                subjectId: 'math-calculus',
                title: 'Limits, L\'Hôpital & Maxima-Minima',
                durationMin: 40,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Fundamental for algorithm complexity bounds and continuous optimization.',
                  whatYouWillLearn: ['Indeterminate forms (0/0, ∞/∞, 1^∞)', 'L\'Hôpital\'s rule application', 'Second derivative test for local extrema'],
                  prerequisites: ['Standard derivatives and continuity']
                },
                explanation: {
                  definition: 'Limits describe behavior of a function near a point; extrema identify optimal values.',
                  intuition: 'L\'Hôpital compares relative growth rates of numerator and denominator tangent slopes.',
                  howItWorks: [
                    'If lim f(x)/g(x) yields 0/0 or ∞/∞, lim f(x)/g(x) = lim f\'(x)/g\'(x).',
                    'For 1^∞ forms: lim [f(x)]^g(x) = exp( lim g(x) * (f(x) - 1) ).',
                    'Lagrange MVT: If f is continuous on [a, b] and differentiable on (a, b), ∃ c ∈ (a, b) such that f\'(c) = (f(b) - f(a)) / (b - a).'
                  ],
                  keyTakeaway: 'Always verify that the indeterminate form 0/0 or ∞/∞ holds before differentiating with L\'Hôpital.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-one-power-inf',
                    name: '1^∞ Form Shortcut',
                    formula: 'lim_{x→a} [f(x)]^g(x) = e^{ lim_{x→a} g(x)(f(x) - 1) }',
                    rule: 'Valid when lim f(x) = 1 and lim g(x) = ∞.',
                    subjectCode: 'MATH-CALC',
                    lessonId: 'calc-l1',
                    lessonTitle: 'Limits, L\'Hôpital & Maxima-Minima'
                  }
                ],
                examples: [
                  {
                    title: 'Evaluating 1^∞ Form',
                    problem: 'Find lim_{x→0} (1 + 2x)^(1/x).',
                    solutionSteps: [
                      'As x → 0, (1 + 2x) → 1 and 1/x → ∞ (1^∞ form).',
                      'Apply rule: exp( lim_{x→0} (1/x) * ((1 + 2x) - 1) ).',
                      '= exp( lim_{x→0} (1/x) * 2x ) = exp(2) = e^2.'
                    ],
                    keyInsight: 'Using the exponential formula avoids messy logarithmic expansions.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Applying L\'Hôpital\'s rule when limit is NOT 0/0 or ∞/∞.',
                    whyItHappens: 'Habitual reflex without checking initial form.',
                    correction: 'Substitute x = a first. If f(a)/g(a) is finite and defined, that IS the limit.'
                  }
                ],
                masterCheckCriteria: [
                  'I verify 0/0 or ∞/∞ before ever taking derivatives for L\'Hôpital',
                  'I can solve 1^∞, 0^0, and ∞^0 limits effortlessly using exponential transforms',
                  'I can find points satisfying Lagrange and Rolle\'s Mean Value Theorems',
                  'I can find saddle points, maxima, and minima using partial derivatives for multivariable functions',
                  'I understand properties of definite integrals (odd/even functions, symmetry)',
                  'I can test differentiability using left-hand and right-hand derivative limits'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'math-prob-stats',
    code: 'MATH-PROB',
    name: 'Probability & Statistics',
    pillar: 'MATH',
    officialSection: 'Engineering Mathematics — Section 4',
    approxMarks: 3,
    description: 'Sample space, conditional probability, Bayes theorem, random variables, PMF, PDF, CDF, distributions, and statistics.',
    modules: [
      {
        id: 'math-prob-a',
        subjectId: 'math-prob-stats',
        azLetter: 'A',
        name: 'Probability & Bayes Theorem',
        description: 'Conditional probability, independence, law of total probability, and Bayes rule.',
        topics: [
          {
            id: 'prob-t1',
            moduleId: 'math-prob-a',
            subjectId: 'math-prob-stats',
            name: 'Conditional Probability & Bayes',
            description: 'Multiplication rule, pairwise vs mutual independence, and posterior probability updating.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'prob-l1',
                topicId: 'prob-t1',
                moduleId: 'math-prob-a',
                subjectId: 'math-prob-stats',
                title: 'Conditional Probability, Total Probability & Bayes',
                durationMin: 45,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Critical in machine learning, randomized algorithms, and standard GATE probability questions.',
                  whatYouWillLearn: ['P(A|B) definition and conditioning', 'Law of Total Probability partitioning', 'Bayes rule inversion of cause and effect'],
                  prerequisites: ['Set operations and sample spaces']
                },
                explanation: {
                  definition: 'Bayes theorem computes posterior probability of a cause given observed evidence.',
                  intuition: 'Observed evidence shrinks the sample space from the universe S down to event B; find how much of A lies inside B.',
                  howItWorks: [
                    'P(A|B) = P(A ∩ B) / P(B).',
                    'Total Probability: P(B) = ∑ P(B|A_i) P(A_i) for mutually exclusive and exhaustive partitions A_i.',
                    'Bayes: P(A_k | B) = [ P(B | A_k) P(A_k) ] / [ ∑ P(B | A_i) P(A_i) ].'
                  ],
                  keyTakeaway: 'Always construct a probability tree to visualize prior partitions and conditioned branches.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-bayes',
                    name: 'Bayes Theorem',
                    formula: 'P(A_i | B) = [ P(B | A_i) P(A_i) ] / P(B)',
                    rule: 'Calculates posterior probability given prior beliefs and conditional likelihoods.',
                    subjectCode: 'MATH-PROB',
                    lessonId: 'prob-l1',
                    lessonTitle: 'Conditional Probability, Total Probability & Bayes'
                  }
                ],
                examples: [
                  {
                    title: 'Medical Diagnostic Test Probability',
                    problem: 'Disease prevalence is 0.1%. A test is 99% accurate (true positive = 0.99, false positive = 0.05). If a person tests positive, what is the probability they actually have the disease?',
                    solutionSteps: [
                      'P(D) = 0.001, P(¬D) = 0.999.',
                      'P(+|D) = 0.99, P(+|¬D) = 0.05.',
                      'P(+) = P(+|D)P(D) + P(+|¬D)P(¬D) = (0.99)(0.001) + (0.05)(0.999) = 0.00099 + 0.04995 = 0.05094.',
                      'P(D|+) = [0.00099] / [0.05094] ≈ 0.0194 (around 1.94%!).'
                    ],
                    keyInsight: 'When disease prevalence is very low, false positives easily swamp true positives (base rate fallacy).'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Confusing P(A|B) with P(B|A).',
                    whyItHappens: 'Misinterpreting what has been given as observed evidence.',
                    correction: 'The condition (what is already known) is always in the denominator.'
                  }
                ],
                masterCheckCriteria: [
                  'I can distinguish independent events from mutually exclusive events',
                  'I can apply the Law of Total Probability using partitioned tree diagrams',
                  'I can set up Bayes theorem calculations without confusing prior and posterior terms',
                  'I know the variance and expectation definitions for discrete and continuous random variables',
                  'I know memoryless properties of Exponential and Geometric distributions',
                  'I can compute Poisson and Normal distribution parameters (mean = λ, var = λ for Poisson)'
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
