import React, {useEffect, useState} from "react";
import ButtonEx from "../../Auxiliary/ButtonEx.tsx";
import TextBlock from "./TextBlock.tsx";
import Select from "../../Select/Select.tsx";
import {formatDateTime} from "../../../lib/time.ts";
import {clButton, stButton} from "../Story.tsx";
import {isEmpty} from "../../../lib/utils.ts";
import {Tooltip} from "../../Auxiliary/Tooltip.tsx";
import DropdownButton from "../../Auxiliary/DropdownButton.tsx";
import Dropdown from "../../Auxiliary/Dropdown.tsx";
import clsx from "clsx";

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

/**
 * Типы моральной ориентации персонажа.
 * Позволяет избежать "магических строк" и стандартизирует варианты.
 */
enum Morality {
    Altruistic = "Альтруист",                   // Бескорыстная помощь другим без условий
    Compassionate = "Сострадательный",         // Акцент на сочувствии и помощи страдающим
    SelfSacrificing = "Самоотверженный",       // Готовность жертвовать своими интересами ради других
    AltruisticConditional = "Условный альтруист", // Помогает при выгоде или безопасности для себя
    Utilitarian = "Утилитарист",                // Максимизация общего блага, даже если иногда в ущерб отдельным лицам
    Deontological = "Деонтолог",                // Следование моральным правилам и обязанностям независимо от последствий
    JusticeOriented = "Справедливый",           // Стремление к справедливости и равенству для всех
    Communitarian = "Коммунитарист",            // Приоритет интересов сообщества над индивидуальными
    MoralRelativist = "Моральный релятивист",  // Мораль зависит от контекста и культуры
    Neutral = "Нейтрал",                        // Баланс интересов, без явного предпочтения
    Pragmatic = "Прагматик",                    // Практичный, ориентирован на результат и выгоду
    Hedonistic = "Гедонист",                    // Стремление к удовольствию и избеганию боли
    Selfish = "Эгоист",                         // Личная выгода превыше всего
    Anarchist = "Анархист",                     // Отказ от традиционных моральных норм и иерархий
}

/**
 * Типы темперамента.
 * Используем enum вместо строк для уменьшения ошибок ввода.
 */
enum Temper {
    Calm = "Спокойный",
    Reserved = "Сдержанный",
    Humble = "Скромный",
    Patient = "Терпеливый",
    Loyal = "Верный",
    Reliable = "Надежный",
    Rational = "Рациональный",
    Skeptical = "Скептический",
    Curious = "Любопытный",
    Sympathetic = "Сочувствующий",
    Empathetic = "Эмпатичный",
    Optimistic = "Оптимистичный",
    Cheerful = "Жизнерадостный",
    Confident = "Уверенный",
    Assertive = "Настойчивый",
    Adventurous = "Авантюрный",
    Energetic = "Энергичный",
    Extroverted = "Экстраверт",
    Creative = "Креативный",
    Impulsive = "Импульсивный",
    Moody = "Капризный",
    Anxious = "Тревожный",
    Indecisive = "Нерешительный",
    PassiveAggressive = "Пассивно-агрессивный",
    Jealous = "Ревнивый",
    Distrustful = "Недоверчивый",
    Stubborn = "Упрямый",
    Volatile = "Вспыльчивый",
    Aggressive = "Агрессивный",
    Dominant = "Доминирующий",
    Pessimistic = "Пессимистичный",
    Introverted = "Интроверт",
    Emotional = "Эмоциональный",
    Sensitive = "Чувствительный"
}


/**
 * Структура черт характера.
 * Разделена на логические блоки для:
 * 1) Упрощения расширения (например, добавление physical-свойств)
 * 2) Группировки связанных параметров
 * 3) Четкого разделения ответственности
 */
interface CharacterTraits {
    /** Базовые качества, определяющие "стержень" персонажа */
    core: {
        morality: Morality[];   // Моральный выборы по enum
        courage: number;        // Шкала 0-10: от трусости до безрассудства
        loyalty: number;        // Шкала 0-10: вероятность предательства
    };

    /** Эмоциональные реакции и устойчивость */
    emotional: {
        empathy: number;       // Способность к сопереживанию (0-10)
        temper: Temper[];      // Тип темперамента по enum
        resilience: number;    // Устойчивость к стрессу (0 = сломление, 10 = сталь)
    };

    /** Социальное взаимодействие */
    social: {
        charisma: number;      // Влияние на других (0-10)
        isLeader: boolean;     // Лидерские качества (бинарный флаг)
        trustInOthers: number; // 0 = параноик, 10 = наивный
    };

    /** Интеллект и творчество */
    intellectual: {
        creativity: number;    // 0 = шаблонное мышление, 10 = новатор
        isAnalytical: boolean; // Преобладание логики над эмоциями
        curiosity: number;     // 0 = консерватор, 10 = исследователь
    };

