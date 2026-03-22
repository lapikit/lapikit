import { liliCore } from '$lib/framework';
import type { LapikitPreprocessOptions } from '$lib/@types';

function lapikitPreprocess(options?: LapikitPreprocessOptions) {
	return liliCore(options);
}

export { lapikitPreprocess };
