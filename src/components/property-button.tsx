"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import PropertyForm from "./property-form";
import { useState } from "react";
import { flushSync } from "react-dom";

type PropertyButtonProps = {
  actionType: "add" | "edit" | "checkout";
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};

export default function PropertyButton({
  actionType,
  disabled,
  onClick,
  children,
}: PropertyButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (actionType === "checkout") {
    return (
      <Button variant="default" disabled={disabled} onClick={onClick}>
        {children}
      </Button>
    );
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        {actionType === "add" ? (
          <Button size="icon">
            <PlusIcon className="h-6 w-6" />
          </Button>
        ) : (
          <Button variant="secondary">{children}</Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "add" ? "Add a new property" : "Edit property"}
          </DialogTitle>
        </DialogHeader>

        <PropertyForm
          actionType={actionType}
          onFormSubmission={() => {
            flushSync(() => {
              setIsFormOpen(false);
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
