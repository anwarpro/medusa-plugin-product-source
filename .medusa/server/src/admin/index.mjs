import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { defineWidgetConfig, defineRouteConfig } from "@medusajs/admin-sdk";
import { clx, Text, toast, Heading, Drawer, Button, Label, Container, Tooltip, Badge, usePrompt, DropdownMenu, IconButton, createDataTableColumnHelper, useDataTable, DataTable, FocusModal, Input, Prompt } from "@medusajs/ui";
import { useParams, useNavigate, Link, useLocation, useBlocker } from "react-router-dom";
import Medusa from "@medusajs/js-sdk";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller, Form as Form$1 } from "react-hook-form";
import { TrianglesMini, PencilSquare, EllipsisHorizontal, Trash, Photo } from "@medusajs/icons";
import React, { useState, useRef, useEffect, useMemo, createContext, useCallback, useContext } from "react";
import { z } from "zod";
import { createColumnHelper } from "@tanstack/react-table";
const SectionRow = ({
  title,
  value,
  actions,
  variant = "default"
}) => {
  const isValueString = typeof value === "string" || !value;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clx(
        `text-ui-fg-subtle grid w-full grid-cols-2 items-center gap-4 px-6 py-4`,
        {
          "grid-cols-[1fr_1fr_28px]": !!actions
        },
        {
          ["grid grid-cols-1"]: variant === "custom"
        }
      ),
      children: [
        /* @__PURE__ */ jsx(Text, { size: "small", weight: "plus", leading: "compact", children: title }),
        isValueString ? /* @__PURE__ */ jsx(
          Text,
          {
            size: "small",
            leading: "compact",
            className: clx(`whitespace-pre-line text-pretty`, {
              ["no-scrollbar h-full max-h-[400px] overflow-y-scroll"]: variant === "custom"
            }),
            children: value ?? "-"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: value }),
        actions && /* @__PURE__ */ jsx("div", { children: actions })
      ]
    }
  );
};
const sdk = new Medusa({
  baseUrl: "/",
  debug: false,
  auth: {
    type: "session"
  }
});
const KeyboundForm = React.forwardRef(({ onSubmit, onKeyDown, ...rest }, ref) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit == null ? void 0 : onSubmit(event);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.target instanceof HTMLTextAreaElement && !(event.metaKey || event.ctrlKey)) {
        return;
      }
      event.preventDefault();
      if (event.metaKey || event.ctrlKey) {
        handleSubmit(event);
      }
    }
  };
  return /* @__PURE__ */ jsx(
    "form",
    {
      ...rest,
      onSubmit: handleSubmit,
      onKeyDown: onKeyDown ?? handleKeyDown,
      ref
    }
  );
});
KeyboundForm.displayName = "KeyboundForm";
const Combobox = ({
  value: controlledValue,
  onChange,
  searchValue: controlledSearchValue,
  onSearchValueChange,
  options,
  placeholder,
  className = "",
  disabled = false,
  fetchNextPage,
  isFetchingNextPage,
  "aria-label": ariaLabel
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(controlledSearchValue || "");
  const [selectedValues, setSelectedValues] = useState(controlledValue || (Array.isArray(controlledValue) ? [] : ""));
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const isArrayValue = Array.isArray(selectedValues);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (open && dropdownRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      dropdownRef.current.style.position = "absolute";
      dropdownRef.current.style.width = `${containerRect.width}px`;
      dropdownRef.current.style.left = "0";
      dropdownRef.current.style.top = `${containerRect.height + 4}px`;
    }
  }, [open]);
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onSearchValueChange == null ? void 0 : onSearchValueChange(newValue);
  };
  const handleSelect = (option) => {
    if (option.disabled) return;
    let newValue;
    if (isArrayValue) {
      const currentValues = selectedValues;
      newValue = currentValues.includes(option.value) ? currentValues.filter((v) => v !== option.value) : [...currentValues, option.value];
    } else {
      newValue = option.value;
    }
    setSelectedValues(newValue);
    onChange == null ? void 0 : onChange(newValue);
    setOpen(false);
    setSearchValue("");
  };
  const filteredOptions = options.filter(
    (option) => option.label.toLowerCase().includes(searchValue.toLowerCase())
  );
  const getSelectedLabels = () => {
    var _a;
    if (isArrayValue) {
      return selectedValues.map((v) => {
        var _a2;
        return (_a2 = options.find((o) => o.value === v)) == null ? void 0 : _a2.label;
      }).filter(Boolean);
    }
    return (_a = options.find((o) => o.value === selectedValues)) == null ? void 0 : _a.label;
  };
  const selectedLabels = getSelectedLabels();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: clx(
        "relative flex cursor-pointer items-center gap-x-2",
        "h-8 w-full rounded-md",
        "bg-ui-bg-field transition-fg shadow-borders-base",
        "has-[input:focus]:shadow-borders-interactive-with-active",
        "has-[:invalid]:shadow-borders-error has-[[aria-invalid=true]]:shadow-borders-error",
        "has-[:disabled]:bg-ui-bg-disabled has-[:disabled]:text-ui-fg-disabled has-[:disabled]:cursor-not-allowed",
        disabled && "opacity-50 cursor-not-allowed",
        className
      ),
      "aria-label": ariaLabel,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex size-full items-center", children: [
          !open && selectedLabels && /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 flex size-full items-center overflow-hidden left-2", children: /* @__PURE__ */ jsx("span", { className: "txt-compact-small text-ui-fg-base truncate", children: selectedLabels }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: inputRef,
              type: "text",
              value: open ? searchValue : "",
              onChange: handleSearchChange,
              onClick: () => !disabled && setOpen(true),
              className: clx(
                "txt-compact-small text-ui-fg-base !placeholder:text-ui-fg-muted transition-fg",
                "size-full cursor-pointer bg-transparent pl-2 pr-8 outline-none focus:cursor-text",
                "hover:bg-ui-bg-field-hover",
                { "opacity-0": !open && selectedLabels }
              ),
              placeholder,
              disabled
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "text-ui-fg-muted transition-fg hover:bg-ui-bg-field-hover absolute right-0 flex size-8 items-center justify-center rounded-r outline-none",
              onClick: (e) => {
                e.stopPropagation();
                !disabled && setOpen(!open);
              },
              children: /* @__PURE__ */ jsx(TrianglesMini, {})
            }
          )
        ] }),
        open && /* @__PURE__ */ jsx(
          "div",
          {
            ref: dropdownRef,
            className: clx(
              "absolute left-0 z-50",
              "shadow-elevation-flyout bg-ui-bg-base rounded-lg p-1",
              "max-h-[300px] overflow-y-auto",
              "animate-in fade-in-0 zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2",
              "data-[side=top]:slide-in-from-bottom-2"
            ),
            style: {
              minWidth: "220px"
            },
            children: /* @__PURE__ */ jsxs("div", { className: "py-1", children: [
              filteredOptions.map((option, index) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: clx(
                    "transition-fg bg-ui-bg-base hover:bg-ui-bg-base-hover",
                    "group flex cursor-pointer items-center gap-x-2 rounded-[4px] px-2 py-1.5",
                    option.disabled && "text-ui-fg-disabled bg-ui-bg-component cursor-not-allowed",
                    selectedValues === option.value && "bg-ui-bg-base-hover"
                  ),
                  onClick: () => handleSelect(option),
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1", children: [
                      option.image && /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: option.image,
                          alt: option.label,
                          className: "w-8 h-8 object-cover rounded"
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "txt-compact-small text-ui-fg-base truncate", children: option.label })
                    ] }),
                    option.price !== void 0 && /* @__PURE__ */ jsxs("span", { className: "txt-compact-small text-ui-fg-subtle ml-auto", children: [
                      option.price,
                      " ",
                      option.currency_code
                    ] })
                  ]
                },
                option.value
              )),
              isFetchingNextPage && /* @__PURE__ */ jsx("div", { className: "transition-fg bg-ui-bg-base flex items-center rounded-[4px] px-2 py-1.5", children: /* @__PURE__ */ jsx("div", { className: "bg-ui-bg-component size-full h-5 w-full animate-pulse rounded-[4px]" }) }),
              !filteredOptions.length && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-x-2 rounded-[4px] px-2 py-1.5", children: /* @__PURE__ */ jsx("span", { className: "txt-compact-small text-ui-fg-subtle", children: "No results found" }) })
            ] })
          }
        )
      ]
    }
  );
};
const SelectComponent = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [isCreatingSource, setIsCreatingSource] = useState(false);
  const [localSourceList, setLocalSourceList] = useState(
    props.sourceList
  );
  const [selectedValue, setSelectedValue] = useState(
    props.value || props.defaultValue || ""
  );
  const [forceUpdate, setForceUpdate] = useState(0);
  const newlyCreatedSourceRef = useRef(null);
  useEffect(() => {
    setLocalSourceList(props.sourceList);
  }, [props.sourceList]);
  useEffect(() => {
    setSelectedValue(props.value || props.defaultValue || "");
  }, [props.value, props.defaultValue]);
  useEffect(() => {
    if (newlyCreatedSourceRef.current) {
      setSelectedValue(newlyCreatedSourceRef.current);
      newlyCreatedSourceRef.current = null;
      setForceUpdate((prev) => prev + 1);
    }
  }, [localSourceList]);
  const sourceExists = localSourceList.some(
    (source) => source.name.toLowerCase() === searchValue.toLowerCase()
  );
  const options = [
    // Add "Create source" option if search value doesn't match any existing source
    ...searchValue && !sourceExists ? [
      {
        label: `Create source "${searchValue}"`,
        value: `__create__${searchValue}`
      }
    ] : [],
    // Add all existing sources
    ...localSourceList.map((source) => ({
      label: source.name,
      value: source.id
    }))
  ];
  const handleCreateSource = async (sourceName) => {
    try {
      setIsCreatingSource(true);
      const response = await fetch(`/admin/source`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: sourceName })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create source");
      }
      const data = await response.json();
      toast.success("Source created successfully");
      newlyCreatedSourceRef.current = data.source.id;
      setLocalSourceList((prevSources) => [...prevSources, data.source]);
      if (props.onSourceCreated) {
        props.onSourceCreated(data.source);
      }
      props.onChange(data.source.id);
      setSearchValue("");
    } catch (error) {
      toast.error(error.message || "Failed to create source");
    } finally {
      setIsCreatingSource(false);
    }
  };
  return /* @__PURE__ */ jsx(
    Combobox,
    {
      value: selectedValue,
      onChange: (value) => {
        if (typeof value === "string" && value.startsWith("__create__")) {
          const sourceName = value.replace("__create__", "");
          handleCreateSource(sourceName);
        } else {
          setSelectedValue(value);
          props.onChange(value);
        }
      },
      options,
      placeholder: "Select Source",
      searchValue,
      onSearchValueChange: setSearchValue,
      disabled: isCreatingSource
    },
    forceUpdate
  );
};
const ErrorMessage = (props) => {
  var _a, _b;
  return /* @__PURE__ */ jsx(Fragment, { children: props.form.formState.errors[props.field] && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm", children: (_b = (_a = props.form.formState.errors[props.field]) == null ? void 0 : _a.message) == null ? void 0 : _b.toString() }) });
};
const AddProductSource = () => {
  var _a, _b;
  const params = useParams();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryFn: () => sdk.client.fetch(
      `/admin/products/${params == null ? void 0 : params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        query: {
          fields: "source.*"
        }
      }
    ),
    queryKey: ["products"],
    refetchOnMount: "always"
  });
  const { data: sources } = useQuery({
    queryFn: () => sdk.client.fetch(`/admin/source`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }),
    queryKey: ["sources"],
    refetchOnMount: "always"
  });
  const form = useForm({
    defaultValues: {
      source: (_b = (_a = data == null ? void 0 : data.product) == null ? void 0 : _a.source) == null ? void 0 : _b.id
    }
  });
  const handleSubmit = async ({ source }) => {
    var _a2, _b2, _c;
    try {
      const productUpdate = await sdk.client.fetch(
        `/admin/products/${(_a2 = data == null ? void 0 : data.product) == null ? void 0 : _a2.id}`,
        {
          method: "POST",
          body: {
            additional_data: {
              source_id: source || null,
              old_source_id: ((_c = (_b2 = data == null ? void 0 : data.product) == null ? void 0 : _b2.source) == null ? void 0 : _c.id) ?? null
            }
          },
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      navigate(0);
      toast.success("Source edited successfully...");
    } catch (error) {
      toast.error(error.message || "Something went wrong...");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4", children: [
    /* @__PURE__ */ jsx(Heading, { level: "h2", children: "Product Source" }),
    /* @__PURE__ */ jsxs(Drawer, { children: [
      /* @__PURE__ */ jsx(Drawer.Trigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "primary", children: /* @__PURE__ */ jsx(PencilSquare, {}) }) }),
      /* @__PURE__ */ jsx(Drawer.Content, { children: /* @__PURE__ */ jsxs(
        KeyboundForm,
        {
          onSubmit: form.handleSubmit(handleSubmit),
          className: "flex flex-1 flex-col",
          children: [
            /* @__PURE__ */ jsx(Drawer.Header, { children: /* @__PURE__ */ jsx(Drawer.Title, { children: "Edit Product Source" }) }),
            /* @__PURE__ */ jsx(Drawer.Body, { className: "p-4 flex flex-1", children: /* @__PURE__ */ jsx(
              Controller,
              {
                rules: {
                  required: "Source is required"
                },
                control: form.control,
                name: "source",
                render: ({ field }) => {
                  var _a2, _b2;
                  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full gap-2", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Name" }),
                    /* @__PURE__ */ jsx(
                      SelectComponent,
                      {
                        defaultValue: (_b2 = (_a2 = data == null ? void 0 : data.product) == null ? void 0 : _a2.source) == null ? void 0 : _b2.id,
                        sourceList: sources.sources,
                        field,
                        ...field
                      }
                    ),
                    /* @__PURE__ */ jsx(ErrorMessage, { field: field.name, form })
                  ] });
                }
              }
            ) }),
            /* @__PURE__ */ jsxs(Drawer.Footer, { children: [
              /* @__PURE__ */ jsx(Drawer.Close, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "secondary", children: "Cancel" }) }),
              /* @__PURE__ */ jsx(Button, { type: "submit", children: "Save" })
            ] })
          ]
        }
      ) })
    ] })
  ] });
};
const SourceWidget = () => {
  var _a, _b, _c;
  const params = useParams();
  const { data } = useQuery({
    queryFn: () => sdk.client.fetch(
      `/admin/products/${params == null ? void 0 : params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        query: {
          fields: "source.*"
        }
      }
    ),
    queryKey: ["products"],
    refetchOnMount: "always"
  });
  return /* @__PURE__ */ jsxs(Container, { className: "divide-y p-0", children: [
    /* @__PURE__ */ jsx(AddProductSource, {}),
    /* @__PURE__ */ jsx(
      SectionRow,
      {
        title: "Source",
        value: ((_b = (_a = data == null ? void 0 : data.product) == null ? void 0 : _a.source) == null ? void 0 : _b.name) ? /* @__PURE__ */ jsx(OrganizationTag, { label: (_c = data == null ? void 0 : data.product) == null ? void 0 : _c.source.name, to: `/sources` }) : void 0
      }
    )
  ] });
};
const OrganizationTag = ({ label, to }) => {
  return /* @__PURE__ */ jsx(Tooltip, { content: label, children: /* @__PURE__ */ jsx(Badge, { size: "2xsmall", className: "block w-fit truncate", asChild: true, children: /* @__PURE__ */ jsx(Link, { to, children: label }) }) });
};
defineWidgetConfig({
  zone: "product.details.side.after"
});
const deleteSource = async (sourceId) => {
  try {
    const response = await fetch(`/admin/source/${sourceId}`, {
      method: "DELETE"
    });
    const res = response;
    return res;
  } catch (error) {
    throw error;
  }
};
const handleDeleteSource = async (sourceId) => {
  try {
    await deleteSource(sourceId);
    toast.success("Source deleted successfully");
  } catch (error) {
    toast.error((error == null ? void 0 : error.message) || "Failed to delete source. Please try again.");
  }
};
const useDeleteSourceAction = (id, name) => {
  const prompt = usePrompt();
  const navigate = useNavigate();
  const handleDelete = async () => {
    const result = await prompt({
      title: "Are you sure?",
      description: `You are about to delete the product type ${name}. This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel"
    });
    if (!result) {
      return;
    }
    await handleDeleteSource(id);
    navigate(0);
  };
  return handleDelete;
};
const ConditionalTooltip = ({
  children,
  showTooltip = false,
  ...props
}) => {
  if (showTooltip) {
    return /* @__PURE__ */ jsx(Tooltip, { ...props, children });
  }
  return children;
};
const ActionMenu = ({
  groups,
  variant = "transparent",
  children
}) => {
  const inner = children ?? /* @__PURE__ */ jsx(IconButton, { size: "small", variant, children: /* @__PURE__ */ jsx(EllipsisHorizontal, {}) });
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenu.Trigger, { asChild: true, children: inner }),
    /* @__PURE__ */ jsx(DropdownMenu.Content, { children: groups.map((group, index) => {
      if (!group.actions.length) {
        return null;
      }
      const isLast = index === groups.length - 1;
      return /* @__PURE__ */ jsxs(DropdownMenu.Group, { children: [
        group.actions.map((action, index2) => {
          const Wrapper = action.disabledTooltip ? ({ children: children2 }) => /* @__PURE__ */ jsx(
            ConditionalTooltip,
            {
              showTooltip: action.disabled,
              content: action.disabledTooltip,
              side: "right",
              children: /* @__PURE__ */ jsx("div", { children: children2 })
            }
          ) : "div";
          if (action.onClick) {
            return /* @__PURE__ */ jsx(Wrapper, { children: /* @__PURE__ */ jsxs(
              DropdownMenu.Item,
              {
                disabled: action.disabled,
                onClick: (e) => {
                  e.stopPropagation();
                  action.onClick();
                },
                className: clx(
                  "[&_svg]:text-ui-fg-subtle flex items-center gap-x-2",
                  {
                    "[&_svg]:text-ui-fg-disabled": action.disabled
                  }
                ),
                children: [
                  action.icon,
                  /* @__PURE__ */ jsx("span", { children: action.label })
                ]
              }
            ) }, index2);
          }
          return /* @__PURE__ */ jsx(Wrapper, { children: /* @__PURE__ */ jsx(
            DropdownMenu.Item,
            {
              className: clx(
                "[&_svg]:text-ui-fg-subtle flex items-center gap-x-2",
                {
                  "[&_svg]:text-ui-fg-disabled": action.disabled
                }
              ),
              asChild: true,
              disabled: action.disabled,
              children: /* @__PURE__ */ jsxs(Link, { to: action.to, onClick: (e) => e.stopPropagation(), children: [
                action.icon,
                /* @__PURE__ */ jsx("span", { children: action.label })
              ] })
            }
          ) }, index2);
        }),
        !isLast && /* @__PURE__ */ jsx(DropdownMenu.Separator, {})
      ] }, index);
    }) })
  ] });
};
const SourceRowActions = ({ source }) => {
  const navigate = useNavigate();
  const handleDelete = useDeleteSourceAction(source.id, source.name);
  const handleEdit = async () => {
    navigate("/sources/edit", { state: source });
  };
  return /* @__PURE__ */ jsx(
    ActionMenu,
    {
      groups: [
        {
          actions: [
            {
              label: "Edit",
              icon: /* @__PURE__ */ jsx(PencilSquare, {}),
              onClick: handleEdit
            }
          ]
        },
        {
          actions: [
            {
              label: "Delete",
              icon: /* @__PURE__ */ jsx(Trash, {}),
              onClick: handleDelete
            }
          ]
        }
      ]
    }
  );
};
const SourceList = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryFn: () => sdk.client.fetch(`/admin/source`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }),
    queryKey: ["source"],
    refetchOnMount: "always"
  });
  const sourceData = useMemo(() => {
    return (data == null ? void 0 : data.sources) || [];
  }, [data == null ? void 0 : data.sources]);
  const columnHelper2 = createDataTableColumnHelper();
  const columns = [
    columnHelper2.accessor("name", {
      header: "Name",
      enableSorting: true
    }),
    columnHelper2.accessor("created_at", {
      header: "Created",
      enableSorting: true,
      cell({ row }) {
        var _a;
        const createdAt = new Date(
          (_a = row == null ? void 0 : row.original) == null ? void 0 : _a.created_at
        ).toDateString();
        return createdAt;
      }
    }),
    columnHelper2.accessor("updated_at", {
      header: "Updated",
      enableSorting: true,
      cell({ row }) {
        var _a;
        const updatedAt = new Date(
          (_a = row == null ? void 0 : row.original) == null ? void 0 : _a.updated_at
        ).toDateString();
        return updatedAt;
      }
    }),
    columnHelper2.accessor("actions", {
      header: "Actions",
      cell: ({ row }) => {
        return /* @__PURE__ */ jsx(
          SourceRowActions,
          {
            source: row.original
          }
        );
      }
    })
  ];
  const table = useDataTable({
    columns,
    data: sourceData,
    rowCount: sourceData.length,
    isLoading,
    pagination: {
      onPaginationChange: () => {
      },
      state: {
        pageIndex: 0,
        pageSize: 50
      }
    },
    onRowClick: (event, row) => {
      navigate(`/sources/detail`, {
        state: row.original
      });
    }
  });
  return /* @__PURE__ */ jsx(DataTable, { instance: table, children: /* @__PURE__ */ jsx(
    DataTable.Table,
    {
      emptyState: {
        empty: {
          heading: "No Products",
          description: "There are no products to display."
        }
      }
    }
  ) });
};
const SourcePage = () => {
  return /* @__PURE__ */ jsxs(Container, { className: "divide-y p-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Heading, { children: "Source List" }),
        /* @__PURE__ */ jsx(Text, { className: "text-ui-fg-subtle", size: "small", children: "Organize your Sources" })
      ] }),
      /* @__PURE__ */ jsx(Button, { size: "small", variant: "secondary", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "create", children: "Create" }) })
    ] }),
    /* @__PURE__ */ jsx(SourceList, {})
  ] });
};
const config = defineRouteConfig({
  label: "Source"
});
const RouteModalProviderContext = createContext(null);
const RouteModalProvider = ({
  prev,
  children
}) => {
  const navigate = useNavigate();
  const [closeOnEscape, setCloseOnEscape] = useState(true);
  const handleSuccess = useCallback(
    (path) => {
      const to = path || prev;
      navigate(to, { replace: true, state: { isSubmitSuccessful: true } });
    },
    [navigate, prev]
  );
  const value = useMemo(
    () => ({
      handleSuccess,
      setCloseOnEscape,
      __internal: { closeOnEscape }
    }),
    [handleSuccess, setCloseOnEscape, closeOnEscape]
  );
  return /* @__PURE__ */ jsx(RouteModalProviderContext.Provider, { value, children });
};
const useRouteModal = () => {
  const context = useContext(RouteModalProviderContext);
  if (!context) {
    throw new Error("useRouteModal must be used within a RouteModalProvider");
  }
  return context;
};
const StackedModalContext = createContext(null);
const StackedModalProvider = ({
  children,
  onOpenChange
}) => {
  const [state, setState] = useState({});
  const getIsOpen = (id) => {
    return state[id] || false;
  };
  const setIsOpen = (id, open) => {
    setState((prevState) => ({
      ...prevState,
      [id]: open
    }));
    onOpenChange(open);
  };
  const register = (id) => {
    setState((prevState) => ({
      ...prevState,
      [id]: false
    }));
  };
  const unregister = (id) => {
    setState((prevState) => {
      const newState = { ...prevState };
      delete newState[id];
      return newState;
    });
  };
  return /* @__PURE__ */ jsx(
    StackedModalContext.Provider,
    {
      value: {
        getIsOpen,
        setIsOpen,
        register,
        unregister
      },
      children
    }
  );
};
const useStateAwareTo = (prev) => {
  const location = useLocation();
  const to = useMemo(() => {
    var _a;
    const params = (_a = location.state) == null ? void 0 : _a.restore_params;
    if (!params) {
      return prev;
    }
    return `${prev}?${params.toString()}`;
  }, [location.state, prev]);
  return to;
};
const Root$1 = ({ prev = "..", children }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [stackedModalOpen, onStackedModalOpen] = useState(false);
  const to = useStateAwareTo(prev);
  useEffect(() => {
    setOpen(true);
    return () => {
      setOpen(false);
      onStackedModalOpen(false);
    };
  }, []);
  const handleOpenChange = (open2) => {
    if (!open2) {
      document.body.style.pointerEvents = "auto";
      navigate(to, { replace: true });
      return;
    }
    setOpen(open2);
  };
  return /* @__PURE__ */ jsx(FocusModal, { open, onOpenChange: handleOpenChange, children: /* @__PURE__ */ jsx(RouteModalProvider, { prev: to, children: /* @__PURE__ */ jsx(StackedModalProvider, { onOpenChange: onStackedModalOpen, children: /* @__PURE__ */ jsx(Content, { stackedModalOpen, children }) }) }) });
};
const Content = ({ stackedModalOpen, children }) => {
  const { __internal } = useRouteModal();
  const shouldPreventClose = !__internal.closeOnEscape;
  return /* @__PURE__ */ jsx(
    FocusModal.Content,
    {
      onEscapeKeyDown: shouldPreventClose ? (e) => {
        e.preventDefault();
      } : void 0,
      className: clx({
        "!bg-ui-bg-disabled !inset-x-5 !inset-y-3": stackedModalOpen
      }),
      children
    }
  );
};
const Header$1 = FocusModal.Header;
const Title$1 = FocusModal.Title;
const Description$1 = FocusModal.Description;
const Footer$1 = FocusModal.Footer;
const Body$1 = FocusModal.Body;
const Close$1 = FocusModal.Close;
const RouteFocusModal = Object.assign(Root$1, {
  Header: Header$1,
  Title: Title$1,
  Body: Body$1,
  Description: Description$1,
  Footer: Footer$1,
  Close: Close$1
});
z.object({
  value: z.string().min(1)
});
const createSource = async (data) => {
  try {
    const response = await fetch(`/admin/source`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const res = await response.json();
    return res;
  } catch (error) {
    throw error;
  }
};
const CreateSource = () => {
  const form = useForm();
  const navigate = useNavigate();
  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await createSource({ name: values.value });
      toast.success("Source created successfully");
      navigate("/sources");
    } catch (error) {
      toast.error(
        (error == null ? void 0 : error.message) || "Failed to create source. Please try again."
      );
    }
  });
  return /* @__PURE__ */ jsx(RouteFocusModal, { children: /* @__PURE__ */ jsxs(
    KeyboundForm,
    {
      onSubmit: handleSubmit,
      className: "flex flex-col overflow-hidden",
      children: [
        /* @__PURE__ */ jsx(RouteFocusModal.Header, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-x-2", children: [
          /* @__PURE__ */ jsx(RouteFocusModal.Close, { asChild: true, children: /* @__PURE__ */ jsx(Button, { size: "small", variant: "secondary", children: "Cancel" }) }),
          /* @__PURE__ */ jsx(Button, { size: "small", variant: "primary", type: "submit", children: "Create" })
        ] }) }),
        /* @__PURE__ */ jsxs(RouteFocusModal.Body, { className: "flex flex-col p-20 max-w-[720px] gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex w-full max-w-[720px] flex-col gap-y-8", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Heading, { children: "Create Source" }),
            /* @__PURE__ */ jsx(Text, { weight: "regular", size: "base", children: "Create a new Source to categorize your products" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            Controller,
            {
              rules: {
                required: "Source name is required"
              },
              control: form.control,
              name: "value",
              render: ({ field }) => {
                return /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full gap-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Value" }),
                  /* @__PURE__ */ jsx(Input, { ...field }),
                  /* @__PURE__ */ jsx(ErrorMessage, { field: field.name, form })
                ] });
              }
            }
          ) })
        ] })
      ]
    }
  ) });
};
const SourceGeneralSection = ({ source }) => {
  return /* @__PURE__ */ jsxs(Container, { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsx(Heading, { children: source.name }),
    /* @__PURE__ */ jsx(SourceRowActions, { source })
  ] });
};
const Thumbnail = ({ src, alt, size = "base" }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clx(
        "bg-ui-bg-component border-ui-border-base flex items-center justify-center overflow-hidden rounded border",
        {
          "h-8 w-6": size === "base",
          "h-5 w-4": size === "small"
        }
      ),
      children: src ? /* @__PURE__ */ jsx(
        "img",
        {
          src,
          alt,
          className: "h-full w-full object-cover object-center"
        }
      ) : /* @__PURE__ */ jsx(Photo, { className: "text-ui-fg-subtle" })
    }
  );
};
const ProductCell = ({ product }) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full max-w-[250px] items-center gap-x-3 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "w-fit flex-shrink-0", children: /* @__PURE__ */ jsx(Thumbnail, { src: product.thumbnail }) }),
    /* @__PURE__ */ jsx("span", { title: product.title, className: "truncate", children: product.title })
  ] });
};
const ProductHeader = () => {
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center", children: /* @__PURE__ */ jsx("span", { children: "Product" }) });
};
const PlaceholderCell = () => {
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center", children: /* @__PURE__ */ jsx("span", { className: "text-ui-fg-muted", children: "-" }) });
};
const CollectionCell = ({ collection }) => {
  if (!collection) {
    return /* @__PURE__ */ jsx(PlaceholderCell, {});
  }
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center overflow-hidden", children: /* @__PURE__ */ jsx("span", { className: "truncate", children: collection.title }) });
};
const CollectionHeader = () => {
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center", children: /* @__PURE__ */ jsx("span", { children: "Collection" }) });
};
const SalesChannelsCell = ({
  salesChannels
}) => {
  if (!salesChannels || !salesChannels.length) {
    return /* @__PURE__ */ jsx(PlaceholderCell, {});
  }
  if (salesChannels.length > 2) {
    return /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full items-center gap-x-1 overflow-hidden", children: [
      /* @__PURE__ */ jsx("span", { className: "truncate", children: salesChannels.slice(0, 2).map((sc) => sc.name).join(", ") }),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          content: /* @__PURE__ */ jsx("ul", { children: salesChannels.slice(2).map((sc) => /* @__PURE__ */ jsx("li", { children: sc.name }, sc.id)) }),
          children: /* @__PURE__ */ jsx("span", { className: "text-xs", children: `+ ${salesChannels.length - 2} more` })
        }
      )
    ] });
  }
  const channels = salesChannels.map((sc) => sc.name).join(", ");
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center overflow-hidden max-w-[250px]", children: /* @__PURE__ */ jsx("span", { title: channels, className: "truncate", children: channels }) });
};
const SalesChannelHeader = () => {
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center", children: /* @__PURE__ */ jsx("span", { children: "Sales Channel" }) });
};
const VariantCell = ({ variants }) => {
  if (!variants || !variants.length) {
    return /* @__PURE__ */ jsx(PlaceholderCell, {});
  }
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center overflow-hidden", children: /* @__PURE__ */ jsx("span", { className: "truncate", children: `${variants.length} variants` }) });
};
const VariantHeader = () => {
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center", children: /* @__PURE__ */ jsx("span", { children: "Variants" }) });
};
const StatusCell = ({ color, children }) => {
  return /* @__PURE__ */ jsxs("div", { className: "txt-compact-small text-ui-fg-subtle flex h-full w-full items-center gap-x-2 overflow-hidden", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        role: "presentation",
        className: "flex h-5 w-2 items-center justify-center",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: clx(
              "h-2 w-2 rounded-sm shadow-[0px_0px_0px_1px_rgba(0,0,0,0.12)_inset]",
              {
                "bg-ui-tag-neutral-icon": color === "grey",
                "bg-ui-tag-green-icon": color === "green",
                "bg-ui-tag-red-icon": color === "red",
                "bg-ui-tag-blue-icon": color === "blue",
                "bg-ui-tag-orange-icon": color === "orange",
                "bg-ui-tag-purple-icon": color === "purple"
              }
            )
          }
        )
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "truncate", children })
  ] });
};
const ProductStatusCell = ({ status }) => {
  const [color, text] = {
    draft: ["grey", "Draft"],
    proposed: ["orange", "Proposed"],
    published: ["green", "Published"],
    rejected: ["red", "Rejected"]
  }[status];
  return /* @__PURE__ */ jsx(StatusCell, { color, children: text });
};
const ProductStatusHeader = () => {
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center", children: /* @__PURE__ */ jsx("span", { children: "Status" }) });
};
const columnHelper = createColumnHelper();
const useProductTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.display({
        id: "product",
        header: () => /* @__PURE__ */ jsx(ProductHeader, {}),
        cell: ({ row }) => /* @__PURE__ */ jsx(ProductCell, { product: row.original })
      }),
      columnHelper.accessor("collection", {
        header: () => /* @__PURE__ */ jsx(CollectionHeader, {}),
        cell: ({ row }) => /* @__PURE__ */ jsx(CollectionCell, { collection: row.original.collection })
      }),
      columnHelper.accessor("sales_channels", {
        header: () => /* @__PURE__ */ jsx(SalesChannelHeader, {}),
        cell: ({ row }) => /* @__PURE__ */ jsx(SalesChannelsCell, { salesChannels: row.original.sales_channels })
      }),
      columnHelper.accessor("variants", {
        header: () => /* @__PURE__ */ jsx(VariantHeader, {}),
        cell: ({ row }) => /* @__PURE__ */ jsx(VariantCell, { variants: row.original.variants })
      }),
      columnHelper.accessor("status", {
        header: () => /* @__PURE__ */ jsx(ProductStatusHeader, {}),
        cell: ({ row }) => /* @__PURE__ */ jsx(ProductStatusCell, { status: row.original.status })
      })
    ],
    []
  );
};
const SourceProductSection = ({ source }) => {
  var _a;
  const {
    data: productsData,
    isError,
    error
  } = useQuery({
    queryFn: () => {
      var _a2;
      return sdk.client.fetch(`/admin/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        query: {
          id: ((_a2 = source.product_ids) == null ? void 0 : _a2.length) ? source.product_ids : [""]
        }
      });
    },
    queryKey: ["products"],
    refetchOnMount: "always"
  });
  const columns = useProductTableColumns();
  const table = useDataTable({
    columns,
    data: (productsData == null ? void 0 : productsData.products) || [],
    getRowId: (product) => product.id,
    rowCount: (_a = productsData == null ? void 0 : productsData.products) == null ? void 0 : _a.length,
    isLoading: false,
    pagination: {
      onPaginationChange: () => {
      },
      state: {
        pageIndex: 0,
        pageSize: 50
      }
    }
  });
  if (isError) {
    throw error;
  }
  return /* @__PURE__ */ jsxs(Container, { className: "divide-y p-0", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(Heading, { level: "h2", children: "Products" }) }),
    /* @__PURE__ */ jsx(DataTable, { instance: table, children: /* @__PURE__ */ jsx(
      DataTable.Table,
      {
        emptyState: {
          empty: {
            heading: "No Products",
            description: "There are no products to display."
          }
        }
      }
    ) })
  ] });
};
const SourceDetail = () => {
  const { state } = useLocation();
  return /* @__PURE__ */ jsxs(Container, { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsx(SourceGeneralSection, { source: state }),
    /* @__PURE__ */ jsx(SourceProductSection, { source: state })
  ] });
};
const RouteModalForm = ({
  form,
  blockSearchParams: blockSearch = false,
  children,
  onClose
}) => {
  const {
    formState: { isDirty }
  } = form;
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const { isSubmitSuccessful } = nextLocation.state || {};
    if (isSubmitSuccessful) {
      onClose == null ? void 0 : onClose(true);
      return false;
    }
    const isPathChanged = currentLocation.pathname !== nextLocation.pathname;
    const isSearchChanged = currentLocation.search !== nextLocation.search;
    if (blockSearch) {
      const ret2 = isDirty && (isPathChanged || isSearchChanged);
      if (!ret2) {
        onClose == null ? void 0 : onClose(isSubmitSuccessful);
      }
      return ret2;
    }
    const ret = isDirty && isPathChanged;
    if (!ret) {
      onClose == null ? void 0 : onClose(isSubmitSuccessful);
    }
    return ret;
  });
  const handleCancel = () => {
    var _a;
    (_a = blocker == null ? void 0 : blocker.reset) == null ? void 0 : _a.call(blocker);
  };
  const handleContinue = () => {
    var _a;
    (_a = blocker == null ? void 0 : blocker.proceed) == null ? void 0 : _a.call(blocker);
    onClose == null ? void 0 : onClose(false);
  };
  return /* @__PURE__ */ jsxs(Form$1, { ...form, children: [
    children,
    /* @__PURE__ */ jsx(Prompt, { open: blocker.state === "blocked", variant: "confirmation", children: /* @__PURE__ */ jsxs(Prompt.Content, { children: [
      /* @__PURE__ */ jsxs(Prompt.Header, { children: [
        /* @__PURE__ */ jsx(Prompt.Title, { children: "Are you sure you want to leave this form?" }),
        /* @__PURE__ */ jsx(Prompt.Description, { children: "You have unsaved changes that will be lost if you exit this form." })
      ] }),
      /* @__PURE__ */ jsxs(Prompt.Footer, { children: [
        /* @__PURE__ */ jsx(Prompt.Cancel, { onClick: handleCancel, type: "button", children: "Cancel" }),
        /* @__PURE__ */ jsx(Prompt.Action, { onClick: handleContinue, type: "button", children: "Continue" })
      ] })
    ] }) })
  ] });
};
const Root = ({ prev = "..", children }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [stackedModalOpen, onStackedModalOpen] = useState(false);
  useEffect(() => {
    setOpen(true);
    return () => {
      setOpen(false);
      onStackedModalOpen(false);
    };
  }, []);
  const handleOpenChange = (open2) => {
    if (!open2) {
      document.body.style.pointerEvents = "auto";
      navigate(prev, { replace: true });
      return;
    }
    setOpen(open2);
  };
  return /* @__PURE__ */ jsx(Drawer, { open, onOpenChange: handleOpenChange, children: /* @__PURE__ */ jsx(RouteModalProvider, { prev, children: /* @__PURE__ */ jsx(StackedModalProvider, { onOpenChange: onStackedModalOpen, children: /* @__PURE__ */ jsx(
    Drawer.Content,
    {
      "aria-describedby": void 0,
      className: clx({
        "!bg-ui-bg-disabled !inset-y-5 !right-5": stackedModalOpen
      }),
      children
    }
  ) }) }) });
};
const Header = Drawer.Header;
const Title = Drawer.Title;
const Description = Drawer.Description;
const Body = Drawer.Body;
const Footer = Drawer.Footer;
const Close = Drawer.Close;
const Form = RouteModalForm;
const RouteDrawer = Object.assign(Root, {
  Header,
  Title,
  Body,
  Description,
  Footer,
  Close,
  Form
});
const editSource = async (data) => {
  try {
    const response = await fetch(`/admin/source/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const res = await response.json();
    return res;
  } catch (error) {
    throw error;
  }
};
const SourceEdit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const form = useForm({
    defaultValues: {
      name: state.name
    }
  });
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await editSource({
        name: data.name,
        id: state.id
      });
      toast.success("Source updated successfully");
      navigate(`/sources`);
    } catch (error) {
      toast.error(
        (error == null ? void 0 : error.message) || "Failed to update source. Please try again."
      );
    }
  });
  return /* @__PURE__ */ jsx(RouteDrawer, { children: /* @__PURE__ */ jsxs(
    KeyboundForm,
    {
      onSubmit: handleSubmit,
      className: "flex flex-col overflow-hidden flex-1",
      children: [
        /* @__PURE__ */ jsx(RouteDrawer.Header, { children: /* @__PURE__ */ jsx(Heading, { children: "Edit Source" }) }),
        /* @__PURE__ */ jsx(RouteDrawer.Body, { className: "flex flex-1 flex-col gap-y-8 overflow-y-auto", children: /* @__PURE__ */ jsx(
          Controller,
          {
            rules: {
              required: "Source name is required"
            },
            control: form.control,
            name: "name",
            render: ({ field }) => {
              return /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full gap-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Name" }),
                /* @__PURE__ */ jsx(Input, { ...field }),
                /* @__PURE__ */ jsx(ErrorMessage, { field: field.name, form })
              ] });
            }
          }
        ) }),
        /* @__PURE__ */ jsx(RouteDrawer.Footer, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-x-2", children: [
          /* @__PURE__ */ jsx(RouteDrawer.Close, { asChild: true, children: /* @__PURE__ */ jsx(Button, { size: "small", variant: "secondary", children: "Cancel" }) }),
          /* @__PURE__ */ jsx(Button, { size: "small", type: "submit", children: "Save" })
        ] }) })
      ]
    }
  ) });
};
const widgetModule = { widgets: [
  {
    Component: SourceWidget,
    zone: ["product.details.side.after"]
  }
] };
const routeModule = {
  routes: [
    {
      Component: SourcePage,
      path: "/sources"
    },
    {
      Component: CreateSource,
      path: "/sources/create"
    },
    {
      Component: SourceDetail,
      path: "/sources/detail"
    },
    {
      Component: SourceEdit,
      path: "/sources/edit"
    },
    {
      Component: SourceList,
      path: "/sources/list"
    }
  ]
};
const menuItemModule = {
  menuItems: [
    {
      label: config.label,
      icon: void 0,
      path: "/sources",
      nested: void 0
    }
  ]
};
const formModule = { customFields: {} };
const displayModule = {
  displays: {}
};
const plugin = {
  widgetModule,
  routeModule,
  menuItemModule,
  formModule,
  displayModule
};
export {
  plugin as default
};
