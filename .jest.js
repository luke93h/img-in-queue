const libDir = process.env.LIB_DIR;

const transformIgnorePatterns = [
  '/dist/',
  'node_modules\/[^/]+?\/(?!(es|node_modules)\/)', // Ignore modules without es dir
];

module.exports = {
  setupFiles: [
    './tests/setup.js',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'md',
  ],
  modulePathIgnorePatterns: [
    '/_site/',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    'dekko',
    'node',
  ],
  transform: {
    '\\.tsx?$': './node_modules/antd-tools/lib/jest/codePreprocessor',
    '\\.js$': './node_modules/antd-tools/lib/jest/codePreprocessor',
    '\\.md$': './node_modules/antd-tools/lib/jest/demoPreprocessor',
  },
  testRegex: libDir === 'dist' ? 'demo\\.test\\.js$' : '.*\\.test\\.js$',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/*/style/index.tsx',
    '!src/style/index.tsx',
    '!src/*/locale/index.tsx',
    '!src/*/__tests__/**/type.tsx',
    '!src/**/*/interface.{ts,tsx}',
  ],
  transformIgnorePatterns,
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.test.json',
    }
  },
  testURL: 'http://localhost',
  testEnvironmentOptions: { "resources": "usable" },
};
