import type { CatSubject } from './types';
import { M, S, T } from './builder';

/** GATE EE (Electrical). General Aptitude is shared and added in index.ts. */
export const EE_SUBJECTS: CatSubject[] = [
  S('ee-maths', 'Engineering Mathematics', '11–13', 'Same high-return maths as every engineering paper.', [
    M('A', 'Linear algebra', [T('Matrices, rank and systems of equations', 'E'), T('Eigenvalues and eigenvectors', 'M')]),
    M('B', 'Calculus', [T('Limits, series and mean value theorems', 'M'), T('Vector calculus and line integrals', 'M')]),
    M('C', 'Differential equations', [T('First and higher order linear ODEs', 'M')]),
    M('D', 'Complex variables', [T('Analytic functions and residue theorem', 'H')]),
    M('E', 'Probability and statistics', [T('Probability and distributions', 'M')]),
  ]),
  S('ee-circuits', 'Electric Circuits', '8–10', 'Foundation for everything else. Transients and resonance repeat yearly.', [
    M('A', 'DC and AC analysis', [T('Nodal and mesh analysis', 'E'), T('Network theorems', 'M'), T('Sinusoidal steady state and phasors', 'M')]),
    M('B', 'Transients and networks', [T('Transient response of RL, RC and RLC circuits', 'H'), T('Resonance', 'M'), T('Two-port networks', 'M')]),
    M('C', 'Power', [T('Three-phase circuits and power', 'M'), T('Ideal and dependent sources', 'E')]),
  ]),
  S('ee-emf', 'Electromagnetic Fields', '3–5', 'Small but conceptual. Coulomb, Gauss and Ampere laws.', [
    M('A', 'Electrostatics', [T('Coulomb\'s law and Gauss\'s law', 'M'), T('Capacitance and dielectrics', 'M')]),
    M('B', 'Magnetostatics', [T('Biot–Savart and Ampere\'s law', 'M'), T('Faraday\'s law and inductance', 'M')]),
  ]),
  S('ee-signals', 'Signals & Systems', '6–8', 'Fourier, Laplace and Z-transforms; sampling theorem.', [
    M('A', 'Signals', [T('Signal classification and LTI systems', 'E'), T('Convolution', 'M')]),
    M('B', 'Transforms', [T('Fourier series and Fourier transform', 'M'), T('Laplace transform', 'M'), T('Z-transform and DTFT', 'H'), T('Sampling theorem', 'M')]),
  ]),
  S('ee-machines', 'Electrical Machines', '10–14', 'Largest core subject. Transformers and induction motors dominate.', [
    M('A', 'Transformers', [T('Single-phase transformer: equivalent circuit and tests', 'M'), T('Efficiency and regulation', 'M'), T('Three-phase transformers and autotransformers', 'H')]),
    M('B', 'DC machines', [T('DC generators and motors', 'M'), T('Speed control and starting of DC motors', 'M')]),
    M('C', 'Induction machines', [T('Three-phase induction motor: torque and slip', 'H'), T('Starting and speed control of induction motors', 'H'), T('Single-phase induction motor', 'M')]),
    M('D', 'Synchronous machines', [T('Synchronous generators: regulation and parallel operation', 'H'), T('Synchronous motors', 'M')]),
  ]),
  S('ee-power', 'Power Systems', '12–14', 'Big and numerical. Load flow, faults and stability every year.', [
    M('A', 'Generation and transmission', [T('Power generation concepts', 'E'), T('Transmission line parameters and performance', 'H'), T('Cables and insulators', 'M')]),
    M('B', 'Analysis', [T('Per-unit system and bus admittance matrix', 'M'), T('Load flow: Gauss–Seidel and Newton–Raphson', 'H'), T('Symmetrical components and fault analysis', 'H')]),
    M('C', 'Control and protection', [T('Voltage and frequency control', 'M'), T('Power system stability and equal area criterion', 'H'), T('Protection: relays and circuit breakers', 'M'), T('HVDC and FACTS basics', 'M')]),
  ]),
  S('ee-control', 'Control Systems', '7–9', 'Stability tools every year: Routh, root locus, Bode, Nyquist.', [
    M('A', 'Basics', [T('Block diagrams and signal flow graphs', 'E'), T('Time response and steady-state error', 'M')]),
    M('B', 'Stability', [T('Routh–Hurwitz criterion', 'M'), T('Root locus', 'H'), T('Bode plot and Nyquist criterion', 'H')]),
    M('C', 'Design', [T('Lag and lead compensators', 'M'), T('State-space analysis', 'H')]),
  ]),
  S('ee-measure', 'Electrical & Electronic Measurements', '5–7', 'Bridges and instruments; quick scoring with formulas.', [
    M('A', 'Instruments', [T('Measuring instruments: PMMC, moving iron, dynamometer', 'M'), T('Measurement of power and energy', 'M')]),
    M('B', 'Bridges and errors', [T('AC and DC bridges', 'M'), T('Instrument transformers', 'M'), T('Oscilloscopes and error analysis', 'E')]),
  ]),
  S('ee-electronics', 'Analog & Digital Electronics', '6–8', 'Op-amps and digital basics, lighter than in EC.', [
    M('A', 'Analog', [T('Diode circuits and rectifiers', 'E'), T('BJT and MOSFET amplifiers', 'M'), T('Op-amp circuits and filters', 'M')]),
    M('B', 'Digital', [T('Combinational and sequential logic', 'M'), T('ADC, DAC and sample-and-hold', 'M')]),
  ]),
  S('ee-pe', 'Power Electronics', '7–9', 'Converters and inverters. Waveform-based numericals.', [
    M('A', 'Devices', [T('Power semiconductor devices: SCR, MOSFET, IGBT', 'M')]),
    M('B', 'Converters', [T('Phase-controlled rectifiers', 'H'), T('DC–DC converters: buck, boost, buck-boost', 'H'), T('Inverters and PWM', 'H')]),
  ]),
];
