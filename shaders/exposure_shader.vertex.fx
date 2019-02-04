// Attributes
attribute vec3 position;
attribute vec2 uv;

// Uniforms
uniform mat4 world;
uniform mat4 worldViewProjection;

varying vec2 vUV;
varying vec4 vClipVertex;

void main()
{
    gl_Position = worldViewProjection * vec4(position, 1.0);
    vClipVertex = world*vec4(position, 1.0);
    vUV = uv;
}
