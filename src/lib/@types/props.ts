export type PropValue = string | boolean | number | null | undefined;
export type SizeType = 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type RoundedType = 0 | '0' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DensityType = 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
export type VariantType = 'filled' | 'tonal' | 'outline' | 'surface' | 'text';
export type OverlayPositionType =
	| 'top'
	| 'center'
	| 'bottom'
	| 'top-left'
	| 'top-right'
	| 'center-left'
	| 'center-right'
	| 'bottom-left'
	| 'bottom-right';
export type ElevationType = '0' | '1' | '2' | '3' | '4' | '5' | 0 | 1 | 2 | 3 | 4 | 5;

export interface ElevationState {
	base?: ElevationType;
	hover?: ElevationType;
	active?: ElevationType;
}

export type ElevationProps = ElevationType | ElevationState;

export interface ColorState {
	base?: string | false;
	active?: string | false;
}

// false gives no color: color={isActive && 'accent'}
export type ColorProps = string | false | ColorState;