    /** Особенности и "изюминки" характера */
    quirks: {
        isSarcastic: boolean;  // Склонность к сарказму
        phobias?: string;    // Опционально: список страхов (гибкость для NPC)
        secrets?: string;    // Опционально: скрытые мотивы/факты
    };
}

// Reusable Number Input Component
const NumberInput: React.FC<{
    label: string;
    value: number;
    hint?: string;
    onChange: (value: number) => void;
}> = ({label, value, hint = 'Подсказка', onChange}) => (
    <div>
        <Tooltip style={{fontSize: '.8em'}} text={hint}>
            <div style={{fontSize: '.9em', minWidth: '5em'}}>{label}</div>
        </Tooltip>
        <input
            className="form-control"
            style={{fontSize: '0.875rem', padding: '4px 8px'}}
            type="number"
            min="0"
            max="10"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
        />
    </div>
);

// Reusable String Array Component
const TextArea: React.FC<{
    label: string;
    value: string;
    onChange: (item: string) => void;
    hint: string;
}> = ({label, value, onChange, hint}) => {

    return (
        <div className="w-100">
            <Tooltip style={{fontSize: '.8em'}} text={hint}>
                <div style={{fontSize: '.9em', width: 'min-content'}}>{label}</div>
            </Tooltip>
            <textarea
                className="form-control no-resize"
                style={{fontSize: '0.875rem', padding: '4px 8px', height: '.8em'}}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            ></textarea>
        </div>
    )
        ;
};

// Reusable Multi-Select Component
const EnumMultiSelect: React.FC<{
    label: string;
    values: string[];
    options: string[];
    onChange: (values: string[]) => void;
}> =
    ({label, values, options, onChange}) => (
        <DropdownButton size="sm" title={label} variant="secondary">
            <div style={{
                display: 'flex',
                width: 'max-content',
                height: '50vh',
                flexDirection: 'column',
                flexWrap: 'wrap'
            }}
                 onClick={(e) =>
                     // @ts-ignore
                     onChange(e.target.textContent)
                 }>
                {options.map((value, i) => (
                    <Dropdown.Item href={"#/action-" + i} key={value} style={{width: 'auto'}}>{value}</Dropdown.Item>))}
            </div>
        </DropdownButton>);

function GroupCharacterParam({label, children, className = ''}) {
    return <div className={"position-relative mt-3 p-2 border rounded shadow-sm " + className}>
        <div
            className={clsx('position-absolute d-flex flex-row no-select text-center', 'transform -translate-y-[-50%] top-[-0.7] left-[1em] absolute flex !flex-row')}>
            <Tooltip style={{fontSize: '.8em'}} text={'placeholder'}>
                <div
                    className="px-2 rounded-full border bg-white text-[.9em]/[0.7] pt-[3px] pr-0 pb-[4px] pl-0">{label}</div>
            </Tooltip>
        </div>
        {/*@ts-ignore*/}
        <div
            className={clsx(
                '!position-[unset] d-flex flex-row no-select text-center',
                'transform -translate-y-[-50%] top-[-0.7] left-[1em] absolute flex !flex-row',
                'invisible mb-[-0.5em]')
            }>
            <Tooltip style={{fontSize: '.8em'}} text={'placeholder'}>
                <div
                    className="px-2 rounded-full border bg-white text-[.9em]/[0.7] pt-[3px] pr-0 pb-[4px] pl-0">{label}</div>
            </Tooltip>
        </div>
        <div className="d-flex flex-column align-items-end gap-1 align-items-center">
            {children}
        </div>
    </div>;
}

