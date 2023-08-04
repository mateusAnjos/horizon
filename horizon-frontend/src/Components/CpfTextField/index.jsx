import React from 'react';
import TextField from '@mui/material/TextField';
import InputMask from 'react-input-mask';

const CpfTextField = React.forwardRef((props, ref) => (
    <InputMask
      mask="999.999.999-99"
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

  export default CpfTextField;