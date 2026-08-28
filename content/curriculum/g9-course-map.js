/**
 * ChemLab G9 curriculum map.
 *
 * This is a structural planning layer, not a reproduction of textbook prose.
 * Detailed lesson content should be authored in content/lessons and linked by IDs.
 *
 * Each unit has an explicit semester so the app can authoritatively resolve
 * whether a course belongs to the upper (上册) or lower (下册) volume.
 */
export const g9CourseMap = {
  version: '2.2.0',
  scope: 'junior-high-chemistry-g9',
  semesters: [
    {
      id: 'g9-s1',
      title: '九年级化学上册',
      term: 'upper',
      units: [
        { id: 'u01', title: '走进化学世界', semester: 'upper', status: 'built' },
        { id: 'u02', title: '我们周围的空气', semester: 'upper', status: 'built' },
        { id: 'u03', title: '物质构成的奥秘', semester: 'upper', status: 'built' },
        { id: 'u04', title: '自然界的水', semester: 'upper', status: 'built' },
        { id: 'u05', title: '化学方程式', semester: 'upper', status: 'built' },
        { id: 'u06', title: '碳和碳的氧化物', semester: 'upper', status: 'built' },
        { id: 'u07', title: '燃料及其利用', semester: 'upper', status: 'built' }
      ]
    },
    {
      id: 'g9-s2',
      title: '九年级化学下册',
      term: 'lower',
      units: [
        { id: 'u08', title: '金属和金属材料', semester: 'lower', status: 'planned' },
        { id: 'u09', title: '溶液', semester: 'lower', status: 'planned' },
        { id: 'u10', title: '酸和碱', semester: 'lower', status: 'partially-built' },
        { id: 'u11', title: '盐 化肥', semester: 'lower', status: 'planned' },
        { id: 'u12', title: '化学与生活', semester: 'lower', status: 'planned' }
      ]
    }
  ]
};

/**
 * Resolve the semester for a given unitId.
 * Returns 'upper', 'lower', or null if unknown.
 */
export function getUnitSemester(unitId) {
  for (const sem of g9CourseMap.semesters) {
    const unit = sem.units.find(u => u.id === unitId);
    if (unit) return unit.semester;
  }
  return null;
}

/**
 * Build a lookup: unitId -> { semester, title, status }
 */
export const unitMeta = Object.fromEntries(
  g9CourseMap.semesters.flatMap(sem =>
    sem.units.map(u => [u.id, { semester: sem.term, title: u.title, status: u.status }])
  )
);

export default g9CourseMap;
