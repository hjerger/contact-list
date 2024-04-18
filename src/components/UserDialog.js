import React, { useState } from "react"
import Button from "@mui/material/Button"
import BootstrapDialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import { Box, TextField } from "@mui/material"

export default function UserDialog({ open, editUser, onClose, onSave }) {
  const [user, setUser] = useState()

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setUser({ ...user, [name]: value })
  }

  const handleSave = (event) => {
    event.preventDefault()
    onSave(user)
  }

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <div style={{ width: "400px" }}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Edit User
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField
                size="small"
                autoFocus
                name="firstName"
                label="First name"
                type="text"
                defaultValue={editUser?.firstName}
                onChange={handleInputChange}
              ></TextField>
              <div style={{ padding: "12px" }}></div>
              <TextField
                size="small"
                autoFocus
                name="lastName"
                label="Last name"
                type="text"
                defaultValue={editUser?.lastName}
                onChange={handleInputChange}
              ></TextField>
              <div style={{ padding: "12px" }}></div>
              <TextField
                size="small"
                autoFocus
                name="email"
                label="email"
                type="text"
                defaultValue={editUser?.email}
                onChange={handleInputChange}
              ></TextField>
              <div style={{ padding: "12px" }}></div>
              <TextField
                size="small"
                autoFocus
                name="street"
                label="street"
                type="text"
                defaultValue={editUser?.street}
                onChange={handleInputChange}
              ></TextField>
              <div style={{ padding: "12px" }}></div>
              <TextField
                size="small"
                autoFocus
                name="city"
                label="city"
                type="text"
                defaultValue={editUser?.city}
                onChange={handleInputChange}
              ></TextField>
              <div style={{ padding: "12px" }}></div>
              <TextField
                size="small"
                autoFocus
                name="zip"
                label="zip"
                type="zip"
                defaultValue={editUser?.zip}
                onChange={handleInputChange}
              ></TextField>
              <div style={{ padding: "12px" }}></div>
              <TextField
                size="small"
                autoFocus
                name="phone"
                label="phone"
                type="phone"
                defaultValue={editUser?.phone}
                onChange={handleInputChange}
              ></TextField>
            </Box>
          </DialogContent>
          <DialogActions
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button autoFocus onClick={onClose}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </div>
      </BootstrapDialog>
    </React.Fragment>
  )
}
