import { useState, useEffect, useRef } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Brand } from "../../../routes/settings/brand/list/page";
import { toast } from "@medusajs/ui";
import Combobox from "../combobox/combobox";

type Props = {
  field: ControllerRenderProps<FieldValues, string>;
  onChange: (...event: any[]) => void;
  value: string;
  brandList: Brand[];
  defaultValue?: string;
  onBrandCreated?: (newBrand: Brand) => void;
};

const SelectComponent = (props: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const [isCreatingBrand, setIsCreatingBrand] = useState(false);
  const [localBrandList, setLocalBrandList] = useState<Brand[]>(props.brandList);
  const [selectedValue, setSelectedValue] = useState<string>(props.value || props.defaultValue || "");
  const [forceUpdate, setForceUpdate] = useState(0);
  const newlyCreatedBrandRef = useRef<string | null>(null);

  // Update local brand list when props.brandList changes
  useEffect(() => {
    setLocalBrandList(props.brandList);
  }, [props.brandList]);

  // Update selected value when props.value changes
  useEffect(() => {
    setSelectedValue(props.value || props.defaultValue || "");
  }, [props.value, props.defaultValue]);

  // Effect to handle newly created brand selection
  useEffect(() => {
    if (newlyCreatedBrandRef.current) {
      setSelectedValue(newlyCreatedBrandRef.current);
      newlyCreatedBrandRef.current = null;
      setForceUpdate(prev => prev + 1);
    }
  }, [localBrandList]);

  // Check if the search value exactly matches any existing brand
  const brandExists = localBrandList.some(
    (brand) => brand.name.toLowerCase() === searchValue.toLowerCase()
  );

  // Convert brand list to options format for Combobox
  const options = [
    // Add "Create brand" option if search value doesn't match any existing brand
    ...(searchValue && !brandExists ? [{
      label: `Create brand "${searchValue}"`,
      value: `__create__${searchValue}`
    }] : []),
    // Add all existing brands
    ...localBrandList.map(brand => ({
      label: brand.name,
      value: brand.id
    }))
  ];

  const handleCreateBrand = async (brandName: string) => {
    try {
      setIsCreatingBrand(true);
      const response = await fetch(`/admin/brand`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: brandName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create brand");
      }

      const data = await response.json();
      toast.success("Brand created successfully");

      // Store the new brand ID for selection
      newlyCreatedBrandRef.current = data.brand.id;

      // Update local brand list with the new brand
      setLocalBrandList(prevBrands => [...prevBrands, data.brand]);

      // Call the callback with the new brand
      if (props.onBrandCreated) {
        props.onBrandCreated(data.brand);
      }

      // Update the form with the new brand ID
      props.onChange(data.brand.id);

      // Clear the search value
      setSearchValue("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create brand");
    } finally {
      setIsCreatingBrand(false);
    }
  };

  return (
    <Combobox
      key={forceUpdate} // Force re-render when needed
      value={selectedValue}
      onChange={(value) => {
        if (typeof value === 'string' && value.startsWith('__create__')) {
          const brandName = value.replace('__create__', '');
          handleCreateBrand(brandName);
        } else {
          setSelectedValue(value as string);
          props.onChange(value);
        }
      }}
      options={options}
      placeholder="Select Brand"
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
      disabled={isCreatingBrand}
    />
  );
};

export default SelectComponent;
