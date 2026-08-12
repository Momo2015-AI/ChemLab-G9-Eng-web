/**
 * ChemLab G9 curriculum map.
 *
 * This is a structural planning layer, not a reproduction of textbook prose.
 * Detailed lesson content should be authored in content/lessons and linked by IDs.
 */
export const g9CourseMap = {
  version: '2.1.0',
  scope: 'junior-high-chemistry-g9',
  semesters: [
    {
      id: 'g9-s1',
      title: '九年级化学上册',
      units: [
        { id: 'u01', title: '走进化学世界', status: 'planned' },
        { id: 'u02', title: '我们周围的空气', status: 'planned' },
        { id: 'u03', title: '物质构成的奥秘', status: 'planned' },
        { id: 'u04', title: '自然界的水', status: 'planned' },
        { id: 'u05', title: '化学方程式', status: 'planned' },
        { id: 'u06', title: '碳和碳的氧化物', status: 'planned' },
        { id: 'u07', title: '燃料及其利用', status: 'planned' }
      ]
    },
    {
      id: 'g9-s2',
      title: '九年级化学下册',
      units: [
        { id: 'u08', title: '金属和金属材料', status: 'planned' },
        { id: 'u09', title: '溶液', status: 'planned' },
        { id: 'u10', title: '酸和碱', status: 'planned' },
        { id: 'u11', title: '盐 化肥', status: 'planned' },
        { id: 'u12', title: '化学与生活', status: 'planned' }
      ]
    }
  ]
};

export default g9CourseMap;
