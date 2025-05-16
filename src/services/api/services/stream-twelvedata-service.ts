export class StreamTwelvedataService<T> {
  protected readonly socketUrl: string;
  protected socket: WebSocket | null = null;
  protected connected: boolean = false;
  protected bufferedUpdates: T[] = [];
  protected flushCallback: ((data: T[]) => void) | null = null;
  protected flushTimeout: NodeJS.Timeout | null = null;
  protected flushDelay = 1000;

  constructor(socketUrl: string) {
    this.socketUrl = socketUrl;
  }

  protected flushUpdates() {
    if (this.bufferedUpdates.length && this.flushCallback) {
      this.flushCallback(this.bufferedUpdates);
      this.bufferedUpdates = [];
    }
  }

  protected onMessage(event: MessageEvent) {
    try {
      const parsedData: T = JSON.parse(event.data);
      this.bufferedUpdates.push(parsedData);
      if (!this.flushTimeout) {
        this.flushTimeout = setTimeout(() => {
          this.flushUpdates();
          this.flushTimeout = null;
        }, this.flushDelay);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  public connect(): Promise<void> {
    if (this.socket) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.socket = new WebSocket(this.socketUrl);
      this.socket.onopen = () => {
        console.log("WebSocket connected");
        this.connected = true;
        resolve();
      };
      this.socket.onmessage = this.onMessage.bind(this);
      this.socket.onclose = (event) => {
        console.log(`WebSocket closed: ${event.code} ${event.reason}`);
        this.socket = null;
      };
      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public async subscribe(symbols: string) {
    if (!this.connected) {
      await this.connect();
    }
    this.socket?.send(
      JSON.stringify({
        action: "subscribe",
        params: { symbols },
      }),
    );
  }

  public setFlushCallback(callback: (data: T[]) => void) {
    this.flushCallback = callback;
  }
}
