import React from "react";
import { FormContainer } from "~/views/bp-groups/styles";
import { InputGroup } from "~/components/form";

export const BPGroupsForm = ({ previewMode }) => {
  return (
    <FormContainer>
      <InputGroup
        type="text"
        name="grpCode"
        label="Código"
        required={true}
        maxLength={100}
        autoFocus
        disabled={previewMode}
      />

      <InputGroup
        type="text"
        name="grpName"
        label="Nome"
        required={true}
        maxLength={100}
        autoFocus
        disabled={previewMode}
      />

    </FormContainer>
  );
};
