import type { CatSubject } from './types';
import { M, S, T } from './builder';

/** GATE DA (Data Science & AI). General Aptitude is shared and added in index.ts. */
export const DA_SUBJECTS: CatSubject[] = [
  S('da-prob', 'Probability & Statistics', '14–18', 'The biggest maths block in DA. Distributions and hypothesis testing are core.', [
    M('A', 'Probability', [
      T('Counting, axioms of probability and sample spaces', 'E'),
      T('Conditional probability, independence and Bayes theorem', 'M'),
      T('Random variables, PMF, PDF and CDF', 'M'),
      T('Expectation, variance, covariance and correlation', 'M'),
      T('Discrete distributions: Bernoulli, binomial, Poisson, geometric', 'M'),
      T('Continuous distributions: uniform, exponential, normal', 'M'),
      T('Joint, marginal and conditional distributions', 'H'),
      T('Central limit theorem', 'M'),
    ]),
    M('B', 'Statistics', [
      T('Descriptive statistics: mean, median, mode, standard deviation', 'E'),
      T('Sampling, confidence intervals and standard error', 'H'),
      T('Hypothesis testing: z-test, t-test, chi-squared test', 'H'),
    ]),
  ]),
  S('da-la', 'Linear Algebra', '8–10', 'Matrix decompositions power ML. Eigenvalues and SVD are must-know.', [
    M('A', 'Vector spaces', [
      T('Vector spaces, subspaces, linear independence and basis', 'M'),
      T('Linear transformations and projections', 'M'),
      T('Orthogonality and Gram–Schmidt', 'M'),
    ]),
    M('B', 'Matrices', [
      T('Rank, determinants and systems of linear equations', 'E'),
      T('Eigenvalues and eigenvectors', 'M'),
      T('Quadratic forms and positive definite matrices', 'H'),
      T('LU decomposition', 'M'),
      T('Singular value decomposition', 'H'),
    ]),
  ]),
  S('da-calc', 'Calculus & Optimization', '4–6', 'Gradients and optimisation link straight to ML training.', [
    M('A', 'Calculus', [
      T('Limits, continuity and differentiability', 'E'),
      T('Taylor series', 'M'),
      T('Functions of several variables and partial derivatives', 'M'),
    ]),
    M('B', 'Optimization', [
      T('Maxima and minima of a single variable', 'M'),
      T('Optimization in several variables and gradient descent', 'H'),
    ]),
  ]),
  S('da-prog', 'Programming, Data Structures & Algorithms', '10–14', 'Python-based. Trace code by hand and know algorithm complexity.', [
    M('A', 'Programming', [
      T('Programming in Python', 'E'),
      T('Recursion', 'M'),
    ]),
    M('B', 'Data structures', [
      T('Stacks, queues and linked lists', 'E'),
      T('Trees and hash tables', 'M'),
    ]),
    M('C', 'Algorithms', [
      T('Searching: linear and binary search', 'E'),
      T('Sorting: selection, bubble, insertion, merge and quick sort', 'M'),
      T('Divide and conquer', 'M'),
      T('Graph traversals and shortest path', 'H'),
    ]),
  ]),
  S('da-db', 'Database Management & Warehousing', '6–8', 'SQL and normalisation are near-certain; warehousing is easy marks.', [
    M('A', 'Databases', [
      T('ER model and relational model', 'E'),
      T('Relational algebra and tuple calculus', 'M'),
      T('SQL queries', 'M'),
      T('Integrity constraints and normal forms', 'H'),
      T('File organisation and indexing', 'M'),
    ]),
    M('B', 'Warehousing', [
      T('Data types, transformation, normalisation and discretisation', 'E'),
      T('Data warehouse modelling: schemas, hierarchies and measures', 'M'),
    ]),
  ]),
  S('da-ml', 'Machine Learning', '18–22', 'The core of DA. Know every algorithm\'s assumptions, loss and trade-offs.', [
    M('A', 'Supervised learning', [
      T('Regression: simple, multiple and ridge', 'M'),
      T('Logistic regression', 'M'),
      T('k-nearest neighbours', 'E'),
      T('Naive Bayes classifier', 'M'),
      T('Linear discriminant analysis', 'H'),
      T('Support vector machines', 'H'),
      T('Decision trees', 'M'),
      T('Bias–variance trade-off and cross-validation', 'M'),
      T('Neural networks: perceptron and multi-layer perceptron', 'H'),
    ]),
    M('B', 'Unsupervised learning', [
      T('Clustering: k-means and k-medoids', 'M'),
      T('Hierarchical clustering', 'M'),
      T('Dimensionality reduction: principal component analysis', 'H'),
    ]),
  ]),
  S('da-ai', 'Artificial Intelligence', '10–12', 'Search and logic are formulaic; probabilistic inference is the hard part.', [
    M('A', 'Search', [
      T('Uninformed search: BFS, DFS, uniform cost', 'E'),
      T('Informed search: greedy and A*', 'M'),
      T('Adversarial search: minimax and alpha–beta pruning', 'M'),
    ]),
    M('B', 'Logic', [
      T('Propositional logic', 'E'),
      T('Predicate logic', 'M'),
    ]),
    M('C', 'Reasoning under uncertainty', [
      T('Conditional independence and Bayesian networks', 'H'),
      T('Exact inference: variable elimination', 'H'),
      T('Approximate inference through sampling', 'H'),
    ]),
  ]),
];
