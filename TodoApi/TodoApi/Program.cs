namespace TodoApi;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddAuthorization();
        
        builder.Services.AddControllers();
        builder.Services.AddSignalR();
        
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin", b =>
            {
                b.WithOrigins("http://localhost:3000") // Your frontend URL
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        
        //DI
        builder.Services.AddSingleton<TodoRepository>();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseCors("AllowSpecificOrigin");
        }

        app.UseHttpsRedirection();
        
        app.UseRouting();
        app.UseAuthorization();

        app.MapHub<TodoItemHub>("/todohub");
        app.MapControllers();

        app.Run();
    }
}