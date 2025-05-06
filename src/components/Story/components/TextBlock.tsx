import React, {useEffect, useRef} from 'react';
import {Tooltip} from "../../Auxiliary/Tooltip.tsx";


function TextBlock({
                       value,
                       onChange,
                       className = '',
                       style = {},
                       placeholder = "Введите текст",
                       caption = null,
                       hint = null
                   }) {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [textareaRef]);

    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    return (

        <div className={"position-relative " + (caption ? 'mt-2 ' : '') + className}>
            {caption && <div className="absolute flex !flex-row select-none top-[-0.7em] left-[1em]">
                <Tooltip style={{fontSize: '.8em'}} text={placeholder}>
                    <div
                        className="px-2 rounded-full border bg-white text-[.9em]/[0.7] pt-[3px] pr-0 pb-[4px] pl-0">{caption}</div>
                </Tooltip>
            </div>}
            <textarea value={value}
                      onChange={onChange}
                      ref={textareaRef}
                      onInput={handleInput}
                      rows={1}
                // placeholder={placeholder}
                      className={"form-control no-resize"}
                      style={{overflow: 'hidden', ...style}}></textarea>
        </div>);
}

export default TextBlock;