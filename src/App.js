
import './App.css';
import { useState } from 'react';




function EditTask({ toggleModal, taskEdit, handleUpdateList }) {
  const [task, setTask] = useState(taskEdit)

  {
    return (
      <div className='modal'>
        <div className='overlay'>
          <button className='btn-close' onClick={toggleModal}>X</button>
          <h1>Edit Task</h1>
          <div className='form-edit'>
            <form>
              <input className='edit-name' value={task.name} placeholder='Name' onChange={(event) => {
                setTask((preTask) => preTask = {
                  name: event.target.value,
                  description: preTask.description,
                  state: preTask.state
                }
                )
              }} />
              <br />
              <input className='edit-description' value={task.description} placeholder='Description...' onChange={(event) => {
                setTask((preTask) => preTask = {
                  name: preTask.name,
                  description: event.target.value,
                  state: preTask.state
                }
                )
              }} />
              <br />
              <button className='btn-save' >Save</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

function App() {

  // Set state 
  const [task, setTask] = useState({
    name: '',
    description: '',
    state: false
  });

  const [list, setList] = useState(() => {
    const storageList = JSON.parse(localStorage.getItem('listTask'))
    return storageList || []
  });

  const [listType, setListType] = useState(false)

  const [modalEdit, setModalEdit] = useState(false)

  const [taskEdit, setTaskEdit] = useState({})



  const toggleModal = () => {
    //setTaskEdit(value)
    setModalEdit(!modalEdit)
  }



  // Validate form when submit new item
  const validationForm = () => {
    let returnData = {
      error: false,
      msg: ''
    }

    const taskCheck = task
    if (taskCheck.name === '' || taskCheck.description === '') {
      returnData.error = true
      returnData.msg = 'Name or description can\'t empty'
    }
    return returnData;
  }


  // Handle Check
  const handleCheck = (value) => {
    setList(prev => {
      const isChecked = value.state === true;
      if (isChecked) {
        const newList = [...prev]
        for (let v of newList) {
          if (v.name === value.name) {
            v.state = false
          }
        }
        setListInLocalStorage(newList)
        return newList
      } else {

        const newList = [...prev]
        for (let v of newList) {
          if (v.name === value.name) {
            v.state = true
          }
        }
        setListInLocalStorage(newList)
        return newList
      }
    })

  }
  // Set list task in local Storage
  const setListInLocalStorage = (list) => {
    const jsonJobs = JSON.stringify(list)
    localStorage.setItem('listTask', jsonJobs)
  }


  

  return (
    <div className="App">
      <div className="App-header">
        <h1>Todo App</h1>
      </div>

      <form className='Create-task' onSubmit={(event) => {
        event.preventDefault();
        const validation = validationForm()
        if (validation.error) {
          alert(validation.msg)
        }
        else {
          setList((preList) => {
            const newList = [...preList, task]
            setListInLocalStorage(newList)
            return newList
          })

          setTask({
            name: '',
            description: '',
            state: false
          })

        }

      }}>
        <input className='input-name' type="text" value={task.name} placeholder="Name" onChange={(event) => {
          setTask((preTask) => preTask = {
            name: event.target.value,
            description: preTask.description,
            state: preTask.state
          }
          )
        }} />
        <button className='btn'><i className='fa-solid fa-plus'></i> Add new item</button>
        <br />
        <input className='input-description' type="text" value={task.description} placeholder="Description..." onChange={(event) => {
          setTask((preTask) => preTask = {
            name: preTask.name,
            description: event.target.value,
            state: preTask.state
          }
          )
        }} />
      </form>


      <div className='list'>

        <div className='type-list'>

          <button onClick={() => {
            setListType(false)
          }} >Todo</button>

          <button onClick={() => {
            setListType(true)
          }}>Done</button>

        </div>

        <table className='list-task'>

          <tr className='header-list'>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Checked</th>
            <th>Action</th>
          </tr>

          {
            list.filter((value) => value.state === listType)
              .map((value, index) => {
                return (
                  <tr className='content-list' key={index}>
                    <td className='task-id' width={'7%'} >{index + 1}</td>
                    <td className='task-name' width={'13%'}>{value.name}</td>
                    <td className='task-description' width={'60%'}>
                      {value.description}
                    </td>

                    <td className='task-checked' width={'10%'}>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={value.state === true}
                          onChange={() => {
                            handleCheck(value, index)
                          }}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>

                    <td className='task-action' width={'10%'}>
                      <button className='btn-edit' onClick={() => {
                        setTaskEdit(value)
                        setModalEdit(!modalEdit)
                      }}><i className='fa-solid fa-pen'></i></button>

                      <button className='btn-delete' onClick={() => {
                        if (window.confirm('Are you sure delete task ?')) {
                          const newList = list.filter((val) => {
                            return val !== value
                          })
                          setListInLocalStorage(newList)
                          setList(newList)
                        }

                      }}>
                        <i className='fa-solid fa-trash-can'></i>
                      </button>
                    </td>

                  </tr>
                )
              })

          }

        </table>

      </div>
      {modalEdit && <EditTask toggleModal={toggleModal} taskEdit={taskEdit} />}


    </div>
  );
}

export default App;
