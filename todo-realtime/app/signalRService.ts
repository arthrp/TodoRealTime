import * as signalR from "@microsoft/signalr";

export const createSignalRConnection = async (hubUrl: string) => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information) // Set logging level
      .build();
  
    try {
      await connection.start();
      console.log("SignalR Connected.");
    } catch (err) {
      console.log("SignalR Connection Error: ", err);
    }
  
    return connection;
};
