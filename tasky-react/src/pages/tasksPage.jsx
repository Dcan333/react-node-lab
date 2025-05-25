import Task from '../components/Task';
import AddTaskForm from '../components/Form';
import { useState, useEffect } from 'react'; 
import {getTasks, addTask, deleteTask, updateTask} from "../api/tasky-api";

function TasksPage() {
  
  const [ taskState, setTaskState ] = useState({tasks: []});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      getTasks().then(tasks => {
        setTaskState({tasks: tasks});
      }).catch(err => {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
      });
    }, []);
  
    console.log('Current tasks:', taskState.tasks); // Debug log

  const doneHandler = (taskIndex) => {
    const tasks = [...taskState.tasks];
    tasks[taskIndex].done = !tasks[taskIndex].done;
    updateTask(tasks[taskIndex]).catch(err => {
      console.error('Error updating task:', err);
      // Revert the change if update fails
      tasks[taskIndex].done = !tasks[taskIndex].done;
      setTaskState({tasks});
    });
    setTaskState({tasks});
  }

  const deleteHandler = (taskIndex) => {
    const tasks = [...taskState.tasks];
    const id = tasks[taskIndex]._id;
    tasks.splice(taskIndex, 1);
    deleteTask(id).catch(err => {
      console.error('Error deleting task:', err);
      // Could add the task back if delete fails
    });
    setTaskState({tasks});
  }

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('=== FORM SUBMISSION DEBUG ===');
      
      // Get form data directly from the form elements
      const formData = new FormData(event.target);
      const taskData = {
        title: formData.get('title'),
        description: formData.get('description'),
        deadline: formData.get('deadline'),
        priority: formData.get('priority')
      };
      
      console.log('Task data from form:', taskData);
      console.log('Auth token exists:', !!localStorage.getItem('token'));
      
      // Validate required fields
      if (!taskData.title || !taskData.deadline || !taskData.priority) {
        throw new Error('Please fill in all required fields (title, deadline, priority)');
      }
      
      console.log('Calling addTask API...');
      const newTask = await addTask(taskData);
      console.log('API Response:', newTask);
      
      if (newTask && newTask._id) {
        const tasks = taskState.tasks ? [...taskState.tasks] : [];
        tasks.push(newTask);
        setTaskState({tasks});
        
        // Reset the form
        event.target.reset();
        
        console.log('✅ Task added successfully!');
      } else {
        console.error('❌ Invalid server response:', newTask);
        throw new Error('Server returned invalid response');
      }
    } catch (err) {
      console.error('❌ Error adding task:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack
      });
      
      // More specific error messages
      if (err.message.includes('401')) {
        setError('Authentication failed. Please log in again.');
      } else if (err.message.includes('400')) {
        setError('Invalid task data. Please check all fields.');
      } else if (err.message.includes('500')) {
        setError('Server error. Please try again later.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Is the backend running?');
      } else {
        setError(`Failed to add task: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <>
      {error && <div style={{color: 'red', padding: '10px'}}>{error}</div>}
      
      {taskState.tasks.map((task, index) => (              
        <Task 
          title={task.title}
          description={task.description}
          deadline={task.deadline}
          key={task._id}
          done={task.done}
          priority={task.priority}
          markDone={() => doneHandler(index)}
          deleteTask = {() => deleteHandler(index)}
        />
      ))}
      
      <AddTaskForm 
        submit={formSubmitHandler}
        disabled={loading}
      />
      
      {loading && <div>Adding task...</div>}
    </>
  );
}

export default TasksPage;