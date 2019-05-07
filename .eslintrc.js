// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: false,
    node: true,
    es6: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    'semi': 0,
    'camelcase': 0,
    'spaced-comment': 0,
    'no-multiple-empty-lines': 0,
    'space-before-function-paren': 0,
    'quotes': 0,
    'indent': 0,
    'padded-blocks': 0,
    'eqeqeq': 0,
    'no-undef': 0,
    'space-before-blocks': 0,
    'no-extra-boolean-cast': 0,
    'no-unused-vars': 0,
    'comma-dangle': 0,
    'semi-spacing': 0,
    'one-var': 0
  },
  globals: {
    App: true,
    Page: true,
    wx: true,
    swan: true,
    tt: true,
    my: true,
    getApp: true,
    getPage: true,
    requirePlugin: true,
    mpvue: true,
    mpvuePlatform: true
  }
}