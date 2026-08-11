export function renderLabPage(context = {}) {
  return {
    title: 'Virtual Lab',
    panels: [
      'Instrument Panel',
      'Experiment Workspace',
      'AI Hint Panel'
    ],
    context
  };
}
