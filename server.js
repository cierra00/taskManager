const readline = require('readline');
const fs = require('fs').promises;
const tasksJson = './tasks.json';
const { promisify } = require('util');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const getAllTasks = async () => {
    try {
        const data = await fs.readFile(tasksJson, 'utf8');      
        const tasks = JSON.parse(data);        
        console.log('\nTasks:', tasks);
        if (!Array.isArray(tasks)) {
            throw new Error('Parsed data is not an array');
        }
    } catch (error) {
        console.error('Error reading tasks file:', error);
     return;
    }

};

const addTask = async (id, title, description, status="not completed") => {
    try {
        const data = await fs.readFile(tasksJson, 'utf8');
        const tasks = JSON.parse(data);
        
        // Create a new task object
        const newTask = {
            id,
            title,
            description, 
            status          
        };
        
        // Add the new task to the tasks array
        tasks.push(newTask);
        
        // Write the updated tasks array back to the file
        await fs.writeFile(tasksJson, JSON.stringify(tasks, null, 2), 'utf8');
        
        console.log('Task added successfully!');
    } catch (error) {
        console.error('Error adding task:', error);
    }
};

const taskUserInput = async()=>{    
      const question = promisify(rl.question).bind(rl);
      try{
      const id = await question('Enter Task Id');
      const title = await question('Enter task title: ');
      const description = await question('Enter task description: ');
      if(id && title && description){
        await addTask(id, title, description);
      } else {
        console.log('Values Cannot Be Null')
        setTimeout(() => {
            taskUserInput();
        }, 2000);
        
      }

      } catch(error){
        console.error("Error entering task");
      }
}



const completeTask = async (id) => {
    try {
        // Read and parse the existing tasks from the file
        const data = await fs.readFile(tasksJson, 'utf8');
        const parsedData = JSON.parse(data);

        // Update the status of the task with the specified ID
        const updatedTasks = parsedData.map(task =>
            task.id === id ? { ...task, status: 'completed' } : task
        );

        // Write the updated tasks back to the file
        await fs.writeFile(tasksJson, JSON.stringify(updatedTasks, null, 2), 'utf8');

        // Log the updated tasks
        console.log('Task updated:', updatedTasks);
    } catch (error) {
        console.error('Error updating task status:', error);
    }
};
const completeUserInput = async()=>{    
    const question = promisify(rl.question).bind(rl);
    try{
    const id = await question('Enter The Task Id of the Task You Wish to Mark Complete: ');    
    console.log(`The ID is : ${id}, and type is ${typeof(id)}` );
    await completeTask(parseInt(id));
    } catch(error){
      console.error("Error entering task");
    }
}





const menu = ()=>{   
   rl.question('Welcome to the NodeJS Task Manager\n\n\nPress 1 to read the tasks\nPress 2 to add a task\npress 3 to complete a task\n\n\nPlease select an option (1-3):', handleSelection);
}

const handleSelection = (selection)=>{
    switch(selection.trim()){
        case '1':
            getAllTasks();                     
            break;
        case '2':
            taskUserInput();
            break;
        case '3':
            completeUserInput();
            // completeTask(2);
            break;
        
    }
    setTimeout(() => {
        menu();
    }, 2000);
    
   
}


menu();
