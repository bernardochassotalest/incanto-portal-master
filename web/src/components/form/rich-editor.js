import React from 'react';
import _ from 'lodash';
import { Field, ErrorMessage } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled, { css } from 'styled-components';
import arrow from '~/assets/arrow.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
  position: relative;

  ${(props) => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    user-select: none;
    pointer-events: none;
  `}
`;

const Group = styled.div`
  display: flex;
  width: 100%;
  height: ${(props) => props.heightText || (((props.height || 180) + 42) + 'px')};

  .quill {
    width: 100%;
  }
  .ql-container, .ql-toolbar.ql-snow {
    font-family: inherit !important;
  }
  .ql-container.ql-snow {
    border: none;
  }
  .ql-editor {
    background: #f7f7f7;
  }
  .ql-toolbar.ql-snow {
    border: 1px solid #f7f7f7;
  }
  .ql-toolbar.ql-snow {
    height: 42px;
  }
  select {
    position: absolute;
    min-width: 200px;
    color: #555;
    padding: 10px 0 10px 10px;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    border: none;
    background: rgba(0, 0, 0, 0.05) url(${arrow});
    background-repeat: no-repeat, repeat;
    background-position: right 1.5em top 50%, 0 0;
    background-size: .65em auto, 100%;
    height: 42px;
    right: 0px;
  }
`;

const defaultModules = {
    toolbar: [
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['clean', 'link'],
    ],
    clipboard: {
      matchVisual: false,
    }
  }
  , defaultFormats = [
    'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align',
    'link', 'image'
  ]


const RichEditor = ({ name, heightText, height, modules, formats, valueFormat = 'html', variables, disabled, placeholder, onChange }) => {

  const editorRef = React.createRef()

  const setFieldIntoHTML = (value) => {
    if (!value) {
      return
    }
    let editor = _.get(editorRef, 'current.editor')
    if (editor) {
      let varText = `<%=${value}%>`,
        cursorPosition = _.get(editor.getSelection(), 'index') || 0
      editor.insertText(cursorPosition, varText)
      editor.setSelection(cursorPosition + _.size(varText))
    }
  }

  const changeValue = (form, value) => {
    if (onChange) {
      onChange({ target: { value, name } })
    } else {
      form.setFieldValue(name, value)
    }
  }

  return (
    <Container disabled={disabled}>
      <Field type="text" id={name} name={name}>
        {({field, form}) => (
          <Group height={height} heightText={heightText}>
            <ReactQuill
              ref={editorRef}
              theme={'snow'}
              modules={modules || defaultModules}
              formats={formats || defaultFormats}
              readOnly={disabled}
              placeholder={placeholder}
              style={{ textTransform: 'none', height: heightText || height || '180px' }}
              value={field.value || ''}
              onChange={(content) => changeValue(form, content)} />
            <select disabled={disabled} onChange={event => setFieldIntoHTML(event.target.value)}>
              <option value="">Variáveis</option>
              {_.map(variables, (v, idx) => (
                <option key={idx} value={v.id}>{v.label}</option>
              ))}
            </select>
          </Group>
        )}
      </Field>
      <ErrorMessage name={name} className="error" component="div" />
    </Container>
  )
}

export default RichEditor;

/*
  Exemplo de uso

  import { RichEditor } from '~/components/form';

  <RichEditor
    height={144}
    name="statement"
    placeholder="Demonstrativo"
    modules={{ toolbar: [] }}
    variables={billetVariables}
    />
*/