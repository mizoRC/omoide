export interface Task<T> {
  (): Promise<T>;
}

export class ConcurrencyPool {
  private queue: Array<{
    task: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private running = 0;
  private limit: number;

  constructor(limit: number = 8) {
    this.limit = Math.max(1, limit);
  }

  async run<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.running < this.limit) {
        this.running++;
        task()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.running--;
            this.processQueue();
          });
      } else {
        this.queue.push({ task, resolve, reject });
      }
    });
  }

  private processQueue(): void {
    while (this.running < this.limit && this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        this.running++;
        item
          .task()
          .then(item.resolve)
          .catch(item.reject)
          .finally(() => {
            this.running--;
            this.processQueue();
          });
      }
    }
  }

  async waitAll(): Promise<void> {
    return new Promise((resolve) => {
      const checkDone = () => {
        if (this.running === 0 && this.queue.length === 0) {
          resolve();
        } else {
          setTimeout(checkDone, 50);
        }
      };
      checkDone();
    });
  }
}
