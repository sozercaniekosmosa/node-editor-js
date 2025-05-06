import React from "react";

// const NestedList: React.FC<any> = ({obj, parent = null, index, onInsert = null}) => {
const NestedList = ({list, parent = null, index = null, onInsert = null}) => {
    return onInsert && onInsert({
        parent, list, index,
        child: list.arrChild.length > 0 && list.arrChild.map((child, index) => <NestedList key={index} list={child} parent={list} index={index}
                                                                                           onInsert={onInsert}/>)
    });
};

export default NestedList;