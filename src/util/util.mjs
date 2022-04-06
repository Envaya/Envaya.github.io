/**
 * @author bezel: https://github.com/KDuss/bezel
 */

/**
 * Adds delay to the execution of subsequent code.
 * Used for UI tests, because click events run asynchronously.
 * Usage in test: await sleep(10);
 * @param { !Number } millis - Duration of delay
 */
const sleep = millis => new Promise(
    res => setTimeout(_ => res(), millis),
);

/**
 * Takes a Number and adds a "'" to every third 0.
 * @param { !Number } nr
 */
const addThousandsSeparator = nr => nr.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '\'');

export {
    addThousandsSeparator, sleep
};

/**
 * @author blt: https://gitlab.fhnw.ch/niki.voegtli/IP6-BigLazyTables-for-Kolibri/
 */

/**
 * Creating a new domElement.
 * @param { !string   }  type    Type of target HTML element;               mandatory.
 * @param { ?Object   }  styles  Styles applied to the target HTML element; might be null.
 * @param { ?string   }  id      Id of target HTML element;                 might be null.
 * @param { ...string }  classes Classes added to target HTML element;      might be empty.
 * @returns { HTMLElement }
 */
const domElement = (type, styles, id, ...classes) => {
    const newElement = document.createElement(type);
    if (styles) {
        for(let prop of Object.keys(styles)){
            newElement.style[prop.toString()] = styles[prop.toString()];
        }
    }
    if (id) newElement.id = id;
    if (0 !== classes.length) newElement.classList.add(...classes);
    return newElement;
};

/**
 * Takes an array and adds 'px' to each element.
 * @param   { !Array<String | Number> } arr
 * @returns { Array<String> }
 */
const pxMapper = arr => {
    return arr.map(e => e + 'px');
}

/**
 * Visual element for resizing the columns.
 * @param   { !Number } tableHeaderHeight
 * @returns { HTMLElement }
 */
const columnResizerElement = tableHeaderHeight => {
    const styles = {
        top             : "0",
        right           : "0",
        width           : '2px',
        position        : 'absolute',
        cursor          : 'col-resize',
        backgroundColor : 'black',
        userSelect      : 'none',
        height          : tableHeaderHeight + 'px'
    }
    return domElement("div", styles, null);
}

/**
 * All listeners for resizing table columns.
 * inspired by https://www.brainbell.com/javascript/making-resizable-table-js.html
 * @param { !TableController } tableController
 * @param { !HTMLElement     } rootElement     - represents the top-level HTML Element. All other elements must be descendants of this element.
 * @param { !HTMLElement     } columnResizer   - a single HTML Element to bind the resizing listeners.
 */
const addListenersToColumnResizer = (tableController, rootElement, columnResizer) => {

    let pageX, curCol, nxtCol, curColWidth, nxtColWidth;

    /**
     * Select columnResizer.
     */
    columnResizer.addEventListener('mousedown', e => {
        curCol      = e.target.parentElement;
        nxtCol      = curCol.nextElementSibling;
        pageX       = e.pageX;
        curColWidth = curCol.offsetWidth;

        if (nxtCol) nxtColWidth = nxtCol.offsetWidth;
    });

    /**
     * Move selected columnResizer.
     */
    rootElement.addEventListener('mousemove', e => {
        if (curCol) {
            const diffX = e.pageX - pageX;

            if (nxtCol) {
                tableController.setColumnWidths(nxtCol.dataset.columnIndex, (nxtColWidth - (diffX))); //warning can be ignored because it always returns a number
            }
            tableController.setColumnWidths(curCol.dataset.columnIndex,  (curColWidth + diffX)); //warning can be ignored because it always returns a number
        }
    });

    /**
     * Release selected columnResizer.
     */
    rootElement.addEventListener('mouseup', _ => {
        curCol      = undefined;
        nxtCol      = undefined;
        pageX       = undefined;
        nxtColWidth = undefined;
        curColWidth = undefined;
    });
}

/**
 * Generates a random Integer Number between a given minimal and maximal value.
 * @param   { !Number } min
 * @param   { !Number } max
 * @returns { Number}
 */
const RandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Converts a given Number into a positive Number by converting negative Numbers to 0.
 * @param   { Number | String } value
 * @returns { Number }
 */
const PositiveNumber = value => {
    const number = Number(value.valueOf());
    if (isNaN(number)) {
        throw new TypeError("Object '" + number + "' is not a valid number.");
    }
    return number < 0 ? 0 : number;
}

/**
 * Generates a random String with a given length
 * @param   { !String } stringSet
 * @param   { !Number } length
 * @returns { String }
 */
