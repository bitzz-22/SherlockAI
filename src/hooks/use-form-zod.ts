import { useState } from "react";
import { useForm } from "react-hook-form";

const useFormZod = <T extends Record<string, unknown>>(schema: { parse: (data: T) => T }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, handleSubmit, formState, reset, watch, setValue, getValues } = useForm({
    resolver: async (data) => {
      try {
        schema.parse(data as T);
        return { values: data as T, errors: {} };
      } catch (error: unknown) {
        const zodError = error as { errors?: Array<{ path?: Array<string | number>; message?: string }> };
        const fieldErrors: Record<string, string> = {};
        zodError.errors?.forEach((err) => {
          const path = err.path?.join(".");
          if (path && err.message) {
            fieldErrors[path] = err.message;
          }
        });
        setErrors(fieldErrors);
        return { values: {}, errors: fieldErrors };
      }
    },
  });

  return {
    register,
    handleSubmit: handleSubmit as (fn: (data: T) => void | Promise<void>) => (e?: React.BaseSyntheticEvent) => Promise<void>,
    formState: { ...formState, errors: { ...formState.errors, ...errors } },
    reset,
    watch,
    setValue,
    getValues,
    errors,
  };
};

export default useFormZod;
