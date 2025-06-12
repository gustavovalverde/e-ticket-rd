"use client";

import { FileText, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QRCodeDisplayProps {
  data: string;
  size?: number;
}

export function QRCodeDisplay({ data, size: _size = 200 }: QRCodeDisplayProps) {
  const downloadQRCode = () => {
    // TODO: Implement QR code download functionality
    // eslint-disable-next-line no-console
    console.log("Download QR code:", data);
  };

  return (
    <Card>
      <CardContent className="section-title-gap-lg flex flex-col items-center text-center">
        {/* QR Code Placeholder - Will implement qrcode.react later */}
        <div className="bg-card border-border flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed p-4 shadow-sm">
          <div className="text-center">
            <FileText className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
            <p className="text-muted-foreground text-sm">QR Code</p>
            <p className="text-muted-foreground text-xs">Generated Here</p>
          </div>
        </div>

        <div className="section-title-gap-sm">
          <p className="text-muted-foreground text-sm">
            CÓDIGO QR DE USO EXCLUSIVO PARA VALIDACIÓN ADUANAL
          </p>
          <Button
            variant="outline"
            onClick={downloadQRCode}
            className="text-sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
