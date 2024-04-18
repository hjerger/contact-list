import React, { useState, useEffect } from "react"
import {
  Button,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Collapse,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import axios from "axios"
import UserDialog from "./UserDialog"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"

function UserList() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [expandedId, setExpandedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(
          `http://localhost:3001/api/contacts?offset=${page * 100}`
        )
        setUsers((prevUsers) => [...prevUsers, ...response.data])
      } catch (error) {
        console.error("Error fetching users: ", error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchUsersWithSearch = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(
          `http://localhost:3001/api/contacts/search?q=${searchQuery}`
        )
        setUsers(response.data)
      } catch (error) {
        console.error("Error fetching users with search query: ", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (searchQuery.length > 0) {
      fetchUsersWithSearch()
    } else {
      fetchUsers()
    }
  }, [page, searchQuery])

  const handleScroll = (event) => {
    const bottom =
      Math.abs(
        event.target.scrollHeight -
          event.target.clientHeight -
          event.target.scrollTop
      ) <= 1
    if (bottom && !isLoading) {
      setTimeout(() => {
        setPage((prevPage) => prevPage + 1)
      }, 200)
    }
  }

  const handleListItemClick = (userId) => {
    const id = userId === expandedId ? null : userId
    setExpandedId(id)
  }

  const handleEditUser = () => {
    const userToEdit = users.find((user) => user.id === expandedId)
    setEditUser(userToEdit)
    setDialogOpen(true)
  }

  const handleSearch = (event) => {
    setPage(0)
    setUsers([])
    setSearchQuery(event.target.value)
  }

  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16)
  }

  const handleClose = () => {
    setDialogOpen(false)
  }

  const handleSave = (updatedFields) => {
    const updatedUser = { ...editUser, ...updatedFields }
    setDialogOpen(false)
    try {
      axios
        .put(
          `http://localhost:3001/api/contacts/${updatedUser.id}`,
          updatedUser
        )
        .then((response) => {
          const index = users.findIndex((user) => user.id === updatedUser.id)
          if (index !== -1) {
            const updatedUsers = [...users]
            updatedUsers[index] = response.data[0]
            setUsers(updatedUsers)
          }
        })
    } catch (error) {
      console.error("Error updating user: ", error)
    }
  }

  const onDelete = (userId) => {
    console.log("delete", userId)
    try {
      axios
        .delete(`http://localhost:3001/api/contacts/${userId}`)
        .then((response) => {
          const index = users.findIndex((user) => user.id === userId)
          console.log("response", index, response)
          if (index !== -1) {
            const updatedUsers = [...users]
            updatedUsers.splice(index, 1)
            setUsers(updatedUsers)
          }
        })
    } catch (error) {
      console.error("Error deleting user: ", error)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingBottom: "16px",
          paddingTop: "16px",
          paddingRight: "40px",
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          className="textField"
          onChange={(event) => handleSearch(event)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ paddingLeft: "16px", width: "368px" }}
        />
      </Box>
      <div
        style={{
          height: "calc(100vh - 100px)",
          overflowY: "auto",
          display: "flex",
        }}
        onScroll={handleScroll}
      >
        <List
          sx={{
            padding: "0 12px 0 0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {users.map((user, index) => (
            <div key={index}>
              <ListItem
                onClick={() => handleListItemClick(user.id)}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "400px",
                  display: "flex",
                  paddingRight: "4px",
                }}
              >
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: getRandomColor() }}>
                    {user.firstName.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${user.firstName} ${user.lastName}`}
                  secondary={user.email}
                />
                <IconButton
                  aria-label="delete"
                  onClick={() => onDelete(user.id)}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                    alignSelf: "center",
                    display: "flex",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </ListItem>

              <Collapse
                in={user.id === expandedId}
                timeout="auto"
                unmountOnExit
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    width: "398px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <Typography
                    variant="h5"
                    style={{ margin: "8px 16px 4px 16px" }}
                  >
                    {`${user.firstName} ${user.lastName}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ margin: "0px 16px", color: "#7E7E7E" }}
                  >
                    {user.street}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ margin: "0px 16px", color: "#7E7E7E" }}
                  >
                    {`${user.city},`}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ margin: "0px 16px", color: "#7E7E7E" }}
                  >
                    {`${user.state} ${user.zip}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ margin: "16px 16px 12px 16px", color: "#7E7E7E" }}
                  >
                    {user.phone}
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleEditUser()}
                    sx={{ width: 50, marginLeft: "16px", marginBottom: "8px" }}
                  >
                    Edit
                  </Button>
                </Box>
              </Collapse>
            </div>
          ))}
          {isLoading && (
            <ListItem>
              <CircularProgress
                size={24}
                sx={{ backgroundColor: "lightBlue", color: "transparent" }}
              />
            </ListItem>
          )}
        </List>
      </div>
      <UserDialog
        open={dialogOpen}
        editUser={editUser}
        onClose={handleClose}
        onSave={(user) => handleSave(user)}
      />
    </div>
  )
}

export default UserList
