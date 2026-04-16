/* eslint-disable no-label-var */
/* eslint-disable no-labels */

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  return {
    KeyboardAwareScrollView: ({ children }) => children,
  };
});
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Login from './login';
import { useDispatch } from 'react-redux';
import {showMessage} from 'react-native-flash-message';
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');
jest.mock('react-native-vector-icons/Entypo', () => 'Icon');
jest.mock('react-native-vector-icons/EvilIcons', () => 'Icon');

jest.mock('react-native-flash-message', () => ({
  showMessage: jest.fn(),
}));

jest.mock('react-redux', () => ({
   useDispatch: jest.fn(() => ({
      unwrap: () => Promise.resolve({ success: true, data: {} }),
    })),
}));



describe('login screen test', () => {
  // emplty field test
  test('show error when field are empty', () => {
    const { getByTestId } = render(<Login />);
    const loginbtn = getByTestId('Login');
    fireEvent.press(loginbtn);
    expect(getByTestId('All fields are required')).toBeTruthy();
  });
});

// input change test
test('user can type email and password', () => {
  const { getByPlaceholderText } = render(<Login />);
  const emailInput = getByPlaceholderText('email');
  const passwordInput = getByPlaceholderText('password');
  fireEvent.changeText(emailInput, 'test@gmail.com');
  fireEvent.changeText(passwordInput, 'passwrod@123');

  expect(emailInput.props.value).toBe('test@gmail.com');
  expect(passwordInput.props.value).toBe('passwrod@123');
});
//valid login test
test('no error when valid  input', () => {
  const { getByPlaceholderText, getByTestId, queryByText } = render(<Login />);
  fireEvent.changeText(getByPlaceholderText('email'), 'test@gmail.com');
  fireEvent.changeText(getByPlaceholderText('password'), 'passwrod@123');
  fireEvent.press(getByTestId('Login'));

  expect(queryByText('All fields required')).toBeNull();
});
