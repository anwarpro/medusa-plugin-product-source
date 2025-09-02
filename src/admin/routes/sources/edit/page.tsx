import { Button, Heading, Input, Label, toast } from "@medusajs/ui";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { RouteDrawer } from "../../../components/common/modals/route-drawer";
import { KeyboundForm } from "../../../components/common/keybound-form";
import ErrorMessage from "../../../components/common/ErrorMessage";

const editSource = async (data: { name: string; id: string }) => {
  try {
    const response = await fetch(`/admin/source/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
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

const SourceEdit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const form = useForm({
    defaultValues: {
      name: state.name,
    },
  });
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await editSource({
        name: data.name,
        id: state.id,
      });
      toast.success("Source updated successfully");
      navigate(`/sources`);
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to update source. Please try again."
      );
    }
  });

  return (
    <RouteDrawer>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-col overflow-hidden flex-1"
      >
        <RouteDrawer.Header>
          <Heading>Edit Source</Heading>
        </RouteDrawer.Header>
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-y-auto">
          <Controller
            rules={{
              required: "Source name is required",
            }}
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <div className="flex flex-col w-full gap-2">
                  <Label>Name</Label>
                  <Input {...field} />
                  <ErrorMessage field={field.name} form={form} />
                </div>
              );
            }}
          />
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                Cancel
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit">
              Save
            </Button>
          </div>
        </RouteDrawer.Footer>
        {/* {brand ? <EditBrandForm Brand={brand} /> : <div>Loading...</div>} */}
      </KeyboundForm>
    </RouteDrawer>
  );
};

export default SourceEdit;
