<div align="center">
  <h3 align="center">EventEmitter</h3>

  <p align="center">
    Type-Safe EventEmitter with constraints on supported events and their payloads
  </p>
</div>

<summary>Table of Contents</summary>
<ol>
  <li><a href="#installation">Installation</a></li>
  <li>
    <a href="#usage">Usage</a>
    <ul>
      <li><a href="#with-constraints">With constraints</a></li>
      <li><a href="#inheriting-from-eventemitter">Inheriting from EventEmitter</a></li>
      <li><a href="#one-time-subscription">One-time subscription</a></li>
    </ul>
  </li>
  <li><a href="#license">License</a></li>
</ol>



## Installation 
```sh
npm i @kiolib/event-emitter
```



## Usage

### With constraints

Create a custom type to limit the list of available events and describe the data associated with each of them:
- keys - list of the allowed event names;
- values - list of parameters which need to be send with specific event.

```ts
const { EventEmitter } from '@kiolib/event-emitter';

type EventMap = {
  meaningOfLife: [theAnswer: number];
  protagonist: [firstName: string, lastName: string];
  beep: [];
};

const emitter = new EventEmitter<EventMap>();

// subscribe to events
emitter.addEventListener(
  'meaningOfLife',
  answer => console.log(answer)
);
emitter.addEventListener(
  'protagonist',
  (firstName, lastName) => console.log(firstName, lastName)
);
emitter.addEventListener(
  'beep',
  () => console.log('beeped')
);

// emit events
emitter.emit('meaningOfLife', 42);
emitter.emit('protagonist', 'Arthur', 'Dent');
emitter.emit('beep');

```

### Inheriting from EventEmitter
In the example below we are extending our custom UserService class from the EventEmitter to enable events support:

```ts
import { EventEmitter } from "./EventEmitter";

// user model
type User = {
  id: string;
  username: string;
};

// supported events for UserService 
type UserEvents = {
  login: [user: User];
  logout: [];
}

class UserService extends EventEmitter<UserEvents> {
  async login(username: string, password: string) {
    // authenticathion logic
    this.emit('login', { id: '42', username: 'arthur.dent' });
  }

  async logout() {
    // clear user data
    this.emit('logout');
  }
}

// creating service instance which will be shared in an application
const userService = new UserService();

// listening the login event to welcome user
userService.addEventListener(
  'login',
  user => window.alert(`Welcome, ${user.username}`)
);

// somewhere in your code user can login and will see the welcome message
userService.login('arthur.dent', 'not-a-real-password');
```

### One-time subscription

Some events might occur only once and when that happens we are no longer interested in listening them.
In this case we can configure the listener to unsubscribe itself after event emitted using the 3rd parameter - options:

```ts
// event emitter setup code from the first example
// (using EventMap constraint)

emitter.addEventListener('beep', listener, { once: true });
```

## License

Distributed under the MIT License.