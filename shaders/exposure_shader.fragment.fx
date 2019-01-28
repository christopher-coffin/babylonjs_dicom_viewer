
varying vec2 vUV;

uniform sampler2D textureSampler;
uniform float exposure;

void main()
{
    vec4 src = texture2D(textureSampler, vUV);
    gl_FragColor.rgb = src.rgb*exposure;
    gl_FragColor.a = src.a;
}
