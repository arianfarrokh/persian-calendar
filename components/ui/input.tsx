"use client";

import * as React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: 36, // شبیه h-9
    borderRadius: 6,
    backgroundColor: "transparent",
    fontSize: 14,
    paddingRight: theme.spacing(1.5),
    paddingLeft: theme.spacing(1.5),
    transition: "box-shadow 0.2s, border-color 0.2s",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.text.primary,
  },
  "& .MuiInputBase-input::placeholder": {
    color: theme.palette.text.secondary,
    opacity: 0.7,
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${theme.palette.primary.main}40`, // focus-visible:ring
  },
  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.error.main,
  },
  "&.Mui-disabled .MuiInputBase-root": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
}));

export function Input(props: TextFieldProps) {
  return (
    <StyledInput
      {...props}
      variant="outlined"
      size="small"
      fullWidth
      InputProps={{
        ...props.InputProps,
      }}
    />
  );
}
