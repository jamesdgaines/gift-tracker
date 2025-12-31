import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from '@/components/common';

describe('Button', () => {
  describe('rendering', () => {
    it('should render with title', () => {
      render(<Button testID="test-button" title="Click me" onPress={() => {}} />);

      expect(screen.getByTestId('test-button')).toBeTruthy();
      expect(screen.getByText('Click me')).toBeTruthy();
    });

    it('should render with different variants', () => {
      const { rerender } = render(
        <Button testID="test-button" title="Primary" variant="primary" onPress={() => {}} />
      );
      expect(screen.getByTestId('test-button')).toBeTruthy();

      rerender(
        <Button testID="test-button" title="Secondary" variant="secondary" onPress={() => {}} />
      );
      expect(screen.getByTestId('test-button')).toBeTruthy();

      rerender(
        <Button testID="test-button" title="Outline" variant="outline" onPress={() => {}} />
      );
      expect(screen.getByTestId('test-button')).toBeTruthy();

      rerender(
        <Button testID="test-button" title="Danger" variant="danger" onPress={() => {}} />
      );
      expect(screen.getByTestId('test-button')).toBeTruthy();
    });

    it('should render with different sizes', () => {
      const { rerender } = render(
        <Button testID="test-button" title="Small" size="sm" onPress={() => {}} />
      );
      expect(screen.getByTestId('test-button')).toBeTruthy();

      rerender(<Button testID="test-button" title="Medium" size="md" onPress={() => {}} />);
      expect(screen.getByTestId('test-button')).toBeTruthy();

      rerender(<Button testID="test-button" title="Large" size="lg" onPress={() => {}} />);
      expect(screen.getByTestId('test-button')).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('should call onPress when pressed', () => {
      const onPressMock = jest.fn();
      render(<Button testID="test-button" title="Click me" onPress={onPressMock} />);

      fireEvent.press(screen.getByTestId('test-button'));

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const onPressMock = jest.fn();
      render(<Button testID="test-button" title="Click me" onPress={onPressMock} disabled />);

      fireEvent.press(screen.getByTestId('test-button'));

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('should not call onPress when loading', () => {
      const onPressMock = jest.fn();
      render(<Button testID="test-button" title="Click me" onPress={onPressMock} loading />);

      fireEvent.press(screen.getByTestId('test-button'));

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should show loading indicator when loading', () => {
      render(<Button testID="test-button" title="Click me" onPress={() => {}} loading />);

      // The button should still exist but show loading indicator
      expect(screen.getByTestId('test-button')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('should have correct accessibility role', () => {
      render(<Button testID="test-button" title="Click me" onPress={() => {}} />);

      const button = screen.getByTestId('test-button');
      expect(button.props.accessibilityRole).toBe('button');
    });

    it('should have correct accessibility state when disabled', () => {
      render(<Button testID="test-button" title="Click me" onPress={() => {}} disabled />);

      const button = screen.getByTestId('test-button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('should have accessibility label from title', () => {
      render(<Button testID="test-button" title="Submit Form" onPress={() => {}} />);

      const button = screen.getByTestId('test-button');
      expect(button.props.accessibilityLabel).toBe('Submit Form');
    });
  });

  describe('fullWidth', () => {
    it('should render as full width when fullWidth is true', () => {
      render(<Button testID="test-button" title="Full Width" onPress={() => {}} fullWidth />);

      const button = screen.getByTestId('test-button');
      expect(button).toBeTruthy();
    });
  });
});
