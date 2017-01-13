import commonjs from 'rollup-plugin-commonjs';
import npm from 'rollup-plugin-node-resolve';

export default {
    entry: 'index.js',
    dest: 'bundle.js',
    format: 'umd',
    moduleName: 'SVGCatmullRomSpline',
    plugins: [
        npm({ jsnext: true }),
        commonjs(),
    ],
};