const FormInput = ({ label, name, type, defaultValue }) => {
  return (
    <div className='form-control '>
      <label className='label'>
        <span className='label-text capitalize'>{label}</span>
      </label>
     <input
  type={type}
  name={name}
  className="input input-bordered w-full bg-white text-slate-900 border-slate-300 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none"
  placeholder={label}
/>
    </div>
  );
};
export default FormInput;