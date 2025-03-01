import React from 'react';
import { 
  Cpu, CircuitBoard, MemoryStick, HardDrive,
  Power, Fan, Laptop, Monitor, Keyboard,
  Mouse, Gamepad, Server, Wrench, Scissors
} from 'lucide-react';

const iconMap = {
  cpu: Cpu,
  circuitBoard: CircuitBoard,
  memoryStick: MemoryStick,
  hardDrive: HardDrive,
  power: Power,
  fan: Fan,
  laptop: Laptop,
  monitor: Monitor,
  keyboard: Keyboard,
  mouse: Mouse,
  gamepad: Gamepad,
  server: Server,
  wrench: Wrench,
  scissors: Scissors
};

const CategoryIcon = ({ name, className, customIcon }) => {
  // ถ้ามี customIcon ให้แสดง SVG ที่ user กำหนดเอง
  if (customIcon) {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: customIcon }}
      />
    );
  }
  
  // ถ้าไม่มี customIcon ให้แสดง icon จาก iconMap ตามปกติ
  const IconComponent = iconMap[name];
  return IconComponent ? <IconComponent className={className} /> : null;
};

export { iconMap };
export default CategoryIcon;