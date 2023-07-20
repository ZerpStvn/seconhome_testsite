import { useState } from 'react';

export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  return {
    values,
    handleChange: (e) => {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    },
    reset: () => setValues(initialValues),
    handelSelectChange: (key,value)=>{
      console.log(key,value);
      setValues({
        ...values,
        [key]: value,
      });
    }
  };
};
