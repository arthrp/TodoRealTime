using System.Collections.Concurrent;

namespace TodoApi;

public class TodoRepository
{
    private ConcurrentDictionary<long,Todo> _items = new();
    
    public List<Todo> GetAll()
    {
        return _items.Values.ToList();
    }

    public void Add(Todo todo)
    {
        _items.TryAdd(todo.Id, todo);
    }

    public Todo? Get(int id)
    {
        return _items[id];
    }

    public void Delete(long id)
    {
        if (!_items.ContainsKey(id)) return;
        
        Todo? res;
        _items.Remove(id,out res);
    }
}