import { Select } from "@medusajs/ui";
import { Dispatch, SetStateAction } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Brand } from "../../../routes/settings/brand/list/page";

type Props = {
  field: ControllerRenderProps<FieldValues, string>;
  onChange: (...event: any[]) => void;
  value: string;
  brandList: Brand[];
  defaultValue?: string;
};

const SelectComponent = (props: Props) => {
  return (
    <Select
      name={props.field.name}
      onValueChange={(v) => {
        props.onChange(v);
      }}
      defaultValue={props.defaultValue}
    >
      <Select.Trigger>
        <Select.Value placeholder={`Select Brand`} />
      </Select.Trigger>
      <Select.Content>
        {props.brandList?.map((item) => (
          <Select.Item key={item?.id} value={item?.id!}>
            {item?.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};

export default SelectComponent;
