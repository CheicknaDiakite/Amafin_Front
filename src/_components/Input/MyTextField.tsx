import { forwardRef } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { ChangeEvent } from "react";

type TypeText = {
  name?: string;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
} & TextFieldProps;

// Utiliser forwardRef pour transmettre ref à react-hook-form
const MyTextField = forwardRef<HTMLInputElement, TypeText>(({ name, onChange, ...props }, ref) => {
  return (
    <TextField
      variant="outlined"
      name={name}
      onChange={onChange}
      inputRef={ref} // Transmet ref à react-hook-form
      {...props}
    />
  );
});

export default MyTextField;
