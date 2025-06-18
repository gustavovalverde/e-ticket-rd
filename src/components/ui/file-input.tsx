import { Upload, FileIcon, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FileInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  onFileChange?: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  placeholder?: string;
  error?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      className,
      onFileChange,
      accept = ".json",
      maxSize,
      placeholder = "Choose a file or drag it here",
      error,
      disabled,
      ...props
    },
    ref
  ) => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [isDragOver, setIsDragOver] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => {
      if (!inputRef.current) {
        // Create a temporary input element as fallback
        const tempInput = document.createElement("input");
        tempInput.type = "file";
        return tempInput;
      }
      return inputRef.current;
    }, []);

    const handleFileChange = (file: File | null) => {
      setSelectedFile(file);
      onFileChange?.(file);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;

      if (file && maxSize && file.size > maxSize) {
        // Clear the input
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setSelectedFile(null);
        onFileChange?.(null);
        return;
      }

      handleFileChange(file);
    };

    const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const file = event.dataTransfer.files?.[0] || null;

      if (file && maxSize && file.size > maxSize) {
        return;
      }

      if (file && accept) {
        const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
        if (!accept.includes(fileExtension)) {
          return;
        }
      }

      if (inputRef.current) {
        const dataTransfer = new DataTransfer();
        if (file) dataTransfer.items.add(file);
        inputRef.current.files = dataTransfer.files;
      }

      handleFileChange(file);
    };

    const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    };

    const handleDragLeave = (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);
    };

    const handleClear = (event?: React.MouseEvent) => {
      if (event) {
        event.stopPropagation();
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      handleFileChange(null);
    };

    const handleClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      if (!disabled) {
        inputRef.current?.click();
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      // Handle Enter and Space keys for keyboard accessibility
      if (!disabled && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopPropagation();
        inputRef.current?.click();
      }
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      // Use explicit bounds checking to avoid linter issues
      let sizeUnit: string;
      if (i >= 3) {
        sizeUnit = "GB";
      } else if (i >= 2) {
        sizeUnit = "MB";
      } else if (i >= 1) {
        sizeUnit = "KB";
      } else {
        sizeUnit = "Bytes";
      }

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizeUnit}`;
    };

    return (
      <div className="space-y-2">
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={
            selectedFile ? `Selected file: ${selectedFile.name}` : placeholder
          }
          aria-describedby={error ? "file-input-error" : undefined}
          aria-disabled={disabled}
          className={cn(
            "border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-4 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            isDragOver && "border-primary bg-primary/10",
            error && "border-destructive",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            onBlur={(e) => e.stopPropagation()}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            disabled={disabled}
            {...props}
          />

          {selectedFile ? (
            <div className="flex items-center space-x-2">
              <FileIcon className="text-primary h-8 w-8" />
              <div className="text-left">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-muted-foreground text-xs">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  handleClear(e);
                }}
                className="ml-auto h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="text-muted-foreground mx-auto h-8 w-8" />
              <div className="space-y-1">
                <p className="text-sm font-medium">{placeholder}</p>
                <p className="text-muted-foreground text-xs">
                  {accept && `Accepted formats: ${accept}`}
                  {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p id="file-input-error" className="text-destructive text-sm">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };
