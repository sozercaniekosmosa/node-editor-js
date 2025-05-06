import React from "react";


const Scene = ({book, setBook, param}) => {
    const {worlds, scenes, characters, objects} = book;
    const {parent, list, index, child} = param;
    const opt = list.data.opt;

    return <>
        <div className="d-flex flex-row gap-1 mb-1">

        </div>
        <div>
            {list.data?.scene && Object.entries(scenes[list.data.scene]).map((scene, idi) => {
                const [sceneParam, text] = scene;
                // @ts-ignore
                return <div key={idi}>{text.text}</div>
            })}
        </div>
        {!list.hide && <div className="flex-column border rounded p-1 mb-1">{child}</div>}
    </>
};

export default Scene;