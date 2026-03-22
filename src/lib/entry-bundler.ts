import { liliCore } from '$lib/framework';
import type { LapikitPreprocessOptions } from '$lib/@types';
import type { PreprocessorGroup } from 'svelte/compiler';

function lapikitPreprocess(options?: LapikitPreprocessOptions): PreprocessorGroup {
	return liliCore(options);
}

export { lapikitPreprocess };
