import { LocationContext } from "@hatech/karma-core/context/location";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import React from "react";
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
  className: "location-search-input",
  placeholder: "Search Places ..."
};

export interface IPlacesAutoComplete {
  coordinates: google.maps.LatLngLiteral;
  address: string;
}

interface IProps {
  disableCurrentLocation?: boolean;
  value?: string;
  handleSelect: (payload: IPlacesAutoComplete) => void;
}

/**
 * React Function Component that renders
 * Google AutoSuggestion Search Field
 * @param props React Function Component parameters
 */

const LocationAutoComplete: React.FC<IProps> = props => {
  const location = React.useContext(LocationContext);
  const [value, setValue] = React.useState();

  React.useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  React.useEffect(() => {
    if (!props.disableCurrentLocation) {
      const address = location.state && location.state.address ? location.state.address : "";
      setValue(address);
    }
  }, [location.state, props.disableCurrentLocation]);

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
    <PlacesAutocomplete value={value || ""} onChange={handleChange} onSelect={handleSelect}>
      {opts => {
        const { getInputProps, suggestions, getSuggestionItemProps, loading } = opts;
        return (
          <React.Fragment>
            <TextField id="location-search" name="location-search" label="Enter Location" fullWidth={true} {...getInputProps(inputProps)} />
            <Paper className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                const style = suggestion.active ? activeStyle : nonActiveStyle;
                const styling = { className, style };
                const suggestionProps = getSuggestionItemProps(suggestion, styling);
                return (
                  <div {...suggestionProps} id="location-dropdown-value" key={suggestionProps.key}>
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