const RandomString = (stringSet, length) => {
    if (typeof stringSet !== 'string') {
        throw new TypeError("Object '" + stringSet + "' is not a valid string.");
    }
    const number = PositiveNumber(Number(length.valueOf()));
    if (isNaN(number)) {
        throw new TypeError("Object '" + number + "' is not a valid number.");
    }
    let result = '';
    const charactersLength = stringSet.length;
    for (let i = 0; i < length; i++) {
        result += stringSet.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

/**
 * @callback observableMapCallback
 * @template T
 * @impure   this callback usually modifies the MVC view
 * @param {T} item - the item that has been added to or removed from the {@link IObservableMap<T> }
 * @return void
 */

/**
 * IObservableMap<T> is the interface for map that can be observed for various map-specific operations.
 * This observable type was built specifically for the needs of Big Lazy Table.
 * @typedef IObservableMap
 * @template T
 * @property { function(observableMapCallback)              : void }       onAdd                 - register an observer that is called whenever an item is added.
 * @property { function(observableMapCallback)              : void }       onDel                 - register an observer that is called whenever an item is removed.
 * @property { function(observableMapCallback)              : void }       onChange              - register an observer that is called whenever an item is removed or added.
 * @property { function(observableMapCallback)              : void }       onInit                - register an observer that is called whenever items are added to the map using init().
 * @property { function(observableMapCallback)              : void }       onClear               - register an observer that is called whenever the map is cleared.
 * @property { function(!Number|Function|String, T)         : void }       add                   - add an item to the observable map and notify the observers. Modifies the map.
 * @property { function(!Number|Function|String)            : void }       del                   - delete an item to the observable map and notify the observers. Modifies the map.
 * @property { function(!Number|Function|String, Array<T>)  : void }       init                  - clear the map, add items and notify the observers. Modifies the map.
 * @property { function(!Number|Function|String)            : boolean }    has                   - Returns true if the item with the passed key exists in the map.
 * @property { function(!Number|Function|String)            : T }          getItem               - Returns the item matching the passed key.
 * @property { function()                                   : map<T> }     get                   - Returns the map.
 * @property { function()                                   : void }       clear                 - clears the map of all items.
 * @property { function(observableMapCallback)              : void }       removeAddListener     - unregister the "add" observer
 * @property { function(observableMapCallback)              : void }       removeDeleteListener  - unregister the "delete" observer
 * @property { function()                                   : number }     size                  - current length of the inner map.
 */

/**
 * Constructor for an IObservableMap<T>.
 * @template T
 * @param {!Map<T>} map - the inner map that is to be decorated with observability. Mandatory.
 * @returns IObservableMap<T>
 * @constructor
 * @example
 * const map = IObservableMap( new Map() );
 * map.onAdd( item => console.log(item));
 * map.add(1, 'first');
 */
const ObservableMap = map => {
    const addListeners    = [];
    const delListeners    = [];
    const changeListeners = [];
    const clearListeners  = [];
    const initListeners   = [];
    const removeAddListener    = addListener => addListeners.removeItem(addListener);
    const removeDeleteListener = delListener => delListeners.removeItem(delListener);
    return {
        onAdd: listener => {
            addListeners   .push(listener);
            changeListeners.push(listener);
        },
        onDel: listener => {
            delListeners   .push(listener);
            changeListeners.push(listener);
        },
        onChange: callback => {
            changeListeners.push(callback);
        },
        onInit: listener => {
            initListeners.push(listener);
        },
        onClear: listener => clearListeners.push(listener),
        add: (key, value) => {
            map.set(key, value);
            addListeners   .forEach( listener => listener(key, value));
            changeListeners.forEach( listener => listener(key, value));
        },
        has: key => map.has(key),
        del: key => {
            const value = map.get(key);
            map.delete(key);
            const safeIterateDelete = [...delListeners]; // shallow copy as we might change listeners array while iterating
            const safeIterateChange = [...changeListeners]; // shallow copy as we might change listeners array while iterating
            safeIterateDelete.forEach( listener => listener(key, value, () => removeDeleteListener(listener) ));
            safeIterateChange.forEach( listener => listener(key, value));
        },
        init: (startKey, valueArray) => {
            map.clear();
            valueArray   .forEach((value, index) => map.set(startKey + index, value));
            initListeners.forEach( listener => listener(map));
        },
        getItem: key => map.get(key),
        get: () => map,
        removeAddListener,
        removeDeleteListener,
        clear: () => {
            map.clear();
            clearListeners.forEach( listener => listener());
        },
        size:  () => map.size
    }
};

/**
 * Compares two values and returns whether they are equal or not.
 * The order of keys in objects does not matter, since JavaScript object keys are not ordered.
 * @param   { !* } value1
 * @param   { !* } value2
 * @returns { Boolean }
 */
const isEqual = (value1, value2) => {
    if (typeof value1 === 'undefined' || typeof value1 === 'undefined') return value1 === value2;
    if (Object.keys(value1).length !== Object.keys(value2).length) return false;
    if (typeof value1 !== 'object' && typeof value1 !== 'function' || typeof value2 !== 'object' && typeof value2 !== 'function') return value1 === value2;
    for (let p in value1) {
        if (value1.hasOwnProperty(p) !== value2.hasOwnProperty(p)) return false;

        switch (typeof (value1[p])) {
            case 'object':
                if (!isEqual(value1[p], value2[p])) return false;
                break;
            case 'function':
                if (typeof (value2[p]) === 'undefined' || (p !== 'compare' && value1[p].toString() !== value2[p].toString())) return false;
                break;
            default:
                if (value1[p] !== value2[p]) return false;
        }
    }
    return true;
};

export {
    domElement,
    pxMapper,
    columnResizerElement,
    addListenersToColumnResizer,
    RandomString,
    RandomNumber,
    PositiveNumber,
    ObservableMap,
    isEqual
};