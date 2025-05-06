// Tabs.tsx
import clsx from 'clsx';
import React, {useState, ReactNode, createContext, useContext} from 'react';

interface TabContextType {
    activeKey: string | null;
    setActiveKey: (key: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

interface TabsProps {
    defaultActiveKey?: string;
    activeKey?: string;
    onSelect?: (key: string) => void;
    className?: string;
    children: ReactNode;
    id?: string;
}

export const Tabs = ({
                         defaultActiveKey,
                         activeKey,
                         onSelect,
                         className = '',
                         children,
                         id = '',
                     }: TabsProps) => {
    const [internalActiveKey, setInternalActiveKey] = useState<string>(
        defaultActiveKey || ''
    );

    const resolvedActiveKey = activeKey !== undefined ? activeKey : internalActiveKey;

    const handleSelect = (key: string) => {
        if (onSelect) {
            onSelect(key);
        } else {
            setInternalActiveKey(key);
        }
    };

    return (
        <TabContext.Provider value={{activeKey: resolvedActiveKey, setActiveKey: handleSelect}}>
            <div className={className}>
                <div role="tablist" className="flex border-black/20 border-b px-1">
                    {React.Children.map(children, (child) => {
                        if (!React.isValidElement(child) || child.type !== Tab) return null;

                        const key = child.props.eventKey;
                        const title = child.props.title;

                        return <div
                            key={key}
                            role="tab"
                            aria-selected={key === resolvedActiveKey}
                            onClick={() => handleSelect(key)}
                            className={clsx(
                                'px-2 py-1 mt-1 cursor-pointer select-none',
                                'rounded-t-sm border-1 border-inherit border-r-0 border-b-0 last:border-r-1',
                                'transition-colors duration-200 hover:bg-gray-300',
                                key === resolvedActiveKey ? 'bg-gray-200' : 'bg-none'
                            )}
                        >
                            {title}
                        </div>;
                    })}
                </div>
                <div className="h-full">
                    {React.Children.map(children, (child) => {
                        if (!React.isValidElement(child) || child.type !== Tab) return null;

                        const key = child.props.eventKey;
                        const className = child.props.className;

                        return (
                            <div
                                role="tabpanel"
                                hidden={key !== resolvedActiveKey}
                                className={clsx(
                                    'h-full',
                                    key === resolvedActiveKey ? 'block' : 'hidden',
                                    className
                                )}
                            >
                                {child.props.children}
                            </div>
                        );
                    })}
                </div>
            </div>
        </TabContext.Provider>
    );
};

interface TabProps {
    eventKey: string;
    title: string;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
}

export const Tab = ({eventKey, title, className = '', style, children}: TabProps) => {
    return <div className={className}>{children}</div>;
};