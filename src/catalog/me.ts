import type { CatSubject } from './types';
import { M, S, T } from './builder';

/** GATE ME (Mechanical). General Aptitude is shared and added in index.ts. */
export const ME_SUBJECTS: CatSubject[] = [
  S('me-maths', 'Engineering Mathematics', '11–13', 'Same high-return maths as every engineering paper.', [
    M('A', 'Linear algebra', [T('Matrices, rank and systems of equations', 'E'), T('Eigenvalues and eigenvectors', 'M')]),
    M('B', 'Calculus', [T('Limits, maxima and minima', 'M'), T('Vector calculus and multiple integrals', 'M')]),
    M('C', 'Differential equations', [T('First and higher order ODEs', 'M'), T('Partial differential equations', 'H')]),
    M('D', 'Probability and numerical methods', [T('Probability and statistics', 'M'), T('Numerical methods', 'M')]),
  ]),
  S('me-mech', 'Engineering Mechanics', '3–5', 'Free-body diagrams decide everything here.', [
    M('A', 'Statics and dynamics', [T('Free-body diagrams and equilibrium', 'E'), T('Trusses and frames', 'M'), T('Friction', 'M'), T('Kinematics and dynamics of particles and rigid bodies', 'M'), T('Impulse, momentum and energy', 'M')]),
  ]),
  S('me-som', 'Strength of Materials', '7–9', 'Bending and torsion numericals repeat every year.', [
    M('A', 'Stress and strain', [T('Stress, strain and elastic constants', 'E'), T('Mohr\'s circle for plane stress and strain', 'M'), T('Thermal stresses', 'M')]),
    M('B', 'Beams and shafts', [T('Shear force and bending moment diagrams', 'M'), T('Bending and shear stresses in beams', 'M'), T('Deflection of beams', 'H'), T('Torsion of circular shafts', 'M')]),
    M('C', 'Columns and energy', [T('Euler buckling of columns', 'M'), T('Strain energy methods', 'H'), T('Thin cylinders', 'E')]),
  ]),
  S('me-tom', 'Theory of Machines & Vibrations', '6–8', 'Mechanisms, gears and vibrations; formula-driven.', [
    M('A', 'Mechanisms', [T('Displacement, velocity and acceleration analysis of linkages', 'H'), T('Cams', 'M'), T('Gears and gear trains', 'M'), T('Flywheels and governors', 'M'), T('Balancing of masses', 'M')]),
    M('B', 'Vibrations', [T('Free and forced vibration of single DOF systems', 'H'), T('Effect of damping and resonance', 'M'), T('Critical speeds of shafts', 'M')]),
  ]),
  S('me-design', 'Machine Design', '4–6', 'Failure theories and joints; quick if formulas are clear.', [
    M('A', 'Design', [T('Static and dynamic loading, failure theories', 'M'), T('Fatigue: S-N diagram', 'M'), T('Bolted, riveted and welded joints', 'M'), T('Shafts, gears, bearings, brakes and clutches', 'H'), T('Springs', 'E')]),
  ]),
  S('me-fm', 'Fluid Mechanics', '7–9', 'Bernoulli, pipe flow and boundary layers are high-yield.', [
    M('A', 'Fluid statics', [T('Fluid properties and fluid statics', 'E'), T('Buoyancy and manometry', 'E')]),
    M('B', 'Fluid dynamics', [T('Control volume analysis: mass, momentum, energy', 'M'), T('Bernoulli\'s equation', 'M'), T('Dimensional analysis', 'M'), T('Viscous flow and pipe flow losses', 'H'), T('Boundary layer theory', 'H')]),
    M('C', 'Turbomachinery', [T('Pelton, Francis and Kaplan turbines', 'M'), T('Pumps and compressors', 'M')]),
  ]),
  S('me-ht', 'Heat Transfer', '5–7', 'Conduction, fins and heat exchangers repeat every year.', [
    M('A', 'Modes', [T('Steady conduction and thermal resistance', 'M'), T('Fins', 'M'), T('Unsteady conduction: lumped analysis', 'M'), T('Convection: free and forced', 'H'), T('Radiation: black and grey bodies, view factors', 'H')]),
    M('B', 'Heat exchangers', [T('Heat exchangers: LMTD and NTU methods', 'H')]),
  ]),
  S('me-thermo', 'Thermodynamics & Applications', '10–12', 'Laws, cycles and refrigeration. Big and scoring.', [
    M('A', 'Thermodynamics', [T('Properties of pure substances', 'E'), T('First law and energy analysis', 'M'), T('Second law, entropy and availability', 'H')]),
    M('B', 'Cycles', [T('Rankine cycle and power plants', 'M'), T('Gas power cycles: Otto, Diesel, Brayton', 'M'), T('IC engines', 'M')]),
    M('C', 'Refrigeration', [T('Vapour compression refrigeration', 'M'), T('Psychrometry and air conditioning', 'M')]),
  ]),
  S('me-mfg', 'Manufacturing & Materials', '14–16', 'Largest block: casting, forming, machining, joining, metrology.', [
    M('A', 'Materials', [T('Engineering materials and properties', 'E'), T('Phase diagrams and heat treatment', 'M')]),
    M('B', 'Processes', [T('Casting', 'M'), T('Metal forming: rolling, forging, extrusion', 'M'), T('Joining: welding, brazing, soldering', 'M'), T('Machining: tool life and cutting forces', 'H'), T('Non-traditional machining', 'M')]),
    M('C', 'Metrology', [T('Limits, fits and tolerances', 'M'), T('Measurement and inspection', 'E')]),
  ]),
  S('me-ie', 'Industrial Engineering', '5–7', 'Inventory, forecasting and LP; easy to score with practice.', [
    M('A', 'Operations', [T('Forecasting', 'E'), T('Inventory control: EOQ models', 'M'), T('Linear programming and simplex', 'M'), T('Queueing and PERT/CPM', 'M'), T('Production planning and scheduling', 'M')]),
  ]),
];
