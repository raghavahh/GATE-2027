import { FormulaRule } from '../../types';
import { allSubjects } from '../syllabus';

export const getAllFormulas = (): FormulaRule[] => {
  const formulas: FormulaRule[] = [];
  allSubjects.forEach(subject => {
    subject.modules.forEach(mod => {
      mod.topics.forEach(topic => {
        topic.lessons.forEach(lesson => {
          if (lesson.formulasAndRules && lesson.formulasAndRules.length > 0) {
            formulas.push(...lesson.formulasAndRules);
          }
        });
      });
    });
  });
  return formulas;
};

export const getFormulasBySubject = (subjectCode: string): FormulaRule[] => {
  return getAllFormulas().filter(f => f.subjectCode.toUpperCase() === subjectCode.toUpperCase());
};
