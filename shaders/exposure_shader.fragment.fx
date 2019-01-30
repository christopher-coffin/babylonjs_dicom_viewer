
varying vec2 vUV;

uniform sampler2D textureSampler;
uniform float wMinThreshold;
uniform float wMaxThreshold;

void main()
{
    vec4 src = texture2D(textureSampler, vUV);
    float intensity = (src.r-wMinThreshold)/(wMaxThreshold-wMinThreshold);
    gl_FragColor.rgb = vec3(intensity, intensity, intensity);
    gl_FragColor.a = (src.r > wMinThreshold && src.r < wMaxThreshold) ? src.a : 0.0;
}
