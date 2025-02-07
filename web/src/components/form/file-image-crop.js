import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop';
import { useField, useFormikContext } from 'formik';
import styled from 'styled-components';
import { getCroppedImg, getCroppedAsBase64 } from './crop-image';
import { lightGray, secondary } from '~/components/mixins/color';

const FileContainer = styled.div`
  display: flex;
  height: ${props => props.height};
  width: 100%;
  border: 2px dotted ${secondary.hex()};
  border-radius: 3px;
  background: transparent;
  position: relative;
  color: ${lightGray.hex()};

  button {
    position: absolute;
    z-index: 1;
    color: ${lightGray.hex()};
    right: 0px;
    top: 0px;
    width: 100%;
    text-align: right;
    border-radius: 3px;
    padding: 5px;
    background: #7f7f7f;
    font-size: 12px;
    font-weight: bold;
  }

  .crop-container {
    cursor: pointer;
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;
    width: 100%;
    border-radius: 3px;
    border: none;
    input {
      display: none;
    }
  }
`;

function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}

export const FileImageCrop = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x:0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const ref = useRef(null);

  const handleChange = async (e) => {
    e.persist();
    if (ref.current.files && ref.current.files.length > 0) {
      const urlImage = await readFile(ref.current.files[0]),
        value = (props.asBase64) ? urlImage : ref.current.files[0];
      setImage(urlImage);
      setCrop({x: 0, y: 0});
      setZoom(1);
      setFieldValue(field.name, value);
      props.onChange && props.onChange(value);
    }
  };

  const clearImage = async e => {
    setImage(null);
    setFieldValue(field.name, null);
  };

  const onCropComplete = async (croppedArea, croppedAreaPixels) => {
    let value = null;
    if (props.asBase64) {
      value = await getCroppedAsBase64(image, croppedAreaPixels, 0);
    } else {
      value = await getCroppedImg(image, croppedAreaPixels, 0);
    }
    setFieldValue(field.name, value);
  }

  return (
    <FileContainer height={props.height}>
      {image && 
        <>
          <button onClick={clearImage}>Limpar Imagem</button>
          <div className='crop-container'>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={props.aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              />
          </div>
        </>
      }
      <label htmlFor={props.name} style={{display: !image ? 'flex' : 'none' }}>
        {props.label}
        <input
          type="file"
          id={props.name}
          name={props.name}
          accept="image/*"
          ref={ref}
          onChange={handleChange}
          />
      </label>
    </FileContainer>
  );
};

FileImageCrop.propTypes = {
  height: PropTypes.string.isRequired,
  aspect: PropTypes.number.isRequired,
  asBase64: PropTypes.bool,
}

FileImageCrop.defaultProps = {
  asBase64: false,
  height: '270px',
  aspect: (4/3)
}

export default FileImageCrop;
