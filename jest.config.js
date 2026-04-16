// module.exports = {
//   preset: 'react-native',
//   setupFiles: ['<rootDir>/jest.setup.js'],
//   transformIgnorePatterns: [
//     'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-flash-message|react-native-vector-icons|react-native-keyboard-aware-scroll-view|react-native-responsive-screen|react-native-modal|react-native-dropdown-picker|@react-native-community/datetimepicker|@reduxjs/toolkit|immer|@react-native-firebase)/)',
//   ],
//  plugins:[
//   [
//     "module-resolver",
//     {
//       root:["./"],
//       alias:{
//         "@components": "./src/components",
//         "@screens": "./src/screens",
//         "@styles": "./src/styles",
//         "@utils":"./src/utils",
//         "@redux": "./src/redux",
//         "@assets":"./src/assets",
//         "@services":"./src/services"
//       }
//     }
//   ]
//  ]
// };

module.exports = {
  preset: 'react-native',

  setupFiles: ['<rootDir>/jest.setup.js'],

  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-flash-message|react-native-vector-icons|react-native-keyboard-aware-scroll-view|react-native-responsive-screen|react-native-modal|react-native-dropdown-picker|@react-native-community/datetimepicker|@reduxjs/toolkit|immer|@react-native-firebase)/)',
  ],

  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@redux/(.*)$': '<rootDir>/src/redux/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@constant/(.*)$': '<rootDir>/src/constant/$1',
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
  },
};
