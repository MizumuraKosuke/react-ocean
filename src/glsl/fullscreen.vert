precision highp float;

varying vec2 v_coordinates;

void main (void) {
  v_coordinates = position.xy * .5 + .5;
  gl_Position = vec4(position, 1.);
}