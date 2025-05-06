import React, {useState, useEffect, useRef} from 'react';

type DropdownVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
type DropdownSize = 'sm' | 'md' | 'lg';

interface DropdownProps {
    title?: string;
    variant?: DropdownVariant;
    size?: DropdownSize;
    children?: React.ReactNode;
}

const DropdownButton: React.FC<DropdownProps> = ({
                                                     title,
                                                     variant = 'secondary',
                                                     size = 'md',
                                                     children
                                                 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Map variants to Tailwind classes
    const variantClasses: Record<DropdownVariant, string> = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
        success: 'bg-green-600 hover:bg-green-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        info: 'bg-cyan-600 hover:bg-cyan-700 text-white',
        light: 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300',
        dark: 'bg-gray-800 hover:bg-gray-900 text-white'
    };

    // Map sizes to Tailwind classes
    const sizeClasses: Record<DropdownSize, string> = {
        sm: 'text-sm px-2 py-1',
        md: 'text-base px-3 py-2',
        lg: 'text-lg px-4 py-2'
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className={`inline-flex items-center justify-center w-full rounded-md ${variantClasses[variant]} ${sizeClasses[size]} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
                {title}
                <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    style={{
                        display: 'flex',
                        width: 'max-content',
                        maxHeight: '50vh',
                        flexDirection: 'column',
                        flexWrap: 'wrap'
                    }}
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 overflow-auto"
                >
                    {children}
                </div>
            )}
        </div>
    );
};

export default DropdownButton;