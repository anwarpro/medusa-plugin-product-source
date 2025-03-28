import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HttpTypes } from "@medusajs/framework/types";
import { Button, Drawer, Heading, Label, toast } from "@medusajs/ui";
import { Controller, useForm } from "react-hook-form";
import { PencilSquare } from "@medusajs/icons";
import { sdk } from "../../../../../utils/sdk";
import { KeyboundForm } from "../../../../../components/common/keybound-form";
import SelectComponent from "../../../../../components/common/select";
import ErrorMessage from "../../../../../components/common/ErrorMessage";

const AddProductBrand = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data } = useQuery<HttpTypes.AdminProduct | any>({
    queryFn: () =>
      sdk.client.fetch(`/admin/products/${params?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        query: {
          fields: "brand.*",
        },
      }),
    queryKey: ["products"],
    refetchOnMount: "always",
  });

  const { data: brands } = useQuery<HttpTypes.AdminProduct | any>({
    queryFn: () =>
      sdk.client.fetch(`/admin/brand`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    queryKey: ["brands"],
    refetchOnMount: "always",
  });

  const form = useForm({
    defaultValues: {
      brand: data?.product?.brand?.id,
    },
  });

  const handleSubmit = async ({ brand }: { brand: string }) => {
    try {
      const productUpdate =
        await sdk.client.fetch<HttpTypes.AdminProductResponse>(
          `/admin/products/${data?.product?.id}`,
          {
            method: "POST",
            body: {
              additional_data: {
                brand_id: brand || null,
                old_brand_id: data?.product?.brand?.id ?? null,
              },
            },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

      navigate(0);
      toast.success("Brand edited successfully...");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong...");
    }
  };
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">Product Brand</Heading>
      <Drawer>
        <Drawer.Trigger asChild>
          <Button variant="primary">
            <PencilSquare />
          </Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <KeyboundForm
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-1 flex-col"
          >
            <Drawer.Header>
              <Drawer.Title>Edit Product Brand</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-4 flex flex-1">
              <Controller
                rules={{
                  required: "Brand is required",
                }}
                control={form.control}
                name="brand"
                render={({ field }) => {
                  return (
                    <div className="flex flex-col w-full gap-2">
                      <Label>Name</Label>
                      <SelectComponent
                        defaultValue={data?.product?.brand?.id}
                        brandList={brands.brands}
                        field={field as any}
                        {...field}
                      />
                      <ErrorMessage field={field.name} form={form} />
                    </div>
                  );
                }}
              />
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Drawer.Close>
              <Button type="submit">Save</Button>
            </Drawer.Footer>
          </KeyboundForm>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};

export default AddProductBrand;
