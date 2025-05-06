import {useState, useRef, useEffect} from 'react';

// Типы для пропсов
interface DropdownProps {
    label: string;
    children: React.ReactNode;
}

interface DropdownItemProps {
    href: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

// Хук для обработки кликов вне элемента
const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [callback]);

    return ref;
};

// Компонент элемента выпадающего списка
const DropdownItem: React.FC<DropdownItemProps> = ({
                                                       href,
                                                       children,
                                                       style,
                                                       className = 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                                                   }) => {
    return (
        <a
            href={href}
            style={style}
            className={className}
        >
            {children}
        </a>
    );
};

// Основной компонент Dropdown
const Dropdown: React.FC<DropdownProps> & { Item: typeof DropdownItem } = ({
                                                                               label,
                                                                               children
                                                                           }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useOutsideClick(() => setIsOpen(false));

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                id="menu-button"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {label}
                <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                >
                    <div className="py-1" role="none">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

// Добавляем Item как статическое свойство
Dropdown.Item = DropdownItem;

export default Dropdown;