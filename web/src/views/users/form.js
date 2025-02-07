import React from "react";
import _ from "lodash";
import * as Yup from "yup";
import { Autocomplete, Checkbox, InputGroup } from "~/components/form";
import { FormContainer } from "~/views/users/styles";

export const UserForm = ({
  errors,
  status,
  touched,
  values,
  isValid,
  previewMode,
  handleListProfiles
}) => {
  return (
    <FormContainer>
      <Checkbox name="active" label="Ativo" disabled={previewMode} />

      <Autocomplete
        name="profile"
        minLength={0}
        keyField="id"
        label="Perfil"
        value={values.profile}
        disabled={previewMode}
        valueFormat={row => `${row.name}`}
        loadData={handleListProfiles}
        emptyText={"Pesquise um perfil"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        />

      <InputGroup
        disabled={previewMode}
        type="email"
        name="email"
        label="Email (login)"
        maxLength={50}
        hasError={errors.email && touched.email}
        />

      <InputGroup
        disabled={previewMode}
        type="text"
        name="name"
        label="Nome"
        maxLength={100}
        hasError={errors.name && touched.name}
        />


      {status && status.msg && <div>{status.msg}</div>}
    </FormContainer>
  );
};

export const UserSchema = Yup.object().shape({
  email: Yup.string()
    .required("Informe o email")
    .email("Informe um email válido"),
  name: Yup.string()
    .min(4, "Verifique se o nome está correto")
    .required("Informar o nome"),
  profile: Yup.mixed().test("", "Informe o Perfil", function(val) {
    return !_.isEmpty(val);
  })
});
