import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HttpTypes } from "@medusajs/framework/types";
import { Button, Drawer, Heading, Label, toast } from "@medusajs/ui";
import { Controller, useForm } from "react-hook-form";
import { PencilSquare } from "@medusajs/icons";
import { sdk } from "../../../../utils/sdk";
import { KeyboundForm } from "../../../../components/common/keybound-form";
import SelectComponent from "../../../../components/common/select";
import ErrorMessage from "../../../../components/common/ErrorMessage";

const AddProductSource = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data } = useQuery<HttpTypes.AdminProduct | any>({
    queryFn: () =>
      sdk.client.fetch(`/admin/products/${params?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          query: {
            fields: "source.*",
          },
        }
      ),
    queryKey: ["productsSource"],
    refetchOnMount: "always",
  });

  const { data: sources } = useQuery<HttpTypes.AdminProduct | any>({
    queryFn: () =>
      sdk.client.fetch(`/admin/source`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    queryKey: ["sources"],
    refetchOnMount: "always",
  });

  const form = useForm({
    defaultValues: {
      source: data?.product?.source?.id,
    },
  });

  const handleSubmit = async ({ source }: { source: string }) => {
    try {
      const productUpdate =
        await sdk.client.fetch<HttpTypes.AdminProductResponse>(
          `/admin/products/${data?.product?.id}`,
          {
            method: "POST",
            body: {
              additional_data: {
                source_id: source || null,
                old_source_id: data?.product?.source?.id ?? null,
              },
            },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

      navigate(0);
      toast.success("Source edited successfully...");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong...");
    }
  };
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">Product Source</Heading>
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
              <Drawer.Title>Edit Product Source</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-4 flex flex-1">
              <Controller
                rules={{
                  required: "Source is required",
                }}
                control={form.control}
                name="source"
                render={({ field }) => {
                  return (
                    <div className="flex flex-col w-full gap-2">
                      <Label>Name</Label>
                      <SelectComponent
                        defaultValue={data?.product?.source?.id}
                        sourceList={sources.sources}
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

export default AddProductSource;
