import { useEffect, useReducer, useState } from 'react';
import uuid from 'react-uuid';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';


interface Todo {
  id: string;
  task: string;
  isCompleted: boolean;
};

interface ReducerAction {
  type: string;
  payload: any;
}

interface Toggle {
  isEditable: boolean;
  isDisabled: boolean;
  isHidden: boolean;
}

const sampleData = [
  {id: '1', task: 'Eat breakfast', isCompleted: false},
  {id: '2', task: 'Drink milk', isCompleted: false}
];

const reducer = (state: Todo[], action: ReducerAction) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, {
        id: uuid(),
        task: action.payload.task,
        isCompleted: false
      }];
    case 'REMOVE_TODO':
      const updated = state.filter((item) => item.id != action.payload.id);
      return [...updated];
    case 'EDIT_TODO':
      const editedTodo = {...state[action.payload.index], task: action.payload.task}
      state[action.payload.index] = editedTodo;
      return [...state];
    case 'TOGGLE_TODO':
      // Toggle mark on completed todo
      const toggledTodo = {...state[action.payload.index], isCompleted: action.payload.checked}
      state[action.payload.index] = toggledTodo;
      return [...state]; 
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, sampleData);
  const [task, setTask] = useState<string>('');
  const [filtered, setFiltered] = useState<Todo[]>(sampleData);
  const [toggle, setToggle] = useState<Toggle>({
    isEditable: true,
    isDisabled: true,
    isHidden: false
  })

  const filterTodos = () => {
    if (toggle.isHidden) {
      const updated = state.filter((item) => item.isCompleted === false);
      setFiltered(updated);
    } else {
      setFiltered(state);
    }   
  }

  useEffect(() => {
    filterTodos();
  }, [state, toggle.isHidden]);

  // Add todo in list after submission
  const submitHandler = (e: any) => {
    e.preventDefault();
    dispatch({type: 'ADD_TODO', payload: {task}});
    setTask('');
  }

  // Enable submit button if todo has content
  const changeHandler = (e:any) => {
    setTask(e.target.value);
    if (e.target.value === '') setToggle({ ...toggle, isDisabled: true });
    else setToggle({ ...toggle, isDisabled: false });
  }

  const optionStyle = toggle.isEditable 
    ? 'btn position-absolute top-0 end-0 m-4 shadow p-2 rounded-circle' 
    : 'btn active position-absolute top-0 end-0 m-4 shadow p-2 rounded-circle';


  return (
    <div className='container-fluid'>
      <h1 className='text-center my-4'>Todo List</h1>
      <div
        className={optionStyle}
        style={{width: '3rem'}}
        data-bs-toggle="tooltip" 
        title="Enable editing"
        onClick={() => setToggle({ ...toggle, isEditable: !toggle.isEditable })}
      >
        <Cog6ToothIcon />
      </div>
      <form 
        className='d-flex gap-2 w-75 text-center mx-auto my-1' 
        onSubmit={submitHandler}
      >
        <input 
          type="text" 
          className="form-control" 
          placeholder="Enter task" 
          value={task} 
          onChange={changeHandler}
        />
        <button type="submit" className="btn btn-primary" disabled={toggle.isDisabled}>Enter</button>
      </form>

      <div className='d-flex flex-row-reverse w-75 mx-auto text-secondary mb-4' style={{fontSize: '0.85rem'}}>
        <label>Hide Completed</label>
        <input 
          type='checkbox' 
          className='form-check-input'
          onChange={() => setToggle({ ...toggle, isHidden: !toggle.isHidden })}
        />
      </div>

      <ul className='list-group list-group-flush container'>
        {filtered.map((item, index) => (
          <li key={item.id} className='list-group-item d-flex justify-content-between align-items-center gap-5'>
            <input 
              type='checkbox' 
              className='form-check-input' 
              onChange={(e) => dispatch({type: 'TOGGLE_TODO', payload: {index, checked: e.target.checked}})} 
            />
            <input 
              className='form-control-plaintext' 
              style={{
                textDecoration: item.isCompleted ? 'line-through' : 'none',
                color: toggle.isEditable ? 'black' : '#007BFF'
              }} 
              value={item.task} 
              disabled={toggle.isEditable}
              onChange={(e) => dispatch({type: 'EDIT_TODO', payload: {index, task: e.target.value}})} 
            />
            <button 
              className='btn btn-danger btn-sm'
              onClick={() => dispatch({type: 'REMOVE_TODO', payload: {id: item.id}})}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App