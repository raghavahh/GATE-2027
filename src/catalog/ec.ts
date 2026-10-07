import type { CatSubject } from './types';
import { M, S, T } from './builder';

/** GATE EC (Electronics & Communication). General Aptitude is shared and added in index.ts. */
export const EC_SUBJECTS: CatSubject[] = [
  S('ec-maths', 'Engineering Mathematics', '11–13', 'Linear algebra, calculus and probability give quick marks.', [
    M('A', 'Linear algebra', [T('Matrices, rank and systems of equations', 'E'), T('Eigenvalues and eigenvectors', 'M')]),
    M('B', 'Calculus', [T('Limits, mean value theorems and series', 'M'), T('Vector calculus: gradient, divergence, curl', 'M')]),
    M('C', 'Differential equations', [T('First and higher order linear ODEs', 'M'), T('Partial differential equations', 'H')]),
    M('D', 'Complex analysis', [T('Analytic functions and Cauchy integral theorem', 'H'), T('Residue theorem', 'H')]),
    M('E', 'Probability and statistics', [T('Probability, random variables and distributions', 'M'), T('Mean, variance and correlation', 'E')]),
    M('F', 'Numerical methods', [T('Numerical solution of equations and integration', 'M')]),
  ]),
  S('ec-nss', 'Networks, Signals & Systems', '12–14', 'Highest weight in EC. Network theorems and Fourier/Laplace every year.', [
    M('A', 'Network analysis', [
      T('Nodal and mesh analysis', 'E'),
      T('Network theorems: Thevenin, Norton, superposition, max power', 'M'),
      T('Transient analysis of RL, RC and RLC circuits', 'H'),
      T('Two-port networks', 'M'),
      T('Sinusoidal steady state and resonance', 'M'),
    ]),
    M('B', 'Continuous-time signals', [
      T('Fourier series and Fourier transform', 'M'),
      T('Laplace transform', 'M'),
      T('LTI systems: convolution, causality, stability', 'M'),
    ]),
    M('C', 'Discrete-time signals', [
      T('Sampling theorem', 'M'),
      T('DTFT, DFT and FFT', 'H'),
      T('Z-transform', 'H'),
      T('Digital filters: FIR and IIR', 'H'),
    ]),
  ]),
  S('ec-devices', 'Electronic Devices', '6–8', 'Semiconductor physics plus diodes and MOS. Numerical-heavy.', [
    M('A', 'Semiconductor physics', [
      T('Energy bands, intrinsic and extrinsic semiconductors', 'E'),
      T('Carrier transport: drift and diffusion', 'M'),
      T('Generation and recombination', 'M'),
    ]),
    M('B', 'Devices', [
      T('P-N junction diode and Zener diode', 'M'),
      T('BJT and MOS capacitor', 'H'),
      T('MOSFET characteristics', 'H'),
      T('LED, photodiode and solar cell', 'M'),
    ]),
  ]),
  S('ec-analog', 'Analog Circuits', '8–10', 'Small-signal models and op-amps decide your score here.', [
    M('A', 'Diode circuits', [T('Clipping, clamping and rectifiers', 'E')]),
    M('B', 'Transistor amplifiers', [
      T('BJT and MOSFET biasing', 'M'),
      T('Small-signal models and single-stage amplifiers', 'H'),
      T('Multistage and differential amplifiers', 'H'),
      T('Frequency response of amplifiers', 'H'),
      T('Feedback amplifiers', 'M'),
    ]),
    M('C', 'Op-amps and oscillators', [
      T('Op-amp circuits and active filters', 'M'),
      T('Oscillators and Barkhausen criterion', 'M'),
      T('Voltage reference and power supply circuits', 'M'),
    ]),
  ]),
  S('ec-digital', 'Digital Circuits', '6–8', 'Scoring and predictable. K-maps, counters and ADCs first.', [
    M('A', 'Number systems and logic', [T('Number representations and binary arithmetic', 'E'), T('Boolean algebra and K-map minimisation', 'M')]),
    M('B', 'Combinational circuits', [T('Logic gates, mux, decoder and adders', 'M'), T('CMOS and TTL logic families', 'H')]),
    M('C', 'Sequential circuits', [T('Latches and flip-flops', 'M'), T('Counters, shift registers and finite state machines', 'H')]),
    M('D', 'Data converters and computer organisation', [T('ADC and DAC', 'M'), T('Semiconductor memories and microprocessor basics', 'M')]),
  ]),
  S('ec-control', 'Control Systems', '7–9', 'Stability tools (Routh, root locus, Bode, Nyquist) every single year.', [
    M('A', 'Basics', [T('Block diagrams and signal flow graphs', 'E'), T('Transient and steady-state analysis', 'M')]),
    M('B', 'Stability', [T('Routh–Hurwitz criterion', 'M'), T('Root locus', 'H'), T('Bode plot and Nyquist criterion', 'H')]),
    M('C', 'Design and state space', [T('Lag, lead and lag-lead compensation', 'M'), T('State-space representation', 'H')]),
  ]),
  S('ec-comm', 'Communications', '10–12', 'Analog + digital comm. Probability-based noise questions are common.', [
    M('A', 'Random processes', [T('Random processes, autocorrelation and PSD', 'H'), T('Noise in communication systems', 'M')]),
    M('B', 'Analog communication', [T('Amplitude modulation and demodulation', 'M'), T('Angle modulation: FM and PM', 'M'), T('Superheterodyne receivers', 'E')]),
    M('C', 'Information theory', [T('Entropy, mutual information and channel capacity', 'M')]),
    M('D', 'Digital communication', [
      T('PCM, DPCM and delta modulation', 'M'),
      T('Digital modulation: ASK, PSK, FSK, QAM', 'M'),
      T('Matched filter and probability of error', 'H'),
      T('Bandwidth, SNR and multiple access (TDMA, FDMA, CDMA)', 'M'),
    ]),
  ]),
  S('ec-emt', 'Electromagnetics', '8–10', 'Conceptual and formula-heavy. Transmission lines and waveguides score well.', [
    M('A', 'Maxwell and waves', [T('Maxwell\'s equations', 'M'), T('Plane waves: propagation, reflection, refraction', 'M'), T('Poynting vector and skin depth', 'M')]),
    M('B', 'Transmission lines', [T('Transmission line equations and impedance', 'H'), T('Smith chart and impedance matching', 'H'), T('S-parameters', 'M')]),
    M('C', 'Waveguides and antennas', [T('Rectangular waveguides', 'H'), T('Antenna basics: dipoles and arrays', 'M')]),
  ]),
];
