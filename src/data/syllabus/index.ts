import { Subject, Lesson, Topic, Module, PillarType } from '../../types';
import { generalAptitudeSubjects } from './generalAptitude';
import { engineeringMathsSubjects } from './engineeringMaths';
import { computerScienceSubjects } from './computerScience';

export const allSubjects: Subject[] = [
  ...generalAptitudeSubjects,
  ...engineeringMathsSubjects,
  ...computerScienceSubjects
];

export const getSubjectsByPillar = (pillar: PillarType): Subject[] => {
  return allSubjects.filter(s => s.pillar === pillar);
};

export const getSubjectById = (id: string): Subject | undefined => {
  return allSubjects.find(s => s.id === id || s.code.toLowerCase() === id.toLowerCase());
};

export const getAllLessons = (): Lesson[] => {
  const lessons: Lesson[] = [];
  allSubjects.forEach(subject => {
    subject.modules.forEach(mod => {
      mod.topics.forEach(topic => {
        lessons.push(...topic.lessons);
      });
    });
  });
  return lessons;
};

export const getAllTopics = (): Topic[] => {
  const topics: Topic[] = [];
  allSubjects.forEach(subject => {
    subject.modules.forEach(mod => {
      topics.push(...mod.topics);
    });
  });
  return topics;
};

export const getLessonById = (id: string): { lesson: Lesson; topic: Topic; module: Module; subject: Subject } | undefined => {
  for (const subject of allSubjects) {
    for (const mod of subject.modules) {
      for (const topic of mod.topics) {
        for (const lesson of topic.lessons) {
          if (lesson.id === id) {
            return { lesson, topic, module: mod, subject };
          }
        }
      }
    }
  }
  return undefined;
};

export const getSyllabusSummary = () => {
  const gaSubjects = getSubjectsByPillar('GA');
  const mathSubjects = getSubjectsByPillar('MATH');
  const csSubjects = getSubjectsByPillar('CS');

  const countLessons = (subs: Subject[]) => 
    subs.reduce((acc, s) => acc + s.modules.reduce((mAcc, m) => mAcc + m.topics.reduce((tAcc, t) => tAcc + t.lessons.length, 0), 0), 0);

  const countTopics = (subs: Subject[]) => 
    subs.reduce((acc, s) => acc + s.modules.reduce((mAcc, m) => mAcc + m.topics.length, 0), 0);

  const countModules = (subs: Subject[]) => 
    subs.reduce((acc, s) => acc + s.modules.length, 0);

  return {
    totalMarks: 100,
    pillars: {
      GA: { marks: 15, subjects: gaSubjects.length, modules: countModules(gaSubjects), topics: countTopics(gaSubjects), lessons: countLessons(gaSubjects) },
      MATH: { marks: 13, subjects: mathSubjects.length, modules: countModules(mathSubjects), topics: countTopics(mathSubjects), lessons: countLessons(mathSubjects) },
      CS: { marks: 72, subjects: csSubjects.length, modules: countModules(csSubjects), topics: countTopics(csSubjects), lessons: countLessons(csSubjects) }
    },
    totalSubjects: allSubjects.length,
    totalModules: countModules(allSubjects),
    totalTopics: countTopics(allSubjects),
    totalLessons: countLessons(allSubjects)
  };
};