const GenCharacter = ({book, setBook}) => {

    const {worlds, scenes, characters, objects} = book;
    const [characterName, setCharacterName] = useState(null)
    const character = characters[characterName];

    useEffect(() => {
        if (!characterName) setCharacterName(Object.keys(characters)[0]);
    }, []);

    const [traits, setTraits] = useState<CharacterTraits>({
        core: {morality: [], courage: 5, loyalty: 5},
        emotional: {empathy: 5, temper: [], resilience: 5},
        social: {charisma: 5, isLeader: false, trustInOthers: 5},
        intellectual: {creativity: 5, isAnalytical: false, curiosity: 5},
        quirks: {isSarcastic: false, phobias: '', secrets: ''},
    });

    const updateField = <T extends keyof CharacterTraits, K extends keyof CharacterTraits[T]>(
        section: T,
        field: K,
        value: CharacterTraits[T][K]
    ) => {
        setTraits(prev => ({
            ...prev,
            [section]: {...prev[section], [field]: value}
        }));
    };

    return <>
        <div className="d-flex flex-row gap-1 mb-1">
            <ButtonEx style={stButton}
                      className={clButton + " btn-secondary bi-plus btn-sm flex-grow-0 input-group-append"}
                      onAction={() => {
                          const name = 'Персонаж: ' + formatDateTime()
                          if (characters?.[name]) return;
                          setCharacterName(name);
                          characters[name] = {
                              core: {
                                  morality: [Morality.Altruistic],
                                  courage: 0,
                                  loyalty: 0
                              },
                              emotional: {
                                  empathy: 0,
                                  temper: [Temper.Calm],
                                  resilience: 0
                              },
                              social: {
                                  charisma: 0,
                                  isLeader: false,
                                  trustInOthers: 0
                              },
                              intellectual: {
                                  creativity: 0,
                                  isAnalytical: false,
                                  curiosity: 0
                              },
                              quirks: {
                                  isSarcastic: false,
                                  phobias: [],
                                  secrets: []
                              }
                          };
                          setBook({...book});
                      }}/>
            <ButtonEx style={stButton} className="btn-danger btn-sm bi-x-lg flex-grow-0" description="Удалить"
                      onConfirm={() => {
                          delete characters[characterName];
                          setCharacterName(Object.keys(characters)?.[0]);
                          setBook({...book});
                      }}/>

            <Select className={clsx('flex-grow-0 ps-2 pe-5 py-0 mb-1 w-auto ellipsis',
                'h-[1.7em] text-[1.2em]/[1.1]'
            )} arrList={Object.keys(characters)} value={characterName}
                    onChange={(val: string) => setCharacterName(val)}/>
        </div>
        {character && !isEmpty(character) && <>

            <input type="text" placeholder="Введите имя персонажа"
                   className={clsx("mb-1 form-control h-[1.7em] text-[1.2em]/[1.1]",
                       characterName?.length == 0 ? 'border-red-700' : 'border-gray-400'
                   )}

                   value={characterName ?? ''}
                   onChange={({target}) => {
                       characters[target.value] = character;
                       delete characters[characterName];
                       setCharacterName(target.value);
                       setBook({...book});
                   }}/>
            <div className="d-flex flex-row flex-wrap gap-1">
                <GroupCharacterParam label="Основные качества">
                    <EnumMultiSelect label="Мораль" values={traits.core.morality} options={Object.values(Morality)}
                                     onChange={(v) => updateField('core', 'morality', v as Morality[])}/>
                    <NumberInput label="Лояльность" value={traits.core.loyalty}
                                 onChange={(v) => updateField('core', 'loyalty', v)}/>
                    <NumberInput label="Смелость" value={traits.core.courage}
                                 onChange={(v) => updateField('core', 'courage', v)}/>
                </GroupCharacterParam>
                <GroupCharacterParam label="Эмоциональные">
                    <EnumMultiSelect label="Темперамент" values={traits.emotional.temper}
                                     options={Object.values(Temper)}
                                     onChange={(v) => updateField('emotional', 'temper', v as Temper[])}/>
                    <NumberInput label="Устойчивость" value={traits.emotional.resilience}
                                 onChange={(v) => updateField('emotional', 'resilience', v)}/>
                    <NumberInput label="Эмпатия" value={traits.emotional.empathy}
                                 onChange={(v) => updateField('emotional', 'empathy', v)}/>
                </GroupCharacterParam>
                <GroupCharacterParam label="Социальные">
                    <NumberInput label="Доверие к другим" value={traits.social.trustInOthers}
                                 onChange={(v) => updateField('social', 'trustInOthers', v)}/>
                    <NumberInput label="Харизма" value={traits.social.charisma}
                                 onChange={(v) => updateField('social', 'charisma', v)}/>
                    <input
                        type="checkbox"
                        title="Лидерские качества"
                        checked={traits.social.isLeader}
                        onChange={(e) => updateField('social', 'isLeader', e.target.checked)}
                    />
                </GroupCharacterParam>
                <GroupCharacterParam label="Интеллектуальные">
                    <NumberInput label="Любознательность" value={traits.intellectual.curiosity}
                                 onChange={(v) => updateField('intellectual', 'curiosity', v)}/>
                    <NumberInput label="Креативность" value={traits.intellectual.creativity}
                                 onChange={(v) => updateField('intellectual', 'creativity', v)}/>
                    <input type="checkbox" title="Аналитическое мышление"
                           checked={traits.intellectual.isAnalytical}
                           onChange={(e) => updateField('intellectual', 'isAnalytical', e.target.checked)}/>
                </GroupCharacterParam>
                <GroupCharacterParam label="Особенности" className="flex-grow-1">
                    <div className="w-100">
                        <TextArea label="Фобии" value={traits.quirks.phobias || ''}
                                  onChange={(v) => updateField('quirks', 'phobias', v)}
                                  hint="Добавить фобию"/>
                        <TextArea label="Секреты" value={traits.quirks.secrets || ''}
                                  onChange={(v) => updateField('quirks', 'secrets', v)}
                                  hint="Добавить секрет"/>
                    </div>
                    <div className="d-flex align-items-start w-100">
                        <input type="checkbox" title="Саркастичность" checked={traits.quirks.isSarcastic}
                               onChange={(e) => updateField('quirks', 'isSarcastic', e.target.checked)}/>
                    </div>

                </GroupCharacterParam>
            </div>
        </>}
    </>
};

export default GenCharacter