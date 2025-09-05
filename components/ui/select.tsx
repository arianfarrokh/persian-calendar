"use client";

import * as React from "react";
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
  SelectProps as MuiSelectProps,
  FormHelperText,
} from "@mui/material";

type Option = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

interface CustomSelectProps extends Omit<MuiSelectProps, "onChange"> {
  label?: string;
  helperText?: string;
  options: Option[];
  onChange?: (value: string | number) => void;
}

export function Select({
  label,
  helperText,
  options,
  onChange,
  value,
  ...props
}: CustomSelectProps) {
  const id = React.useId();

  return (
    <FormControl fullWidth size="small">
      {label && <InputLabel id={`${id}-label`}>{label}</InputLabel>}
      <MuiSelect
        labelId={`${id}-label`}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value as string | number)}
        {...props}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
