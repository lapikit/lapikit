import { liliCore } from '$lib/compiler/preprocess';
import type { LapikitPreprocessOptions } from '$lib/@types';

function lapikitPreprocess(options?: LapikitPreprocessOptions) {
	return liliCore(options);
}

export { lapikitPreprocess };
