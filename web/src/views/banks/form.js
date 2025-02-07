import React from "react";
import { FormContainer } from "~/views/banks/styles";
import { InputGroup } from "~/components/form";

export const BanksForm = ({ previewMode }) => {
  return (
    <FormContainer>
      <InputGroup
        type="text"
        name="id"
        label="Código"
        required={true}
        maxLength={100}
        autoFocus
        disabled={previewMode}
      />

      <InputGroup
        type="text"
        name="name"
        label="Nome"
        required={true}
        maxLength={100}
        autoFocus
        disabled={previewMode}
      />

      <InputGroup
        type="text"
        name="ispb"
        label="ISPB"
        required={true}
        maxLength={100}
        autoFocus
        disabled={previewMode}
      />
    </FormContainer>
  );
};
