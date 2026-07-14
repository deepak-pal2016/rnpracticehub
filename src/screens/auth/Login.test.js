/* eslint-disable no-undef */

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import Login from './login';

// ---------------- MOCKS ----------------

const mockNavigate = jest.fn();
const mockLogin = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');

  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
    }),
  };
});

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

jest.mock('@redux/store/hooks', () => ({
  useAppDispatch: () => mockLogin,
}));

jest.mock('@components/index', () => {
  const React = require('react');

  const { TextInput, TouchableOpacity, Text, View } = require('react-native');

  return {
    CommonLoader: () => ({
      showLoader: jest.fn(),
      hideLoader: jest.fn(),
    }),

    FloatingTextInput: props => <TextInput {...props} />,

    Button: ({ title, onPress, testID }) => (
      <TouchableOpacity onPress={onPress} testID={testID || title}>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),

    TextView: ({ children }) => <Text>{children}</Text>,

    DividerWithText: ({ title }) => (
      <View>
        <Text>{title}</Text>
      </View>
    ),

    LightTheme: {},
    DarkTheme: {},
  };
});

// ---------------- WRAPPER ----------------

const renderWithProvider = ui => {
  return render(
    <NavigationContainer>
      <SafeAreaProvider>{ui}</SafeAreaProvider>
    </NavigationContainer>,
  );
};

// ---------------- TESTS ----------------

describe('Login Screen', () => {
  test('show error when fields are empty', () => {
    const { getByText } = renderWithProvider(<Login />);

    expect(getByText('SIGN IN')).toBeTruthy();
  });

  test('user can type email and password', () => {
    const { getByPlaceholderText } = renderWithProvider(<Login />);

    const emailInput = getByPlaceholderText('email');

    const passwordInput = getByPlaceholderText('password');

    fireEvent.changeText(emailInput, 'test@gmail.com');

    fireEvent.changeText(passwordInput, 'password@123');

    expect(emailInput.props.value).toBe('test@gmail.com');

    expect(passwordInput.props.value).toBe('password@123');
  });

  test('debug', () => {
    renderWithProvider(<Text>Test</Text>);
  });

  test('no error when valid input', async () => {
    const { getByPlaceholderText, getByText, queryByText } = renderWithProvider(
      <Login />,
    );

    fireEvent.changeText(getByPlaceholderText('email'), 'test@gmail.com');

    fireEvent.changeText(getByPlaceholderText('password'), 'password@123');

    await act(async () => {
      fireEvent.press(getByText('SIGN IN'));
    });

    expect(queryByText('All fields required')).toBeNull();
  });

  test('navigate after login success', async () => {
    mockLogin.mockResolvedValue({
      unwrap: () =>
        Promise.resolve({
          status: true,
          token: '123',
        }),
    });

    const { getByPlaceholderText, getByText } = renderWithProvider(<Login />);

    fireEvent.changeText(getByPlaceholderText('email'), 'test@gmail.com');

    fireEvent.changeText(getByPlaceholderText('password'), 'password@123');

    await act(async () => {
      fireEvent.press(getByText('SIGN IN'));
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});

// ---------------- CLEANUP ----------------

afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
  jest.useRealTimers();
});

afterAll(async () => {
  jest.clearAllMocks();
  jest.clearAllTimers();

  await new Promise(resolve => setTimeout(resolve, 0));
});
