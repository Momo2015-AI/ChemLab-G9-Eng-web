// Course Data Schema V1.6
// Standard structure for Day lessons

export function createCourseDay(data = {}) {
  return {
    day: data.day || '',
    title: data.title || '',
    knowledge: data.knowledge || [],
    experiments: data.experiments || [],
    exercises: data.exercises || [],
    assessment: data.assessment || null
  };
}

export default createCourseDay;
