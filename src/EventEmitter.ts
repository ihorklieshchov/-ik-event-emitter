type Listener<T extends Array<unknown>> = (...args: T) => void;

type AddEventListenerOptions = {
  once: boolean;
};

export class EventEmitter<T extends Record<string, Array<unknown>>> {
  private listeners: { [K in keyof T]?: Set<Listener<T[K]>> } = {};

  private once: Set<unknown> = new Set();

  addEventListener<K extends keyof T>(name: K, listener: Listener<T[K]>, options?: Partial<AddEventListenerOptions>) {
    const optionsWithDefaults: AddEventListenerOptions = { once: false, ...options };

    const listeners = this.listeners[name] ?? new Set();
    this.listeners[name] = listeners;
    listeners.add(listener);

    if (optionsWithDefaults.once) {
      this.once.add(listener);
    }
  }

  removeEventListener<K extends keyof T>(name: K, listener: Listener<T[K]>) {
    const listeners = this.listeners[name];
    if (!listeners) {
      return;
    }

    listeners.delete(listener);
    if (listeners.size === 0) {
      delete this.listeners[name];
    }

    this.once.delete(listener);
  }

  emit<K extends keyof T>(name: K, ...args: T[K]) {
    const listeners = this.listeners[name];
    if (!listeners) {
      return;
    }

    listeners.forEach((listener) => {
      listener(...args);

      if (this.once.has(listener)) {
        this.removeEventListener(name, listener);
      }
    });
  }
}
