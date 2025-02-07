import React from 'react';
import { Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-xcode';

const Container = styled.div`
  display: flex;
  width: 100%;
  margin: 0 0 10px;
  .ace_editor, .ace_content, .ace_editor div {
    font-family: monospace !important;
  }
  .ace_text-input, .ace_content {
    position: unset !important;
  }
  > div {
    width: 100%;
  }
`;


const CodeEditor = ({ id, name, height, language, disabled }) => {

  return (
    <>
      <Container>
        <Field
          id={id}
          name={name} >
          {({field, form}) => (
            <AceEditor
              theme='xcode'
              name={name}
              mode={language}
              readOnly={disabled}
              tabSize={2}
              cursorStart={1}
              showPrintMargin={false}
              enableBasicAutocompletion={true}
              enableSnippets={true}
              width='100%'
              height={height}
              value={field.value}
              onChange={(value) => form.setFieldValue(field.name, value)}
              editorProps={{ $blockScrolling: true }}
              />
          )}
        </Field>
      </Container>
      <ErrorMessage name={name} className="error" component="div" />
    </>
  )
}

CodeEditor.propTypes = {
  label: PropTypes.string
}

export default CodeEditor;
