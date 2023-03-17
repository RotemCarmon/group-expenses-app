module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  transform: {
    // process `*.vue` files with `vue-jest`
    // '.*\\.(vue)$': 'vue-jest'
    '.*\\.(vue)$': '@vue/vue2-jest'
  },
  verbose: true,
  // setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.js'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // '../api': '<rootDir>/src/api/__mocks__/fake-api.js'
  },
  transformIgnorePatterns: ["/node_modules/(?!axios)"],

}
