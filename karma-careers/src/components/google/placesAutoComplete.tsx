import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

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
  placeholder: "Search Places ...",
  className: "location-search-input"
};

export interface IPlacesAutoComplete {
  coordinates: google.maps.LatLngLiteral;
  address: string;
}

interface IProps {
  value?: string;
  handleSelect: (payload: IPlacesAutoComplete) => void;
}

/**
 * React Function Component that renders
 * Google AutoSuggestion Search Field
 * @param props React Function Component parameters
 */

const LocationAutoComplete: React.FC<IProps> = props => {
  const [value, setValue] = React.useState(props.value || "");

  React.useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  const handleChange = (address: string) => {
    setValue(address);
  };

  const handleSelect = async (address: string) => {
    const results = await geocodeByAddress(address);
    const coordinates = await getLatLng(results[0]);
    props.handleSelect({ coordinates, address });
    setValue(address);
  };

  return (
    <PlacesAutocomplete value={value} onChange={handleChange} onSelect={handleSelect}>
      {opts => {
        const { getInputProps, suggestions, getSuggestionItemProps, loading } = opts;
        return (
          <React.Fragment>
            <TextField label="Location" fullWidth={true} {...getInputProps(inputProps)} />
            <Paper className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                const style = suggestion.active ? activeStyle : nonActiveStyle;
                const styling = { className, style };
                const suggestionProps = getSuggestionItemProps(suggestion, styling);
                return (
                  <div {...suggestionProps}>
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
