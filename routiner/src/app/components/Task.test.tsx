/**
 * @jest-environment jsdom
*/

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Task from './Task';

describe('Task Component', () => {
  const mockTask = {
    title: 'Test Task',
    id: '1',
    day: 'Monday',
    date: '2025-05-01',
    startTime: '10:00',
    endTime: '11:00',
    checked: false,
  };

  const mockOnClick = jest.fn();

  it('renders the task title', () => {
    render(<Task task={mockTask} onClick={mockOnClick} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('renders the task date if provided', () => {
    render(<Task task={mockTask} onClick={mockOnClick} />);
    expect(screen.getByText('2025-05-01')).toBeInTheDocument();
  });

  it('does not render the date if not provided', () => {
    const taskWithoutDate = { ...mockTask, date: undefined };
    render(<Task task={taskWithoutDate} onClick={mockOnClick} />);
    expect(screen.queryByText('2025-05-01')).not.toBeInTheDocument();
  });

  it('renders the checkbox with the correct checked state', () => {
    render(<Task task={mockTask} onClick={mockOnClick} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('calls the onClick handler when the edit button is clicked', () => {
    render(<Task task={mockTask} onClick={mockOnClick} />);
    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});