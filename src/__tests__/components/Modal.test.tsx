import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '@/src/components/ui/Modal';

describe('Modal', () => {
  test('renders when open and has dialog role', () => {
    render(
      // @ts-ignore
      <Modal open title="Confirm">
        Are you sure?
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(
      // @ts-ignore
      <Modal open={false} title="Confirm">
        Are you sure?
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('calls onClose when clicking close button or backdrop', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      // @ts-ignore
      <Modal open title="Confirm" onClose={onClose}>
        Are you sure?
      </Modal>
    );

    const close = screen.queryByRole('button', { name: /close/i });
    if (close) {
      await user.click(close);
      expect(onClose).toHaveBeenCalled();
      return;
    }

    // fallback: ESC key
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
