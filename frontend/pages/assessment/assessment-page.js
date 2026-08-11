export function renderAssessmentPage(context = {}) {
  return {
    title: 'Assessment Feedback',
    panels: [
      'Answer Review',
      'Diagnosis',
      'Remediation'
    ],
    context
  };
}
