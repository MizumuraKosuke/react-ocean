export const isProd = process.env.NODE_ENV === 'production'

// gl parameter
export const INITIAL_SIZE = 250
export const INITIAL_WIND = [ 10.0, 10.0 ]
export const INITIAL_CHOPPINESS = 1.5
export const CLEAR_COLOR = [ 1.0, 1.0, 1.0, 0.0 ]
export const GEOMETRY_ORIGIN = [ -1000.0, -1000.0 ]
export const SUN_DIRECTION = [ -1.0, 1.0, 1.0 ]
export const OCEAN_COLOR = [ 0.004, 0.016, 0.047 ]
export const SKY_COLOR = [ 3.2, 9.6, 12.8 ]
export const EXPOSURE = 0.35
export const GEOMETRY_RESOLUTION = 256 // Math.sqrt(5041)
export const GEOMETRY_SIZE = 2000
export const RESOLUTION = 512