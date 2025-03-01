const Button = ({ children, variant = 'primary', type = 'button', ...props }) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-md ${variants[variant]} disabled:opacity-50`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;