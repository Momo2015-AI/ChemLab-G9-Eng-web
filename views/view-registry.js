/**
 * V1.7 View Registry
 * Transitional adapter: rendering remains in the legacy app until each view is migrated.
 */

export const VIEW_NAMES = Object.freeze([
  'home',
  'course',
  'quiz',
  'result',
  'graph',
  'dashboard',
  'experiment',
  'experiment-result',
]);

export function createViewRegistry(legacyApp) {
  if (!legacyApp) throw new Error('A legacy app instance is required during migration.');

  return Object.fromEntries(
    VIEW_NAMES.map(name => [
      name,
      {
        render: () => {
          const method = `render${name
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('')}`;
          if (typeof legacyApp[method] !== 'function') {
            throw new Error(`Legacy view renderer not found: ${method}`);
          }
          return legacyApp[method]();
        },
      },
    ])
  );
}
