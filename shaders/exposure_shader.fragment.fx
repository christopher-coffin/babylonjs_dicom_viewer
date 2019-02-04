
varying vec2 vUV;
varying vec4 vClipVertex;

uniform sampler2D textureSampler;
uniform float wMinThreshold;
uniform float wMaxThreshold;
uniform float xClip;
uniform float yClip;
uniform float zClip;
uniform float rThreshold;
uniform float gThreshold;
uniform float bThreshold;
uniform float colorEnabled;
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
    if (intensity <= rThreshold)
        gl_FragColor.rgb = vec3(intensity, 0,0);
    else if (intensity > rThreshold && intensity <= gThreshold)
        gl_FragColor.rgb = vec3(0, intensity, 0);
    else
        gl_FragColor.rgb = vec3(0, 0, intensity);
    gl_FragColor.a = (intensity > wMinThreshold && intensity < wMaxThreshold) ? src.a*0.6 : 0.0;
}
