import React from 'react';
import TextField from '@mui/material/TextField';
import InputMask from 'react-input-mask';

const CnpjTextField = React.forwardRef((props, ref) => (
  <InputMask
    mask="99.999.999/9999-99"
    {...props}
  >
    {(inputProps) => (
      <TextField
        {...inputProps}
        ref={ref}
      />
    )}
  </InputMask>
));

export default CnpjTextField;