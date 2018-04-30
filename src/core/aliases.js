import { 
  UPDATE_OVERWRITES,
  UPDATE_SELECTED_OVERWRITES,
  CLEAR_SELECTED_OVERWRITES,
  POP_OVERWRITE,
} from './models/page/action-types';
import { 
  updateOverwrites, 
  updateSelectedOverwrites,
  clearSelectedOverwrites,
  popOverwrite,
} from './models/page/aliases';
import {
  SET_PASTE_NODE,
} from './models/ui/action-types';
import {
  setPasteNode,
} from './models/ui/aliases';

export default {
  [UPDATE_OVERWRITES]: updateOverwrites,
  [UPDATE_SELECTED_OVERWRITES]: updateSelectedOverwrites,
  [CLEAR_SELECTED_OVERWRITES]: clearSelectedOverwrites,
  [POP_OVERWRITE]: popOverwrite,
  [SET_PASTE_NODE]: setPasteNode,
};