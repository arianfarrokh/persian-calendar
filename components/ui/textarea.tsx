"use client";

import * as React from "react";
import { TextField, TextFieldProps } from "@mui/material";

interface CustomTextareaProps extends Omit<TextFieldProps, "variant"> {}

export function Textarea({ className, ...props }: CustomTextareaProps) {
  return (
    <TextField
      multiline
      minRows={4} // معادل min-h-16
      fullWidth
      variant="outlined"
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 1, // rounded-md
          px: 1.5, // px-3
          py: 1,   // py-2
          bgcolor: "background.paper", // bg-transparent یا dark:bg-input/30
          "&.Mui-focused": {
            borderColor: "primary.main", // focus-visible:border-ring
            boxShadow: "0 0 0 3px rgba(25,118,210,0.2)", // focus-visible:ring
          },
          "&.Mui-disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
          },
          "&.Mui-error": {
            borderColor: "error.main",
            boxShadow: "0 0 0 3px rgba(211,47,47,0.2)", // aria-invalid:ring-destructive
          },
        },
        "& .MuiInputBase-input": {
          p: 0,
          lineHeight: 1.5,
        },
        ...props?.sx,
      }}
    />
  );
}
