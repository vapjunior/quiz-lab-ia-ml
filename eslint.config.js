import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'coverage/**', 'playwright-report/**', 'test-results/**', '.agents/**'] },
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  {
    files: ['src/**/*.{js,vue}', 'tests/unit/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['*.config.js', 'scripts/**/*.mjs', 'tests/**/*.{js,mjs}'],
    languageOptions: { globals: globals.node },
  },
]
