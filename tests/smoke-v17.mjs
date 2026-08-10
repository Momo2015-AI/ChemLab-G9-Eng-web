import assert from 'node:assert/strict';

const routes = ['home','course','graph','dashboard','quiz','experiment','experiment-result','result'];
const parseHash = (hash) => {
  const value = hash.replace(/^#/, '') || 'home';
  const [page, ...params] = value.split('/');
  return { page: routes.includes(page) ? page : 'home', params };
};

assert.deepEqual(parseHash(''), { page: 'home', params: [] });
assert.deepEqual(parseHash('#course/day-01'), { page: 'course', params: ['day-01'] });
assert.deepEqual(parseHash('#quiz/day-01'), { page: 'quiz', params: ['day-01'] });
assert.equal(parseHash('#unknown').page, 'home');

const content = await import('../app/content-service.js');
assert.ok(content.contentService, 'ContentService singleton should be exported');

console.log('V1.7 smoke checks passed');
