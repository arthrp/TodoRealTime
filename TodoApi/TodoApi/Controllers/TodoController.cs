using Microsoft.AspNetCore.Mvc;

namespace TodoApi.Controllers;

[ApiController]
[Route("todo")]
public class TodoController(TodoRepository _todoRepository) : ControllerBase
{
    [HttpGet("all")]
    public List<Todo> GetAll()
    {
        return _todoRepository.GetAll();
    }

    [HttpPost("add")]
    public Todo Add(Todo todo)
    {
        var newTodo = new Todo(new Random().NextInt64(0, long.MaxValue-1), todo.Title, todo.IsDone);
        
        _todoRepository.Add(newTodo);
        return newTodo;
    }

    [HttpDelete("{id}")]
    public void Delete(long id)
    {
        _todoRepository.Delete(id);
    }
}