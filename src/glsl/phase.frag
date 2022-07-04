precision highp float;

const float PI = 3.14159265359;
const float G = 9.81;
const float KM = 370.0;

varying vec2 v_coordinates;

uniform sampler2D u_phases;

uniform float u_deltaTime;
uniform float u_resolution;
uniform float u_size;

float speed = 1.;

float omega (float k) {
  return sqrt(G * k * (1. + k * k / KM * KM));
}

void main (void) {
  vec2 coordinates = gl_FragCoord.xy - .5;
  float n = (coordinates.x < u_resolution * .5) ? coordinates.x : coordinates.x - u_resolution;
  float m = (coordinates.y < u_resolution * .5) ? coordinates.y : coordinates.y - u_resolution;
  vec2 waveVector = (2. * PI * vec2(n, m)) / u_size;

  float phase = texture2D(u_phases, v_coordinates).r;
  float deltaPhase = omega(length(waveVector)) * u_deltaTime * speed;
  phase = mod(phase + deltaPhase, 2. * PI);

  gl_FragColor = vec4(phase, 0., 0., 0.);
}