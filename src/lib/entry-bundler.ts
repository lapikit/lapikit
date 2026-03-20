import { liliCore } from '$lib/compiler/preprocess';
import type { LapikitPreprocessOptions } from '$lib/compiler/types/options';

function lapikitPreprocess(options?: LapikitPreprocessOptions) {
	return liliCore(options);
}

export { lapikitPreprocess };
