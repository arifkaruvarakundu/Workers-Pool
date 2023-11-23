const CustomDatePickerInput = ({ value, onClick, isDateBusy }) => {
    const isDisabled = isDateBusy(new Date(value));
  
    return (
      <input
        type="text"
        value={value}
        onClick={onClick}
        className={`w-full p-2 border rounded-lg ${isDisabled ? 'bg-red-500 text-white' : ''}`}
        disabled={isDisabled}
      />
    );
  };
export default CustomDatePickerInput;  