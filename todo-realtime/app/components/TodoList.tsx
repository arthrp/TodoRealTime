"use client";
import { useEffect, useState } from "react";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../todoService";
import { Todo } from "../interfaces/todo";
import { createSignalRConnection } from "../signalRService";

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  
    useEffect(() => {
      fetchTodos();
    }, []);

    useEffect(() => {
        const startConnection = async () => {
          const hubUrl = "https://localhost:7094/todohub";
          const newConnection = await createSignalRConnection(hubUrl);
          setConnection(newConnection);
    
          if (newConnection) {
            // Listen for incoming messages
            newConnection.on("ReceiveBroadcast", (message: string) => {
              console.log('Got message',message);
            });
          }
        };
    
        startConnection();
    
        // Clean up on unmount
        return () => {
          connection?.stop();
        };
      }, []);
  
    const fetchTodos = async () => {
      const todos = await getTodos();
      setTodos(todos);
    };
  
    const handleCreateTodo = async () => {
      if (newTodo.trim()) {
        const todo = await createTodo(newTodo);
        await broadcast(newTodo);
        setTodos([...todos, todo]);
        setNewTodo('');
      }
    };
  
    const handleToggleTodo = async (id: number, isDone: boolean) => {
      const updatedTodo = await updateTodo(id, !isDone);
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    };
  
    const handleDeleteTodo = async (id: number) => {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    };

    const broadcast = async(title: string) => {
        if(connection && title) {
            await connection.invoke("BroadcastNewTodo", title);
        }
    }
  
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        <div className="mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 mr-2"
          />
          <button
            onClick={handleCreateTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Todo
          </button>
        </div>
        <ul className="w-64">
          {todos.map((todo) => (
            <li key={todo.id} className="flex justify-between items-center bg-white shadow-md rounded-lg p-2 mb-2">
              <span
                className={`cursor-pointer ${todo.isDone ? 'line-through text-gray-500' : ''}`}
                onClick={() => handleToggleTodo(todo.id, todo.isDone)}
              >
                {todo.title}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default TodoList;