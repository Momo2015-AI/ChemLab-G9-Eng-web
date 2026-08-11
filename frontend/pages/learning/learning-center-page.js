export function renderLearningCenterPage(context = {}) {
  return {
    title: 'Learning Center',
    sections: [
      'Chapters',
      'Knowledge Points',
      'Experiments',
      'Assessment'
    ],
    context
  };
}
