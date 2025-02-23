import { Button } from "./ui/button";

type PropertyFormBtnProps = {
  actionType: "add" | "edit";
};

export default function PropertyFormBtn({ actionType }: PropertyFormBtnProps) {
  return (
    <Button type="submit" className="mt-5 self-end">
      {actionType === "add" ? "Add a new property" : "Edit property"}
    </Button>
  );
}
