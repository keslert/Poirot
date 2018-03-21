require('./background/promisify');
import { createStore } from './background/store';
import { listen } from './background/listen';


const store = createStore();
listen(store);
