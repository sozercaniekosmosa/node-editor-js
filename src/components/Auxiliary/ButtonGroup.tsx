const ButtonGroup = ({children, className = '', style = {}}) => {
    return <div className={"flex flex-row *:rounded-none *:first:rounded-l-sm *:last:rounded-r-sm " + className}
                style={style}>
        {children}
    </div>;
}

export default ButtonGroup;