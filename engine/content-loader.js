/**
 * Deprecated V1.7 compatibility shim.
 *
 * The canonical content loader now lives under app/content-loader.js.
 * Keep this re-export temporarily for any external/legacy importers while
 * preventing a second implementation from drifting from the application path.
 */
export { contentLoader } from '../app/content-loader.js';
export { default } from '../app/content-loader.js';
