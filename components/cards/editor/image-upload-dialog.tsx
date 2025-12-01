"use client";

import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ImageConfig } from "@/types/card";
import { ZoomIn, ZoomOut, Upload as UploadIcon } from "lucide-react";
import Cropper, { Area } from "react-easy-crop";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  currentImage?: string | ImageConfig;
  onSave: (config: ImageConfig) => void;
  aspectRatio?: number; // 1 for square, 16/9 for cover
}

// Helper function to create cropped image
const createCroppedImage = async (
  imageSrc: string,
  pixelCrop: Area,
): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(URL.createObjectURL(blob));
      }
    }, 'image/jpeg', 0.95);
  });
};

export function ImageUploadDialog({
  open,
  onOpenChange,
  title,
  currentImage,
  onSave,
  aspectRatio = 1,
}: ImageUploadDialogProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    if (typeof currentImage === 'string') {
      setImageUrl(currentImage);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } else if (currentImage) {
      // If it's already an ImageConfig, just use the URL
      setImageUrl(currentImage.url);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } else {
      setImageUrl("");
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    }
  }, [currentImage, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageUrl) return;

    try {
      const croppedImageUrl = await createCroppedImage(imageUrl, croppedAreaPixels);

      onSave({
        url: croppedImageUrl,
        zoom: 1, // Reset since we're saving cropped image
        x: 50,
        y: 50,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!imageUrl ? (
            <div className="flex h-96 w-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
              <div className="text-center space-y-4">
                <UploadIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                    Upload Image
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">PNG, JPG, or WEBP (max. 5MB)</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative h-96 w-full rounded-lg overflow-hidden bg-black/5">
                <Cropper
                  image={imageUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  style={{
                    containerStyle: {
                      borderRadius: '0.5rem',
                    },
                  }}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <ZoomOut className="h-4 w-4 text-muted-foreground" />
                    Zoom
                  </Label>
                  <span className="text-xs text-muted-foreground font-medium">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Slider
                    value={[zoom]}
                    min={1}
                    max={3}
                    step={0.1}
                    onValueChange={([val]: number[]) => setZoom(val)}
                    className="flex-1"
                  />
                  <ZoomIn className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Drag the image to reposition • Scroll or use slider to zoom
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <Button variant="outline" size="sm" onClick={() => document.getElementById('file-upload-replace')?.click()}>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Replace Image
                </Button>
                <input
                  id="file-upload-replace"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={() => {
              onSave({ url: '', zoom: 1, x: 50, y: 50 });
              onOpenChange(false);
            }}
            disabled={!imageUrl}
          >
            Remove Image
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!imageUrl}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
