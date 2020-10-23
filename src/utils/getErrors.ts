import { FieldError } from "../generated/graphql";

export const getErrors = (errors: FieldError[]): Record<string, string> => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, errorMessage }) => {
    errorMap[field] = errorMessage;
  });
  return errorMap;
};
