/* eslint-disable no-undef */
global.__DEV__ = true;

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));


jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(),
}));

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(),
  getToken: jest.fn(() => Promise.resolve('mock-token')),
  requestPermission: jest.fn(),
  onMessage: jest.fn(),
  onNotificationOpenedApp: jest.fn(),
  getInitialNotification: jest.fn(),
  onTokenRefresh: jest.fn(),
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));
jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const React = require('react');
  return {
    KeyboardAwareScrollView: ({ children }) => React.createElement(React.Fragment, null, children),
  };
});

jest.mock('react-native-modal', () => {
  const React = require('react');
  return ({ children }) =>
    React.createElement(React.Fragment, null, children);
});


