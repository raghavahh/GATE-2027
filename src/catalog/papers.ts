import type { Paper } from './types';

const p = (code: string, name: string, group: Paper['group'], status: Paper['status'] = 'soon', note?: string): Paper =>
  ({ code, slug: code.toLowerCase(), name, group, status, note });

/** All 30 GATE papers. Verify against the official GATE 2027 brochure. */
export const PAPERS: Paper[] = [
  p('CS', 'Computer Science & Information Technology', 'Engineering', 'live'),
  p('DA', 'Data Science & Artificial Intelligence', 'Engineering', 'live'),
  p('EC', 'Electronics & Communication Engineering', 'Engineering', 'live'),
  p('EE', 'Electrical Engineering', 'Engineering', 'live'),
  p('ME', 'Mechanical Engineering', 'Engineering', 'live'),
  p('CE', 'Civil Engineering', 'Engineering', 'live'),
  p('IN', 'Instrumentation Engineering', 'Engineering', 'live'),
  p('CH', 'Chemical Engineering', 'Engineering', 'live'),
  p('PI', 'Production & Industrial Engineering', 'Engineering', 'live'),
  p('BT', 'Biotechnology', 'Engineering', 'live'),
  p('AE', 'Aerospace Engineering', 'Engineering', 'live'),
  p('AG', 'Agricultural Engineering', 'Engineering', 'live'),
  p('BM', 'Biomedical Engineering', 'Engineering', 'live'),
  p('ES', 'Environmental Science & Engineering', 'Engineering', 'live'),
  p('GE', 'Geomatics Engineering', 'Engineering', 'live'),
  p('MN', 'Mining Engineering', 'Engineering', 'live'),
  p('MT', 'Metallurgical Engineering', 'Engineering', 'live'),
  p('NM', 'Naval Architecture & Marine Engineering', 'Engineering', 'live'),
  p('PE', 'Petroleum Engineering', 'Engineering', 'live'),
  p('TF', 'Textile Engineering & Fibre Science', 'Engineering'),
  p('XE', 'Engineering Sciences', 'Engineering', 'live', 'Maths + any two sections'),
  p('AR', 'Architecture & Planning', 'Other', 'live'),
  p('CY', 'Chemistry', 'Science', 'live'),
  p('EY', 'Ecology & Evolution', 'Science', 'live'),
  p('GG', 'Geology & Geophysics', 'Science', 'live', 'Geology or Geophysics'),
  p('MA', 'Mathematics', 'Science', 'live'),
  p('PH', 'Physics', 'Science', 'live'),
  p('ST', 'Statistics', 'Science', 'live'),
  p('XL', 'Life Sciences', 'Science', 'live', 'Chemistry + any two sections'),
  p('XH', 'Humanities & Social Sciences', 'Other', 'live', 'Reasoning + one section'),
];

export const PRICE_INR = 310;
export const EDITION = 'GATE 2027';
