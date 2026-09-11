import { Subject, Lesson, Topic, Module } from '../../types';

export const generalAptitudeSubjects: Subject[] = [
  {
    id: 'ga-verbal',
    code: 'GA-VERBAL',
    name: 'Verbal Ability',
    pillar: 'GA',
    officialSection: 'General Aptitude — Section 1',
    approxMarks: 4,
    description: 'English grammar, vocabulary, sentence completion, reading comprehension, and verbal reasoning.',
    modules: [
      {
        id: 'ga-verbal-a',
        subjectId: 'ga-verbal',
        azLetter: 'A',
        name: 'Basic English & Parts of Speech',
        description: 'Fundamental word classes and sentence components.',
        topics: [
          {
            id: 'ga-v-t1',
            moduleId: 'ga-verbal-a',
            subjectId: 'ga-verbal',
            name: 'Parts of Speech',
            description: 'Nouns, pronouns, verbs, adjectives, adverbs, conjunctions, prepositions, and articles.',
            difficulty: 'Foundation',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'ga-v-l1',
                topicId: 'ga-v-t1',
                moduleId: 'ga-verbal-a',
                subjectId: 'ga-verbal',
                title: 'Nouns, Pronouns & Articles',
                durationMin: 35,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Grammatical accuracy is tested directly in sentence correction and cloze tests.',
                  whatYouWillLearn: ['Countable vs uncountable nouns', 'Pronoun-antecedent agreement', 'Definite and indefinite article rules'],
                  prerequisites: ['Basic sentence reading']
                },
                explanation: {
                  definition: 'Rules governing nominal elements and their determiners in formal English.',
                  intuition: 'Articles specify uniqueness or generalization; pronouns must mirror their antecedents in number and gender without ambiguity.',
                  howItWorks: [
                    'Use "a/an" for singular non-specific count nouns; "the" when noun is uniquely identifiable.',
                    'Uncountable nouns (information, advice, furniture) never take plural suffixes or indefinite articles.',
                    'Relative pronouns (who vs whom, which vs that) define clause boundaries.'
                  ],
                  keyTakeaway: 'Always verify whether a noun is countable before inserting articles or quantifiers like many vs much.'
                },
                conceptMap: {
                  title: 'Noun & Pronoun Framework',
                  nodes: [
                    { id: '1', label: 'Noun Class', sub: 'Countable / Uncountable' },
                    { id: '2', label: 'Determiner / Article', sub: 'A / An / The / Zero' },
                    { id: '3', label: 'Pronoun Agreement', sub: 'Number & Case Match' }
                  ],
                  connections: [
                    { from: '1', to: '2', label: 'determines' },
                    { from: '1', to: '3', label: 'antecedent for' }
                  ],
                  asciiDiagram: '[Noun Class] ──(determines)──> [Article/Determiner]\n      │\n      └──(antecedent)──> [Pronoun Case & Number]'
                },
                formulasAndRules: [
                  {
                    id: 'rule-art-1',
                    name: 'Vowel Sound Rule',
                    formula: 'An + [vowel sound] (e.g. an honest man, a European country)',
                    rule: 'Article "an" depends on the phonetic initial vowel sound, not the orthographic letter.',
                    condition: 'Single countable nouns',
                    subjectCode: 'GA-VERBAL',
                    lessonId: 'ga-v-l1',
                    lessonTitle: 'Nouns, Pronouns & Articles'
                  }
                ],
                examples: [
                  {
                    title: 'Pronoun-Antecedent Case',
                    problem: 'Identify the error: "Each of the researchers must submit their own findings."',
                    solutionSteps: [
                      '"Each" is grammatically singular.',
                      'Using plural "their" violates formal concord in strict tests.',
                      'Correction: "Each of the researchers must submit his or her own findings" or "All researchers must submit their..."'
                    ],
                    keyInsight: 'Indefinite pronouns (each, either, neither, everyone) are singular.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Treating "data", "criteria", "phenomena" as singular.',
                    whyItHappens: 'Colloquial usage often blurs Latin/Greek plurals.',
                    correction: '"Criteria" is plural (singular: criterion); "phenomena" is plural (singular: phenomenon).'
                  }
                ],
                masterCheckCriteria: [
                  'I can explain pronoun-antecedent agreement rules without hesitation',
                  'I can differentiate countable and uncountable noun qualifiers (few vs less, many vs much)',
                  'I can solve standard sentence correction problems involving articles',
                  'I can correctly select who vs whom in complex embedded clauses',
                  'I can identify collective noun subject-verb traps',
                  'I can recall the standard rules for indefinite pronoun agreement'
                ]
              },
              {
                id: 'ga-v-l2',
                topicId: 'ga-v-t1',
                moduleId: 'ga-verbal-a',
                subjectId: 'ga-verbal',
                title: 'Prepositions & Conjunctions',
                durationMin: 30,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Fixed prepositions and correlative conjunctions account for high-frequency fill-in-the-blanks.',
                  whatYouWillLearn: ['Fixed prepositions', 'Correlative conjunction parallelism', 'Subordinating vs coordinating conjunctions'],
                  prerequisites: ['Basic parts of speech']
                },
                explanation: {
                  definition: 'Prepositions establish spatial/temporal/logical relations; conjunctions link syntactic units.',
                  intuition: 'Correlative pairs act as structural balances; what follows the first element must match the second.',
                  howItWorks: [
                    'Correlative pairs: Neither...nor, Either...or, Not only...but also.',
                    'Idiomatic prepositions: comply with, adhere to, abstain from, identical with/to.'
                  ],
                  keyTakeaway: 'Ensure structural parallelism immediately after each correlative connector.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-conj-1',
                    name: 'Parallel Structure with Correlatives',
                    formula: 'Not only [X] but also [Y] where syntactic_type(X) == syntactic_type(Y)',
                    rule: 'Both joined elements must have identical grammatical form.',
                    subjectCode: 'GA-VERBAL',
                    lessonId: 'ga-v-l2',
                    lessonTitle: 'Prepositions & Conjunctions'
                  }
                ],
                examples: [
                  {
                    title: 'Parallelism Correction',
                    problem: 'Correct: "He not only likes programming but also to play chess."',
                    solutionSteps: [
                      'First element after "not only" is finite verb "likes".',
                      'Second element after "but also" is infinitive "to play".',
                      'Correct: "He likes not only programming but also playing chess."'
                    ],
                    keyInsight: 'Move the common verb outside the correlative pair.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Using "different than" instead of "different from".',
                    whyItHappens: 'Influence of colloquial speech.',
                    correction: 'In standard formal GATE English, use "different from".'
                  }
                ],
                masterCheckCriteria: [
                  'I can spot correlative conjunction parallelism flaws instantly',
                  'I know standard fixed prepositions for high-frequency verbs',
                  'I can solve preposition fill-in-the-blank questions accurately',
                  'I understand the difference between although and despite',
                  'I can distinguish coordinating from subordinating conjunctions',
                  'I avoid dangling modifier errors connected by prepositions'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ga-verbal-b',
        subjectId: 'ga-verbal',
        azLetter: 'B',
        name: 'Grammar & Sentence Mechanics',
        description: 'Subject-verb agreement, tenses, voice, clauses, and modifiers.',
        topics: [
          {
            id: 'ga-v-t2',
            moduleId: 'ga-verbal-b',
            subjectId: 'ga-verbal',
            name: 'Subject-Verb Agreement & Modifiers',
            description: 'Core agreement principles, misplaced modifiers, and dangling participles.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'ga-v-l3',
                topicId: 'ga-v-t2',
                moduleId: 'ga-verbal-b',
                subjectId: 'ga-verbal',
                title: 'Subject-Verb Agreement Principles',
                durationMin: 35,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Foundational grammar rule tested in almost every GATE paper.',
                  whatYouWillLearn: ['Intervening prepositional phrases', 'Compound subjects with and / or', 'Inverted sentences'],
                  prerequisites: ['Nouns and verbs identification']
                },
                explanation: {
                  definition: 'A verb must agree with its true grammatical subject in number and person, regardless of intervening phrases.',
                  intuition: 'Ignore everything between the subject and the verb inside commas or prepositional phrases.',
                  howItWorks: [
                    'Ignore parenthetical clauses (along with, as well as, accompanied by).',
                    'In "Neither A nor B", the verb agrees with B (proximity rule).',
                    '"The number of" takes a singular verb; "A number of" takes a plural verb.'
                  ],
                  keyTakeaway: 'Locate the root subject before checking verb agreement.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-sva-1',
                    name: 'The Number of vs A Number of',
                    formula: '"The number of" → Singular Verb | "A number of" → Plural Verb',
                    rule: '"The number" refers to the statistic (singular); "A number" functions as a quantifier meaning several (plural).',
                    subjectCode: 'GA-VERBAL',
                    lessonId: 'ga-v-l3',
                    lessonTitle: 'Subject-Verb Agreement Principles'
                  }
                ],
                examples: [
                  {
                    title: 'Intervening Phrase Concord',
                    problem: 'Find error: "The quality of these products are below standard."',
                    solutionSteps: [
                      'Subject is "The quality" (singular), not "products" (prepositional object).',
                      'Verb must be "is", not "are".',
                      'Correction: "The quality of these products is below standard."'
                    ],
                    keyInsight: 'Objects of prepositions cannot be the subject of the clause.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Matching verb with closest noun instead of true subject.',
                    whyItHappens: 'Proximity illusion.',
                    correction: 'Bracket off prepositional phrases mentally before matching verb.'
                  }
                ],
                masterCheckCriteria: [
                  'I can identify the true subject despite complex intervening phrases',
                  'I recall the proximity rule for or/nor structures',
                  'I know the rules for "the number of" vs "a number of"',
                  'I can identify and fix dangling participle modifiers',
                  'I can solve GATE sentence correction questions on subject-verb concord',
                  'I can explain inverted sentence subject agreement'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ga-verbal-c',
        subjectId: 'ga-verbal',
        azLetter: 'C',
        name: 'Reading Comprehension & Critical Reasoning',
        description: 'Passage analysis, inference, author tone, and logical deductions.',
        topics: [
          {
            id: 'ga-v-t3',
            moduleId: 'ga-verbal-c',
            subjectId: 'ga-verbal',
            name: 'Passage Analysis & Inference',
            description: 'Main ideas, direct inferences, identifying assumptions, and author intent.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'ga-v-l4',
                topicId: 'ga-v-t3',
                moduleId: 'ga-verbal-c',
                subjectId: 'ga-verbal',
                title: 'Inference & Argument Structure',
                durationMin: 40,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Reading comprehension and critical inference test analytical reading under time pressure.',
                  whatYouWillLearn: ['Premise vs Conclusion vs Assumption', 'Valid inference vs extrapolation', 'Tone identification'],
                  prerequisites: ['Basic critical reading']
                },
                explanation: {
                  definition: 'An inference is an unstated truth that must follow necessarily from the given premises without external speculation.',
                  intuition: 'Never assume outside knowledge; stick strictly to what the passage mandates.',
                  howItWorks: [
                    'Premises + Unstated Assumptions = Conclusion.',
                    'Negation Test: If negating an assumption destroys the argument, it is necessary.',
                    'Avoid extreme answer choices containing "always", "never", "only" unless explicitly supported.'
                  ],
                  keyTakeaway: 'A valid inference cannot be false if the text is true.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-inf-1',
                    name: 'Assumption Negation Test',
                    formula: 'Negate(A) ⇒ Argument Breaks down ∴ A is a necessary assumption',
                    rule: 'A necessary assumption must hold for the conclusion to stand.',
                    subjectCode: 'GA-VERBAL',
                    lessonId: 'ga-v-l4',
                    lessonTitle: 'Inference & Argument Structure'
                  }
                ],
                examples: [
                  {
                    title: 'Spotting Necessary Inferences',
                    problem: 'Passage: All surveyed engineers who passed the exam attended all review sessions. Some attendees were freshmen. Conclusion: Some freshmen passed.',
                    solutionSteps: [
                      'Premise 1: Passed → Attended.',
                      'Premise 2: Some Attendees are Freshmen.',
                      'Does it follow that Some Freshmen passed? No, because attending is a necessary condition to pass, not sufficient.',
                      'Valid inference: Attendees who did not attend certainly did not pass.'
                    ],
                    keyInsight: 'Distinguish necessary conditions from sufficient conditions.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Selecting plausible real-world facts that are not stated in the passage.',
                    whyItHappens: 'Injecting prior knowledge.',
                    correction: 'Strictly evaluate based on passage boundaries.'
                  }
                ],
                masterCheckCriteria: [
                  'I can separate premise from conclusion in an argument',
                  'I can apply the assumption negation test accurately',
                  'I avoid falling into extreme word traps (all/never)',
                  'I can determine author tone (objective, skeptical, critical, neutral)',
                  'I can answer RC questions within 2.5 minutes',
                  'I can identify circular reasoning and flawed logic'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ga-quant',
    code: 'GA-QUANT',
    name: 'Quantitative Aptitude',
    pillar: 'GA',
    officialSection: 'General Aptitude — Section 2',
    approxMarks: 5,
    description: 'Numbers, percentages, ratios, time & work, speed & distance, algebra, and data interpretation.',
    modules: [
      {
        id: 'ga-quant-a',
        subjectId: 'ga-quant',
        azLetter: 'A',
        name: 'Numbers & Elementary Arithmetic',
        description: 'Integers, divisibility, factors, remainders, LCM, HCF, and percentages.',
        topics: [
          {
            id: 'ga-q-t1',
            moduleId: 'ga-quant-a',
            subjectId: 'ga-quant',
            name: 'Number Properties & Remainders',
            description: 'Divisibility rules, modular remainders, prime factorization, and LCM/HCF.',
            difficulty: 'Foundation',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'ga-q-l1',
                topicId: 'ga-q-t1',
                moduleId: 'ga-quant-a',
                subjectId: 'ga-quant',
                title: 'Divisibility, Factors & Modular Remainders',
                durationMin: 40,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Essential for discrete math and CS arithmetic as well as GA quantitative problems.',
                  whatYouWillLearn: ['Divisibility checks', 'Unit digits of powers (cyclicity)', 'Remainder theorems and Euler totient'],
                  prerequisites: ['Basic arithmetic']
                },
                explanation: {
                  definition: 'Properties of integers under division and modular arithmetic.',
                  intuition: 'Remainders repeat periodically; find the cyclicity period to compute massive powers modulo n.',
                  howItWorks: [
                    'LCM(a, b) × HCF(a, b) = a × b for two positive integers.',
                    'Unit digits of powers have cyclicity of at most 4.',
                    'Remainder of (a × b) mod m = ((a mod m) × (b mod m)) mod m.'
                  ],
                  keyTakeaway: 'Always break large numbers into prime factors to evaluate divisors and remainders.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-lcm-1',
                    name: 'LCM × HCF Product Property',
                    formula: 'LCM(a, b) × HCF(a, b) = a × b',
                    rule: 'Holds strictly for pairs of two positive integers.',
                    subjectCode: 'GA-QUANT',
                    lessonId: 'ga-q-l1',
                    lessonTitle: 'Divisibility, Factors & Modular Remainders'
                  },
                  {
                    id: 'rule-num-factors',
                    name: 'Number of Factors',
                    formula: 'If N = p1^a * p2^b * p3^c, total factors = (a+1)(b+1)(c+1)',
                    rule: 'Calculated from canonical prime factorization.',
                    subjectCode: 'GA-QUANT',
                    lessonId: 'ga-q-l1',
                    lessonTitle: 'Divisibility, Factors & Modular Remainders'
                  }
                ],
                examples: [
                  {
                    title: 'Unit Digit of Large Power',
                    problem: 'Find the unit digit of 7^95 - 3^58.',
                    solutionSteps: [
                      'Cyclicity of 7 is 4: 7^1=7, 7^2=9, 7^3=3, 7^4=1.',
                      '95 mod 4 = 3, so unit digit of 7^95 is 3.',
                      'Cyclicity of 3 is 4: 3^1=3, 3^2=9, 3^3=7, 3^4=1.',
                      '58 mod 4 = 2, so unit digit of 3^58 is 9.',
                      'Difference: (..3) - (..9) → Borrow 10 → 13 - 9 = 4.'
                    ],
                    keyInsight: 'When subtracting unit digits and minuend < subtrahend, borrow 10.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Applying LCM(a,b,c) × HCF(a,b,c) = a × b × c.',
                    whyItHappens: 'False generalization from two numbers to three.',
                    correction: 'The product formula only holds for 2 integers, not 3 or more.'
                  }
                ],
                masterCheckCriteria: [
                  'I can determine prime factor counts and sum of factors systematically',
                  'I can find unit digits using power cyclicity modulo 4',
                  'I can solve remainder problems using modular reduction',
                  'I understand the Euclidean algorithm for GCD',
                  'I can solve word problems involving highest common factor and least common multiple',
                  'I can apply Fermat’s Little Theorem for prime modulo remainders'
                ]
              }
            ]
          },
          {
            id: 'ga-q-t2',
            moduleId: 'ga-quant-a',
            subjectId: 'ga-quant',
            name: 'Percentages, Ratios & Profit-Loss',
            description: 'Successive percentage changes, proportionality, profit margins, and discounts.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'ga-q-l2',
                topicId: 'ga-q-t2',
                moduleId: 'ga-quant-a',
                subjectId: 'ga-quant',
                title: 'Successive Percentages & Proportions',
                durationMin: 35,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Forms the core of arithmetic and Data Interpretation questions.',
                  whatYouWillLearn: ['Successive percentage formula', 'Multiplicative factors', 'Direct and inverse proportion scaling'],
                  prerequisites: ['Basic fractions and percentages']
                },
                explanation: {
                  definition: 'Relative change calculations and invariant ratios.',
                  intuition: 'Think in terms of multiplying factors: a 20% increase is ×1.20, a 20% decrease is ×0.80.',
                  howItWorks: [
                    'Two successive changes a% and b% yield effective change: a + b + (ab/100)%.',
                    'If quantity A is inversely proportional to B, A1 × B1 = A2 × B2.',
                    'Profit % is always calculated on Cost Price unless specified otherwise.'
                  ],
                  keyTakeaway: 'Always use fractional multiplier representations (e.g., 1/6 for 16.67%) for speed.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-pct-1',
                    name: 'Successive Percentage Formula',
                    formula: 'Effective % = a + b + (a * b) / 100',
                    rule: 'Use positive for increases, negative for decreases.',
                    subjectCode: 'GA-QUANT',
                    lessonId: 'ga-q-l2',
                    lessonTitle: 'Successive Percentages & Proportions'
                  }
                ],
                examples: [
                  {
                    title: 'Price and Consumption Invariance',
                    problem: 'If the price of petrol increases by 25%, by what percentage must consumption be reduced to keep total expenditure constant?',
                    solutionSteps: [
                      'Expenditure = Price × Consumption.',
                      'New Price = 1.25 × P = (5/4)P.',
                      'To keep product constant, New Consumption must be (4/5)C.',
                      'Reduction = 1 - 4/5 = 1/5 = 20%.'
                    ],
                    keyInsight: 'If P increases by x/(y), consumption must decrease by x/(y+x).'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Thinking an x% increase followed by x% decrease returns to original.',
                    whyItHappens: 'Ignoring change of base.',
                    correction: 'Result is always a net decrease of (x^2 / 100)%.'
                  }
                ],
                masterCheckCriteria: [
                  'I convert percentages to fractions instantaneously',
                  'I can apply the successive percentage formula with positive/negative signs',
                  'I can solve inverse proportion invariance problems in under 60 seconds',
                  'I compute marked price, discount, and profit percentage on cost price without confusion',
                  'I can interpret complex multi-column percentage tables in Data Interpretation',
                  'I can calculate weighted averages and mixtures using allegation'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ga-quant-b',
        subjectId: 'ga-quant',
        azLetter: 'B',
        name: 'Time, Work & Motion',
        description: 'Work rates, pipe-cistern, relative velocity, trains, and average speed.',
        topics: [
          {
            id: 'ga-q-t3',
            moduleId: 'ga-quant-b',
            subjectId: 'ga-quant',
            name: 'Work Rates & Relative Motion',
            description: 'Combined work, efficiency ratios, relative speed, and kinematic word problems.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'ga-q-l3',
                topicId: 'ga-q-t3',
                moduleId: 'ga-quant-b',
                subjectId: 'ga-quant',
                title: 'Time & Work, Pipes and Cisterns',
                durationMin: 35,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'High-probability question type in almost all GATE sets.',
                  whatYouWillLearn: ['Total work as LCM of individual times', 'Negative work (leakage)', 'Work done in alternation'],
                  prerequisites: ['LCM and fractional arithmetic']
                },
                explanation: {
                  definition: 'Models rate of progress where Work = Rate × Time.',
                  intuition: 'Assume total work is the LCM of given days to deal strictly with clean integer units instead of fractions.',
                  howItWorks: [
                    'If A takes x days and B takes y days, Total Work = LCM(x, y) units.',
                    'Rate_A = Work / x, Rate_B = Work / y.',
                    'Combined Time = Work / (Rate_A + Rate_B).'
                  ],
                  keyTakeaway: 'Work with integer efficiency units instead of adding fractions.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-tw-1',
                    name: 'Harmonic Work Rate',
                    formula: 'Time_combined = (x * y) / (x + y)',
                    rule: 'For two independent workers doing the identical task.',
                    subjectCode: 'GA-QUANT',
                    lessonId: 'ga-q-l3',
                    lessonTitle: 'Time & Work, Pipes and Cisterns'
                  }
                ],
                examples: [
                  {
                    title: 'Alternating Work Days',
                    problem: 'A completes a job in 12 days, B in 18 days. Working alternately starting with A, how many days will it take?',
                    solutionSteps: [
                      'Total work = LCM(12, 18) = 36 units.',
                      'Efficiency: A = 3 units/day, B = 2 units/day.',
                      'In 1 cycle (2 days), work done = 3 + 2 = 5 units.',
                      '7 cycles (14 days) = 35 units done. Remaining = 1 unit.',
                      'Day 15 is A\'s turn: takes 1/3 day. Total time = 14 + 1/3 = 14.33 days.'
                    ],
                    keyInsight: 'Always calculate full integer cycles first before evaluating the remainder day.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Averaging speeds directly for round trips: (v1 + v2)/2.',
                    whyItHappens: 'Confusing arithmetic mean with harmonic mean.',
                    correction: 'Average speed for equal distances is the harmonic mean: 2*v1*v2 / (v1 + v2).'
                  }
                ],
                masterCheckCriteria: [
                  'I use the LCM method to avoid fractional work calculations',
                  'I can handle negative efficiency (drain pipes) accurately',
                  'I calculate relative speeds for same and opposite directions correctly',
                  'I know how to solve train-platform crossing length problems',
                  'I never use simple average for speed over equal distances',
                  'I can solve alternating worker timeline problems'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ga-analytical',
    code: 'GA-ANALYTICAL',
    name: 'Analytical Aptitude',
    pillar: 'GA',
    officialSection: 'General Aptitude — Section 3',
    approxMarks: 3,
    description: 'Statements, assumptions, seating arrangements, sequencing, grouping, puzzles, and data sufficiency.',
    modules: [
      {
        id: 'ga-analytical-a',
        subjectId: 'ga-analytical',
        azLetter: 'A',
        name: 'Deductive Logic & Seating Arrangements',
        description: 'Linear and circular ordering, constraint satisfaction, and logical elimination.',
        topics: [
          {
            id: 'ga-a-t1',
            moduleId: 'ga-analytical-a',
            subjectId: 'ga-analytical',
            name: 'Arrangements, Sequencing & Puzzles',
            description: 'Linear arrangements, circular table constraints, relative positions, and grid deduction.',
            difficulty: 'Core',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'ga-a-l1',
                topicId: 'ga-a-t1',
                moduleId: 'ga-analytical-a',
                subjectId: 'ga-analytical',
                title: 'Linear & Circular Arrangement Strategies',
                durationMin: 35,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Consistent appearance in multi-mark GA questions requiring precise constraint elimination.',
                  whatYouWillLearn: ['Facing center vs outwards in circles', 'Definite vs conditional clues', 'Tree branching for multiple cases'],
                  prerequisites: ['Basic logical reasoning']
                },
                explanation: {
                  definition: 'Arranging elements according to a set of spatial or temporal constraints.',
                  intuition: 'Always start with the most restrictive definite clue to anchor the layout, then overlay conditional clues.',
                  howItWorks: [
                    'In circular arrangements facing center, clockwise is left, anti-clockwise is right.',
                    'Create parallel candidate slots when an ambiguity arises; eliminate branches upon contradictions.',
                    'Never place an element unless its relative position is verified.'
                  ],
                  keyTakeaway: 'Anchor definite positions first; branch parallel possibilities cleanly without scribbling.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-circ-1',
                    name: 'Circular Facing Direction Rule',
                    formula: 'Facing center: Clockwise = LEFT, Counter-clockwise = RIGHT',
                    rule: 'Inverted when facing outward from center.',
                    subjectCode: 'GA-ANALYTICAL',
                    lessonId: 'ga-a-l1',
                    lessonTitle: 'Linear & Circular Arrangement Strategies'
                  }
                ],
                examples: [
                  {
                    title: 'Six-Person Circular Seating',
                    problem: '6 people A, B, C, D, E, F sit in a circle facing center. A is opposite D. B is immediately left of A. C is between D and E. Where is F?',
                    solutionSteps: [
                      'Anchor: Place A at bottom (pos 6), D at top (pos 3) opposite A.',
                      'B is immediate left of A (clockwise from A) → pos 5.',
                      'C is between D (pos 3) and E. If C is pos 2, E must be pos 1.',
                      'Remaining position is pos 4, which must be occupied by F.',
                      'F is opposite E and immediate right of D.'
                    ],
                    keyInsight: 'Drawing a clock face numbered 1 to 6 simplifies relative coordinate references.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Confusing left and right when facing opposite directions.',
                    whyItHappens: 'Looking from the reader perspective rather than the seat\'s perspective.',
                    correction: 'Mentally rotate yourself to face into the circle.'
                  }
                ],
                masterCheckCriteria: [
                  'I anchor arrangements with the most restrictive clue',
                  'I correctly translate clockwise/counter-clockwise to left/right for inward/outward seating',
                  'I can solve Data Sufficiency questions without computing final numerical answers',
                  'I branch parallel constraint scenarios systematically',
                  'I can solve complex multi-attribute grid puzzles',
                  'I identify tautological vs informative conditions in sufficiency problems'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ga-spatial',
    code: 'GA-SPATIAL',
    name: 'Spatial Aptitude',
    pillar: 'GA',
    officialSection: 'General Aptitude — Section 4',
    approxMarks: 3,
    description: '2D & 3D visualization, rotation, reflection, paper folding, assembly, and pattern grouping.',
    modules: [
      {
        id: 'ga-spatial-a',
        subjectId: 'ga-spatial',
        azLetter: 'A',
        name: 'Spatial Transformations & Geometry',
        description: 'Rotational invariance, mirror symmetries, cube unfolding, and cross-sections.',
        topics: [
          {
            id: 'ga-s-t1',
            moduleId: 'ga-spatial-a',
            subjectId: 'ga-spatial',
            name: '2D/3D Rotations & Paper Folding',
            description: 'Orthogonal projections, paper unfolding punch patterns, and dice opposite faces.',
            difficulty: 'Foundation',
            official: true,
            supporting: false,
            lessons: [
              {
                id: 'ga-s-l1',
                topicId: 'ga-s-t1',
                moduleId: 'ga-spatial-a',
                subjectId: 'ga-spatial',
                title: '3D Cube Nets & Paper Folding Mechanics',
                durationMin: 30,
                official: true,
                supporting: false,
                overview: {
                  whyItMatters: 'Spatial questions are standard 1 or 2-mark scoring opportunities with zero ambiguity.',
                  whatYouWillLearn: ['Opposite face rules in cube nets', 'Reflection axes in paper folding', 'Rotational invariants'],
                  prerequisites: ['Basic spatial orientation']
                },
                explanation: {
                  definition: 'Mental transformation of 2D cross-sections, unfolds, and 3D rigid body rotations.',
                  intuition: 'In any standard cube net, alternate faces in a straight line are opposite to each other.',
                  howItWorks: [
                    'Cube Net Rule: Faces separated by one face in a row/column are opposite.',
                    'Opposite faces can NEVER be adjacent in the assembled 3D cube.',
                    'Paper unfolding: Reflect punched holes across the fold crease line successively in reverse order.'
                  ],
                  keyTakeaway: 'Eliminate options containing opposite faces placed adjacent to each other.'
                },
                formulasAndRules: [
                  {
                    id: 'rule-cube-1',
                    name: 'Cube Net Opposites Rule',
                    formula: 'Face(i) and Face(i+2) in a straight strip are opposite',
                    rule: 'Two opposite faces cannot touch along any edge or vertex in the folded 3D state.',
                    subjectCode: 'GA-SPATIAL',
                    lessonId: 'ga-s-l1',
                    lessonTitle: '3D Cube Nets & Paper Folding Mechanics'
                  }
                ],
                examples: [
                  {
                    title: 'Identifying Impossible Folded Dice',
                    problem: 'Given a linear net where face 1 is separated from face 3 by face 2, can faces 1 and 3 share an edge in the 3D cube?',
                    solutionSteps: [
                      '1 and 3 are in the same strip separated by 2.',
                      'By the cube net rule, 1 and 3 are parallel opposite faces.',
                      'Opposite faces never touch or share an edge.',
                      'Therefore, any cube showing both 1 and 3 simultaneously is invalid.'
                    ],
                    keyInsight: 'Opposite faces can never appear concurrently on any three visible faces of a cube.'
                  }
                ],
                commonMistakes: [
                  {
                    pitfall: 'Failing to reverse fold order when unfolding paper punches.',
                    whyItHappens: 'Tracing from first fold to last instead of backwards.',
                    correction: 'Unfold in exact reverse order (last fold is first unfolded).'
                  }
                ],
                masterCheckCriteria: [
                  'I can identify opposite face pairs in any 6-square cube net instantly',
                  'I use opposite face elimination to discard wrong 3D views in under 20 seconds',
                  'I can mentally reflect asymmetrical figures across diagonal fold lines',
                  'I can recognize identical rotated 2D silhouettes without orientation confusion',
                  'I can determine count of cubes in assembled isometric blocks',
                  'I understand chirality and mirror invariance'
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
