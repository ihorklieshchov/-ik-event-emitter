/**
 * Event listener function with a variable list of arguments
 */
type Listener<T extends Array<unknown>> = (...payload: T) => void;

/**
 * Options used to configure event listener subscription
 */
type AddEventListenerOptions = {
  /**
   * if true then listener should be unsubscribed after the first target event emitted
   */
  once: boolean;
};

/**
 * Class to create event emitter objects
 *
 * @typeParam T - used to apply constraints on supported event names and expected payloads
 *
 * @example
 * Limits the number of supported events to the next 3:
 *  - meaningOfLife - event emits a single numeric value
 *  - protagonist - event emits two string values
 *  - beep - an event with empty payload
 *
 * ```ts
 * type MyEventMap = {
 *   meaningOfLife: [theAnswer: number];
 *   protagonist: [firstName: string, lastName: string];
 *   beep: [];
 * };
 *
 * const myEmitter = new EventEmitter<MyEventMap>();
 * ```
 */
export class EventEmitter<T extends Record<string, Array<unknown>>> {
  /**
   * Stores all event listeners grouped by event name
   */
  private listeners: { [K in keyof T]?: Set<Listener<T[K]>> } = {};

  /**
   * Stores event listeners that were created with the once=true option
   * and should be removed after the first target event
   */
  private once: Set<unknown> = new Set();

  /**
   * Subscribe listener to a specific event
   *
   * @param name - event name
   * @param listener - listener function
   * @param options - used to configure subscription behavior
   */
  addEventListener<K extends keyof T>(
    name: K,
    listener: Listener<T[K]>,
    options?: Partial<AddEventListenerOptions>,
  ) {
    const optionsWithDefaults: AddEventListenerOptions = {
      once: false,
      ...options,
    };

    const listeners = this.listeners[name] ?? new Set();
    this.listeners[name] = listeners;
    listeners.add(listener);

    if (optionsWithDefaults.once) {
      this.once.add(listener);
    }
  }

  /**
   * Unsubscribe listener from a specific event
   *
   * @param name - event name
   * @param listener - listener function
   */
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

  /**
   * Emit event by name with required payload data
   *
   * @param name - event name
   * @param payload - event related data
   */
  emit<K extends keyof T>(name: K, ...payload: T[K]) {
    const listeners = this.listeners[name];
    if (!listeners) {
      return;
    }

    listeners.forEach((listener) => {
      listener(...payload);

      if (this.once.has(listener)) {
        this.removeEventListener(name, listener);
      }
    });
  }
}
