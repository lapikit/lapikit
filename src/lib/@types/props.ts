export type PropValue = string | boolean | number | null | undefined;
export type SizeType = 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type RoundedType = 0 | '0' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DensityType = 'none' | 'compact' | 'default' | 'comfortable';
export type ElevationType = '0' | '1' | '2' | '3' | '4' | '5';

export interface ElevationState {
	base?: ElevationType;
	hover?: ElevationType;
	active?: ElevationType;
}

export type ElevationProps = ElevationType | ElevationState;
