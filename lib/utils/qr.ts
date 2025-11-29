import QRCode from 'qrcode';

export interface QRCodeOptions {
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  color?: {
    dark?: string;
    light?: string;
  };
  margin?: number;
}

export async function generateQRCode(
  data: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const {
    size = 512,
    errorCorrectionLevel = 'H',
    color = { dark: '#000000', light: '#FFFFFF' },
    margin = 4,
  } = options;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: size,
      errorCorrectionLevel,
      color,
      margin,
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

export async function generateQRCodeBuffer(
  data: string,
  options: QRCodeOptions = {}
): Promise<Buffer> {
  const {
    size = 512,
    errorCorrectionLevel = 'H',
    color = { dark: '#000000', light: '#FFFFFF' },
    margin = 4,
  } = options;

  try {
    const buffer = await QRCode.toBuffer(data, {
      width: size,
      errorCorrectionLevel,
      color,
      margin,
    });

    return buffer;
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

// Generate high-resolution QR code for printing (300 DPI)
export async function generatePrintQRCode(
  data: string,
  sizeInInches: number = 3
): Promise<Buffer> {
  const dpi = 300;
  const sizeInPixels = sizeInInches * dpi;

  return generateQRCodeBuffer(data, {
    size: sizeInPixels,
    errorCorrectionLevel: 'H',
    margin: 1,
  });
}

