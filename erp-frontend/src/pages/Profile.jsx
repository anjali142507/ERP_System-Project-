import { Box, Paper, Typography, Avatar, Button, Dialog } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";


function Profile() {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { user: loggedInUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser?.id) {
     fetch(`https://erpsystem-project-production.up.railway.app/api/profile/${loggedInUser.id}`)
        .then(res => res.json())
        .then(data => {
          setUser(data);

          if (data.profileImage) {
            setImageUrl(
           `https://erpsystem-project-production.up.railway.app/uploads/${data.profileImage}`
            );
          }
        })
        .catch(err => console.log(err));
    }
  }, [loggedInUser]);

  const uploadImage = async () => {

    if (!selectedFile) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {

      const response = await axios.post(
       `https://erpsystem-project-production.up.railway.app/api/profile/upload/${loggedInUser.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImageUrl(
       `https://erpsystem-project-production.up.railway.app/uploads/${response.data.profileImage}`

      );
      alert("Profile Photo Uploaded Successfully");
    } catch (err) {
      console.log(err);
      alert("Upload Failed");
    }

  };
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
        background: "#f5f7fb",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          width: 420,
          p: 4,
          borderRadius: 4,
          textAlign: "center",
        }}
      >

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          My Profile
        </Typography>
        <Button
          variant="text"
          onClick={() => navigate("/dashboard")}
          sx={{
            mb: 2,
            color: "#F2867A",
            fontWeight: 600
          }}
        >
          ← Back to Dashboard
        </Button>

        <Avatar
          src={preview || imageUrl}
          onClick={() => setOpenImage(true)}
          sx={{
            width: 120,
            height: 120,
            mx: "auto",
            mb: 2,
            bgcolor: "#F2867A",
            cursor: "pointer",
            fontSize: "40px",
            border: "4px solid white",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
        >
          {!imageUrl && user?.username?.charAt(0).toUpperCase()}
        </Avatar>


        <Typography
          variant="h6"
          fontWeight="bold"
        >
          {user?.username || "Admin"}
        </Typography>


        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          {user?.role || "Admin"}
        </Typography>



        <Button
          variant="outlined"
          component="label"
          sx={{
            borderRadius: 3,
            mb: 2
          }}
        >
          Choose Photo

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];

              if (file) {
                if (file.size > 10 * 1024 * 1024) {
                  alert("Image size should be less than 10MB");
                  return;
                }
                setSelectedFile(file);

                const reader = new FileReader();

                reader.onload = () => {
                  setPreview(reader.result);
                };

                reader.readAsDataURL(file);
              }
            }}
          />
        </Button>


        <Button
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 3,
            py: 1.2,
            background: "#F2867A",
            "&:hover": {
              background: "#e56f63"
            }
          }}
          onClick={uploadImage}
        >
          Upload Photo
        </Button>


        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            background: "#fafafa",
            textAlign: "left"
          }}
        >

          <Typography>
            <b>Username:</b> {user?.username || "Admin"}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            <b>Role:</b> {user?.role || "Admin"}
          </Typography>

        </Box>


      </Paper>


      <Dialog
        open={openImage}
        onClose={() => setOpenImage(false)}
      >

        <img
          src={preview || imageUrl}
          alt="profile"
          style={{
            width: "450px",
            maxWidth: "90vw",
            height: "auto"
          }}
        />

      </Dialog>


    </Box>
  );
}

export default Profile;