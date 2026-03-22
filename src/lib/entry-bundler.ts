import { liliCore } from './framework.js';
import type { LapikitPreprocessOptions } from './@types/index.js';
import type { PreprocessorGroup } from 'svelte/compiler';

function lapikitPreprocess(options?: LapikitPreprocessOptions): PreprocessorGroup {
	return liliCore(options);
}

export { lapikitPreprocess };
