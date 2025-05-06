//0-ok, 1-processing, 2-error
import React, {useEffect, useState} from "react";
import Dialog from "./Dialog.tsx";
import {Tooltip} from "./Tooltip.tsx";
import Spinner from "./Spinner.tsx";
import clsx from "clsx";

function ButtonEx({
                      style = {},
                      className = '',
                      onAction = null,
                      onClick = null,
                      disabled = false,
                      hidden = false,
                      children = null,
                      onConfirm = null,
                      title = null,
                      dir = null,
                      description = 'Добавьте текст...',
                      text = '',
                      autoFocus = false
                  }) {
    const [_state, set_state] = useState(0)
    const [showAndDataEvent, setShowAndDataEvent] = useState<boolean | null | object>(false);


    let onAct = async (e) => {
        if (onConfirm) {
            setShowAndDataEvent(e)
            return e;
        }
        onClick && onClick(e)
        if (onAction) {
            set_state(1)
            const s = await onAction(e) //TODO: тут можно сделать try..catch на отлов ошибок или Promise callback
            setTimeout(() => set_state(s), 500);
        }
    }

    const btn = <div
        autoFocus={autoFocus}
        className={clsx(
            className,
            // 'w-6 h-6',
            'focus:outline-3 outline-gray-500/50 select-none',
            'bg-gray-500 text-white p-1 rounded-sm hover:bg-gray-600 transition',
            'flex justify-center items-center',
            _state == 2 ? '!outline-red-700 !outline-1 !outline-offset-1' : '',
            _state == 1 || disabled ? '!bg-gray-400 pointer-events-none' : ''
        )}
        onClick={onAct} hidden={hidden}>
        {_state == 1 && <Spinner/>}
        {hidden ? '' : children}
        {hidden ? '' : text}
    </div>


    return <>
        {hidden ? '' : (title ? <Tooltip text={title} direction={dir}>{btn}</Tooltip> : btn)}
        {onConfirm ?
            <Dialog title={description} message="Уверены?" show={showAndDataEvent} setShow={setShowAndDataEvent}
                    onConfirm={async () => onConfirm(showAndDataEvent)}
                    props={{className: 'modal-sm'}}/> : ''}
    </>
}

export default ButtonEx;