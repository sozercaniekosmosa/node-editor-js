import React, {useEffect, useState} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../Auxiliary/ButtonEx.tsx";
import NestedList from "./components/NestedList.tsx";
import Select from "../Select/Select.tsx";
import Scene from "./components/Scene.tsx";
import TextBlock from "./components/TextBlock.tsx";
import GenScene from "./components/GenScene.tsx";
import {Tab, Tabs} from "../Auxiliary/Tabs.tsx";
// import GenCharacter from "./components/GenCharacter.tsx";

export const stButton = {width: '1.8em', height: '1.8em'}
export const clButton = ' btn btn-sm flex-grow-0 d-flex justify-content-center align-items-center'

const EMPTY = 'Пусто';
const ROOT = 'Содержание';
const INTRO = 'Вступление';
const MID = 'Основная часть';
const END = 'Заключение';
const CHAPTER = 'Глава';
const SCENE = 'Сцена';
const CHARACTER = 'Персонаж';
const OBJECT = 'Объект';
const ACTION = 'Действие';

export const PARTS = {EMPTY, ROOT, INTRO, MID, END, CHAPTER, SCENE, CHARACTER, OBJECT, ACTION,};
const arrControl = [EMPTY, CHARACTER, OBJECT, ACTION];

let BOOK = {
    "worlds": {},
    "scenes": {
        "": {},
        "Сцена: 01.04.2025 19:32:18": {
            "pointOfView": {"text": ""},
            "location": {"text": "1"},
            "detailsEnv": {"text": ""},
            "time": {"text": ""},
            "mood": {"text": ""},
            "sensors": {"text": ""},
            "symbols": {"text": ""}
        },
        "Сцена: 01.04.2025 19:32:29": {
            "pointOfView": {"text": ""},
            "location": {"text": "й"},
            "detailsEnv": {"text": ""},
            "time": {"text": ""},
            "mood": {"text": ""},
            "sensors": {"text": ""},
            "symbols": {"text": ""}
        }
    },
    "characters": {
        "": {}
    },
    "objects": {},
    "content": {
        "arrChild": [{"arrChild": [], "data": {"opt": "Вступление"}, "hide": false}, {
            "arrChild": [],
            "data": {"opt": "Основная часть"},
            "hide": false
        }, {"arrChild": [], "data": {"opt": "Заключение"}, "hide": false}], "data": {"opt": "Содержание"}, "hide": true
    }
};

const Base = ({book, setBook, param}) => {
    const {parent, list, index, child} = param;
    const {opt} = list.data
    return <>
        <ButtonEx style={stButton} className="btn-danger btn-sm bi-x-lg flex-grow-0" description="Удалить"
                  onConfirm={() => {
                      parent.arrChild.splice(index, 1);
                      setBook({...book});
                  }}/>
        <Select arrList={arrControl} value={opt} onChange={(key) => (list.data.opt = key, setBook({...book}))}
                style={{height: '1.7em', fontSize: '1.2em', lineHeight: 1.1}} className="ps-2 pe-5 py-0 w-auto"/>
    </>
};

const Action = ({book, setBook, param}) => {
    const {parent, list, index, child} = param;
    const {opt} = list.data
    return <div className="d-flex flex-column">
        <ButtonEx style={stButton} className="btn-danger btn-sm bi-x-lg flex-grow-0" description="Удалить"
                  onConfirm={() => {
                      parent.arrChild.splice(index, 1);
                      setBook({...book});
                  }}/>
        <div>Характер, предмет, сцена, диалог</div>
        <div>Описание действия</div>
        {/*<Select arrList={arrControl} value={opt} onChange={(key) => (list.data.opt = key, setBook({...book}))}*/}
        {/*        style={{height: '1.7em', fontSize: '1.2em', lineHeight: 1.1}} className="ps-2 pe-5 py-0 w-auto"/>*/}
    </div>
};

