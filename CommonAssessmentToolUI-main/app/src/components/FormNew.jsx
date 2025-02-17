import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import {
  Typography,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import styles from "./Form.module.css";

const FormNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedUser, setSelectedUser] = useState({
    firstName: "",
    lastName: "",
    age: 0,
    gender: "",
    work_experience: 0,
    canada_workex: 0,
    dep_num: 0,
    canada_born: "false",
    citizen_status: "",
    level_of_schooling: "",
    fluent_english: "false",
    reading_english_scale: 0,
    speaking_english_scale: 0,
    writing_english_scale: 0,
    numeracy_scale: 0,
    computer_scale: 0,
    transportation_bool: "false",
    caregiver_bool: "false",
    housing: "",
    income_source: "",
    felony_bool: "false",
    attending_school: "false",
    currently_employed: "false",
    substance_use: "false",
    time_unemployed: 0,
    need_mental_health_support_bool: "false",
  });
  // http://ec2-34-219-155-200.us-west-2.compute.amazonaws.com:8000/clients/predictions
  // this can be changed to an env variable
  const workscore_api = "http://localhost:3001/api/work-score";

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    age: "",
  });

  useEffect(() => {
    // If there's form data in the location state, use it to initialize the form
    if (location.state && location.state.selectedUser) {
      setSelectedUser(location.state.selectedUser);
    }
  }, [location.state]);

  // State to hold the entries
  const [setEntries] = useState([]); // Ensure this is defined

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedUser({
      ...selectedUser,
      [name]: type === "checkbox" ? (checked ? "true" : "false") : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!selectedUser.firstName.trim()) {
      newErrors.firstName = "First Name is required.";
      isValid = false;
    }

    if (!selectedUser.lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
      isValid = false;
    }

    if (selectedUser.age <= 0) {
      newErrors.age = "Age is required.";
      isValid = false;
    }

    if (!Number.isInteger(Number(selectedUser.age))) {
      newErrors.age = "Age must be a valid number.";
      isValid = false;
    }

    if (
      (selectedUser.age > 0 && selectedUser.age < 18) ||
      selectedUser.age > 66
    ) {
      newErrors.age = "Age must be between 18 and 65.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Prevent form submission if validation fails
    try {
      await handleAdd();
      const response = await axios.post(workscore_api, selectedUser);
      const probability = response.data.baseline;

      const interventions = response.data.interventions;
      navigate("/results", {
        state: { selectedUser, probability, interventions },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleAdd = async () => {
    try {
      // Send formData to the backend at the new endpoint
      const response = await axios.post(
        "http://localhost:3001/api/submit-form", // Update the URL as needed
        selectedUser,
      );

      // Assuming the response contains the newly added submission or confirmation
      console.log(response.data);

      // Update the entries state with the new submission
      setEntries((prevEntries) => [...prevEntries, response.data.submission]);
      handleClearForm(); // Optionally clear the form after adding
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  const handleClearForm = () => {
    setSelectedUser({
      firstName: "",
      lastName: "",
      age: 0,
      gender: "",
      work_experience: 0,
      canada_workex: 0,
      dep_num: 0,
      canada_born: "false",
      citizen_status: "",
      level_of_schooling: "",
      fluent_english: "false",
      reading_english_scale: 0,
      speaking_english_scale: 0,
      writing_english_scale: 0,
      numeracy_scale: 0,
      computer_scale: 0,
      transportation_bool: "false",
      caregiver_bool: "false",
      housing: "",
      income_source: 0,
      felony_bool: "false",
      attending_school: "false",
      currently_employed: "false",
      substance_use: "false",
      time_unemployed: 0,
      need_mental_health_support_bool: "false",
    });
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          className={styles.formTitle}
        >
          Candidate Form
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              type="text"
              name="firstName"
              value={selectedUser.firstName}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              type="text"
              name="lastName"
              value={selectedUser.lastName}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Age"
              type="number"
              name="age"
              value={selectedUser.age}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              //InputProps={{ inputProps: { min: 18, max: 65 } }}
              error={!!errors.age}
              helperText={errors.age}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={selectedUser.gender}
                label="Gender"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Work Experience (years)"
              name="work_experience"
              type="number"
              value={selectedUser.work_experience}
              onChange={handleChange}
              className={styles.formField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Canadian Work Experience (years)"
              name="canada_workex"
              type="number"
              value={selectedUser.canada_workex}
              onChange={handleChange}
              className={styles.formField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Number of Dependents"
              name="dep_num"
              type="number"
              value={selectedUser.dep_num}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Citizen Status</InputLabel>
              <Select
                name="citizen_status"
                value={selectedUser.citizen_status}
                onChange={handleChange}
                label="Citizen Status"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="citizen">Citizen</MenuItem>
                <MenuItem value="permanent_resident">
                  Permanent Resident
                </MenuItem>
                <MenuItem value="temporary_resident">
                  Temporary Resident
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedUser.canada_born === "true"}
                  onChange={handleChange}
                  name="canada_born"
                />
              }
              label="Born in Canada"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Level of Schooling</InputLabel>
              <Select
                name="level_of_schooling"
                value={selectedUser.level_of_schooling}
                onChange={handleChange}
                label="Level of Schooling"
              >
                <MenuItem value="Grade 0-8">Grade 0-8</MenuItem>
                <MenuItem value="Grade 9">Grade 9</MenuItem>
                <MenuItem value="Grade 10">Grade 10</MenuItem>
                <MenuItem value="Grade 11">Grade 11</MenuItem>

                <MenuItem value="Grade 12 or equivalent">
                  Grade 12 or equivalent
                </MenuItem>
                <MenuItem value="OAC or Grade 13">OAC or Grade 13</MenuItem>
                <MenuItem value="Some college">Some college</MenuItem>
                <MenuItem value="Some university">Some university</MenuItem>
                <MenuItem value="Some apprenticeship">
                  Some apprenticeship
                </MenuItem>
                <MenuItem value="Certificate of Apprenticeship">
                  Certificate of Apprenticeship
                </MenuItem>
                <MenuItem value="Journeyperson">Journeyperson</MenuItem>
                <MenuItem value="Certificate/Diploma">
                  Certificate/Diploma
                </MenuItem>
                <MenuItem value="Bachelor’s degree">Bachelor’s degree</MenuItem>
                <MenuItem value="Post graduate">Post graduate</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedUser.attending_school === "true"}
                  onChange={handleChange}
                  name="attending_school"
                />
              }
              label="Attending School"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedUser.fluent_english === "true"}
                  onChange={handleChange}
                  name="fluent_english"
                />
              }
              label="Fluent in English"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedUser.currently_employed === "true"}
                  onChange={handleChange}
                  name="currently_employed"
                />
              }
              label="Currently Employed"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Time Unemployed (months)"
              name="time_unemployed"
              type="number"
              value={selectedUser.time_unemployed}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedUser.transportation_bool === "true"}
                  onChange={handleChange}
                  name="transportation_bool"
                />
              }
              label="Has Transportation"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedUser.caregiver_bool === "true"}
                  onChange={handleChange}
                  name="caregiver_bool"
                />
              }
              label="Is a Caregiver"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Housing</InputLabel>
              <Select
                name="housing"
                label="housing"
                value={selectedUser.housing}
                onChange={handleChange}
              >
                <MenuItem value="Renting-private">Renting-private</MenuItem>
                <MenuItem value="Renting-subsidized">
                  Renting-subsidized
                </MenuItem>
                <MenuItem value="Boarding or lodging">
                  Boarding or lodging
                </MenuItem>
                <MenuItem value="Homeowner">Homeowner</MenuItem>
                <MenuItem value="Living with family/friend">
                  Living with family/friend
                </MenuItem>
                <MenuItem value="Institution">Institution</MenuItem>
                <MenuItem value="Temporary second residence">
                  Temporary second residence
                </MenuItem>
                <MenuItem value="Band-owned home">Band-owned home</MenuItem>
                <MenuItem value="Homeless or transient">
                  Homeless or transient
                </MenuItem>
                <MenuItem value="Emergency hostel">Emergency hostel</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Source of Income</InputLabel>
              <Select
                name="income_source"
                label="Source of Income"
                value={selectedUser.income_source}
                onChange={handleChange}
              >
                <MenuItem value="No Source of Income">
                  No Source of Income
                </MenuItem>
                <MenuItem value="Employment Insurance">
                  Employment Insurance
                </MenuItem>
                <MenuItem value="Ontario Works applied or receiving">
                  Ontario Works applied or receiving
                </MenuItem>
                <MenuItem value="Ontario Disability Support Program applied or receiving">
                  Ontario Disability Support Program applied or receiving
                </MenuItem>
                <MenuItem value="Dependent of someone receiving OW or ODSP">
                  Dependent of someone receiving OW or ODSP
                </MenuItem>
                <MenuItem value="Crown Ward">Crown Ward</MenuItem>
                <MenuItem value="Employment">Employment</MenuItem>
                <MenuItem value="Band-owned home">Band-owned home</MenuItem>
                <MenuItem value="Homeless or transient">
                  Homeless or transient
                </MenuItem>
                <MenuItem value="Self-Employment">Self-Employment</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedUser.felony_bool === "true"}
                  onChange={handleChange}
                  name="felony_bool"
                />
              }
              label="Has Felony"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedUser.substance_use === "true"}
                  onChange={handleChange}
                  name="substance_use"
                />
              }
              label="Substance Use"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    selectedUser.need_mental_health_support_bool === "true"
                  }
                  onChange={handleChange}
                  name="need_mental_health_support_bool"
                  className={styles.checkbox}
                />
              }
              label="Needs Mental Health Support"
              className={styles.formField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Reading English Scale (0-10)"
              name="reading_english_scale"
              type="number"
              value={selectedUser.reading_english_scale}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0, max: 10 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Speaking English Scale (0-10)"
              name="speaking_english_scale"
              type="number"
              value={selectedUser.speaking_english_scale}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0, max: 10 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Writing English Scale (0-10)"
              name="writing_english_scale"
              type="number"
              value={selectedUser.writing_english_scale}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0, max: 10 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Numeracy Scale (0-10)"
              name="numeracy_scale"
              type="number"
              value={selectedUser.numeracy_scale}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0, max: 10 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Computer Scale (0-10)"
              name="computer_scale"
              type="number"
              value={selectedUser.computer_scale}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0, max: 10 } }}
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          justifyContent="flex-end"
          style={{ marginTop: "20px" }}
        >
          <Grid item xs={12} sm={3}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleClearForm}
              fullWidth
            >
              Clear Form
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default FormNew;
