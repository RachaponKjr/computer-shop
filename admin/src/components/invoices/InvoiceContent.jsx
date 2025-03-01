import React from 'react';

const formatNumber = (num) => {
  return num.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  return `${date.getDate()} เดือน ${months[date.getMonth()]} พ.ศ. ${date.getFullYear() + 543}`;
};

const renderImage = (item) => {
  if (item.image instanceof File) {
    return (
      <img
        src={URL.createObjectURL(item.image)}
        alt={item.description}
        className="h-16 w-16 object-cover rounded"
      />
    );
  }
  
  if (typeof item.image === 'string' && item.image.trim() !== '') {
    return (
      <img
        src={item.image}
        alt={item.description}
        className="h-16 w-16 object-cover rounded"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiPjwvcG9seWxpbmU+PC9zdmc+';
        }}
      />
    );
  }

  return (
    <div className="h-16 w-16 flex items-center justify-center bg-gray-50 text-gray-400 text-xs rounded">
      ไม่มีภาพ
    </div>
  );
};

export const InvoiceHeader = () => (
  <div className="text-center mb-6">
    <h1 className="text-2xl font-bold mb-2">เอ อาร์ คอมพิวเตอร์</h1>
    <p className="text-sm">อาคาร ไอทีพลาซ่า 324 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดนครราชสีมา 30000</p>
    <p className="text-sm">โทร/FAX (044) 005540, 081-2664815</p>
    <p className="text-sm">เลขประจำตัวผู้เสียภาษี 3 3602 00346 01 8</p>
  </div>
);

export const InvoiceTitle = () => (
  <div className="text-center bg-blue-700 text-white py-2 mb-4 print:bg-blue-700">
    <h1 className="text-xl font-semibold [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
      ใบส่งของ / ใบกำกับภาษี
    </h1>
  </div>
);

export const InvoiceDetails = ({ customerName, address, invoiceNumber, date }) => (
  <div className="mb-4 grid grid-cols-2">
    <div>
      <p className="text-sm mb-1">นามผู้ซื้อ: {customerName}</p>
      <p className="text-sm">ที่อยู่: {address}</p>
    </div>
    <div className="text-right">
      <p className="text-sm">เลขที่: {invoiceNumber}</p>
      <p className="text-sm">วันที่ {formatDate(date)}</p>
    </div>
  </div>
);

export const InvoiceTable = ({ items }) => (
  <div className="overflow-x-auto mb-6">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
          <th className="py-2 px-2 border text-center">ลำดับ</th>
          <th className="py-2 px-2 border">รายการสินค้า</th>
          <th className="py-2 px-2 border text-center">ภาพสินค้า</th>
          <th className="py-2 px-2 border text-center">จำนวน</th>
          <th className="py-2 px-2 border text-right">ราคา/หน่วย<br/>(ไม่รวม VAT)</th>
          <th className="py-2 px-2 border text-right">ราคา/หน่วย<br/>(รวม VAT)</th>
          <th className="py-2 px-2 border text-right">จำนวนเงิน</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => {
          const priceBeforeVat = item.unitPrice / 1.07;
          return (
            <tr key={item.id || index} className="border-b">
              <td className="py-2 px-2 border text-center">{index + 1}</td>
              <td className="py-2 px-2 border">
                <div>
                  <div className="font-medium">{item.description}</div>
                  {item.specifications && (
                    <div className="text-sm text-gray-600 whitespace-pre-line mt-1">
                      {item.specifications}
                    </div>
                  )}
                </div>
              </td>
              <td className="py-2 px-2 border text-center">
                {renderImage(item)}
              </td>
              <td className="py-2 px-2 border text-center">{item.quantity}</td>
              <td className="py-2 px-2 border text-right">{formatNumber(priceBeforeVat)}</td>
              <td className="py-2 px-2 border text-right">{formatNumber(item.unitPrice)}</td>
              <td className="py-2 px-2 border text-right">{formatNumber(item.total)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// utility function to convert numbers to Thai text
const THAI_NUMBERS = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const THAI_UNITS = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

const convertToThaiText = (num) => {
  if (num === 0) return 'ศูนย์บาทถ้วน';
  
  let text = '';
  const parts = Math.abs(num).toFixed(2).split('.');
  const integerPart = parseInt(parts[0]);
  const decimalPart = parseInt(parts[1]);

  // Convert integer part
  const convertGroup = (n) => {
    let str = '';
    const digits = n.toString().split('').map(Number);
    digits.forEach((digit, index) => {
      if (digit !== 0) {
        if (digit === 1 && index === digits.length - 2) {
          str += 'สิบ';
        } else if (digit === 2 && index === digits.length - 2) {
          str += 'ยี่สิบ';
        } else {
          str += THAI_NUMBERS[digit] + THAI_UNITS[digits.length - 1 - index];
        }
      }
    });
    return str;
  };

  if (integerPart > 0) {
    if (integerPart >= 1000000) {
      const millions = Math.floor(integerPart / 1000000);
      text += convertGroup(millions) + 'ล้าน';
      const remainder = integerPart % 1000000;
      if (remainder > 0) {
        text += convertGroup(remainder);
      }
    } else {
      text += convertGroup(integerPart);
    }
    text += 'บาท';
  }

  // Convert decimal part
  if (decimalPart > 0) {
    text += convertGroup(decimalPart) + 'สตางค์';
  } else {
    text += 'ถ้วน';
  }

  return text;
};

export const InvoiceSummary = ({ subtotal, vat, total }) => (
  <div className="space-y-4">
    <div className="w-full flex justify-end">
      <div className="w-full grid grid-cols-2">
        <div className="text-sm">
          <div className="text-center">จำนวนเงินทั้งสิ้น (ตัวอักษร)</div>
          <div className="bg-blue-50 p-2 mx-4 font-semibold text-center [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
            {convertToThaiText(total)}
          </div>
        </div>
        <div className="w-64 justify-self-end">
          <div className="grid grid-cols-2 gap-2 text-sm border-t pt-2">
            <div className="text-right font-semibold">มูลค่าสินค้า:</div>
            <div className="text-right tabular-nums">{formatNumber(subtotal)}</div>
            
            <div className="text-right font-semibold">ภาษีมูลค่าเพิ่ม 7%:</div>
            <div className="text-right tabular-nums">{formatNumber(vat)}</div>
            
            <div className="text-right font-semibold text-lg border-t pt-2">รวมทั้งสิ้น:</div>
            <div className="text-right tabular-nums text-lg font-bold border-t pt-2">
              {formatNumber(total)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const InvoiceSignatures = () => (
  <div className="border-t border-gray-300 mt-8 pt-8">
    <div className="grid grid-cols-2 gap-8 text-sm">
      <div className="text-left">
        <div className="mb-8 text-center">ลงชื่อ ................................................ ผู้รับสินค้า</div>
        <div className="text-center">วันที่ .......................................................................</div>
      </div>
      <div className="text-right">
        <div className="mb-8 text-center">ลงชื่อ ................................................ ผู้ส่งสินค้า</div>
        <div className="text-center">(...........................................................................)</div>
      </div>
    </div>
  </div>
);

export { formatNumber, formatDate };