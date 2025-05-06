import Spreadsheet from "x-data-spreadsheet"
import {useEffect, useRef, useState} from "react";
import ruRU from "./ru-RU.ts"
import {getHtmlStr} from "../../../lib/dom.ts";

// import convertExcelToXSpreadsheet from "./import.ts";


function widthToColumns(arrData) {
    // @ts-ignore
    return arrData.map(data => { //приведение ширины столбцов
        // @ts-ignore
        data.cols = Object.fromEntries(Object.entries(data.cols).map(([key, val]) => key != 'len' ? [key - 1, {width: val.width * 7}] : [key, val]))
        return data;
    })
}

/**
 * Открывает диалоговое окно для выбора файла.
 * @paramVal {string} acceptTypes - строка с типами через [,] определяющих допустимые типы файлов (например, '.pdf').
 * @returns {Promise<File>} - Промис, который разрешается выбранным файлом.
 */
const openFileDialog = async (acceptTypes: string): Promise<ArrayBuffer> => new Promise((resolve, reject) => {
    // Создаем элемент <input type="file">
    const input = document.createElement('input');
    input.type = 'file';

    // Устанавливаем допустимые типы файлов
    input.accept = acceptTypes; // Указываем допустимые типы файлов

    // Обработчик выбора файла
    input.onchange = () => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const arrayBuffer = event.target.result;
                resolve(arrayBuffer as ArrayBuffer); // Разрешаем промис выбранным файлом
            };
            reader.readAsArrayBuffer(file);
        } else {
            reject(new Error('Файл не выбран'));
        }
    };

    // Обработчик ошибок
    input.onerror = () => {
        reject(new Error('Произошла ошибка при выборе файла'));
    };

    // Открываем диалоговое окно
    input.click();
});

const SpreadSheet = ({data, setData}) => {
    const refNodeSheet = useRef()

    const [spreadsheet, setSpreadsheet] = useState<Spreadsheet>()

    useEffect(() => {

        Spreadsheet.locale('ru-RU', ruRU);

        const s = new Spreadsheet(refNodeSheet.current, {
            mode: 'edit', // edit | read
            showToolbar: true,
            showGrid: true,
            showContextmenu: true,
            showBottomBar: true,
            view: {
                height: () => document.documentElement.clientHeight - 40,
                width: () => document.documentElement.clientWidth,
            },
            row: {
                len: 100,
                height: 25,
            },
            col: {
                len: 26,
                width: 100,
                indexWidth: 60,
                minWidth: 10,
            },
            style: {
                bgcolor: '#ffffff',
                align: 'left',
                valign: 'middle',
                textwrap: false,
                strike: false,
                underline: false,
                color: '#0a0a0a',
                font: {
                    name: 'Helvetica',
                    size: 10,
                    bold: false,
                    italic: false,
                },
            },
        })

        setSpreadsheet(s); // необходимо привязать компонент к React-состоянию что бы иметь к нему доступ позже
        const doc = widthToColumns(data);
        s.loadData(doc) // load data
        s.change(data => {
            console.log(data);
        })
        s.on('cell-selected', (cell, ri, ci) => {
        });
        s.on('cells-selected', (cell, {sri, sci, eri, eci}) => {
        });
        s.on('cell-edited', (text, ri, ci) => {

            // @ts-ignore
            console.log(s.cellStyle(ri, ci))
        });


        setTimeout(() => {
            //language=html
            const btnOpen = getHtmlStr(`
                <div class="x-spreadsheet-toolbar-btn" data-tooltip="Загрузить шаблон">
                    <div class="bi-folder2-open"></div>
                </div>
            `);
            const btnSave = getHtmlStr(`
                <div class="x-spreadsheet-toolbar-btn" data-tooltip="Загрузить шаблон">
                    <div class="bi-floppy2-fill"></div>
                </div>
            `);

            btnOpen[0].addEventListener('click', async (e) => {
                const arrayBuffer = await openFileDialog('xlsx');
                const sheet = [];//await convertExcelToXSpreadsheet({arrayBuffer});
                setData(sheet);
            });
            btnSave[0].addEventListener('click', (e) => {
                console.log(e)
            });

            // @ts-ignore
            refNodeSheet.current.querySelector('.x-spreadsheet-toolbar-btns').prepend(btnSave[0]);
            // @ts-ignore
            refNodeSheet.current.querySelector('.x-spreadsheet-toolbar-btns').prepend(btnOpen[0]);

        }, 100)

        // cell(ri, ci, sheetIndex = 0)
        // s.cell(ri, ci);
        // cellStyle(ri, ci, sheetIndex = 0)
        // s.cellStyle(ri, ci);

        // s.cellText(5, 5, 'xxxx').cellText(6, 5, 'yyy')
        // @ts-ignore
        // s.reRender();


        // @ts-ignore
        s.validate()

        // @ts-ignore
        window.spreadsheet = s;
        // @ts-ignore
        window.save = () => {
            // @ts-ignore
            // XLSX.writeFile(xtos(s.getData()), "SheetJS.xlsx");
        };
    }, []);

    useEffect(() => {
        if (!spreadsheet) return;
        const doc = widthToColumns(data);
        spreadsheet.loadData(doc) // load data
    }, [data]);

    return <div ref={refNodeSheet}/>;
}

export default SpreadSheet;