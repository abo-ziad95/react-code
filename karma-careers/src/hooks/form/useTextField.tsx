import * as React from "react";

/**
 * Custom Hook to determine text field properties
 * @param name Name attribute to be used for textfield
 * @param label Label attribute to be used for textfield
 * @param initialValue Initial value attribute of textfield
 * @param errors All errors associated with form
 * @param margin Margin to be applied to textfield
 */

const useTextField = (
  name: string,
  label: string,
  initialValue?: string | number,
  margin: "normal" | "dense" = "normal"
) => {
  const [files, setFiles] = React.useState<FileList>();
  const [value, setValue] = React.useState<string | number | undefined>(initialValue);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }

    setValue(event.target.value);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const attributes = {
    fullWidth: true,
    label,
    margin,
    name,
    onChange,
    value: value || ""
  };

  return { attributes, value, files };
};

export default useTextField;
