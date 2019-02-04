
varying vec2 vUV;
varying vec4 vClipVertex;

uniform sampler2D textureSampler;
uniform float wMinThreshold;
uniform float wMaxThreshold;
uniform float xClip;
uniform float yClip;
uniform float zClip;
uniform vec3 pOffset;

void main()
{
    vec4 src = texture2D(textureSampler, vUV);
    float intensity = src.r;//(src.r-wMinThreshold)/(wMaxThreshold-wMinThreshold);
    gl_FragColor.rgb = vec3(intensity, intensity, intensity);
    if (vClipVertex.x/vClipVertex.w-pOffset.x > xClip)
        src.a = 0.0;
    if (vClipVertex.y/vClipVertex.w-pOffset.y > yClip)
        src.a = 0.0;
    if (vClipVertex.z/vClipVertex.w-pOffset.z > zClip)
        src.a = 0.0;
    gl_FragColor.a = (src.r > wMinThreshold && src.r < wMaxThreshold) ? src.a*0.6 : 0.0;
}
