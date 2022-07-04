/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (conf) => {
    conf.module.rules.push({
      test: /\.(glsl|fs|vs|frag|vert)$/,
      exclude: /node_modules/,
      use: [
        'raw-loader',
        'glslify-loader',
      ],
    })
    return conf
  },
}
