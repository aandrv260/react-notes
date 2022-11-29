import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import PageContainer from '../../components/PageContainer/PageContainer';

import Feedback from '../../components/Feedback/Feedback';
import NoteForm from '../../components/NoteForm/NoteForm';

import { HeaderInfo } from '../../models/header';
import { getStatusColor } from '../../utils/Form/formValidation';
import useNoteForm from '../../hooks/useNoteForm';
import { NoteFormButton } from '../../models/form';

const NewNotePage = () => {
  const { form: newNoteForm, eventHandlers, allTags } = useNoteForm('create');
  const navigate = useNavigate();

  const headerInfo: HeaderInfo = useMemo(
    () => ({
      heading: 'New note',
      buttons: [
        {
          text: 'Add',
          onClick: () => {
            eventHandlers.submitForm();
          },
        },

        {
          text: 'Back',
          designStyle: 'outline',
          onClick: () => navigate('/'),
        },
      ],
    }),
    [navigate, eventHandlers]
  );

  const formButtons: NoteFormButton[] = [
    { text: 'Create', onClick: eventHandlers.submitForm },
    { text: 'Clear', onClick: eventHandlers.resetForm, designStyle: 'outline' },
  ];

  return (
    <>
      <Feedback
        status={getStatusColor(newNoteForm.status)}
        buttons={[]}
        message={newNoteForm.feedback.message}
        isVisible={newNoteForm.feedback.isVisible}
        onClose={eventHandlers.hideFeedback}
      />

      <PageContainer header={headerInfo}>
        <NoteForm
          form={newNoteForm}
          buttons={formButtons}
          eventHandlers={eventHandlers}
          allTags={allTags}
        />
        {/* <NoteForm
          title={{ value: newNoteForm.heading, onInputChange: headingChangeHandler }}
          tagsInput={{
            multiSelectValue: newNoteForm.tags,
            onChange: tagsChangeHandler,
            options: allTags,
          }}
          checkbox={{ checked: !!newNoteForm?.isFeatured, onChange: checkboxChangeHandler }}
          description={{ value: newNoteForm.description, onChange: descriptionChangeHandler }}
          buttons={[
            { text: 'Create', onClick: createNote },
            { text: 'Clear', onClick: clearForm, designStyle: 'outline' },
          ]}
        /> */}
      </PageContainer>
    </>
  );
};

export default NewNotePage;
