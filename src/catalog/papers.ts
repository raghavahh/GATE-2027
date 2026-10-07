import type { Paper } from './types';

const p = (code: string, name: string, group: Paper['group'], status: Paper['status'] = 'soon', note?: string): Paper =>
  ({ code, slug: code.toLowerCase(), name, group, status, note });

/** All 30 GATE papers. Verify against the official GATE 2027 brochure. */
export const PAPERS: Paper[] = [
  p('CS', 'Computer Science & Information Technology', 'Engineering', 'live'),
  p('DA', 'Data Science & Artificial Intelligence', 'Engineering', 'building'),
  p('EC', 'Electronics & Communication Engineering', 'Engineering', 'building'),
  p('EE', 'Electrical Engineering', 'Engineering', 'building'),
  p('ME', 'Mechanical Engineering', 'Engineering', 'building'),
  p('CE', 'Civil Engineering', 'Engineering', 'building'),
  p('IN', 'Instrumentation Engineering', 'Engineering'),
  p('CH', 'Chemical Engineering', 'Engineering'),
  p('PI', 'Production & Industrial Engineering', 'Engineering'),
  p('BT', 'Biotechnology', 'Engineering'),
  p('AE', 'Aerospace Engineering', 'Engineering'),
  p('AG', 'Agricultural Engineering', 'Engineering'),
  p('BM', 'Biomedical Engineering', 'Engineering'),
  p('ES', 'Environmental Science & Engineering', 'Engineering'),
  p('GE', 'Geomatics Engineering', 'Engineering'),
  p('MN', 'Mining Engineering', 'Engineering'),
  p('MT', 'Metallurgical Engineering', 'Engineering'),
  p('NM', 'Naval Architecture & Marine Engineering', 'Engineering'),
  p('PE', 'Petroleum Engineering', 'Engineering'),
  p('TF', 'Textile Engineering & Fibre Science', 'Engineering'),
  p('XE', 'Engineering Sciences', 'Engineering', 'soon', 'Maths + any two sections'),
  p('AR', 'Architecture & Planning', 'Other'),
  p('CY', 'Chemistry', 'Science'),
  p('EY', 'Ecology & Evolution', 'Science'),
  p('GG', 'Geology & Geophysics', 'Science', 'soon', 'Geology or Geophysics'),
  p('MA', 'Mathematics', 'Science'),
  p('PH', 'Physics', 'Science'),
  p('ST', 'Statistics', 'Science'),
  p('XL', 'Life Sciences', 'Science', 'soon', 'Chemistry + any two sections'),
  p('XH', 'Humanities & Social Sciences', 'Other', 'soon', 'Reasoning + one section'),
];

export const PRICE_INR = 310;
export const EDITION = 'GATE 2027';
