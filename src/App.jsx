import { useState } from 'react'
import AddForm from './components/add_form'
import './App.css'
import data from './components/data.json'
import axios from 'axios'

function App() {

  const [addtable, setAddtable] = useState(false)
  const [table_data, setTable_data] = useState([])
  const [createDB, setCreateDB] = useState(false)
  const [db_name, setDb_name] = useState("")
  const [db_data, setDB_data] = useState({})
  const [download, setDownload] = useState(false)

  // let db_data = {}

  function addData(data, tableName) {
    setTable_data([...table_data, { 'table_name': tableName, 'columns': [data] }])
    setAddtable(!setAddtable)

    console.log(table_data)
  }

  function deleteTable(value) {
    setTable_data(table_data => {
      return table_data.filter(table => table !== value)
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    // db_name = new FormData(event.target).get("db_name")
    setCreateDB(true)
    // console.log(db_name)

  }

  const postData = async () => {
      
    const requestOptions = {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(db_data)
    };

    const url = "http://localhost:3000/api/create_db"
    await fetch(url,requestOptions).then(response => response.blob()).then(blob => {
           // Create a new anchor element with the download URL
           const anchor = document.createElement('a');
           anchor.href = URL.createObjectURL(blob);
           anchor.download = 'my_database.db';
   
           // Programmatically click the anchor to start the download
           anchor.click();
   
           // Remove the anchor from the DOM
           anchor.remove();
       })
       .catch(error => console.log('Error:', error));
  }

  const downloadDb = async () => {
    const url = "http://localhost:3000/api/download_db"
    await axios(
      {
        url: url,
        method: 'GET',
        responseType: 'blob'
      }).then(
        response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", db_name+'.db');
          document.body.appendChild(link);
          link.click();
        }
      )
    window.location.reload(true)
  }

  function handleDBCreate(db_name) {
    setDB_data({
      "db_name": db_name,
      "tables":
        table_data

    })

    // console.log(db_data)
    postData()
  }

  return (
    <div className="App">
      <div className="top">
        <h1 className="heading">SQLite GUI</h1>
        <form className="db_name_form" onSubmit={handleSubmit}><input type="text" className="db_name" name='db_name' placeholder='database name' id='db_name' value={db_name} onChange={(e) => { setDb_name(e.target.value) }} />
          <button className="btn" disabled={!db_name} type='submit'>Go</button></form>
      </div>
      {createDB ? <div className="bottom">
        <div className="bottom-top">
          <h3>Tables</h3><button className="add-table btn" onClick={() => { setAddtable(!addtable) }}>{addtable ? 'x' : '+'}</button>
        </div>{addtable ? <AddForm addData={addData} /> :
          <div><div className="bottom-bottom">
            {table_data.length !== 0 ? <ul>
              {table_data.map((table) => {
                return <li key={table['table_name']}>
                  <div className="table"><h3 className="table-name">{table["table_name"]}</h3><a href="#" className="delete" onClick={() => deleteTable(table)}>X</a></div>
                </li>
              })}

            </ul> : <h3 className='no_tables'>No Tables, Click the plus ^</h3>}
          </div>
            <button className="create-db btn" onClick={() => { handleDBCreate(db_name) }}>Create database</button>

            {download ? <button className="btn" onClick={()=>{downloadDb()}}>Download DB</button> : ""}
          </div>}
      </div> : <h3 className='no_tables'>Click Go To Start</h3>}
    </div>
  )
}

export default App
