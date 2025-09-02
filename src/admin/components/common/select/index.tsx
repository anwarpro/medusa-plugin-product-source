import { useState, useEffect, useRef } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

import { toast } from "@medusajs/ui";
import Combobox from "../combobox/combobox";
import { Brand } from "../../../routes/sources/list/page";

type Props = {
  field: ControllerRenderProps<FieldValues, string>;
  onChange: (...event: any[]) => void;
  value: string;
  sourceList: Source[];
  defaultValue?: string;
  onSourceCreated?: (newSource: Source) => void;
};

const SelectComponent = (props: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const [isCreatingSource, setIsCreatingSource] = useState(false);
  const [localSourceList, setLocalSourceList] = useState<Source[]>(
    props.sourceList
  );
  const [selectedValue, setSelectedValue] = useState<string>(
    props.value || props.defaultValue || ""
  );
  const [forceUpdate, setForceUpdate] = useState(0);
  const newlyCreatedSourceRef = useRef<string | null>(null);

  // Update local source list when props.sourceList changes
  useEffect(() => {
    setLocalSourceList(props.sourceList);
  }, [props.sourceList]);

  // Update selected value when props.value changes
  useEffect(() => {
    setSelectedValue(props.value || props.defaultValue || "");
  }, [props.value, props.defaultValue]);

  // Effect to handle newly created source selection
  useEffect(() => {
    if (newlyCreatedSourceRef.current) {
      setSelectedValue(newlyCreatedSourceRef.current);
      newlyCreatedSourceRef.current = null;
      setForceUpdate((prev) => prev + 1);
    }
  }, [localSourceList]);

  // Check if the search value exactly matches any existing source
  const sourceExists = localSourceList.some(
    (source) => source.name.toLowerCase() === searchValue.toLowerCase()
  );

  // Convert source list to options format for Combobox
  const options = [
    // Add "Create source" option if search value doesn't match any existing source
    ...(searchValue && !sourceExists
      ? [
          {
            label: `Create source "${searchValue}"`,
            value: `__create__${searchValue}`,
          },
        ]
      : []),
    // Add all existing sources
    ...localSourceList.map((source) => ({
      label: source.name,
      value: source.id,
    })),
  ];

  const handleCreateSource = async (sourceName: string) => {
    try {
      setIsCreatingSource(true);
      const response = await fetch(`/admin/source`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: sourceName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create source");
      }

      const data = await response.json();
      toast.success("Source created successfully");

      // Store the new source ID for selection
      newlyCreatedSourceRef.current = data.source.id;

      // Update local source list with the new source
      setLocalSourceList((prevSources) => [...prevSources, data.source]);

      // Call the callback with the new source
      if (props.onSourceCreated) {
        props.onSourceCreated(data.source);
      }

      // Update the form with the new source ID
      props.onChange(data.source.id);

      // Clear the search value
      setSearchValue("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create source");
    } finally {
      setIsCreatingSource(false);
    }
  };

  return (
    <Combobox
      key={forceUpdate} // Force re-render when needed
      value={selectedValue}
      onChange={(value) => {
        if (typeof value === "string" && value.startsWith("__create__")) {
          const sourceName = value.replace("__create__", "");
          handleCreateSource(sourceName);
        } else {
          setSelectedValue(value as string);
          props.onChange(value);
        }
      }}
      options={options}
      placeholder="Select Source"
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
      disabled={isCreatingSource}
    />
  );
};

export default SelectComponent;
