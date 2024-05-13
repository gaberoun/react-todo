import { useReducer, useState } from 'react';
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

const sampleData = [
  {id: '1', task: 'Manood ng bold', isCompleted: false},
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
      const filtered = state.filter((item) => item.id != action.payload.id);
      return [...filtered];
    case 'EDIT_TODO':
      const editedTodo = {...state[action.payload.index], task: action.payload.task}
      state[action.payload.index] = editedTodo;
      return [...state];
    case 'TOGGLE_TODO':
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
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const submitHandler = (e: any) => {
    e.preventDefault();
    dispatch({type: 'ADD_TODO', payload: {task}});
    setTask('');
  }

  const style = isDisabled 
    ? 'btn position-absolute top-0 end-0 m-4 shadow p-2 rounded-circle' 
    : 'btn active position-absolute top-0 end-0 m-4 shadow p-2 rounded-circle';


  return (
    <>
      <h1 className='text-center my-4'>Todo List</h1>
      <div
        className={style}
        style={{width: '3rem'}}
        data-bs-toggle="tooltip" 
        title="Enable editing"
        onClick={() => setIsDisabled(!isDisabled)}
      >
        <Cog6ToothIcon />
      </div>
      <form 
        className='d-flex gap-2 w-50 text-center container my-4' 
        onSubmit={submitHandler}
      >
        <input 
          type="text" 
          className="form-control" 
          placeholder="Enter task" 
          value={task} 
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Enter</button>
      </form>
      <ul className='list-group list-group-flush container'>
        {state.map((item, index) => (
          <li key={item.id} className='list-group-item d-flex justify-content-between align-items-center gap-5'>
            <input 
              type='checkbox' 
              className='form-check-input' 
              onChange={(e) => dispatch({type: 'TOGGLE_TODO', payload: {index, checked: e.target.checked}})} 
            />
            <input 
              className='form-control-plaintext' 
              style={{textDecoration: item.isCompleted ? 'line-through' : 'none'}} 
              value={item.task} 
              disabled={isDisabled}
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
    </>
  )
}

export default App