import React, { useState } from 'react'
import '../App.css'

const AddForm = ({ addData }) => {

  const [cols, setCols] = useState(0)
  const [tableName, setTableName] = useState("")
  const fg = []

  const f_data = {}

  function handleSubmit(event) {
    event.preventDefault()

    const data = new FormData(event.target)
    
    Array.from(data.entries()).forEach(([key, value],index) => {
      // f_data[key] = value;
      if (index % 2 === 0) { // If the index is even, this is the first input of a pair
        const input1 = value;
        const input2 = data.get(Array.from(data.entries())[index + 1][0]); // Get the corresponding second input
        f_data[input1] = input2; // Add the input pair to the object
      }
    })
    // console.log(JSON.stringify(data))
    addData(f_data, tableName)
    console.log(f_data)

  }



  for (let i = 0; i < cols; i++) {
    fg.push(<div className="form_cols">

      <div key={i} className="form-group">
        <input type="text" name={'col_' + i} placeholder='Column name' />
        <select name={"data-type_" + i} id="data-type">
          <option value="integer">INT</option>
          <option value="float">FLOAT</option>
          <option value="datetime">DATETIME</option>
          <option value="text">STRING</option>
        </select>
      </div>
    </div>)
  }

  return (
    <div className='add-form'>
      <div className="form_name">
        <input type="text" placeholder='table name' name='table_name' id='table_name' value={tableName} onChange={(e) => { setTableName(e.target.value) }} />

        <input type="text" name="num_cols" id="num_cols" maxLength="1" placeholder='number of columns' onChange={(e) => { setCols(e.target.value) }} />

      </div>
      <form action="#" onSubmit={handleSubmit}>

        <div>
          {fg}
        </div>
        <button className="add-table btn" type='submit'>Done</button>
      </form>
    </div>
  )

}

export default AddForm