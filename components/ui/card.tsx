import * as React from "react";
import {
  Card as MuiCard,
  CardHeader as MuiCardHeader,
  CardContent as MuiCardContent,
  CardActions as MuiCardActions,
  Typography,
  Box,
  CardProps as MuiCardProps,
} from "@mui/material";

function Card({ children, ...props }: MuiCardProps) {
  return (
    <MuiCard
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        py: 3,
        boxShadow: 1,
      }}
      {...props}
    >
      {children}
    </MuiCard>
  );
}

function CardHeader({
  title,
  subheader,
  action,
  ...props
}: React.ComponentProps<typeof MuiCardHeader>) {
  return (
    <MuiCardHeader
      title={title}
      subheader={subheader}
      action={action}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        pb: 2,
        px: 3,
        "& .MuiCardHeader-title": {
          fontWeight: 600,
        },
        "& .MuiCardHeader-subheader": {
          fontSize: "0.875rem",
          color: "text.secondary",
        },
      }}
      {...props}
    />
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h6" component="div" fontWeight={600}>
      {children}
    </Typography>
  );
}

function CardDescription({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body2" color="text.secondary">
      {children}
    </Typography>
  );
}

function CardAction({ children }: { children: React.ReactNode }) {
  return <Box sx={{ alignSelf: "flex-start" }}>{children}</Box>;
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <MuiCardContent sx={{ px: 3 }}>{children}</MuiCardContent>;
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <MuiCardActions
      sx={{ borderTop: "1px solid", borderColor: "divider", px: 3, pt: 2 }}
    >
      {children}
    </MuiCardActions>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
