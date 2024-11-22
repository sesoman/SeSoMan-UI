import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const RevokeModal = (props: any) => {
  
  return (
    <div>
      {/* Confirmation Dialog */}
      <Dialog
        open={props.open}
        onClose={props.handleCloseRevokeModal}
        aria-labelledby="confirm-revoke-dialog"
        maxWidth="xs" // Sets the modal width for a balanced UI
        fullWidth
      >
        <DialogTitle
          id="confirm-revoke-dialog"
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
          }}
        >
          Confirm Revocation
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{
              fontSize: "1rem",
              color: "rgba(0, 0, 0, 0.7)",
              lineHeight: "1.5",
            }}
          >
            Are you sure you want to revoke your consent?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ padding: "16px" }}>
          <Button
            onClick={props.handleCloseRevokeModal}
            color="primary"
            variant="outlined"
            size="medium" // Small-medium size for compact UI
            style={{
              textTransform: "none",
              fontWeight: "500",
              padding: "6px 16px",
              color: '#5a04bd',
              borderColor: '#5a04bd'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={props.handleRevokeModal}
            variant="contained"
            size="medium"
            style={{
              textTransform: "none",
              fontWeight: "bold",
              padding: "6px 16px",
              backgroundColor: '#5a04bd'
            }}
          >
            Revoke
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RevokeModal;
