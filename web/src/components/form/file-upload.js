import { useField, useFormikContext } from 'formik';
import _ from 'lodash';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled, { css } from 'styled-components';
import { formats } from '~/helper';
import { gray, secondary, symbol } from '../mixins/color';

const getColor = (props) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return symbol.hex();
};

const Container = styled.div`
  display: flex;
  flex-direction: ${(props) =>
    props.orientation === 'vertical' ? 'column' : 'row'};
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 90px;
  margin-bottom: 10px;
  height: auto;

  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.75;
      cursor: not-allowed;
      user-select: none;
    `}
`;

const DropContainer = styled.div`
  height: 100%;
  min-height: 50px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dotted;
  background-color: ${secondary.hex()};
  color: ${gray.hex()};
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const FileContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${(props) => (props.orientation === 'vertical' ? '1' : '0 0 50%')};
  padding: ${(props) =>
    props.orientation === 'vertical' ? '15px 0' : '0 15px'};
  width: 100%;
  & h4 {
    color: ${gray.hex()};
    font-size: 16px;
    margin-bottom: 10px;
  }
  & ul {
    padding: 0;
    margin: 0;
    list-style-type: none;

    li {
      height: 20px;
      font-size: 13px;
      white-space: nowrap;
      display: flex;
      align-items: center;

      .name {
        white-space: nowrap;
        max-width: 70%;
        text-overflow: ellipsis;
        overflow: hidden;
        color: ${gray.hex()};
      }
      .size {
        max-width: 30%;
        font-weight: 500;
        margin-left: 5px;
        font-size: 12px;
        color: ${gray.hex()};
      }
    }
  }
`;

const handleChanges = ({ props, setFieldValue, field }, files) => {
  if (files && files.length > 0) {
    setFieldValue(field.name, files);
    props.onChange && props.onChange({ target: { files } });
  }
};

const FileUpload = (props) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  const params = { props, field, setFieldValue };

  const onDrop = useCallback(
    (files) => {
      handleChanges(params, files);
    },
    [params]
  );

  const onInputChange = (e) => {
    e.persist();
    handleChanges(params, e.target.files);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ ...props, onDrop });

  const renderFiles = _.map(field.value || [], (file, idx) => (
    <li key={idx}>
      <div className='name'>{file.name}</div>{' '}
      <div className='size'>({formats.fileSize(file.size)})</div>
    </li>
  ));

  return (
    <Container orientation={props.orientation} disabled={props.disabled}>
      <DropContainer
        {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
        orientation={props.orientation}
      >
        <input {...getInputProps()} onChange={onInputChange} />
        <p>Arraste e solte seus arquivos aqui, ou clique para seleciona-los</p>
      </DropContainer>

      {!_.isEmpty(field.value) && (
        <FileContainer orientation={props.orientation}>
          <h4>{props.label}</h4>
          <ul>{renderFiles}</ul>
        </FileContainer>
      )}
    </Container>
  );
};
export default FileUpload;
