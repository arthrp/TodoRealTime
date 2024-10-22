import axios from "axios";
import { Todo } from "./interfaces/todo";

const API_URL = 'https://localhost:7094/todo';

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(`${API_URL}/all`);

  console.log('data is', response);
  return response.data;
};

export const createTodo = async (title: string): Promise<Todo> => {
  const response = await axios.post(`${API_URL}/add`, { title, completed: false });
  return response.data;
};

export const updateTodo = async (id: number, completed: boolean): Promise<Todo> => {
  const response = await axios.put(`${API_URL}/${id}`, { completed });
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};