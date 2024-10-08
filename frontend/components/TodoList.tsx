import Navbar from './Navbar';
import { IoMdAddCircle } from 'react-icons/io';
import Task from './Task';
import { SyntheticEvent } from 'react';


interface TaskType {
  id: bigint
  taskText: string;
  isDeleted: boolean;
}

interface TodoListProps {
  tasks: TaskType[];
  input: string;
  setInput: (value: string) => void;
  addTask: (e: SyntheticEvent) => Promise<void>; // Update to match the signature
  deleteTask: (id: bigint, deleted: boolean) =>()=> Promise<void>
}

const TodoList: React.FC<TodoListProps> = ({ tasks, input, setInput, addTask, deleteTask }) => (
  <div className='w-[70%] bg-[#354ea3] py-4 px-9 rounded-[30px] overflow-y-scroll'>
    <Navbar />
    <h2 className='text-4xl bolder text-white pb-8'>
      What&apos;s up, Kevin!
    </h2>
    <div className='py-3 text-[#7d99e9]'>TODAY&apos;S TASKS</div>
    <form className='flex items-center justify-center'>
      <input
        className='rounded-[10px] w-full p-[10px] border-none outline-none bg-[#031956] text-white mb-[10px]'
        placeholder='Add a task for today...'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <IoMdAddCircle
        onClick={(e:SyntheticEvent) => addTask(e)}
        className='text-[#ea0aff] text-[50px] cursor-pointer ml-[20px] mb-[10px]'
      />
    </form>
    <ul>
      {
        tasks.map(item => (
          <Task
            key={item.id}
            taskText={item.taskText}
            onClick={deleteTask(item.id, true)} // Example: setting isDeleted to true
          />

        ))
      }
    </ul>
  </div>
);

export default TodoList;
