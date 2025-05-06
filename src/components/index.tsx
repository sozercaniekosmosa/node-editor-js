import React, {useEffect, useRef, useState} from 'react'
import './style.css'
import ProgressBar from './ProgressBar/ProgressBar';
import {ERR, LOG, OK, PopupMessage, WARN} from "./PopupMessage/PopupMessage.tsx";
import {eventBus} from "../lib/events.ts";
import DropFile from "./DropFile/DropFile.tsx";
import ButtonEx from "./Auxiliary/ButtonEx.tsx";
import DraggableList from "./DraggableList/DraggableList.tsx";
import CodeEditor from "./CodeEditor/CodeEditor.tsx";
import {Editor, TEventEditor} from "./Editor/Editor.tsx";
import SimpleTable from "./Sheets/SimpleTable/SimpleTable.tsx";
import Story from './Story/Story.tsx';
import {Tab, Tabs} from './Auxiliary/Tabs.tsx';
import ButtonGroup from './Auxiliary/ButtonGroup.tsx';

function Index() {
    const [progress, setProgress] = useState(0)
    const [arrData, setArrData] = useState(['Элемент — 1', 'Элемент — 2', 'Элемент — 3'])
    const [newNode, setNewNode] = useState(null)
    const refTbl = useRef();

    useEffect(() => {

        const socketHandler = ({type, data}) => {
            if (type === 'progress') setProgress(data)
        };

        const localHandler = (({type, data}) => {
            console.log(type, data)
        });

        eventBus.addEventListener('message-socket', socketHandler);
        eventBus.addEventListener('message-local', localHandler)

        return () => {
            eventBus.removeEventListener('message-socket', socketHandler);
            eventBus.removeEventListener('message-local', localHandler);
        }
    }, [])

    //language=js
    let code = `
        function changeLang({target}) {
            lang = target.value;
            // setUpdate(Date.now())
            onChange(name, {code, lang, theme})
        }`;


    async function readExcel(e) {

        const file = e.target.files[0];
        const reader = new FileReader();

        // Читаем файл как ArrayBuffer
        reader.onload = async (event) => {
            const buffer = event.target.result;
            // await readExcelFile(buffer)
            e.target.value = null
        };

        reader.readAsArrayBuffer(file);

// Запускаем диалог выбора файла
//         input.click();
    }

    return (
        <div className="flex flex-col h-full">
            {progress >= 0 && <ProgressBar progress={progress}/>}
            <Tabs defaultActiveKey="editor" className="mb-1 h-full">

                {/*<Tab eventKey="report" title="report" style={{flex: 1}} className="h-100">*/}
                {/*    <Reports/>*/}
                {/*</Tab>*/}

                {/*<Tab eventKey="excel" title="excel" style={{flex: 1}} className="h-100">*/}
                {/*    <SpreadSheet data={doc} setData={setDoc}/>*/}
                {/*</Tab>*/}

                {/*<Tab eventKey="story" title="story" style={{flex: 1}} className="h-100">*/}
                {/*    <input type="file" accept=".xlsx, .xlsm, .xltx, .xltm" onChange={e => readExcel(e)}/>*/}
                {/*    <Storytelling/>*/}
                {/*    <Story/>*/}
                {/*</Tab>*/}

                <Tab eventKey="editor" title="Node — редактор" style={{flex: 1}} className="h-100">
                    <div className="flex gap-1 m-1">
                        <ButtonEx className="btn btn-secondary btn-sm " onClick={() => {
                            setNewNode({
                                nodeName: 'Подогрев нефти',
                                arrIn: ['T', 'P'],
                                arrOut: ['Продукт',],
                                color: '#d7d7d7'
                            })
                        }}>ПН</ButtonEx>
                        <ButtonEx className="btn btn-secondary btn-sm" onClick={() => {
                            setNewNode({nodeName: 'УУН', arrIn: ['in'], arrOut: ['V м3', 'M кг'], color: '#efc3a7'})
                        }}>УУН</ButtonEx>
                        <ButtonEx className="btn btn-secondary btn-sm" onClick={() => {
                            setNewNode({
                                nodeName: 'C-1',
                                arrIn: ['in'],
                                arrOut: ['L', 'T', 'Lн', 'Lг', 'Lв'],
                                color: '#a7cbef'
                            })
                        }}>C-1</ButtonEx>
                        Масштаб - (wheel mouse),
                        Удалить связь - (alt + r-button-mouse + move)
                    </div>
                    <Editor newNode={newNode} setNewNode={setNewNode} onEvent={({name, data}: TEventEditor) => {

                        switch (name) {
                            case 'init':
                                const nui = data;
                                nui.svg.innerHTML = '<g class="group-path" transform="translate(0,0)"><path class="link" stroke-linecap="round" d="M421.50000762939453 150.81248474121094 C 303.20052337646484 150.81248474121094, 362.3502655029297 225.81248474121094, 244.05078125 225.81248474121094" id="uDOZugD-uDOZtC9"></path><path class="link" stroke-linecap="round" d="M421.5 150.8125 C 323.6692708333333 150.8125, 372.5846354166667 59.8125, 274.75390625 59.8125" id="uDOZtZ5-uDOZtC9"></path></g><text x="0" y="0" class="node-text" opacity="0" id="temp-node-for-width-text">Подогрев нефти</text><g x="396" y="170.8125" class="node" data-node-name="C-1" data-cfg="" transform="translate(421.5,106.8125)" id="uDOZtC7"><rect x="0" y="-8" width="5" height="5" rx="1" stroke="#25334b" fill="#d5d5d5" class="node-status"></rect><rect x="0" y="0" width="55.33984375" height="88" rx="2" stroke="#25334b" fill="#a7cbef" class="handle"></rect><circle cx="0" cy="44" r="4" stroke="#25334b" fill="#bcffd6" class="pin-in" id="uDOZtC9" data-name="in" data-to="uDOZugD uDOZtZ5"></circle><text x="8" y="45" class="node-text" alignment-baseline="middle">in</text><circle cx="55.33984375" cy="12" r="4" stroke="#25334b" fill="#ffc69a" class="pin-out" id="uDOZtCb" data-name="L"></circle><text x="40.33984375" y="13" class="node-text" alignment-baseline="middle">L</text><circle cx="55.33984375" cy="28" r="4" stroke="#25334b" fill="#ffc69a" class="pin-out" id="uDOZtCc" data-name="T"></circle><text x="39.33984375" y="29" class="node-text" alignment-baseline="middle">T</text><circle cx="55.33984375" cy="44" r="4" stroke="#25334b" fill="#ffc69a" class="pin-out" id="uDOZtCd" data-name="Lн"></circle><text x="33.666015625" y="45" class="node-text" alignment-baseline="middle">Lн</text><circle cx="55.33984375" cy="60" r="4" stroke="#25334b" fill="#ffc69a" class="pin-out" id="uDOZtCe" data-name="Lг"></circle><text x="35.666015625" y="61" class="node-text" alignment-baseline="middle">Lг</text><circle cx="55.33984375" cy="76" r="4" stroke="#25334b" fill="#ffc69a" class="pin-out" id="uDOZtCf" data-name="Lв"></circle><text x="33.666015625" y="77" class="node-text" alignment-baseline="middle">Lв</text><text x="8" y="-2" class="node-text">C-1</text></g><g x="184" y="156.8125" class="node selected" data-node-name="УУН" data-cfg="" transform="translate(206.5,31.8125)" id="uDOZtZ1"><rect x="0" y="-8" width="5" height="5" rx="1" stroke="#25334b" fill="#d5d5d5" class="node-status"></rect><rect x="0" y="0" width="68.25390625" height="40" rx="2" stroke="#25334b" fill="#efc3a7" class="handle"></rect><circle cx="0" cy="20" r="4" stroke="#25334b" fill="#bcffd6" class="pin-in" id="uDOZtZ3" data-name="in"></circle><text x="8" y="21" class="node-text" alignment-baseline="middle">in</text><circle cx="68.25390625" cy="12" r="4" stroke="#25334b" fill="#ffc69a" class="pin-out" id="uDOZtZ4" data-name="V м3"></circle><text x="33.666015625" y="13" class="node-text" alignment-baseline="middle">V м3</text><circle cx="68.25390625" cy="28" r="4" stroke="#25334b" fill="#ffc69a" class="pin-out" id="uDOZtZ5" data-name="M кг" data-to="uDOZtC9"></circle><text x="36.673828125" y="29" class="node-text" alignment-baseline="middle">M кг</text><text x="8" y="-2" class="node-text">УУН</text></g><g x="180" y="178.8125" class="node" data-node-name="Подогрев нефти" data-cfg="" transform="translate(144.5,205.8125)" id="uDOZugz"><rect x="0" y="-8" width="5" height="5" rx="1" stroke="#25334b" fill="#d5d5d5" class="node-status"></rect><rect x="0" y="0" width="99.55078125" height="40" rx="2" stroke="#25334b" fill="#d7d7d7" class="handle"></rect><circle cx="0" cy="12" r="4" stroke="#25334b" fill="#bcffd6" class="pin-in" id="uDOZugA" data-name="T"></circle><text x="8" y="13" class="node-text" alignment-baseline="middle">T</text><circle cx="0" cy="28" r="4" stroke="#25334b" fill="#bcffd6" class="pin-in" id="uDOZugC" data-name="P"></circle><text x="8" y="29" class="node-text" alignment-baseline="middle">P</text><circle cx="99.55078125" cy="20" r="4" stroke="#25334b" fill="#ffc69a" class="pin-out" id="uDOZugD" data-name="Продукт" data-to="uDOZtC9"></circle><text x="45.455078125" y="21" class="node-text" alignment-baseline="middle">Продукт</text><text x="8" y="-2" class="node-text">Подогрев нефти</text></g>'
                                break;
                        }

                        // console.log(name, data)
                    }} className="border"/>
                </Tab>
                {/*<Tab eventKey="code" title="code" style={{flex: 1, height: "inherit"}} className="">
                    <CodeEditor val={{code}} onChange={(data) => {
                        console.log(data)
                    }}/>
                </Tab>
                <Tab eventKey="tables" title="Таблицы">
                    <SimpleTable></SimpleTable>
                </Tab>
                <Tab eventKey="drop-file" title="DropFile">
                    <h6>Перетащите сюда файл:</h6>
                    <DropFile onDrop={(data) => console.log(data)}/>
                </Tab>
                <Tab eventKey="aux" title="aux" style={{flex: 1}} className="h-full">
                    <div className="flex flex-col h-full w-100 m-1">
                        <h6>Кнопки button-spinner:</h6>
                        <div className="flex flex-wrap flex-row gap-1">
                            <ButtonEx className="btn btn-secondary" onAction={(a) => {
                                console.log(a)
                            }}>Кнопка-спиннер</ButtonEx>
                            <ButtonEx className="btn btn-secondary" onConfirm={(a) => {
                                console.log(a)
                            }} description="Выполнить действие">Кнопка-запрос</ButtonEx>
                        </div>
                        <hr/>
                        <h6>Всплывающие сообщения:</h6>
                        <div className="flex flex-wrap flex-row gap-1">
                            <ButtonEx className="btn btn-success" onClick={() => OK(new Date())}> OK</ButtonEx>
                            <ButtonEx className="btn btn-secondary" onClick={() => LOG(new Date())}>LOG</ButtonEx>
                            <ButtonEx className="btn btn-warning" onClick={() => WARN(new Date())}>WARN</ButtonEx>
                            <ButtonEx className="btn btn-danger" onClick={() => ERR(new Date())}>ERR</ButtonEx>
                        </div>
                        <hr/>
                        <h6>Список с перетаскиванием:</h6>
                        <div className="flex flex-row gap-1">
                            <DraggableList arrData={arrData} setArrData={setArrData}
                                           onGetElement={val => <div
                                               className="border border-gray-400 rounded-md p-2 m-1 bg-teal-100">{val}</div>}/>
                        </div>
                        <hr/>
                        <h6>Шакала:</h6>
                        <div className="flex flex-row gap-1">
                            <ButtonEx className="btn btn-primary" onClick={() => setProgress(0)}>0%</ButtonEx>
                            <ButtonEx className="btn btn-primary" onClick={() => setProgress(25)}>25%</ButtonEx>
                            <ButtonEx className="btn btn-primary" onClick={() => setProgress(50)}>50%</ButtonEx>
                            <ButtonEx className="btn btn-primary" onClick={() => setProgress(75)}>75%</ButtonEx>
                            <ButtonEx className="btn btn-primary" onClick={() => setProgress(100)}>100%</ButtonEx>
                        </div>
                        <hr/>
                    </div>
                </Tab>
                <Tab eventKey="test" title="test" style={{flex: 1}}>
                    <ButtonEx onAction={async () => {
                        // let obj = await import('../../../data/db.json');
                        // const table = jsonToHtmlTable(obj["doc"][0])
                        // let obj = await import('./objTable.json');
                        // const table = jsonToHtmlTable(obj)
                        // @ts-ignore
                        refTbl.current.innerHTML = table
                    }}>Ok</ButtonEx>
                    <div ref={refTbl}></div>
                </Tab>*/}
            </Tabs>
            {/*<PopupMessage/>*/}

        </div>
    )
}

export default Index
