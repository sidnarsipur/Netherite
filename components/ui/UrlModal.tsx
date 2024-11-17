// UrlModal.tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

type UrlModalProps = {
  onSubmit: (url: string) => void;
};

export function UrlModal({ onSubmit }: UrlModalProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    onSubmit(url);
    setUrl(""); // Clear the input after submission
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button size="sm" variant="ghost">
          <Image className="h-6 w-6" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-300 p-6 shadow-lg">
          <Dialog.Title className="text-lg font-bold text-gray-600">
            Image URL
          </Dialog.Title>
          <Dialog.Description className="mb-4 mt-2 text-sm text-gray-600">
            Please enter the URL for the image.
          </Dialog.Description>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-md border p-2"
            placeholder="https://example.com"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button size="sm" variant="secondary">
                Cancel
              </Button>
            </Dialog.Close>
            <Button size="sm" variant="default" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
