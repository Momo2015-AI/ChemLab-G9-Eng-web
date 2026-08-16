/** Canonical student-facing lesson registry. Numeric sequence is display/order only. */
export const lessonManifest = {
  version: '1.0.0',
  lessons: [
    { day: '01', sequenceNumber: 1, canonicalId: 'lesson-01-material-changes-properties', title: '物质的变化和性质', semester: 'upper', unitId: 'u01', status: 'ready', releaseStatus: 'ready' },
    { day: '02', sequenceNumber: 2, canonicalId: 'lesson-02-chemistry-as-experimental-science', title: '化学是一门以实验为基础的科学', semester: 'upper', unitId: 'u01', status: 'ready', releaseStatus: 'ready' },
    { day: '03', sequenceNumber: 3, canonicalId: 'lesson-03-acid-intro', title: '酸入门：初识身边的酸', semester: 'lower', unitId: 'u10', status: 'ready', releaseStatus: 'ready' }
  ]
};
export default lessonManifest;