const Control = ({book, setBook, param}) => {
    const {parent, list, index, child} = param;
    const opt = list.data.opt;

    if (opt == ROOT) {
        return <>
            <div className="d-flex flex-row gap-1 mb-1">
                <Select arrList={['Шаблон - 1']} value={opt}
                        onChange={(key) => (list.data.opt = key, setBook({...book}))}
                        style={{height: '1.7em', fontSize: '1.2em', lineHeight: 1.1}}
                        className="flex-grow-0 ps-2 pe-5 py-0 w-auto mb-1"/>
            </div>
            <div className="flex-column border rounded p-1">{child}</div>
        </>
    } else if ((opt == INTRO) || (opt == MID) || (opt == END)) {
        return <>
            <div className="d-flex flex-row gap-1 mb-1">
                <ButtonEx style={stButton} className={`btn-secondary bi-${list.hide ? 'plus-' : ''}square` + clButton}
                          onClick={() => {
                              list.hide = !list.hide;
                              setBook({...book})
                          }}/>
                <ButtonEx style={stButton} className={"btn-secondary bi-plus-circle" + clButton} onClick={() => {
                    list.arrChild.push({arrChild: [], data: {opt: CHAPTER}, hide: false});
                    setBook({...book})
                }}/>
                <ButtonEx style={stButton} className="btn-danger btn-sm bi-x-lg flex-grow-0" description="Удалить"
                          onConfirm={() => {
                              parent.arrChild.splice(index, 1);
                              setBook({...book});
                          }}/>
                <div className="align-content-center">{opt}</div>
            </div>
            {!list.hide && <div className="flex-column border rounded p-1">{child}</div>}
        </>
    } else if (opt == CHAPTER) {
        return <>
            <div className="d-flex flex-row gap-1 mb-1">
                <ButtonEx style={stButton} className={`btn-secondary bi-${list.hide ? 'plus-' : ''}square` + clButton}
                          onClick={() => {
                              list.hide = !list.hide;
                              setBook({...book})
                          }}/>
                <ButtonEx style={stButton} className={"btn-secondary bi-plus-circle" + clButton} onClick={() => {
                    list.arrChild.push({
                        arrChild: [], data: {
                            opt: SCENE, scene: null, sceneDesc: {
                                pointOfView: '',
                                location: '',
                                detailsEnv: '',
                                time: '',
                                mood: '',
                                sensores: '',
                                symbols: '',
                            }
                        }, hide: false
                    });
                    setBook({...book})
                }}/>
                <ButtonEx style={stButton} className="btn-danger btn-sm bi-x-lg flex-grow-0" description="Удалить"
                          onConfirm={() => {
                              parent.arrChild.splice(index, 1);
                              setBook({...book});
                          }}/>
                <div className="align-content-center">{opt}</div>
            </div>
            {!list.hide && <div className="flex-column border rounded p-1">{child}</div>}
        </>
    } else if (opt == SCENE) {
        return <Scene book={book} setBook={setBook} param={param}/>
    } else if (opt == CHARACTER) {
        return <div className="d-flex flex-row gap-1 mb-1">
            <Base book={book} setBook={setBook} param={param}/>
        </div>
    } else if (opt == OBJECT) {
        return <div className="d-flex flex-row gap-1 mb-1">
            <Base book={book} setBook={setBook} param={param}/>
        </div>
    } else if (opt == ACTION) {
        return <div className="d-flex flex-row gap-1 mb-1">
            <Action book={book} setBook={setBook} param={param}/>
        </div>
    } else if (opt == EMPTY) {
        return <div className="d-flex flex-row gap-1 mb-1">
            <Base book={book} setBook={setBook} param={param}/>
        </div>
    } else {
        return <div className="d-flex flex-row gap-1 mb-1">
            <div className="bg-warning">Не существует такого элемента</div>
            <ButtonEx style={stButton} className="btn-danger btn-sm bi-x-lg flex-grow-0" description="Удалить"
                      onConfirm={() => {
                          parent.arrChild.splice(index, 1);
                          setBook({...book});
                      }}/>
        </div>
    }
}

const Storytelling: React.FC<any> = () => {

    const [book, setBook] = useState(BOOK);
    const [content, setContent] = useState(book.content);
    // @ts-ignore
    window.book = book;
    // @ts-ignore
    window.content = content;
    return <Tabs defaultActiveKey="plan" className="mb-1">
        <Tab eventKey="plan" title="План" style={{flex: 1}} className="h-100">
            <NestedList list={content} onInsert={param => {
                const {parent, list, index, child} = param;
                return <div className="d-flex flex-column m-1">
                    <Control book={book} setBook={setBook} param={param}/>
                </div>
            }}/>
        </Tab>
        <Tab eventKey="gen-scene" title="Сцена" style={{flex: 1}} className="h-100">
            <GenScene book={book} setBook={setBook}/>
        </Tab>
        <Tab eventKey="gen-character" title="Персонаж" style={{flex: 1}} className="h-100">
            {/*<GenCharacter book={book} setBook={setBook}/>*/}
        </Tab>
    </Tabs>
};

export default Storytelling;