
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  label?: string;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  buttonText?: string;
  helpText?: string;
}

export function FileUpload({
  onFileSelect,
  label = "Upload file",
  acceptedFileTypes = "*",
  maxSizeMB = 10,
  buttonText = "Select file",
  helpText,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;

    if (!files || files.length === 0) {
      setSelectedFile(null);
      return;
    }

    const file = files[0];
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds the ${maxSizeMB}MB limit`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Button 
            type="button"
            variant="outline"
            onClick={handleButtonClick}
          >
            {buttonText}
          </Button>
          <span className="text-sm text-muted-foreground">
            {selectedFile ? selectedFile.name : "No file selected"}
          </span>
        </div>
        <Input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          className="hidden"
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {helpText && !error && (
          <p className="text-sm text-muted-foreground">{helpText}</p>
        )}
      </div>
    </div>
  );
}
