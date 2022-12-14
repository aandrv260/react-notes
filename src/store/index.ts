import { createSlice, configureStore, PayloadAction, current } from '@reduxjs/toolkit';
import { NoteFormState } from '../models/form';
import { Note } from '../models/notes';
import { NoteTagInfo } from '../models/noteTags';
import { NotesSlice, EditTag } from '../models/store';
import { formStateToNote } from '../utils/Form/form';
import { filterNotes } from './notesFiltersUtils';

type Filter = string | NoteTagInfo[];

export const initialReduxState: NotesSlice = {
  notes: [],
  allTags: [],
  filteredNotes: [],
  filters: {
    heading: '',
    tags: [],
  },
};

export const notesSlice = createSlice({
  name: 'notes',
  initialState: initialReduxState,
  reducers: {
    /**
     * - Changes the whole state with the one from the action.payload object
     * - Should ONLY be used for getting data from Local Storage
     */
    mutateState(_, action: PayloadAction<NotesSlice>) {
      return {
        ...action.payload,
      };
    },

    editNote(curState, action: PayloadAction<NoteFormState>) {
      // TODO: Refactor the findIndex functionality that repeats
      const editedNote = action.payload;
      const { heading, description, isFeatured, tags } = editedNote;
      const indexOfNote = curState.notes.findIndex(note => note.id === editedNote.id);

      console.log('current(curState)', current(curState));

      // Edit note's values
      Object.assign(curState.notes[indexOfNote], { heading, description, isFeatured, tags });

      // Makes the unique tags be pushed into the allTags array
      const newNoteTagsIds = editedNote.tags.map(tag => tag.value);
      const allTagIds = curState.allTags.map(tag => tag.value);

      newNoteTagsIds.forEach(editedNoteTag => {
        if (!allTagIds.includes(editedNoteTag)) {
          const indexOfTagObject = editedNote.tags.findIndex(tag => tag.value === editedNoteTag);

          if (indexOfTagObject) {
            console.log();
            curState.allTags.push(editedNote.tags[indexOfTagObject]);
          }
        }
      });

      curState.filteredNotes = curState.notes;
    },

    deleteNote(curState, action: PayloadAction<string>) {
      const noteId = action.payload;
      const indexOfNote = curState.notes.findIndex(note => note.id === noteId);

      if (indexOfNote) {
        curState.notes.splice(indexOfNote, 1);
      }

      curState.filteredNotes = curState.notes;
    },

    deleteTag(curState, action: PayloadAction<NoteTagInfo>) {
      const indexOfTag = curState.allTags.findIndex(tag => tag.value === action.payload.value);

      curState.allTags.splice(indexOfTag, 1);

      curState.notes.forEach(note => {
        const tagIndex = note.tags.findIndex(tag => tag.value === action.payload.value);
        console.log('in the loop, index: ', tagIndex);

        if (tagIndex !== -1) {
          note.tags.splice(tagIndex, 1);
        }

        curState.filteredNotes = curState.notes;

        // Reset filters
        curState.filters.heading = '';
        curState.filters.tags = [];
      });
    },

    editTag(curState, action: PayloadAction<EditTag>) {
      const { oldTag, newTag } = action.payload;
      const indexOfOldTag = curState.allTags.findIndex(tag => tag.value === oldTag.value);

      curState.allTags[indexOfOldTag].label = newTag.label;
      curState.allTags[indexOfOldTag].value = newTag.value;

      curState.notes.forEach((note, noteIndex) => {
        note.tags.forEach((tag, tagIndex) => {
          if (tag.value === oldTag.value) {
            tag.value = newTag.value;
            tag.label = newTag.label;
          }
        });
      });

      // Reset filtered notes
      curState.filteredNotes = curState.notes;
      curState.filters.heading = '';
      curState.filters.tags = [];
    },

    filterChangeHandler(curState, action: PayloadAction<Filter>) {
      const filterValue = action.payload;

      if (typeof filterValue === 'string') {
        curState.filters.heading = filterValue;
      } else {
        curState.filters.tags = [...filterValue];
      }

      curState.filteredNotes = filterNotes(curState);
    },

    create(curState, action: PayloadAction<NoteFormState>) {
      // const newNoteForm = action.payload;
      // console.log('newNote === action.payload', newNote === action.payload);

      const newNote: Note = formStateToNote(action.payload);

      curState.notes.push(newNote);

      // Reset the filtered notes
      curState.filteredNotes = curState.notes;

      if (curState.allTags.length === 0) {
        curState.allTags = newNote.tags;

        return;
      }

      // Makes the unique tags be pushed into the allTags array
      const newNoteTagsIds = newNote.tags.map(tag => tag.value);
      const allTagIds = curState.allTags.map(tag => tag.value);

      newNoteTagsIds.forEach(newNoteTag => {
        if (!allTagIds.includes(newNoteTag)) {
          const indexOfTagObject = newNote.tags.findIndex(tag => tag.value === newNoteTag);

          if (indexOfTagObject) {
            console.log();
            curState.allTags.push(newNote.tags[indexOfTagObject]);
          }
        }
      });
    },
  },
});

const store = configureStore({
  reducer: notesSlice.reducer,
});

export default store;
