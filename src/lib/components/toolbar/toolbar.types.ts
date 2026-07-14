import type {
	Component,
	DensityType,
	ElevationProps,
	PropValue,
	RoundedType,
	SizeType
} from '$lib/@types';

type Variant = 'filled' | 'outline' | 'text';
type Orientation = 'horizontal' | 'vertical';

export interface ToolbarProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'header' | 'nav';
	variant?: Variant | Record<string, Variant>;
	rounded?: RoundedType | 'full';
	density?: DensityType;
	color?: string;
	orientation?: Orientation | Record<string, Orientation>;
	background?: string;
	classContent?: string | string[] | undefined;
	elevation?: ElevationProps;
	size?: SizeType;
	[key: string]: PropValue | Record<string, PropValue> | unknown;
}
