"use client";

import * as React from "react";
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { X as XIcon } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  showCloseButton = true,
  children,
  actions,
}: DialogProps) {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 2,
          p: 2,
        },
      }}
    >
      {/* Header */}
      {(title || showCloseButton) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          {title && <DialogTitle>{title}</DialogTitle>}
          {showCloseButton && (
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <XIcon size={20} />
            </IconButton>
          )}
        </Box>
      )}

      {/* Content */}
      <DialogContent dividers>
        {description && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {description}
          </Typography>
        )}
        {children}
      </DialogContent>

      {/* Footer / Actions */}
      {actions && <DialogActions>{actions}</DialogActions>}
    </MuiDialog>
  );
}
