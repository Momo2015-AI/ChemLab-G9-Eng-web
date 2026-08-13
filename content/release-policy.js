export const RELEASE_STATES = Object.freeze({
  released: { key: 'released', label: '已发布', available: true, canComplete: true },
  review: { key: 'review', label: '审核中·可体验', available: true, canComplete: false },
  unavailable: { key: 'unavailable', label: '内容未发布', available: false, canComplete: false },
});

const RELEASED = new Set(['ready', 'published', 'released']);
const REVIEW = new Set(['review', 'in-review', 'ready-for-review', 'ready-for-runtime', 'preview']);

export function getLessonReleaseState(lesson = {}) {
  const raw = String(lesson.releaseStatus || lesson.status || lesson.provenance?.status || '').trim().toLowerCase();
  if (RELEASED.has(raw)) return RELEASE_STATES.released;
  if (REVIEW.has(raw)) return RELEASE_STATES.review;
  return RELEASE_STATES.unavailable;
}

export function isLessonRuntimeAvailable(lesson) {
  return getLessonReleaseState(lesson).available;
}

export function canCompleteLesson(lesson) {
  return getLessonReleaseState(lesson).canComplete;
}
