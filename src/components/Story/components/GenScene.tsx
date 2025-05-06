import React, {useEffect, useState} from "react";
import ButtonEx from "../../Auxiliary/ButtonEx.tsx";
import TextBlock from "./TextBlock.tsx";
import {formatDateTime} from "../../../lib/time.ts";
import {clButton, stButton} from "../Story.tsx";
import {isEmpty} from "../../../lib/utils.ts";

const descScene = {
    location: ['Место действия', `
— Географическое расположение (город, джунгли).
— Сооружение (дом, помещение).
— Место.`],
    detailsEnv: ['Детали окружения', `
— Интерьер (мебель, декор, предметы).
— Природа (деревья, река, животные).
— Климатические условия (дождь, жара, туман).
— Освещение (сумерки, яркий свет, свечи).
— Социальная обстановка (богатый квартал, трущобы, замок).`],
    time: ['Время действия', `— Хронологический период (историческая эпоха, современность).
— Время года, суток (зима, ночь, рассвет).
— Сезонные особенности (лето, зима).`],
    mood: ['Настроение, тон', `— Эмоциональная окраска (радость, таинственность, тревожность).
— Использование метафор, сравнений для создания образов.`],
    sensors: ['Сенсорные детали', `— Зрительные образы (цвета, формы, движения).
— Звуки (шум ветра, тишина, музыка).
— Запахи, тактильные ощущения (аромат цветов, холод).`],
    symbols: ['Символизм и подтекст', `— Символические элементы несущие скрытый смысл (разбитое зеркало, часы, старый портрет, гроза как символ кризиса).
— Аллегории, намёки на темы произведения.`]
}


function SceneOpt({book, setBook, param}) {

    const {worlds, scenes, characters, objects} = book;
    const {scene, desc, path} = param;
    const [caption, hint] = desc[path];

    // if (isEmpty(scene)) return '';
    return <div className="d-flex flex-row pb-1 gap-1">
        <ButtonEx style={stButton} className="btn-secondary btn-sm flex-grow-0 bi-stars mt-2" onAction={() => null}/>
        <TextBlock
            className='w-100'
            value={scene?.[path].text ?? ''}
            onChange={({target}) => {
                scene[path].text = target.value;
                setBook({...book});
            }}
            caption={caption} placeholder={hint}
            style={{fontSize: '1em'}}/>
    </div>
}

const GenScene = ({book, setBook}) => {

    const {worlds, scenes, characters, objects} = book;
    const [sceneName, setSceneName] = useState(null)
    const scene = scenes[sceneName];

    useEffect(() => {
        if (!sceneName) setSceneName(Object.keys(scenes)[0]);
    }, []);

    return <>
        <div className="d-flex flex-row gap-1 mb-1">
            <ButtonEx style={stButton}
                      className={clButton + " btn-secondary bi-plus btn-sm flex-grow-0 input-group-append"}
                      onAction={() => {
                          const name = 'Сцена: ' + formatDateTime()
                          if (scenes?.[name]) return;
                          setSceneName(name);
                          scenes[name] = {
                              pointOfView: {text: ''},
                              location: {text: ''},
                              detailsEnv: {text: ''},
                              time: {text: ''},
                              mood: {text: ''},
                              sensors: {text: ''},
                              symbols: {text: ''},
                          };
                          setBook({...book});
                      }}/>
            <ButtonEx style={stButton} className="btn-danger btn-sm bi-x-lg flex-grow-0" description="Удалить"
                      onConfirm={() => {
                          delete scenes[sceneName];
                          setSceneName(Object.keys(scenes)?.[0]);
                          setBook({...book});
                      }}/>
            {/*<select arrList={Object.keys(scenes)} value={sceneName} onChange={(val: string) => setSceneName(val)}/>*/}
        </div>
        {scene && !isEmpty(scene) && <>
            <input type="text" placeholder="Введите название сцены" value={sceneName ?? ''}
                   onChange={({target}) => {
                       scenes[target.value] = scene;
                       delete scenes[sceneName];
                       setSceneName(target.value);
                       setBook({...book});
                   }}/>

            <SceneOpt book={book} setBook={setBook} param={{scene, desc: descScene, path: 'location'}}/>
            <SceneOpt book={book} setBook={setBook} param={{scene, desc: descScene, path: 'detailsEnv'}}/>
            <SceneOpt book={book} setBook={setBook} param={{scene, desc: descScene, path: 'time'}}/>
            <SceneOpt book={book} setBook={setBook} param={{scene, desc: descScene, path: 'mood'}}/>
            <SceneOpt book={book} setBook={setBook} param={{scene, desc: descScene, path: 'sensors'}}/>
            <SceneOpt book={book} setBook={setBook} param={{scene, desc: descScene, path: 'symbols'}}/>

        </>}
    </>
};

export default GenScene;