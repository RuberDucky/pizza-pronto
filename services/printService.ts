import * as Print from 'expo-print';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Order } from './orderService';
import { formatDate } from '../utils/dateUtils';
import QRCode from 'qrcode';

// Constants
const PRINTER_IP = '192.168.178.200';
const PRINTER_MAC = '00:26:AB:7E:51:98';

/**
 * Formats order data as a thermal printer receipt
 */
const formatReceiptContent = async (order: Order): Promise<string> => {
  // Generate QR code with customer information
  const customerInfo = {
    name: order.customerInfo.name,
    phone: order.customerInfo.phone,
    address: `${order.customerInfo.street} ${order.customerInfo.houseNumber}, ${order.customerInfo.postalCode} ${order.customerInfo.city}`,
    floor: order.customerInfo.floor || '',
  };

  const qrCodeData = await QRCode.toDataURL(JSON.stringify(customerInfo));

  // Format order items
  const orderItems = order.orderItems
    .map(
      (item) => `
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <span>${item.quantity}x ${item.name} (${item.size})</span>
      <span>€${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `
    )
    .join('');

  // Format receipt HTML - styled for thermal printer
  return `
    <html>
      <head>
        <meta name="viewport" content="width=300, initial-scale=1.0">
        <style>
          body {
            font-family: 'Courier New', Courier, monospace;
            width: 280px;
            padding: 10px;
            font-size: 12px;
          }
          .header {
            text-align: center;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .divider {
            border-top: 1px dashed #000;
            margin: 10px 0;
          }
          .text-bold {
            font-weight: bold;
          }
          .text-center {
            text-align: center;
          }
          .flex-between {
            display: flex;
            justify-content: space-between;
          }
          .qr-code {
            display: block;
            margin: 15px auto;
            width: 100px;
            height: 100px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="font-size: 16px; margin: 5px 0;">ORDER RECEIPT</h1>
          <p>Order #${order._id}</p>
          <p>${formatDate(order.createdAt)}</p>
        </div>
        
        <div class="divider"></div>
        
        <div>
          <p class="text-bold">CUSTOMER INFORMATION:</p>
          <p>${order.customerInfo.name}<br />
          ${order.customerInfo.phone}<br />
          ${order.customerInfo.street} ${order.customerInfo.houseNumber}
          ${order.customerInfo.floor ? `, Floor: ${order.customerInfo.floor}` : ''}
          <br />${order.customerInfo.postalCode} ${order.customerInfo.city}</p>
        </div>
        
        <div class="divider"></div>
        
        <div>
          <p class="text-bold">ORDER ITEMS:</p>
          ${orderItems}
        </div>
        
        <div class="divider"></div>
        
        <div>
          <div class="flex-between">
            <span>Subtotal:</span>
            <span>€${order.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div class="flex-between">
            <span>Tax:</span>
            <span>€${order.totalTax?.toFixed(2) || '0.00'}</span>
          </div>
          <div class="flex-between text-bold">
            <span>TOTAL:</span>
            <span>€${order.grandTotal?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
        
        ${
          order.specialInstructions
            ? `
          <div class="divider"></div>
          <div>
            <p class="text-bold">SPECIAL INSTRUCTIONS:</p>
            <p>${order.specialInstructions}</p>
          </div>
        `
            : ''
        }
        
        <div class="divider"></div>
        
        <div class="text-center">
          <p class="text-bold">Scan for customer info:</p>
          <img src="${qrCodeData}" class="qr-code" />
        </div>
        
        <p class="text-center">Thank you for your order!</p>
      </body>
    </html>
  `;
};

/**
 * Print order to Epson POS printer
 */
export const printReceipt = async (order: Order): Promise<void> => {
  try {
    // Format receipt content
    const receiptContent = await formatReceiptContent(order);

    // Handle printing based on platform
    if (Platform.OS === 'web') {
      // For web, open in a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(receiptContent);
        printWindow.document.close();
        printWindow.print();
      } else {
        throw new Error('Could not open print window');
      }
    } else {
      // For native platforms
      // First generate PDF file
      const { uri } = await Print.printToFileAsync({ html: receiptContent });

      // Send to printer via IP address
      if (Platform.OS === 'ios') {
        // iOS implementation using AirPrint
        await Print.printAsync({
          uri,
          printerUrl: `ipp://${PRINTER_IP}/ipp/print`,
        });
      } else {
        // Android implementation
        // This would typically use a native module for ESC/POS printing
        // For this example, we're showing a simplified approach

        // The complete solution would require a native module that handles
        // ESC/POS commands directly to the printer over TCP/IP
        // Example using fetch to send to a print server:
        const fileInfo = await FileSystem.getInfoAsync(uri);

        if (fileInfo.exists) {
          const fileContent = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Send to a hypothetical print server or native module
          // This is a placeholder - you'd need actual implementation for your printer
          await fetch(`http://${PRINTER_IP}/print`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/pdf',
              'X-Printer-Mac': PRINTER_MAC,
            },
            body: fileContent,
          });
        }
      }

      // Clean up the temp file
      await FileSystem.deleteAsync(uri, { idempotent: true });
    }
  } catch (error) {
    console.error('Printing failed:', error);
    throw error;
  }
};
