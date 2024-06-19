// Write your tests here
import React from "react";
import { render, fireEvent } from '@testing-library/react';
import AppFunctional from "./AppFunctional";
import '@testing-library/jest-dom/extend-expect';

test('renders the initial state correct', () => {
  const { getByText, getByPlaceholderText } = render(<AppFunctional />);
  expect(getByText('Coordinates (2, 2)')).toBeInTheDocument();
  expect(getByText('You moved 0 times')).toBeInTheDocument();
  expect(getByPlaceholderText('type email')).toHaveValue('');
});

test('moves the B when a direction button is clicked', () => {
  const { getByText, getByTestId } = render(<AppFunctional />);
  fireEvent.click(getByTestId('up'));
  expect(getByText('Coordinates (2, 1)')).toBeInTheDocument();
  expect(getByText('You moved 1 time')).toBeInTheDocument();
});

test('resets the state when the reset button is clicked', () => {
  const { getByText, getByPlaceholderText, getByTestId } = render(<AppFunctional />);
  fireEvent.click(getByTestId('up'));
  fireEvent.click(getByTestId('reset'));
  expect(getByText('Coordinates (2, 2)')).toBeInTheDocument();
  expect(getByText('You moved 0 times')).toBeInTheDocument();
  expect(getByPlaceholderText('type email')).toHaveValue('');
});

test('does not move the B when an invalid direction is clicked', () => {
  const { getByText, getByTestId } = render(<AppFunctional />);
  fireEvent.click(getByTestId('up'));
  fireEvent.click(getByTestId('up'));
  expect(getByText("You can't go up")).toBeInTheDocument();
  expect(getByText('Coordinates (2, 1)')).toBeInTheDocument();
  expect(getByText('You moved 1 time')).toBeInTheDocument();
});

test('updates the email state when the email input is changed', () => {
  const { getByPlaceholderText } = render(<AppFunctional />);
  fireEvent.change(getByPlaceholderText('type email'), {target: {value: 'test@example.com'} });
  expect(getByPlaceholderText('type email')).toHaveValue('test@example.com');
});


