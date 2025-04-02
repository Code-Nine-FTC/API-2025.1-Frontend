import React from "react";
import { Modal, Box, Typography, CircularProgress } from "@mui/material";

interface ReusableModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  open,
  onClose,
  title,
  loading = false,
  children,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "500px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {title && (
              <Typography
                variant="h6"
                component="h2"
                sx={{ marginBottom: "16px" }}
              >
                {title}
              </Typography>
            )}
            {children}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ReusableModal;