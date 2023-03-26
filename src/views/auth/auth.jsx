import React, { useState, useEffect, useRef} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Tab, Tabs, Grid } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../redux-store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "transparent",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const useStyles = makeStyles((theme) => ({
  uploadbtn: {
    backgroundColor: "white",
    color: "#0081F9",
    boxSizing: "border-box",
    boxShadow: " 0px 2px 10px rgba(0, 0, 0, 0.25)",
    borderRadius: "3px",
    width: "100%",
    borderColor: "transparent",
  },
}));

function Auth() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentState, setCurrentState] = useState(0);

  const [fullname, setfullname] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  const navigateTo = useNavigate();

  useEffect(() => {
    if (user) {
      navigateTo("/dashboard");
    }
  }, []);

  const loginSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const isLogin = await dispatch(authActions.login(email, password));

      if (isLogin) {
        setOpen(false);
        navigateTo("/dashboard");
        toast.success("Login Successful!");
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password. Please try again.");
    }
  };

  

  const SignUpHandler = async (e) => {
    e.preventDefault();
    try {
      await dispatch(authActions.signUp(email, password, fullname, phone));
      toast.success("Account Created. Plz login");
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || "Network error";
      toast.error(errorMessage);
    }
  };



  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        
          <Typography
            style={{
              textAlign: "center",
              fontWeight: "700",
              fontFamily: "Times New Roman",
            }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Welcome
          </Typography>
          <Box>
            <Tabs value={tabIndex} onChange={handleTabChange}>
              <Tab style={{ width: "50%" }} label="Log in" />
              <Tab style={{ width: "50%" }} label="Sign up" />
            </Tabs>
          </Box>
          <br />
          <Box sx={{ padding: 2 }}>
            {tabIndex === 0 && (
              <Box>
                <form
                  style={{ justifyContent: "center" }}
                  onSubmit={loginSubmitHandler}
                >
                  <label style={{ fontWeight: "400", fontSize: "19px" }}>
                    Email
                  </label>
                  <br />
                  <input
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      height: "40px",
                      width: "100%",
                      background: "rgba(0, 0, 0, 0.04)",
                      border: "1px solid #C4C4C4",
                      borderRadius: "3px",
                    }}
                  />
                  <br />
                  <label style={{ fontWeight: "400", fontSize: "19px" }}>
                    Password
                  </label>
                  <br />
                  <input
                    required
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      height: "40px",
                      width: "100%",
                      background: "rgba(0, 0, 0, 0.04)",
                      border: "1px solid #C4C4C4",
                      borderRadius: "3px",
                    }}
                  />
                  <br />
                  {/* <a style={{color: '#0081F9', textDecoration: "none"}} href="#" onClick={()=>setCurrentState(1)}>Forgot Password?</a> */}
                  <br />
                  <br />
                  <Button
                    type="submit"
                    style={{
                      width: "100%",
                      height: "50px",
                      color: "white",
                      background: "#0081F9",
                      borderColor: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    Log in
                  </Button>
                </form>
              </Box>
            )}
            {tabIndex === 1 && (
              <Box>
                <form
                  style={{ justifyContent: "center" }}
                  onSubmit={SignUpHandler}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6}>
                      <label style={{ fontWeight: "400", fontSize: "19px" }}>
                        Full Name
                      </label>
                      <br />
                      <input
                        onChange={(e) => setfullname(e.target.value)}
                        required
                        style={{
                          height: "40px",
                          width: "100%",
                          background: "rgba(0, 0, 0, 0.04)",
                          border: "1px solid #C4C4C4",
                          borderRadius: "3px",
                        }}
                      />
                      <br />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <label style={{ fontWeight: "400", fontSize: "19px" }}>
                        Phone No
                      </label>
                      <br />
                      <input
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        style={{
                          height: "40px",
                          width: "100%",
                          background: "rgba(0, 0, 0, 0.04)",
                          border: "1px solid #C4C4C4",
                          borderRadius: "3px",
                        }}
                      />
                      <br />
                    </Grid>
                  </Grid>
                  <label style={{ fontWeight: "400", fontSize: "19px" }}>
                    Email
                  </label>
                  <br />
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      height: "40px",
                      width: "100%",
                      background: "rgba(0, 0, 0, 0.04)",
                      border: "1px solid #C4C4C4",
                      borderRadius: "3px",
                    }}
                  />
                  <br />
                  <label style={{ fontWeight: "400", fontSize: "19px" }}>
                    Password
                  </label>
                  <br />
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    style={{
                      height: "40px",
                      width: "100%",
                      background: "rgba(0, 0, 0, 0.04)",
                      border: "1px solid #C4C4C4",
                      borderRadius: "3px",
                    }}
                  />
                  <br />
                  <br />
                  <Button
                    type="submit"
                    style={{
                      width: "100%",
                      height: "50px",
                      color: "white",
                      background: "#0081F9",
                      borderColor: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    Sign up
                  </Button>
                </form>         
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default Auth;
