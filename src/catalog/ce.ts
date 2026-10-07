import type { CatSubject } from './types';
import { M, S, T } from './builder';

/** GATE CE (Civil). General Aptitude is shared and added in index.ts. */
export const CE_SUBJECTS: CatSubject[] = [
  S('ce-maths', 'Engineering Mathematics', '11–13', 'Same high-return maths as every engineering paper.', [
    M('A', 'Linear algebra', [T('Matrices, rank and systems of equations', 'E'), T('Eigenvalues and eigenvectors', 'M')]),
    M('B', 'Calculus and ODEs', [T('Limits, integrals and maxima-minima', 'M'), T('Ordinary and partial differential equations', 'M')]),
    M('C', 'Probability and numerical methods', [T('Probability and statistics', 'M'), T('Numerical methods', 'M')]),
  ]),
  S('ce-mech', 'Engineering & Solid Mechanics', '6–8', 'Bending, torsion and Mohr\'s circle every year.', [
    M('A', 'Engineering mechanics', [T('Equilibrium, trusses and friction', 'E'), T('Centroid and moment of inertia', 'E')]),
    M('B', 'Solid mechanics', [T('Stress, strain and Mohr\'s circle', 'M'), T('Shear force and bending moment', 'M'), T('Bending and shear stresses', 'M'), T('Deflection of beams', 'H'), T('Torsion and columns', 'M')]),
  ]),
  S('ce-structures', 'Structural Analysis', '6–8', 'Determinacy, influence lines and matrix methods.', [
    M('A', 'Analysis', [T('Static and kinematic indeterminacy', 'M'), T('Force and displacement methods', 'H'), T('Influence lines', 'H'), T('Arches, cables and trusses', 'M'), T('Matrix methods of analysis', 'H')]),
  ]),
  S('ce-concrete-steel', 'Concrete & Steel Structures', '6–8', 'IS code-based design. Limit state concepts are key.', [
    M('A', 'Concrete', [T('Concrete technology and mix design', 'E'), T('Limit state design of beams', 'M'), T('Shear, bond and columns', 'M'), T('Slabs and footings', 'M'), T('Prestressed concrete', 'H')]),
    M('B', 'Steel', [T('Tension and compression members', 'M'), T('Beams and plastic analysis', 'H'), T('Bolted and welded connections', 'M')]),
    M('C', 'Construction', [T('Construction materials and management: CPM and PERT', 'E')]),
  ]),
  S('ce-geotech', 'Geotechnical Engineering', '12–14', 'Biggest civil block. Consolidation and shear strength are core.', [
    M('A', 'Soil mechanics', [T('Soil properties and three-phase relationships', 'E'), T('Soil classification', 'E'), T('Permeability and seepage', 'M'), T('Compaction', 'E'), T('Effective stress', 'M'), T('Consolidation', 'H'), T('Shear strength of soils', 'H')]),
    M('B', 'Foundation engineering', [T('Earth pressure theories', 'M'), T('Stability of slopes', 'M'), T('Bearing capacity of shallow foundations', 'H'), T('Settlement analysis', 'M'), T('Pile foundations', 'M')]),
  ]),
  S('ce-water', 'Water Resources Engineering', '10–12', 'Fluid mechanics, open channels and hydrology.', [
    M('A', 'Fluid mechanics', [T('Fluid properties and statics', 'E'), T('Kinematics and Bernoulli', 'M'), T('Pipe flow and losses', 'M'), T('Dimensional analysis', 'M')]),
    M('B', 'Hydraulics', [T('Open channel flow: specific energy and hydraulic jump', 'H'), T('Gradually varied flow', 'H')]),
    M('C', 'Hydrology and irrigation', [T('Hydrologic cycle and hydrographs', 'M'), T('Flood routing and wells', 'M'), T('Irrigation: water requirements and canals', 'M')]),
  ]),
  S('ce-env', 'Environmental Engineering', '9–11', 'Water/wastewater treatment design and BOD calculations.', [
    M('A', 'Water', [T('Water quality and standards', 'E'), T('Water treatment units', 'M'), T('Water distribution', 'M')]),
    M('B', 'Wastewater', [T('BOD, COD and sewage characteristics', 'M'), T('Primary and secondary treatment', 'H'), T('Sludge disposal', 'M')]),
    M('C', 'Others', [T('Air pollution', 'M'), T('Municipal solid waste', 'E'), T('Noise pollution', 'E')]),
  ]),
  S('ce-transport', 'Transportation Engineering', '8–10', 'Geometric design, pavements and traffic flow.', [
    M('A', 'Highways', [T('Highway geometric design: sight distance and curves', 'M'), T('Highway materials', 'E'), T('Flexible and rigid pavement design', 'H')]),
    M('B', 'Traffic', [T('Traffic flow characteristics', 'M'), T('Traffic signals and intersections', 'M')]),
    M('C', 'Infrastructure', [T('Railways and airports basics', 'E')]),
  ]),
  S('ce-geomatics', 'Geomatics Engineering', '4–6', 'Surveying basics plus photogrammetry and GIS.', [
    M('A', 'Surveying', [T('Principles of surveying and errors', 'E'), T('Levelling and contouring', 'M'), T('Theodolite and traversing', 'M'), T('Curves', 'M')]),
    M('B', 'Modern surveying', [T('Photogrammetry and remote sensing', 'M'), T('GPS and GIS basics', 'E')]),
  ]),
];
