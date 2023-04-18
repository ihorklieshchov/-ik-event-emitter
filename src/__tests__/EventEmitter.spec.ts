import { describe, expect, it, jest } from '@jest/globals';
import { EventEmitter } from '../EventEmitter';

describe('EventEmitter', () => {

  type EventMap = {
    meaningOfLife: [theAnswer: number];
    protagonist: [firstName: string, lastName: string];
    beep: [],
  }

  describe('event type constraint', () => {

    it('no constraint', () => {
      const emitter = new EventEmitter();
      const listener = jest.fn();

      emitter.addEventListener('value', listener);
      emitter.emit('value', 42);

      expect(listener).toBeCalledWith(42);
    });

    it('with constraint', () => {
      const emitter = new EventEmitter<EventMap>();
      const listener = jest.fn();

      emitter.addEventListener('meaningOfLife', listener);
      emitter.emit('meaningOfLife', 42);

      expect(listener).toBeCalledWith(42);
    });
  });

  describe('listener lifetime', () => {
    
    it('until unsubscribed (default)', () => {
      const emitter = new EventEmitter<EventMap>();
      const listener = jest.fn();
      
      emitter.addEventListener('meaningOfLife', listener);
      const emitTimes = 3;
      new Array(emitTimes).fill(null).forEach(() => emitter.emit('meaningOfLife', 42));

      expect(listener).toBeCalledTimes(emitTimes);
      
      emitter.removeEventListener('meaningOfLife', listener);
      emitter.emit('meaningOfLife', 42);
      
      expect(listener).toBeCalledTimes(emitTimes); // last emit has no affect
    });

    it('until event emitted once', () => {
      const emitter = new EventEmitter<EventMap>();
      const listener = jest.fn();
      
      emitter.addEventListener('meaningOfLife', listener, { once: true });
      const emitTimes = 3;
      new Array(emitTimes).fill(null).forEach(() => emitter.emit('meaningOfLife', 42));

      expect(listener).toBeCalledTimes(1);
    });
  });

  describe('smoke test', () => {
    it('emit event without listeners', () => {
      const emitter = new EventEmitter<EventMap>();
      emitter.emit('meaningOfLife', 42);
    });
  });

  describe('values', () => {
    it('emit no value', () => {
      const emitter = new EventEmitter<EventMap>();
      const listener = jest.fn();
      
      emitter.addEventListener('beep', listener);
      emitter.emit('beep');

      expect(listener).toBeCalledTimes(1);
    });

    it('emit multiple values', () => {
      const emitter = new EventEmitter<EventMap>();
      const listener = jest.fn();
      
      emitter.addEventListener('protagonist', listener);
      emitter.emit('protagonist', 'Arthur', 'Dent')

      expect(listener).toBeCalledWith('Arthur', 'Dent');
    });
  });
});
