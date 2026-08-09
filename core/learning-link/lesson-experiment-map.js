// V1.6 Phase 10.5
// Lesson -> Experiment relationship map

export const lessonExperimentMap = {
  Day01: {
    title: '物质的变化和性质',
    experiments: []
  },
  Day02: {
    title: '空气和氧气',
    experiments: [
      'exp-oxygen-properties'
    ]
  },
  Day03: {
    title: '金属的化学性质',
    experiments: [
      'exp-metal-acid',
      'exp-metal-reactivity'
    ]
  }
};

export function getExperimentsByLesson(dayId) {
  return lessonExperimentMap[dayId]?.experiments || [];
}
