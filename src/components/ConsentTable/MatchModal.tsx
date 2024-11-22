import React, { ChangeEvent, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Typography, SelectChangeEvent } from '@mui/material';
import { sendSignal } from '../restApi/serviceHandler';
import { useLocation } from 'react-router-dom';

const MatchModal = (props: any) => {
  // State for dropdown and toggle list
  const [matchedSource, setMatchedSource] = useState('');
  const [coursesNames, setCoursesNames] = useState(false);
  const [coursesProgress, setCoursesProgress] = useState(false);
  const [certificates, setCertificates] = useState(false);
  const [refineSelection, setRefineSelection] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Handle changes for the dropdown
  const handleMatchedSourceChange = (event: SelectChangeEvent<string>) => {
    setMatchedSource(event.target.value);
  };

  // Handle toggles for the data type
  const handleToggle = (event: ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(event.target.checked);
  };

  // Handle refine selection
  const handleRefineSelectionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRefineSelection(event.target.checked);
  };

  // Handle Share button click
  const handleShare = async() => {
    console.log("Sharing the data...");
    await sendSignal(queryParams.get('userId') || '');
    props.setInit(false);
    props.onClose();
  };

  // Handle Cancel button click
  const handleCancel = () => {
    console.log("Cancelled...");
    props.onClose();
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Congratulations! We found a match!</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          MERLOT's Weiterbildungsassistent would like to access the following data:
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Matched Sources</InputLabel>
          <Select
            value={matchedSource}
            onChange={handleMatchedSourceChange}
            label="Matched Sources"
          >
            <MenuItem value="openHPI">openHPI</MenuItem>
            <MenuItem value="imcLearning">imc Learning</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="body1" gutterBottom>
          Data Type:
        </Typography>

        <FormControlLabel
          control={<Switch checked={coursesNames} onChange={(e) => handleToggle(e, setCoursesNames)} />}
          label="Courses Names"
        />
        <FormControlLabel
          control={<Switch checked={coursesProgress} onChange={(e) => handleToggle(e, setCoursesProgress)} />}
          label="Courses Progress"
        />
        <FormControlLabel
          control={<Switch checked={certificates} onChange={(e) => handleToggle(e, setCertificates)} />}
          label="Certificates"
        />

        <FormControlLabel
          control={<Switch checked={refineSelection} onChange={handleRefineSelectionChange} />}
          label="Refine Selection"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleShare} color="primary">
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchModal;
