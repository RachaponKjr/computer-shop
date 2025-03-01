import React from 'react';

const Footer = () => {
  return (
    <div className="bg-white">
      <footer className="bg-white py-12 max-w-7xl mx-auto px-4 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Us Section */}
            <div className="col-span-1">
              <img src="/logo.png" alt="เอ อาร์ คอมพิวเตอร์" className="h-8 mb-4" />
              <p className="text-sm text-gray-400">
                ร้านขายคอมพิวเตอร์ เราคือผู้เชี่ยวชาญ ในการให้บริการด้านคอมพิวเตอร์ ตามการใช้งานในงบประมาณที่ลูกค้าเลือกได้เอง
              </p>
            </div>

            {/* Links Sections */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">เกี่ยวกับเรา</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">ติดต่อเรา</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">เกี่ยวกับเรา</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">ข้อกำหนดและเงื่อนไข</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a></li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">ติดต่อเรา</h3>
              <div className="space-y-2 text-gray-400">
                <p>อาคาร ไอทีพลาซ่า 324 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดนครราชสีมา 30000</p>
                <p>โทรศัพท์: 081-2664815</p>
                <p>อีเมล: info@arcomputer.com</p>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>Copyright © 2024 www.arcomputer.com All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;