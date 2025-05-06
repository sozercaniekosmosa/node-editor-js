// Возможные направления подсказки
import clsx from "clsx";

export type TooltipDirection = 'top' | 'right' | 'bottom' | 'left';

// Пропсы компонента
interface TooltipProps {
    text: string;
    direction?: TooltipDirection;
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

// Классы позиционирования подсказки
const tooltipPositionClasses: Record<TooltipDirection, string> = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-1',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-1',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-1',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-1',
};

// Классы позиционирования стрелки
const arrowPositionClasses: Record<TooltipDirection, string> = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-4 border-b-0 border-transparent border-t-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-4 border-l-0 border-transparent border-r-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-4 border-t-4 border-transparent border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-4 border-r-0 border-transparent border-l-gray-800',
};
let scAni = 'opacity-0 group-hover:opacity-100 transition-opacity duration-300';

// Компонент Tooltip
export const Tooltip: React.FC<TooltipProps> = ({text, direction = 'right', style, className, children}) => {
    return <div className="group relative inline-block">
        {children}
        <div
            className={clsx(
                'absolute z-10 bg-gray-800 text-white text-xs rounded-sm py-1 px-2 shadow-md',
                'whitespace-nowrap pointer-events-none',
                scAni,
                tooltipPositionClasses[direction],
                className,
            )}
            style={style}
        >
            {text}
            <div
                className={[
                    'absolute w-0 h-0 border',
                    arrowPositionClasses[direction]
                ].join(' ')}
            />
        </div>
    </div>;
};