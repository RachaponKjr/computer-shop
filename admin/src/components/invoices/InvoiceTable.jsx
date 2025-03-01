import React, { useState } from 'react';
import { Pencil, Download, Eye, Trash2 } from 'lucide-react';
import DeleteInvoiceDialog from './DeleteInvoiceDialog';

const InvoiceTable = ({
  invoices,
  onDownload,
  onNavigate,
  onDelete
}) => {

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    invoice: null
  });

  const handleOpenDelete = (invoice) => {
    setDeleteDialog({
      open: true,
      invoice
    });
  };

  const handleCloseDelete = () => {
    setDeleteDialog({
      open: false,
      invoice: null
    });
  };

  const handleDelete = (invoiceId) => {
    onDelete(invoiceId);
    handleCloseDelete();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขที่</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดรวม</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {invoice.invoiceNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(invoice.date).toLocaleDateString('th-TH')}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{invoice.customerName}</div>
                <div className="text-xs text-gray-500 truncate max-w-xs">{invoice.address}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                ฿{invoice.total.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onNavigate(invoice._id)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onDownload(invoice._id)}
                    className="text-green-600 hover:text-green-800 p-2"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => onNavigate(`edit/${invoice._id}`)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Pencil size={18} />
                  </button>
                 <button
                   onClick={() => handleOpenDelete(invoice)}
                   className="text-red-600 hover:text-red-800 p-2"
                 >
                   <Trash2 size={20} />
                 </button>
                    {deleteDialog.invoice && (
                        <DeleteInvoiceDialog
                        invoice={deleteDialog.invoice}
                        onDelete={handleDelete}
                        open={deleteDialog.open}
                        onOpenChange={setDeleteDialog}
                        />
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;