import React, { InputHTMLAttributes } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/core";
import { useField } from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  placeholder: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);
  const {
    label,
    placeholder,
    textarea = false,
    size: _,
    ...inputProps
  } = props;
  const TextComponent = textarea ? Textarea : Input;
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor="">{label}</FormLabel>
      <TextComponent
        {...field}
        {...inputProps}
        id={field.name}
        placeholder={placeholder}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
