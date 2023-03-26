import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import backend from "../../api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Select,
  MenuItem,
  InputLabel,
  Typography,
} from "@mui/material";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box } from "@mui/system";
import { Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../redux-store";

const styles = {
  container: {
    margin: "6rem 0",
    padding: "0 2rem",
  },
  card: {
    borderRadius: "12px",
    marginTop: "5rem",
    height: "85vh",
    "@media (max-width: 900px)": {
      marginTop: "0.6rem",
      height: "100%",
    },
  },
  tableHeader: {
    borderBottom: "10px solid #0065B7",
    background: "#F2F2F2",
    color: "#0065B7",
    fontFamily: "Manrope, sans-serif",
    fontWeight: 600,
    fontSize: "12px",
  },
  tableRow: {
    border: "1px solid #E6E6E6",
    borderRadius: "50px",
  },
  noRecords: {
    fontSize: "15px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  button: {
    color: "#0065B7",
    borderColor: "transparent",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "Manrope, sans-serif",
    fontSize: "12px",
  },
  addButton: {
    background: "#0065B7",
    color: "white",
    fontFamily: "Manrope, sans-serif",
    fontWeight: 600,
    textTransform: "none",
    marginTop: "1rem",
    "&:hover": {
      background: "#0065B7",
    },
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textField: {
    width: "100%",
    marginBottom: "1rem",
  },
  error: {
    color: "#f44336",
    fontSize: "12px",
    fontFamily: "Manrope, sans-serif",
  },
};

const validationSchema = Yup.object({
  category: Yup.string().required("Required"),
  model: Yup.string().required("Required"),
  color: Yup.string().required("Required"),
  regNo: Yup.string().required("Required"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

function Dashboard() {
  const [data, setNewData] = useState(null);
  const [width, setWidth] = useState(0);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [sortOrder1, setSortOrder1] = useState("desc");
  const [sortField1, setSortField1] = useState("createdAt");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    setWidth(window.innerWidth);

    const updateDimensions = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  async function getCars() {
    try {
      const response = await backend.get(`/api/car`);
      console.log(response);
      setNewData(response?.data?.data.filter((item) => item.userId === user._id));
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || "Network error";
      toast.error(errorMessage);
    }
  }
  useEffect(() => {
    getCars();
  }, []);

  const formik = useFormik({
    initialValues: {
      category: "",
      model: "",
      color: "",
      regNo: "",
      userId: user._id
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log(values);
        // call your API here to submit the data
        const response = await backend.post(`/api/car`, values);
        toast.success("Car added successfully");
        getCars();
        resetForm();
      } catch (error) {
        console.error(error);
        const errorMessage = error?.response?.data?.message || "Network error";
        toast.error(errorMessage);
      }
    },
  });

  const handleEditCar = (car) => {
    setOpenEditModal(true);
    setEditingCar(car);
  };

  async function handleDelete(id) {
    try {
      const response = await backend.delete(`/api/car/${id}`);
      toast.success("Deleted successfully");
      getCars();
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || "Network error";
      toast.error(errorMessage);
    }
  }

  async function handleSaveChanges() {
    try {
      const id = editingCar._id;
      const body = {
        category: editingCar.category,
        model: editingCar.model,
        color: editingCar.color,
        regNo: editingCar.regNo,
        userId: user._id
      };
      const response = await backend.put(`/api/car/${id}`, body);
      toast.success("Updated successfully");
      getCars();
      setOpenEditModal(false);
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || "Network error";
      toast.error(errorMessage);
    }
  }

  const Logout = async() => {    
      await dispatch(authActions.logout());
       navigateTo("/");
  };

  return (
    <div style={styles.container}>
      <button
        style={{
          color: "black",
          width: "70px",
          height: "60px",
          fontSize: "15px",
          borderRadius: "10px",
        }}
        onClick={()=>Logout()}
      >
        Logout
      </button>
      <Box
        sx={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}
      >
        <form onSubmit={formik.handleSubmit} style={styles.form}>
          <InputLabel id="category-label">Categories</InputLabel>

          <Select
            style={styles.textField}
            label="Category"
            variant="outlined"
            {...formik.getFieldProps("category")}
            error={formik.touched.category && formik.errors.category}
          >
            <MenuItem value="Bus">Bus</MenuItem>
            <MenuItem value="Sedan">Sedan</MenuItem>
            <MenuItem value="SUV">SUV</MenuItem>
            <MenuItem value="Hatchback">Hatchback</MenuItem>
          </Select>
          {formik.touched.category && formik.errors.category ? (
            <span style={styles.error}>{formik.errors.category}</span>
          ) : null}
          {formik.touched.category && formik.errors.category ? (
            <span style={styles.error}>{formik.errors.category}</span>
          ) : null}
          <TextField
            style={styles.textField}
            label="Model"
            variant="outlined"
            {...formik.getFieldProps("model")}
            error={formik.touched.model && formik.errors.model}
          />
          {formik.touched.model && formik.errors.model ? (
            <span style={styles.error}>{formik.errors.model}</span>
          ) : null}
          <TextField
            style={styles.textField}
            label="Color"
            variant="outlined"
            {...formik.getFieldProps("color")}
            error={formik.touched.color && formik.errors.color}
          />
          {formik.touched.color && formik.errors.color ? (
            <span style={styles.error}>{formik.errors.color}</span>
          ) : null}
          <TextField
            style={styles.textField}
            label="Registration Number"
            variant="outlined"
            {...formik.getFieldProps("regNo")}
            error={formik.touched.regNo && formik.errors.regNo}
          />
          {formik.touched.regNo && formik.errors.regNo ? (
            <span style={styles.error}>{formik.errors.regNo}</span>
          ) : null}
          <Button type="submit" variant="contained" sx={styles.addButton}>
            Add Car
          </Button>
        </form>
      </Box>
      <Card style={styles.card}>
        <Box sx={{ margin: "2rem" }}>
          <h3>CARS DASHBOARD</h3>
          <TableContainer>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              style={{ background: "transparent", borderColor: "transparent" }}
            >
              <TableHead style={styles.tableHeader}>
                <TableRow>
                  <TableCell style={{ color: "black" }} align="center">
                    <TableSortLabel
                      active={sortField1 === "category"}
                      direction={sortOrder1}
                      onClick={() => {
                        if (sortField1 === "category") {
                          setSortOrder1(sortOrder1 === "asc" ? "desc" : "asc");
                        } else {
                          setSortField1("category");
                          setSortOrder1("desc");
                        }
                      }}
                    >
                      Category
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ color: "black" }} align="center">
                    <TableSortLabel
                      active={sortField1 === "model"}
                      direction={sortOrder1}
                      onClick={() => {
                        if (sortField1 === "model") {
                          setSortOrder1(sortOrder1 === "asc" ? "desc" : "asc");
                        } else {
                          setSortField1("model");
                          setSortOrder1("desc");
                        }
                      }}
                    >
                      Model
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ color: "black" }} align="center">
                    <TableSortLabel
                      active={sortField1 === "color"}
                      direction={sortOrder1}
                      onClick={() => {
                        if (sortField1 === "color") {
                          setSortOrder1(sortOrder1 === "asc" ? "desc" : "asc");
                        } else {
                          setSortField1("color");
                          setSortOrder1("desc");
                        }
                      }}
                    >
                      Color
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ color: "black" }} align="center">
                    <TableSortLabel
                      active={sortField1 === "regNo"}
                      direction={sortOrder1}
                      onClick={() => {
                        if (sortField1 === "regNo") {
                          setSortOrder1(sortOrder1 === "asc" ? "desc" : "asc");
                        } else {
                          setSortField1("regNo");
                          setSortOrder1("desc");
                        }
                      }}
                    >
                      Reg No
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ color: "black" }} align="center">
                    <TableSortLabel
                      active={sortField1 === "createdAt"}
                      direction={sortOrder1}
                      onClick={() => {
                        if (sortField1 === "createdAt") {
                          setSortOrder1(sortOrder1 === "asc" ? "desc" : "asc");
                        } else {
                          setSortField1("createdAt");
                          setSortOrder1("desc");
                        }
                      }}
                    >
                      Created on
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ color: "black" }} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.length > 0 ? (
                  data
                    .sort((a, b) =>
                      sortOrder1 === "asc"
                        ? a[sortField1].localeCompare(b[sortField1])
                        : b[sortField1].localeCompare(a[sortField1])
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow
                        key={index}
                        style={styles.tableRow}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" align="center">
                          {row?.category}
                        </TableCell>
                        <TableCell align="center">{row?.model}</TableCell>
                        <TableCell align="center">{row?.color}</TableCell>
                        <TableCell align="center">{row?.regNo}</TableCell>
                        <TableCell align="center">{row?.createdAt}</TableCell>
                        <TableCell align="center">
                          <button
                            style={styles.button}
                            onClick={() => handleEditCar(row)}
                          >
                            Edit
                          </button>
                          <button
                            style={styles.button}
                            onClick={() => handleDelete(row?._id)}
                          >
                            Delete
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <strong style={styles.noRecords}>No Record Found</strong>
                )}
              </TableBody>
            </Table>

            {data?.length > rowsPerPage && (
              <Pagination
                sx={{ margin: "1rem 0" }}
                component="div"
                count={Math.ceil(data.length / rowsPerPage)}
                page={page + 1}
                onChange={(_, newPage) => setPage(newPage - 1)}
                rowsPerPageOptions={[5, 10, 25]}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            )}
          </TableContainer>
        </Box>
      </Card>

      {/* Modal dialog */}
      <Box
        sx={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "500px",
          bgcolor: "#fff",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          p: 4,
          display: openEditModal ? "block" : "none",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Edit Car
        </Typography>
        <TextField
          label="Category"
          variant="outlined"
          fullWidth
          value={editingCar?.category}
          onChange={(e) =>
            setEditingCar({ ...editingCar, category: e.target.value })
          }
          sx={{ mb: 2 }}
          bgcolor="#fff"
        />
        <TextField
          label="Model"
          variant="outlined"
          fullWidth
          value={editingCar?.model}
          onChange={(e) =>
            setEditingCar({ ...editingCar, model: e.target.value })
          }
          sx={{ mb: 2 }}
          bgcolor="#fff"
        />
        <TextField
          label="Color"
          variant="outlined"
          fullWidth
          value={editingCar?.color}
          onChange={(e) =>
            setEditingCar({ ...editingCar, color: e.target.value })
          }
          sx={{ mb: 2 }}
          bgcolor="#fff"
        />
        <TextField
          label="Reg No"
          variant="outlined"
          fullWidth
          value={editingCar?.regNo}
          onChange={(e) =>
            setEditingCar({ ...editingCar, regNo: e.target.value })
          }
          sx={{ mb: 2 }}
          bgcolor="#fff"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenEditModal(false)}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default Dashboard;
