precision highp float;

attribute vec2 coordinates;

varying vec3 v_position;
varying vec2 v_coordinates;

uniform float u_size;
uniform float u_geometrySize;
uniform sampler2D u_displacementMap;

void main (void) {
  vec3 pos = position + texture2D(u_displacementMap, coordinates).rgb * (u_geometrySize / u_size);

  v_position = pos;
  v_coordinates = coordinates;

  gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
}