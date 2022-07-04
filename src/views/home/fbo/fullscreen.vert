precision highp float;

varying vec2 v_coordinates;

void main (void) {
  v_coordinates = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position, 1.0);
}