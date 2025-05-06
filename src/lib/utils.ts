const base64Language = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const toShortString = (value, language = base64Language) => {
    const len = language.length;
    let acc = "";
    while (value > 0) {
        const index = value % len;
        acc += language.charAt(index);
        value /= len;
    }
    return acc.split('').reverse().join('').replace(/^0+/g, '');
};
let __id = 0;
export const generateUID = (pre = '') => pre + toShortString((new Date().getTime()) + Math.ceil(Math.random() * 100) + (__id++))
// @ts-ignore
window.generateUID = generateUID;

export const getHashCyrb53 = function (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export const getHashCyrb53Arr = function (arr, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < arr.length; i++) {
        ch = arr[i];
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

let __counter = 0;
export const getID = (): string => toShortString((new Date()).getTime() + __counter++)

export const isFunction = functionToCheck => functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';

export const isEmpty = obj => Object.keys(obj).length === 0;

export const meval = function (js, scope) {
    return new Function(`with (this) { return (${js}); }`).call(scope);
}

/**
 * Wrapper для функции (clbGetData), которая будет вызвана не раньше чем через ms мс. после
 * последнего вызова если в момент тишины с момента последнего вызова будет произведен
 * еще вызов то реальный вызов будет не раньше чем через ms мс. после него
 * @paramVal func
 * @paramVal ms
 * @returns {(function(): void)|*}
 */
export const debounce = (func, ms) => {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), ms);
    };
};

/**
 * Wrapper для функции (clbGetData), которую нельзя вызвать чаще чем tm
 * @paramVal clbGetData
 * @paramVal ms
 * @returns {(function(...[*]): void)|*}
 */
type ThrottledFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => ReturnType<T>;

export function throttle<T extends (...args: any[]) => any>(
    func: T,
    timeMs: number
): ThrottledFunction<T> {
    let lastFunc: ReturnType<typeof setTimeout>;
    let lastRan: number;
    let lastArgs: Parameters<T>;
    let lastThis: any;

    // @ts-ignore
    return function (this: any, ...args: Parameters<T>): ReturnType<T> {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastArgs = args;
            lastThis = this;
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= timeMs) {
                    func.apply(lastThis, lastArgs);
                    lastRan = Date.now();
                }
            }, timeMs - (Date.now() - lastRan));
        }
    } as ThrottledFunction<T>;
}

// Пример использования
const logMessage = (message: string) => {
    console.log(message);
};

// export const throttle = (clbGetData, ms) => {
//
//     let isThrottled = false,
//         savedArgs,
//         savedThis;
//
//     function wrapper(...arg) {
//
//         if (isThrottled) { // (2)
//             savedArgs = arguments;
//             savedThis = this;
//             return;
//         }
//
//         clbGetData.apply(this, arguments); // (1)
//
//         isThrottled = true;
//
//         setTimeout(function () {
//             isThrottled = false; // (3)
//             if (savedArgs) {
//                 wrapper.apply(savedThis, savedArgs);
//                 savedArgs = savedThis = null;
//             }
//         }, ms);
//     }
//
//     return wrapper;
// }

export const asyncDelay = ms => new Promise(res => setTimeout(res, ms));

/**
 * Создает worker на лету:
 * // demo
 * const add = (...nums) => nums.reduce((a, b) => a + b);
 * // call
 * console.log('result: ', await add.callAsWorker(null, 1, 2, 3));
 *
 * @paramVal args of function
 * @returns {Promise<unknown>}
 */
// @ts-ignore
Function.prototype.callAsWorker = function (...args) {
    return new Promise((resolve, reject) => {
        const code = `self.onmessage = e => self.postMessage((${this.toString()}).call(...e.data));`,
            blob = new Blob([code], {type: "text/javascript"}),
            worker = new Worker(window.URL.createObjectURL(blob));
        worker.onmessage = e => (resolve(e.data), worker.terminate());
        worker.onerror = e => (reject(e.message), worker.terminate());
        worker.postMessage(args);
    });
}

// перемещает элемент массива на новое место
export const arrMoveItem = (arr, fromIndex, toIndex) => {
    if (fromIndex < 0 || fromIndex >= arr.length || toIndex < 0 || toIndex >= arr.length) {
        throw new Error('Индексы выходят за пределы массива');
    }

    // Извлекаем элемент из старого индекса
    const element = arr.splice(fromIndex, 1)[0];

    // Вставляем элемент на новый индекс
    arr.splice(toIndex, 0, element);

    return arr;
};

//получает элемент из объектп по заданому пути
const getObjectByPath = (obj, pathArr) => {
    for (let i = 0; i < pathArr.length - 1; i++) {
        const k = pathArr[i];
        if (obj?.[k]) {
            obj = obj[k];
        } else {
            return null;
        }
    }
    return {obj, key: pathArr[pathArr.length - 1]};
}

/**
 * Получение из текста js массив имен функций и параметров
 * @paramVal code - текст на js
 * @return [[fn_name, paramVal], [fn_name, paramVal], ... ]
 */
export const getCodeParam = (code: string) => {
    const functionRegex = /function\s+(\w+)\s*\(([^)]*)\)|const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/g;
    let match: any[], resArr = [];

    while ((match = functionRegex.exec(code)) !== null) {
        const functionName = match[1] || match[3];
        const params = match[2] || match[4];
        resArr.push([functionName, params])
        // console.log(`Функция: ${functionName}, Параметры: ${params}`);
    }

    return resArr;
}