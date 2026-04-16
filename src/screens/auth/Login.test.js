jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const React = require('react');
  return {
    KeyboardAwareScrollView: ({ children }) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock('react-native-flash-message', () => ({
  showMessage: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

// jest.mock('@components/CommonLoader', () => ({
//   CommonLoader: () => ({
//     showLoader: jest.fn(),
//     hideLoader: jest.fn(),
//   }),
//   CommonLoaderProvider: ({ children }) => children,
// }));

jest.mock('@redux/store/hooks', () => ({
  useAppDispatch: () => jest.fn(() => Promise.resolve()),
}));


import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
//import { CommonLoaderProvider } from '@components/CommonLoader';
import Login from './login';
import { Text } from 'react-native';

// mocks


// reusable wrapper
const renderWithProvider = (ui) => {
  return render(
   <NavigationContainer>
      {/* <CommonLoaderProvider> */}
        <SafeAreaProvider>{ui}</SafeAreaProvider>
      {/* </CommonLoaderProvider> */}
    </NavigationContainer>
  );
};

describe('Login Screen', () => {
  test('show error when fields are empty', () => {
    const { getByTestId, getByText } = renderWithProvider(<Login />);
    fireEvent.press(getByTestId('Login'));
    expect(getByText('All fields required')).toBeTruthy();
  });

  test('user can type email and password', () => {
    const { getByPlaceholderText } = renderWithProvider(<Login />);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@gmail.com');
    fireEvent.changeText(passwordInput, 'password@123');

    expect(emailInput.props.value).toBe('test@gmail.com');
    expect(passwordInput.props.value).toBe('password@123');
  });

  test('debug', () => {
  const { getByText } = renderWithProvider(<Text>Test</Text>);
});

  test('no error when valid input', () => {
    const { getByPlaceholderText, getByTestId, queryByText } =
      renderWithProvider(<Login />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password@123');

    fireEvent.press(getByTestId('Login'));

    expect(queryByText('All fields required')).toBeNull();
  });

});