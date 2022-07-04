precision highp float;

const float PI = 3.14159265359;
const float G = 9.81;
const float KM = 370.0;
const float CM = 0.23;

uniform vec2 u_wind;
uniform float u_resolution;
uniform float u_size;

float square (float x) {
  return x * x;
}

float omega (float k) {
  return sqrt(G * k * (1. + square(k / KM)));
}

void main (void) {
  vec2 coordinates = gl_FragCoord.xy - .5;
  float n = (coordinates.x < u_resolution * .5) ? coordinates.x : coordinates.x - u_resolution;
  float m = (coordinates.y < u_resolution * .5) ? coordinates.y : coordinates.y - u_resolution;
  vec2 waveVector = (2. * PI * vec2(n, m)) / u_size;
  float k = length(waveVector);

  float U10 = length(u_wind);

  float Omega = 0.84;
  float kp = G * square(Omega / U10);

  float c = omega(k) / k;
  float cp = omega(kp) / kp;

  float Lpm = exp(-1.25 * square(kp / k));
  float gamma = 1.7;
  float sigma = 0.08 * (1. + 4. * pow(Omega, -3.));
  float Gamma = exp(-square(sqrt(k / kp) - 1.) / 2. * square(sigma));
  float Jp = pow(gamma, Gamma);
  float Fp = Lpm * Jp * exp(-Omega / sqrt(10.) * (sqrt(k / kp) - 1.));
  float alphap = 0.006 * sqrt(Omega);
  float Bl = 0.5 * alphap * cp / c * Fp;

  float z0 = 0.000037 * square(U10) / G * pow(U10 / cp, 0.9);
  float uStar = 0.41 * U10 / log(10. / z0);
  float alpham = 0.01 * ((uStar < CM) ? (1. + log(uStar / CM)) : (1. + 3. * log(uStar / CM)));
  float Fm = exp(-0.25 * square(k / KM - 1.));
  float Bh = 0.5 * alpham * CM / c * Fm * Lpm;

  float a0 = log(2.) / 4.;
  float am = 0.13 * uStar / CM;
  float Delta = tanh(a0 + 4. * pow(c / cp, 2.5) + am * pow(CM / c, 2.5));

  float cosPhi = dot(normalize(u_wind), normalize(waveVector));

  float S = (1. / (2. * PI)) * pow(k, -4.) * (Bl + Bh) * (1. + Delta * (2. * cosPhi * cosPhi - 1.));

  float dk = 2. * PI / u_size;
  float h = sqrt(S / 2.) * dk;

  if (waveVector.x == 0. && waveVector.y == 0.) {
    h = 0.; //no DC term
  }

  gl_FragColor = vec4(h, 0., 0., 0.);
}