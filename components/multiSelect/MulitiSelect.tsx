// MultiSelectDropdown.tsx
"use client";
import useColorMode from "@/hooks/useColorMode";
import useLocalStorage from "@/hooks/useLocalStorage";
import React, { useState, useEffect } from "react";
import Select, { ActionMeta, StylesConfig } from "react-select";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  onChange?: any;
  value?: any;
}

const MulitiSelect: React.FC<MultiSelectDropdownProps> = ({
  options,
  onChange,
  value,
}) => {
  const customStyles: any = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "rgb(29 42 57 / var(--tw-bg-opacity))",
      borderColor: "rgb(61 77 96 / var(--tw-border-opacity))",
      padding: ".24rem",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "rgb(29 42 57 / var(--tw-bg-opacity))",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "gray"
        : "rgb(29 42 57 / var(--tw-bg-opacity))",
      color: state.isSelected ? "white" : "white",
    }),
  };
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedOptions(
        value.map((data: any) => ({
          value: data,
          label: data,
        }))
      );
    }
  }, [value]);

  const handleSelectChange = (selected: any) => {
    // Ensure that selected is an array of options
    const selectedArray = selected as Option[];
    setSelectedOptions(selectedArray);
    const arr = selectedArray.map((val: any) => val.value);
    onChange(arr);
  };

  return (
    <>
      <Select
        styles={customStyles}
        className=" w-full d-flex align-item-center rounded border border-stroke font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleSelectChange}
      />
    </>
  );
};

export default MulitiSelect;
