import { FormEventHandlers, NoteFormButton, NoteFormState } from '../../models/form';
import { NoteTagInfo } from '../../models/noteTags';
import Button from '../Button/Button';
import ButtonGroup from '../ButtonGroup/ButtonGroup';
import Checkbox from '../Checkbox/Checkbox';
import Form from '../Form/Form';
import FormGroup from '../FormGroup/FormGroup';
import InputBox from '../InputBox/InputBox';

interface NoteFormProps {
  form: NoteFormState;
  eventHandlers: FormEventHandlers;
  buttons: NoteFormButton[];
  allTags: NoteTagInfo[];
}

const NoteForm = (props: NoteFormProps) => {
  const { form, eventHandlers, buttons, allTags } = props;

  return (
    <>
      <Form hasGroups>
        <FormGroup>
          <InputBox
            id="note-title"
            inputElementType="input"
            type={'text'}
            label="Heading"
            value={form.heading}
            onInputChange={eventHandlers.headingChange}
            tooltip={{
              text: !form.validation.headingIsValid ? form.feedback.headingMessage : '',
              color: '#333',
            }}
            isValid={form.validation.headingIsValid}
          />

          <InputBox
            id="note-tags"
            label="Tags"
            options={allTags}
            multiSelectValue={form.tags}
            onMultiSelectChange={eventHandlers.tagsChange}
            inputElementType="multi-select"
          />
        </FormGroup>

        <Checkbox
          checked={!!form.isFeatured}
          onChange={eventHandlers.checkboxChange}
          label="Featured"
        />

        <InputBox
          id="note-description"
          type={'text'}
          label="Description"
          value={form.description}
          onTextareaChange={eventHandlers.descriptionChange}
          inputElementType="textarea"
          tooltip={{
            text: !form.validation.descriptionIsValid ? form.feedback.descriptionMessage : '',
            color: '#333',
          }}
          isValid={form.validation.descriptionIsValid}
        />
      </Form>

      <ButtonGroup>
        {buttons.map(button => (
          <Button
            type="button"
            designStyle={button.designStyle}
            onClick={button.onClick}
            key={Math.random()}
          >
            {button.text}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
};

export default NoteForm;
