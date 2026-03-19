import { liliCore } from '$lib/compiler/preprocess/index.js';
import type { LapikitPreprocessOptions } from '$lib/compiler/types/options.js';

function lapikitPreprocess(options?: LapikitPreprocessOptions) {
	return liliCore(options);
}

export { lapikitPreprocess };
