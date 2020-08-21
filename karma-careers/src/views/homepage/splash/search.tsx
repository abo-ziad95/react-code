import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import * as React from "react";
import useHistoryPush from "../../../hooks/router/useHistoryPush";

const style: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: 5,
  boxSizing: "border-box",
  display: "flex",
  padding: 10,
  width: "100%"
};

const iconStyle: React.CSSProperties = {
  color: "#333",
  paddingRight: 8,
  paddingTop: 3
};
const fieldStyle: React.CSSProperties = { flex: 1, paddingTop: 4 };

const Search: React.FC = () => {
  const [search, setState] = React.useState<string | undefined>(undefined);
  const { push } = useHistoryPush();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);
  };

  const handleSubmit = () => {
    let path = "/jobs";
    if (search) {
      path += `?search=${encodeURI(search)}`;
    }
    push(path);
  };

  return (
    <div style={style}>
      <SearchIcon style={iconStyle} fontSize="large" />
      <InputBase
        placeholder="Search For You Dream Job…"
        onChange={onChange}
        style={fieldStyle}
      />
      <Button color="primary" onClick={handleSubmit} variant="contained">
        Search
      </Button>
    </div>
  );
};

export default Search;
