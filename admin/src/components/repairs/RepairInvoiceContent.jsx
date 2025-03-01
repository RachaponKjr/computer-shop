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
  return `${date.getDate()} ${months[date.getMonth()]} พ.ศ. ${date.getFullYear() + 543}`;
};

export const RepairInvoiceHeader = () => (
  <div className="text-center mb-4 sm:mb-6 px-4">
    <h1 className="text-xl sm:text-2xl font-bold mb-2">เอ อาร์ คอมพิวเตอร์</h1>
    <p className="text-xs sm:text-sm">อาคาร ไอทีพลาซ่า 324 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดนครราชสีมา 30000</p>
    <p className="text-xs sm:text-sm">โทร/FAX (044) 005540, 081-2664815</p>
    <p className="text-xs sm:text-sm">เลขประจำตัวผู้เสียภาษี 3 3602 00346 01 8</p>
  </div>
);

export const RepairInvoiceTitle = () => (
  <div className="text-center bg-blue-700 text-white py-2 mb-4 px-2">
    <h1 className="text-lg sm:text-xl font-semibold [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
      ใบเสนอราคาซ่อมอุปกรณ์
    </h1>
  </div>
);

export const RepairInvoiceDetails = ({ title, invoiceNumber, date }) => (
  <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 px-4">
    <div>
      <p className="text-xs sm:text-sm mb-1">เรื่อง: {title}</p>
      <p className="text-xs sm:text-sm">เอ อาร์ คอมพิวเตอร์ มีความยินดีเป็นอย่างยิ่งในการเสนอราคา มีรายการดังต่อไปนี้</p>
    </div>
    <div className="text-left sm:text-right mt-2 sm:mt-0">
      <p className="text-xs sm:text-sm">เลขที่: {invoiceNumber}</p>
      <p className="text-xs sm:text-sm">วันที่ {formatDate(date)}</p>
    </div>
  </div>
);

export const RepairInvoiceTable = ({ items }) => (
  <div className="overflow-x-auto mb-6 px-2 sm:px-4">
    <div className="min-w-[640px]">
      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="bg-gray-50 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
            <th className="py-2 px-1 sm:px-2 border text-center">ลำดับ</th>
            <th className="py-2 px-1 sm:px-2 border">รายการซ่อม</th>
            <th className="py-2 px-1 sm:px-2 border text-center">จำนวน</th>
            <th className="py-2 px-1 sm:px-2 border text-right">ราคา/หน่วย<br/>(ไม่รวม VAT)</th>
            <th className="py-2 px-1 sm:px-2 border text-right">ราคา/หน่วย<br/>(รวม VAT)</th>
            <th className="py-2 px-1 sm:px-2 border text-right">จำนวนเงิน</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const priceBeforeVat = item.unitPrice / 1.07;
            return (
              <tr key={item.id || index} className="border-b">
                <td className="py-2 px-1 sm:px-2 border text-center">{index + 1}</td>
                <td className="py-2 px-1 sm:px-2 border">
                  <div>
                    <div className="font-medium">{item.description}</div>
                    {item.specifications && (
                      <div className="text-xs sm:text-sm text-gray-600 whitespace-pre-line mt-1">
                        {item.specifications}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-2 px-1 sm:px-2 border text-center">{item.quantity}</td>
                <td className="py-2 px-1 sm:px-2 border text-right">{formatNumber(priceBeforeVat)}</td>
                <td className="py-2 px-1 sm:px-2 border text-right">{formatNumber(item.unitPrice)}</td>
                <td className="py-2 px-1 sm:px-2 border text-right">{formatNumber(item.total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// Thai number conversion utility remains the same
const THAI_NUMBERS = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const THAI_UNITS = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

const convertToThaiText = (num) => {
  if (num === 0) return 'ศูนย์บาทถ้วน';
  
  let text = '';
  const parts = Math.abs(num).toFixed(2).split('.');
  const integerPart = parseInt(parts[0]);
  const decimalPart = parseInt(parts[1]);

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

  if (decimalPart > 0) {
    text += convertGroup(decimalPart) + 'สตางค์';
  } else {
    text += 'ถ้วน';
  }

  return text;
};

export const RepairInvoiceSummary = ({ subtotal, vat, total }) => (
  <div className="space-y-4 px-2 sm:px-4">
    <div className="w-full flex flex-col sm:flex-row sm:justify-end">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="text-xs sm:text-sm order-2 sm:order-1">
          <div className="text-center">จำนวนเงินทั้งสิ้น (ตัวอักษร)</div>
          <div className="bg-blue-50 p-2 mx-0 sm:mx-4 font-semibold text-center [-webkit-print-color-adjust:exact] [print-color-adjust:exact] break-words">
            {convertToThaiText(total)}
          </div>
        </div>
        <div className="w-full sm:w-64 justify-self-center sm:justify-self-end order-1 sm:order-2">
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm border-t pt-2">
            <div className="text-right font-semibold">มูลค่าสินค้า:</div>
            <div className="text-right tabular-nums">{formatNumber(subtotal)}</div>
            
            <div className="text-right font-semibold">ภาษีมูลค่าเพิ่ม 7%:</div>
            <div className="text-right tabular-nums">{formatNumber(vat)}</div>
            
            <div className="text-right font-semibold text-base sm:text-lg border-t pt-2">รวมทั้งสิ้น:</div>
            <div className="text-right tabular-nums text-base sm:text-lg font-bold border-t pt-2">
              {formatNumber(total)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const RepairInvoiceSignatures = () => (
  <div className="border-t border-gray-300 mt-8 pt-8 px-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-sm">
      <div className="text-center sm:text-left">
        <div className="mb-4 sm:mb-8">ลงชื่อ ................................................ ผู้รับสินค้า</div>
        <div>วันที่ .......................................................................</div>
      </div>
      <div className="text-center sm:text-right">
        <div className="mb-4 sm:mb-8">ลงชื่อ ................................................ ผู้ส่งสินค้า</div>
        <div>(...........................................................................)</div>
      </div>
    </div>
  </div>
);

export { formatNumber, formatDate };