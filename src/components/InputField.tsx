import React, { InputHTMLAttributes } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/core";
import { useField } from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  placeholder: string;
};

export const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);
  const { label, placeholder, size: _, ...inputProps } = props;
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor="">{label}</FormLabel>
      <Input
        {...field}
        {...inputProps}
        id={field.name}
        placeholder={placeholder}
      />
    </FormControl>
  );
};
