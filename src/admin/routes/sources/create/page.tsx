import { Button, Heading, Input, Label, Text, toast } from "@medusajs/ui";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { z } from "zod";
import { RouteFocusModal } from "../../../components/common/modals";
import { KeyboundForm } from "../../../components/common/keybound-form";
import ErrorMessage from "../../../components/common/ErrorMessage";

const CreateProductTypeSchema = z.object({
  value: z.string().min(1),
});

// Define the type for form values
type FormValues = z.infer<typeof CreateProductTypeSchema>;

const createSource = async (data: { name: string }) => {
  try {
    const response = await fetch(`/admin/source`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    return res;
  } catch (error) {
    throw error;
  }
};

const CreateSource = () => {
  const form = useForm<FormValues>();
  const navigate = useNavigate();

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await createSource({ name: values.value });
      toast.success("Source created successfully");
      navigate("/sources");
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to create source. Please try again."
      );
    }
  });

  return (
    <RouteFocusModal>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                Cancel
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" variant="primary" type="submit">
              Create
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-col p-20 max-w-[720px] gap-4">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>Create Source</Heading>
              <Text weight="regular" size="base">
                Create a new Source to categorize your products
              </Text>
            </div>
          </div>
          <div>
            <Controller
              rules={{
                required: "Source name is required",
              }}
              control={form.control}
              name="value"
              render={({ field }) => {
                return (
                  <div className="flex flex-col w-full gap-2">
                    <Label>Value</Label>
                    <Input {...field} />
                    <ErrorMessage field={field.name} form={form} />
                  </div>
                );
              }}
            />
          </div>
        </RouteFocusModal.Body>
      </KeyboundForm>
    </RouteFocusModal>
  );
};

export default CreateSource;
