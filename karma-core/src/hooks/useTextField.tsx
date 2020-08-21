import { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";

/**
 * Custom Hook to determine text field properties
 * @param name Name attribute to be used for textfield
 * @param label Label attribute to be used for textfield
 * @param initialValue Initial value attribute of textfield
 */

const useTextField = (name: string, label: string, initialValue?: string) => {
  const [files, setFiles] = React.useState<FileList>();
  const [value, setValue] = React.useState<string | undefined>(initialValue);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }

    setValue(event.target.value);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const attributes: TextFieldProps = {
    autoComplete: "off",
    fullWidth: true,
    id: name,
    label,
    margin: "normal",
    name,
    onChange,
    value: value || "",
    variant: "standard"
  };

  return { attributes, files, setValue, value };
};

export default useTextField;
