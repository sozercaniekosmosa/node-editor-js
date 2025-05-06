import React, {Dispatch, SetStateAction, useState} from "react";
import {checkboxColumn, DataSheetGrid, keyColumn, textColumn,} from 'react-datasheet-grid'

// Import the style only once in your app!
import 'react-datasheet-grid/dist/style.css'
// https://github.com/nick-keller/react-datasheet-grid

function SimpleTable({}) {
    const [data, setData] = useState<any>([
        {active: true, firstName: 'Elon', lastName: 'Musk'},
        {active: false, firstName: 'Jeff', lastName: 'Bezos'},
    ])

    const columns = [
        {...keyColumn('active', checkboxColumn), title: 'Тут чекбокс',},
        {...keyColumn('firstName', textColumn), title: 'First name',},
        {...keyColumn('lastName', textColumn), title: 'Last name',},
    ]

    return (
        <DataSheetGrid
            value={data}
            onChange={setData}
            columns={columns}
        />
    )
}

export default SimpleTable;