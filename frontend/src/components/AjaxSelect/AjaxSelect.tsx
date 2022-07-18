import { Select } from "antd";
import React, { useState } from "react";

type Props = {
  placeholder: string;
  fetchData: (value: string, callback: (data: any[]) => void) => void;
  onChange?: (value: string) => void;
  value?: string;
};

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

export const AjaxSelect: React.FC<Props> = ({ value = undefined, onChange, placeholder, fetchData }) => {
  const [data, setData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const options = data.map((d) => <Select.Option key={d.id}>{d.title}</Select.Option>);

  const onValueChange = (newValue: string) => {
    if (onChange) onChange(newValue);
    else setSearchValue(newValue);
  };

  const fetch = (value: string, callback: (data: any[]) => void) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    const f = () => {
      if (currentValue === value) fetchData(value, callback);
    };

    timeout = setTimeout(f, 300);
  };

  const handleSearch = (newValue: string) => {
    if (newValue) {
      fetch(newValue, setData);
    } else {
      setData([]);
    }
  };

  return (
    <Select
      showSearch
      value={value || searchValue}
      onChange={onValueChange}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      notFoundContent={null}
    >
      {options}
    </Select>
  );
};
