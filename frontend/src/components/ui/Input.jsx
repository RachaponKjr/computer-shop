

function Input({ title, type, placeholder, onChange, name }) {
    return (
        <div className="w-full space-y-1">
            <span>{title} :</span>
            <input type={type} name={name} placeholder={placeholder} onChange={onChange} className="w-full p-2 border border-gray-300 rounded mb-4" />
        </div>
    )
}

export default Input