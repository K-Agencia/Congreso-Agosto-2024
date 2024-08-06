import React from 'react';
import { Checkbox, Label } from 'flowbite-react';
import { IoAlertCircleOutline } from 'react-icons/io5';
import Required from './Required';

const InputCheckbox = React.forwardRef(({ name, error, children, required, ...props }, ref) => {
  return (
    <div className={`w-full p-2 border ${error ? 'rounded-lg border-red-600' : 'border-white'}`}>
      <div className="flex items-center gap-2">
        <Checkbox
          ref={ref}
          name={name}
          id={name}
          {...props}
          className={error && 'ring-1 ring-red-600'}
        />
        <Label htmlFor={name} className='flex'>
          <p>{children}</p>
          {required && <Required />}
        </Label>
      </div>
      {error && <span className='mt-1 flex items-center text-sm text-red-600'><IoAlertCircleOutline className='mr-1' /> {error.message}</span>}
    </div>
  )
});

export default InputCheckbox;