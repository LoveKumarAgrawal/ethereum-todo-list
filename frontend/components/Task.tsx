import { BsFillTrashFill } from 'react-icons/bs'

interface TaskProps {
  taskText: string;
  onClick: () => Promise<void>
}

const Task:React.FC<TaskProps> = ({taskText, onClick}) => {
  return (
    <div className='flex items-center text-white'>
      <div className=' bg-[#031956] text-[#b6c7db] flex w-[70%] rounded-[15px] mb-[10px] flex-1'>
        <div className='flex items-center justify-between w-full p-[20px] text-xl'>
          {taskText}
        </div>
      </div>
      <BsFillTrashFill
        onClick={onClick}
        className='text-2xl cursor-pointer ml-10'
      />
    </div>
  )
}

export default Task
