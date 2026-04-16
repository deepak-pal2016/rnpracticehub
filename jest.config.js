module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
   'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-flash-message|react-native-vector-icons|react-native-keyboard-aware-scroll-view|react-native-iphone-x-helper)/)',
  ],
 plugins:[
  [
    "module-resolver",
    {
      root:["./"],
      alias:{
        "@components": "./src/components",
        "@screens": "./src/screens",
        "@styles": "./src/styles",
        "@utils":"./src/utils",
        "@redux": "./src/redux",
        "@assets":"./src/assets",
        "@services":"./src/services"
      }
    }
  ]
 ]
};
