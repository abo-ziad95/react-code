import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { AlertsContext } from "@hatech/karma-core/context/alerts";

const useStyles = makeStyles(() => {
  return {
    paper: {
      maxWidth: "auto",
      position: "absolute",
      width: "auto",
      zIndex: 100
    }
  };
});

const activeStyle = {
  backgroundColor: "#fafafa",
  cursor: "pointer",
  padding: 12
};

const nonActiveStyle = {
  backgroundColor: "#ffffff",
  cursor: "pointer",
  padding: 12
};

const inputProps = {
  className: "location-search-input",
  placeholder: "Search Places ..."
};

export interface IPlacesAutoComplete {
  coordinates: google.maps.LatLngLiteral;
  address: string;
}

interface IProps {
  handleSelect: (payload: IPlacesAutoComplete) => void;
}

/**
 * React Function Component that renders Google AutoSuggestion Search Field
 * @param props React Function Component parameters
 */

const LocationAutoComplete: React.FC<IProps> = props => {
  const alerts = React.useContext(AlertsContext);
  const classes = useStyles({});
  const [value, setValue] = React.useState("");

  const handleChange = (address: string) => {
    if (!address) {
      return;
    }

    setValue(address);
  };

  const handleSelect = async (address: string) => {
    try {
      if (!address) {
        return;
      }
      const results = await geocodeByAddress(address);
      const coordinates = await getLatLng(results[0]);
      props.handleSelect({ coordinates, address });
      setValue(address);
      setValue("");
    } catch (error) {
      alerts.dispatch({
        payload: {
          body: error.message || error,
          title: "Error"
        },
        type: "ADD_ALERT"
      });
    }
  };

  return (
    <PlacesAutocomplete
      value={value}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {opts => {
        const {
          getInputProps,
          suggestions,
          getSuggestionItemProps,
          loading
        } = opts;
        return (
          <React.Fragment>
            <TextField
              label="Add new address"
              fullWidth={true}
              {...getInputProps(inputProps)}
              id="add-address-field"
            />
            <Paper className={classes.paper}>
              {loading && <div style={nonActiveStyle}>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                const style = suggestion.active ? activeStyle : nonActiveStyle;
                const styling = { className, style };
                const suggestionProps = getSuggestionItemProps(
                  suggestion,
                  styling
                );
                return (
                  <div {...suggestionProps} key={suggestionProps.key}>
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </Paper>
          </React.Fragment>
        );
      }}
    </PlacesAutocomplete>
  );
};

export default LocationAutoComplete;
