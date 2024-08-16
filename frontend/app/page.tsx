"use client"
declare const window: any
import WrongNetworkMessage from '../components/WrongNetworkMessage'
import ConnectWalletButton from '../components/ConnectWalletButton'
import TodoList from '../components/TodoList'
import TaskAbi from '../../backend/build/contracts/TaskContract.json'
import { TaskContractAddress } from '@/config'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { SyntheticEvent } from 'react'

interface Task {
  id: bigint;
  taskText: string;
  isDeleted: boolean;
}
export default function Home() {

  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [currentAccount, setCurrentAccount] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

  
  useEffect(()=>{
    connectWallet()
    getAllTasks()
  },[])

  const connectWallet = async () => {
    try {
      const { ethereum }  = window
      if(!ethereum) {
        console.log('MetaMask not detected')
        return
      }
      let chainId = await ethereum.request({method: 'eth_chainId'})
      console.log('connected to chain:', chainId)
      const accounts = await ethereum.request({method: 'eth_requestAccounts'})
      console.log('Found Account',accounts[0])
      setIsUserLoggedIn(true)
      setCurrentAccount(accounts[0])
    } catch(error) {
      console.log(error);
    }
  }


  const getAllTasks = async () => {
    try {
      const { ethereum } = window
      if(ethereum) {
        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )
        let allTasks = await TaskContract.getMyTasks()
        console.log("these are all the tasks", allTasks);
        
        setTasks(allTasks)
      } else {
        console.log('ethereum object does not exist')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addTask = async (e:SyntheticEvent) => {
    e.preventDefault()

    let task = {
      taskText: input,
      isDeleted: false
    }

    try {
      const { ethereum } = window
      if(ethereum) {
        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )

        TaskContract.addTask(task.taskText, task.isDeleted)
        .then(res => {
          getAllTasks();
        })
        .catch(err => {
          console.log(err)
        })
      } else {
        console.log('ethereum object does not exist!')
      }
    } catch(error) {
      console.log(error);
    }
    setInput('')
  }

  const deleteTask = (taskId: bigint, isDeleted: boolean) => async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        console.log('Calling deleteTask with taskId:', taskId, 'isDeleted:', isDeleted);
        await TaskContract.deleteTask(taskId, isDeleted);
        console.log('Task deleted successfully');
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };


  return (
    <div className='bg-[#97b5fe] h-screen w-screen flex justify-center py-6'>
      {!isUserLoggedIn ? <ConnectWalletButton connectWallet={connectWallet}/> : <TodoList tasks={tasks} input={input} setInput={setInput} addTask={addTask} deleteTask={deleteTask}/>}
    </div>
  )
}