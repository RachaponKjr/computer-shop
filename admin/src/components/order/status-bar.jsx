// eslint-disable-next-line react/prop-types
function StatusBar({ status }) {
    const getStatusText = (status) => {
        switch (status) {
            case "pending":
                return "รอการยืนยัน";
            case "paid":
                return "ยืนยันรายการ";
            case "delivered":
                return "จัดส่งแล้ว";
            case "cancel":
                return "ยกเลิกรายการ";
            default:
                return "สถานะไม่ถูกต้อง";
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "gray";
            case "paid":
                return "green";
            case "delivered":
                return "blue";
            case "cancel":
                return "red";
            default:
                return "";
        }
    }

    return (
        <div 
            className="w-max px-2 py-1 rounded-md text-white"
            style={{ backgroundColor: getStatusColor(status) }}
        >
            {getStatusText(status)}
        </div>
    )
}

export default StatusBar