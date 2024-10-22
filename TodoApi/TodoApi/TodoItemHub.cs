using Microsoft.AspNetCore.SignalR;

namespace TodoApi;

public class TodoItemHub : Hub
{
    public async Task BroadcastNewTodo(string title)
    {
        await Clients.All.SendAsync("ReceiveBroadcast", $"New todo was added: '{title}'");
    }
}