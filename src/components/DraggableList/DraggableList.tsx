import React, {useRef, useState} from 'react';
import './style.css'

const toLocalPos = ({target, clientX, clientY}) => {
    var {left, top} = target.getBoundingClientRect();
    return {x: clientX - left, y: clientY - top};
};

const _arrMoveItem = (arr, fromIndex, toIndex) => {
    if (fromIndex < 0 || fromIndex >= arr.length || toIndex < 0 || toIndex >= arr.length) {
        throw new Error('Индексы выходят за пределы массива');
    }

    // Извлекаем элемент из старого индекса
    const element = arr.splice(fromIndex, 1)[0];

    // Вставляем элемент на новый индекс
    arr.splice(toIndex, 0, element);

    return arr;
};

const DraggableList = ({
                           className = '',
                           onChange = (i: any, to: any) => null,
                           arrData,
                           setArrData,
                           onClick = null,
                           onGetElement
                       }) => {
    const [nodeDragging, setNodeDragging] = useState(null);
    const [selectIndex, setSelectIndex] = useState(null);
    const [isCenter, setIsCenter] = useState(false);
    const [isLeftSide, setIsLeftSide] = useState(false);
    const [isClose, setIsClose] = useState(false);
    const [_target, setTarget] = useState(null);

    const nodeContainerRef = useRef(null);

    const handleDragStart = (event) => {
        const target = event.target;
        setNodeDragging(target);
        setSelectIndex([...target.parentElement.children].findIndex(it => it === target));
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        const target = event.target;
        const {x, y} = toLocalPos(event);

        if (!event.target.draggable) return;
        if (!nodeDragging) return;

        target.classList.remove('dragover');
        _target?.classList.remove('dragover');

        if (target === nodeDragging) return;

        target.classList.add('dragover');

        setTarget(target);
    };

    const handleDrop = (event) => {
        // debugger
        event.preventDefault();
        const target = event.target;

        if (!nodeDragging) return;
        if (target === nodeDragging) return;

        let node = nodeDragging;
        // node.classList.add('sortable');
        // node.setAttribute('draggable', true);
        target.classList.remove('dragover')

        const targetIndex = event.target.dataset.index;
        const nodeIndex = node.dataset.index;

        // console.log(targetIndex, nodeIndex)
        // target.after(node);

        // const _arr = arrMoveItem(arrItems, nodeIndex, targetIndex);
        // setArrItems(_arr);

        setNodeDragging(null);
        setTarget(null);

        setArrData(_arrMoveItem(arrData, nodeIndex, targetIndex))
        onChange(nodeIndex, targetIndex);
    };

    return <div ref={nodeContainerRef} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}
                className={className} style={{height: 'inherit'}}>
        {arrData.map((val, i) => React.cloneElement(onGetElement(val, i), {
            draggable: true,
            ['data-index']: i,
            onClick: onClick,
            key: i
        }))}
    </div>
};

export default DraggableList;