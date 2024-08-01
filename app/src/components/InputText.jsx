import { Label, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { IoAlertCircleOutline } from "react-icons/io5";
import Required from './Required';

const InputText = React.forwardRef(({ name, placeholder, type, label, autoComplete, error, required, onChange, onBlur, defaultValues, disabled }, ref) => {

  const [focus, setFocus] = useState(false);

  const handleBlur = (e) => {
    setFocus(false)
    onBlur(e);
  }

  return (
    <div className='w-full mb-3'>
      <Label
        className={`flex ${focus ? error ? "failure" : 'text-sky-600' : error}`}
        color={error && "failure"}
        htmlFor={name}
      >
        {label}:
        {required && <Required />}
      </Label>
      <TextInput
        ref={ref}
        id={name}
        name={name}
        type={type || 'text'}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete || "on"}
        onChange={onChange}
        onBlur={handleBlur}
        onFocus={() => setFocus(true)}
        color={error && "failure"}
        defaultValue={defaultValues}
        helperText={
          error && <span className='flex items-center text-sm'><IoAlertCircleOutline className='mr-1' /> {error.message}</span>
        }
      />
    </div >
  )
})

InputText.displayName = "InputText";

export default InputText;