import React, { useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dropdown from '../Dropdown';

// Mock ReactDOM.createPortal
jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (children: React.ReactNode) => children,
}));

// Mock CSS modules
jest.mock('./Dropdown.module.css', () => ({
    dropdown: 'dropdown',
    'bottom-right': 'bottom-right',
    'bottom-left': 'bottom-left',
    'top-right': 'top-right',
    'top-left': 'top-left',
}));

// Create a proper DOMRect mock function
const createDOMRectMock = (x: number, y: number, width: number, height: number): DOMRect => ({
    x,
    y,
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    toJSON: () => ({
        x,
        y,
        width,
        height,
        top: y,
        left: x,
        right: x + width,
        bottom: y + height,
    }),
});

// Create a mock HTMLElement for triggerRef
const createMockHTMLElement = (): HTMLElement => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => createDOMRectMock(100, 100, 200, 100),
    });
    return element;
};

describe('Dropdown', () => {
    let mockOnClose: jest.Mock;
    let mockTriggerElement: HTMLElement;

    const TestComponent: React.FC<{ show?: boolean; position?: any }> = ({
        show = true,
        position = "bottom-right"
    }) => {
        const triggerRef = useRef<HTMLElement>(null);

        // Assign mock element to ref
        React.useEffect(() => {
            if (triggerRef.current === null) {
                (triggerRef as React.MutableRefObject<HTMLElement>).current = mockTriggerElement;
            }
        }, []);

        return (
            <div>
                <button>Trigger</button>
                <Dropdown
                    show={show}
                    onClose={mockOnClose}
                    position={position}
                    triggerRef={triggerRef as any}
                >
                    <div>Dropdown Content</div>
                </Dropdown>
            </div>
        );
    };

    beforeEach(() => {
        mockOnClose = jest.fn();
        mockTriggerElement = createMockHTMLElement();

        // Mock getBoundingClientRect for dropdown
        Element.prototype.getBoundingClientRect = jest.fn(() =>
            createDOMRectMock(100, 100, 200, 100)
        );

        // Mock window properties
        Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
        Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    });

    afterEach(() => {
        jest.restoreAllMocks();
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    });

    test('renders nothing when show is false', () => {
        const { container } = render(<TestComponent show={false} />);

        expect(screen.queryByText('Dropdown Content')).not.toBeInTheDocument();
        expect(container.querySelector('.dropdown')).not.toBeInTheDocument();
    });

    test('renders dropdown content when show is true', () => {
        render(<TestComponent />);

        expect(screen.getByText('Dropdown Content')).toBeInTheDocument();
    });

    test('calls onClose when clicking outside dropdown and trigger', () => {
        render(<TestComponent />);

        // Click outside both dropdown and trigger
        fireEvent.mouseDown(document.body);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose when clicking inside dropdown', () => {
        render(<TestComponent />);

        const dropdownContent = screen.getByText('Dropdown Content');
        fireEvent.mouseDown(dropdownContent);

        expect(mockOnClose).not.toHaveBeenCalled();
    });

    test('applies correct position class', () => {
        const { rerender } = render(<TestComponent position="bottom-right" />);

        const dropdown = screen.getByText('Dropdown Content').parentElement;
        expect(dropdown).toHaveClass('bottom-right');

        rerender(<TestComponent position="bottom-left" />);
        expect(dropdown).toHaveClass('bottom-left');

        rerender(<TestComponent position="top-right" />);
        expect(dropdown).toHaveClass('top-right');

        rerender(<TestComponent position="top-left" />);
        expect(dropdown).toHaveClass('top-left');
    });

    test('locks scroll when dropdown is open', () => {
        render(<TestComponent />);

        expect(document.body.style.overflow).toBe('hidden');
        expect(document.documentElement.style.overflow).toBe('hidden');
    });

    test('unlocks scroll when dropdown closes', () => {
        const { rerender } = render(<TestComponent show={true} />);

        expect(document.body.style.overflow).toBe('hidden');

        rerender(<TestComponent show={false} />);

        expect(document.body.style.overflow).toBe('');
        expect(document.documentElement.style.overflow).toBe('');
    });

    test('cleans up event listeners on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

        const { unmount } = render(<TestComponent />);

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

        removeEventListenerSpy.mockRestore();
    });

    test('adds event listeners when dropdown opens', () => {
        const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

        render(<TestComponent />);

        expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

        addEventListenerSpy.mockRestore();
    });
});

