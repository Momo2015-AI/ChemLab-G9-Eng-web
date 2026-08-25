/**
 * Canonical student-facing lesson registry.
 *
 * - canonicalId: stable, history-safe identifier (never rename; it anchors URLs,
 *   localStorage progress keys, knowledge-graph relations and test assertions).
 * - displayOrder: authoritative display sequence across the whole G9 course
 *   (1..N, continuous). It is the ONLY ordering field the UI should rely on;
 *   the numeric suffix in canonicalId is a legacy artifact and must NOT be used
 *   for ordering or numbering.
 */
export const lessonManifest = {
  version: '1.4.0',
  lessons: [
    { day: '01', sequenceNumber: 1, displayOrder: 1, canonicalId: 'lesson-01-material-changes-properties', title: '物质的变化和性质', semester: 'upper', unitId: 'u01', status: 'ready', releaseStatus: 'ready' },
    { day: '02', sequenceNumber: 2, displayOrder: 2, canonicalId: 'lesson-02-chemistry-as-experimental-science', title: '化学是一门以实验为基础的科学', semester: 'upper', unitId: 'u01', status: 'ready', releaseStatus: 'ready' },
    { day: '03', sequenceNumber: 3, displayOrder: 3, canonicalId: 'lesson-04-lab-safety-operations', title: '实验安全与基本操作', semester: 'upper', unitId: 'u01', status: 'ready', releaseStatus: 'ready' },
    { day: '04', sequenceNumber: 4, displayOrder: 4, canonicalId: 'lesson-05-oxygen', title: '空气与氧气的性质', semester: 'upper', unitId: 'u02', status: 'ready', releaseStatus: 'ready' },
    { day: '13', sequenceNumber: 13, displayOrder: 5, canonicalId: 'lesson-08-h2o2-oxygen-preparation', title: '过氧化氢制取氧气与催化剂', semester: 'upper', unitId: 'u02', status: 'ready', releaseStatus: 'ready' },
    { day: '12', sequenceNumber: 12, displayOrder: 6, canonicalId: 'lesson-07-oxygen-preparation-comprehensive', title: '氧气制取综合：高锰酸钾法与装置对比', semester: 'upper', unitId: 'u02', status: 'ready', releaseStatus: 'ready' },
    { day: '11', sequenceNumber: 11, displayOrder: 7, canonicalId: 'lesson-06-molecules-and-atoms', title: '分子和原子', semester: 'upper', unitId: 'u03', status: 'ready', releaseStatus: 'ready' },
    { day: '11', sequenceNumber: 11, displayOrder: 8, canonicalId: 'lesson-11-atomic-structure', title: '原子的构成', semester: 'upper', unitId: 'u03', status: 'ready', releaseStatus: 'ready' },
    { day: '12', sequenceNumber: 12, displayOrder: 9, canonicalId: 'lesson-12-ion-bond', title: '离子与离子键', semester: 'upper', unitId: 'u03', status: 'ready', releaseStatus: 'ready' },
    { day: '13', sequenceNumber: 13, displayOrder: 10, canonicalId: 'lesson-13-elements', title: '元素', semester: 'upper', unitId: 'u03', status: 'ready', releaseStatus: 'ready' },
    { day: '06', sequenceNumber: 6, displayOrder: 11, canonicalId: 'lesson-06-water-composition', title: '水的组成', semester: 'upper', unitId: 'u04', status: 'ready', releaseStatus: 'ready' },
    { day: '07', sequenceNumber: 7, displayOrder: 12, canonicalId: 'lesson-07-water-purification', title: '水的净化', semester: 'upper', unitId: 'u04', status: 'ready', releaseStatus: 'ready' },
    { day: '08', sequenceNumber: 8, displayOrder: 13, canonicalId: 'lesson-08-water-conservation', title: '爱护水资源', semester: 'upper', unitId: 'u04', status: 'ready', releaseStatus: 'ready' },
    { day: '09', sequenceNumber: 9, displayOrder: 14, canonicalId: 'lesson-09-chemical-formula', title: '化学式与化合价（上）', semester: 'upper', unitId: 'u03', status: 'ready', releaseStatus: 'ready' },
    { day: '10', sequenceNumber: 10, displayOrder: 15, canonicalId: 'lesson-10-chemical-equation', title: '质量守恒定律与化学计算', semester: 'upper', unitId: 'u05', status: 'ready', releaseStatus: 'ready' },
    { day: '05', sequenceNumber: 5, displayOrder: 16, canonicalId: 'lesson-03-acid-intro', title: '酸入门：初识身边的酸', semester: 'lower', unitId: 'u10', status: 'ready', releaseStatus: 'ready' },
    { day: '20', sequenceNumber: 20, displayOrder: 17, canonicalId: 'lesson-20-carbon-allotrope', title: '碳的单质', semester: 'upper', unitId: 'u06', status: 'ready', releaseStatus: 'ready' },
    { day: '21', sequenceNumber: 21, displayOrder: 18, canonicalId: 'lesson-21-carbon-property', title: '碳的化学性质', semester: 'upper', unitId: 'u06', status: 'ready', releaseStatus: 'ready' },
    { day: '22', sequenceNumber: 22, displayOrder: 19, canonicalId: 'lesson-22-co2-preparation', title: '二氧化碳的制取', semester: 'upper', unitId: 'u06', status: 'ready', releaseStatus: 'ready' },
    { day: '23', sequenceNumber: 23, displayOrder: 20, canonicalId: 'lesson-23-co2-property', title: '二氧化碳的性质', semester: 'upper', unitId: 'u06', status: 'ready', releaseStatus: 'ready' },
    { day: '24', sequenceNumber: 24, displayOrder: 21, canonicalId: 'lesson-24-co-property', title: '一氧化碳', semester: 'upper', unitId: 'u06', status: 'ready', releaseStatus: 'ready' }
  ]
};
export default lessonManifest;
