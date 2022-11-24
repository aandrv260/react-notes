import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import PageContainer from '../../components/PageContainer/PageContainer';
import FilterNotes from '../../components/FilterNotes/FilterNotes';
import Notes from '../../components/Notes/Notes';

import { HeaderInfo } from '../../models/header';
import { NotesSlice } from '../../models/store';
import Modal from '../../components/Modal/Modal';

const AllNotesPage = () => {
  const navigate = useNavigate();
  const state = useSelector((state: NotesSlice) => state);
  const notes = useSelector((state: NotesSlice) => state.filteredNotes);
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

  // For testing the Tags ids. Remove after you finish with the tags edit functionality
  console.log(state);

  const headerInfo: HeaderInfo = {
    heading: 'All Notes',
    buttons: [
      {
        text: 'Create',
        onClick: () => navigate('/new'),
      },

      {
        text: 'Edit Tags',
        onClick: () => setModalIsVisible(true),
      },
    ],
  };

  return (
    <PageContainer header={headerInfo}>
      {modalIsVisible && (
        <Modal isVisible={modalIsVisible} closeHandler={setModalIsVisible.bind(null, false)} />
      )}
      <FilterNotes />
      <Notes notes={notes} />
    </PageContainer>
  );
};

export default AllNotesPage;