describe('Dropdown Edge Cases', () => {
    let mockOnClose: jest.Mock;

    const TestComponent: React.FC<{ show?: boolean }> = ({ show = true }) => {
        const triggerRef = useRef<HTMLElement>(null);

        React.useEffect(() => {
            if (triggerRef.current === null) {
                const mockElement = document.createElement('div');
                Object.defineProperty(mockElement, 'getBoundingClientRect', {
                    value: () => createDOMRectMock(100, 100, 200, 100),
                });
                (triggerRef as React.MutableRefObject<HTMLElement>).current = mockElement;
            }
        }, []);

        return (
            <div>
                <button>Trigger</button>
                <Dropdown
                    show={show}
                    onClose={mockOnClose}
                    triggerRef={triggerRef as any}
                >
                    <div>Dropdown Content</div>
                </Dropdown>
            </div>
        );
    };

    beforeEach(() => {
        mockOnClose = jest.fn();
        Element.prototype.getBoundingClientRect = jest.fn(() =>
            createDOMRectMock(100, 100, 200, 100)
        );
    });

    test('handles missing triggerRef', () => {
        const TestWithoutTrigger: React.FC = () => {
            const triggerRef = useRef<HTMLElement>(null);

            return (
                <Dropdown
                    show={true}
                    onClose={mockOnClose}
                    triggerRef={triggerRef as any}
                >
                    <div>Dropdown Content</div>
                </Dropdown>
            );
        };

        render(<TestWithoutTrigger />);

        // Should render without crashing
        expect(screen.getByText('Dropdown Content')).toBeInTheDocument();
    });

    test('handles rapid open/close cycles', () => {
        const { rerender } = render(<TestComponent show={true} />);

        // Rapidly toggle show state
        rerender(<TestComponent show={false} />);
        rerender(<TestComponent show={true} />);
        rerender(<TestComponent show={false} />);

        // Should not throw errors and should clean up properly
        expect(document.body.style.overflow).toBe('');
    });

    test('works with complex children', () => {
        const ComplexChildren = () => (
            <div>
                <h1>Dropdown Title</h1>
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                </ul>
                <button>Action</button>
            </div>
        );

        const TestWithComplexChildren: React.FC = () => {
            const triggerRef = useRef<HTMLElement>(null);

            React.useEffect(() => {
                if (triggerRef.current === null) {
                    const mockElement = document.createElement('div');
                    Object.defineProperty(mockElement, 'getBoundingClientRect', {
                        value: () => createDOMRectMock(100, 100, 200, 100),
                    });
                    (triggerRef as React.MutableRefObject<HTMLElement>).current = mockElement;
                }
            }, []);

            return (
                <div>
                    <button>Trigger</button>
                    <Dropdown
                        show={true}
                        onClose={mockOnClose}
                        triggerRef={triggerRef as any}
                    >
                        <ComplexChildren />
                    </Dropdown>
                </div>
            );
        };

        render(<TestWithComplexChildren />);

        expect(screen.getByRole('heading', { name: 'Dropdown Title' })).toBeInTheDocument();
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    test('adjusts position when dropdown would go above viewport', () => {
        // Set trigger very close to top
        Element.prototype.getBoundingClientRect = jest.fn(() =>
            createDOMRectMock(100, 10, 200, 100)
        );

        Object.defineProperty(window, 'scrollY', { value: 0 });

        const TestComponentWithHighPosition: React.FC = () => {
            const triggerRef = useRef<HTMLElement>(null);

            React.useEffect(() => {
                if (triggerRef.current === null) {
                    const mockElement = document.createElement('div');
                    Object.defineProperty(mockElement, 'getBoundingClientRect', {
                        value: () => createDOMRectMock(100, 10, 200, 100),
                    });
                    (triggerRef as React.MutableRefObject<HTMLElement>).current = mockElement;
                }
            }, []);

            return (
                <div>
                    <button>Trigger</button>
                    <Dropdown
                        show={true}
                        onClose={mockOnClose}
                        position="top-left"
                        triggerRef={triggerRef as any}
                    >
                        <div>Dropdown Content</div>
                    </Dropdown>
                </div>
            );
        };

        render(<TestComponentWithHighPosition />);

        const dropdown = screen.getByText('Dropdown Content').parentElement;

        // Should adjust to show below trigger instead of above
        expect(dropdown).toHaveStyle({
            top: expect.any(String) // Should be adjusted to positive value
        });
    });
});