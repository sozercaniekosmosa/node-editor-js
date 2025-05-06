import React from "react";
import ButtonEx from "../../Auxiliary/ButtonEx.tsx";
import {clButton, stButton} from "../Story.tsx";
import TextBlock from "./TextBlock.tsx";
import Select from "../../Select/Select.tsx";


const Scene = ({book, setBook, param}) => {
    const {worlds, scenes, characters, objects} = book;
    const {parent, list, index, child} = param;
    const opt = list.data.opt;

    return <>
        <div className="d-flex flex-row gap-1 mb-1">
            {/*<SwitchFolder $hide={list.hide} onClick={() => (list.hide = !list.hide, setBook({...book}))}/>*/}

            {/*<BtnEx $variant="btn-danger bi-x-lg" description="Удалить" onConfirm={() => {*/}
            {/*    parent.arrChild.splice(index, 1);*/}
            {/*    setBook({...book})*/}
            {/*}}/>*/}
            {/*<BtnEx $variant={"btn-secondary bi-person-add"} onClick={() => {*/}
            {/*    list.arrChild.push({arrChild: [], data: {opt: 'character'}, hide: false});*/}
            {/*    setBook({...book})*/}
            {/*}}/>*/}
            {/*<BtnEx $variant={"btn-secondary bi-box"} onClick={() => {*/}
            {/*    list.arrChild.push({arrChild: [], data: {opt: 'object'}, hide: false});*/}
            {/*    setBook({...book})*/}
            {/*}}/>*/}
            {/*<BtnEx $variant={"btn-secondary bi-activity"} onClick={() => {*/}
            {/*    list.arrChild.push({arrChild: [], data: {opt: 'action'}, hide: false});*/}
            {/*    setBook({...book})*/}
            {/*}}/>*/}
            {/*<div className="align-content-center">{opt}</div>*/}
            {/*<BtnEx $variant={`btn-secondary bi-box-arrow-in-down-right`} onClick={() => {*/}
            {/*}}/>*/}
            {/*<SelectScene arrList={Object.keys(scenes)} value={list.data.scene} onChange={(key) => (list.data.scene = key, setBook({...book}))}/>*/}
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