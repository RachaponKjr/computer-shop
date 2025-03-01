import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteInvoiceDialog = ({ invoice, onDelete, open, onOpenChange }) => {
  const dialogRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  const handleDelete = () => {
    onDelete(invoice._id);
  };

  return (
    <>
      <button
        onClick={() => onOpenChange(true)}
        className="text-red-600 hover:text-red-800 p-2"
      >
        <Trash2 size={18} />
      </button>

      <dialog
        ref={dialogRef}
        className="p-0 rounded-lg shadow-lg backdrop:bg-black backdrop:bg-opacity-50"
        onClose={() => onOpenChange(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            onOpenChange(false);
          }
        }}
      >
        <div className="max-w-full p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">ยืนยันการลบใบส่งของ</h2>
          <p className="text-gray-600 mb-4">
            คุณต้องการลบใบส่งของเลขที่ {invoice.invoiceNumber} ใช่หรือไม่?
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              ลบใบส่งของ
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DeleteInvoiceDialog;