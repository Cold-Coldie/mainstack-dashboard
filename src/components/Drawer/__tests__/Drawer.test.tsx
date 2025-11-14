import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Drawer from '../Drawer';

// Mock ReactDOM.createPortal
jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (children: React.ReactNode, container: Element) => children,
}));

// Mock CSS modules
jest.mock('./Drawer.module.css', () => ({
    overlay: 'overlay',
    drawer: 'drawer',
    content: 'content',
}));

describe('Drawer', () => {
    const mockOnClose = jest.fn();
    const defaultProps = {
        show: true,
        onClose: mockOnClose,
        children: <div>Drawer Content</div>,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        document.body.style.overflow = ''; // Reset body overflow
    });

    test('renders nothing when show is false', () => {
        const { container } = render(<Drawer {...defaultProps} show={false} />);
        expect(container.firstChild).toBeNull();
    });

    test('does not call onClose when clicking inside the drawer', () => {
        render(<Drawer {...defaultProps} />);

        const drawerContent = screen.getByText('Drawer Content');
        fireEvent.mouseDown(drawerContent);

        expect(mockOnClose).not.toHaveBeenCalled();
    });

    test('calls onClose when Escape key is pressed', () => {
        render(<Drawer {...defaultProps} />);

        fireEvent.keyDown(document, { key: 'Escape' });

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose when other keys are pressed', () => {
        render(<Drawer {...defaultProps} />);

        fireEvent.keyDown(document, { key: 'Enter' });
        fireEvent.keyDown(document, { key: 'Tab' });
        fireEvent.keyDown(document, { key: ' ' });

        expect(mockOnClose).not.toHaveBeenCalled();
    });

    test('locks body scroll when drawer is open', () => {
        const { unmount } = render(<Drawer {...defaultProps} />);

        expect(document.body.style.overflow).toBe('hidden');

        unmount();

        expect(document.body.style.overflow).toBe('');
    });

    test('unlocks body scroll when drawer is closed', () => {
        const { rerender } = render(<Drawer {...defaultProps} show={true} />);

        expect(document.body.style.overflow).toBe('hidden');

        rerender(<Drawer {...defaultProps} show={false} />);

        expect(document.body.style.overflow).toBe('');
    });

    test('cleans up event listeners on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

        const { unmount } = render(<Drawer {...defaultProps} />);

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

        removeEventListenerSpy.mockRestore();
    });

    test('adds event listeners when drawer opens', () => {
        const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

        render(<Drawer {...defaultProps} />);

        expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

        addEventListenerSpy.mockRestore();
    });

    test('removes event listeners when drawer closes', () => {
        const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

        const { rerender } = render(<Drawer {...defaultProps} show={true} />);

        rerender(<Drawer {...defaultProps} show={false} />);

        expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

        removeEventListenerSpy.mockRestore();
    });

    test('handles complex children content', () => {
        const complexChildren = (
            <div>
                <h1>Title</h1>
                <p>Description</p>
                <button>Action</button>
            </div>
        );

        render(<Drawer {...defaultProps} children={complexChildren} />);

        expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    test('renders in portal container', () => {
        // Since we mocked createPortal, the component should render normally
        render(<Drawer {...defaultProps} />);

        expect(screen.getByText('Drawer Content')).toBeInTheDocument();
    });
});

// Additional tests for edge cases
describe('Drawer Edge Cases', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('does not add event listeners when initially not shown', () => {
        const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

        render(<Drawer show={false} onClose={mockOnClose} children={<div>Content</div>} />);

        expect(addEventListenerSpy).not.toHaveBeenCalledWith('mousedown', expect.any(Function));
        expect(addEventListenerSpy).not.toHaveBeenCalledWith('keydown', expect.any(Function));

        addEventListenerSpy.mockRestore();
    });

    test('handles rapid open/close cycles', () => {
        const { rerender } = render(
            <Drawer show={true} onClose={mockOnClose} children={<div>Content</div>} />
        );

        // Rapidly toggle show state
        rerender(<Drawer show={false} onClose={mockOnClose} children={<div>Content</div>} />);
        rerender(<Drawer show={true} onClose={mockOnClose} children={<div>Content</div>} />);
        rerender(<Drawer show={false} onClose={mockOnClose} children={<div>Content</div>} />);

        // Should not throw errors and should clean up properly
        expect(document.body.style.overflow).toBe('');
    });
});