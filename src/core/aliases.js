import { 
  UPDATE_OVERWRITES, 
  POP_OVERWRITE,
} from './models/page/action-types';
import { 
  updateOverwrites, 
  popOverwrite,
} from './models/page/aliases';

export default {
  [UPDATE_OVERWRITES]: updateOverwrites,
  [POP_OVERWRITE]: popOverwrite,
};