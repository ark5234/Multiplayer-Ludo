import { useState } from 'react';

export default function useInput(initialValue = '') {
    const [value, setValue] = useState(initialValue);
    
    const handleChange = e => {
        setValue(e.target.value);
    };
    
    return {
        value: value,
        onChange: handleChange,
        setValue: setValue,
        // Properties safe for spreading to DOM elements
        inputProps: {
            value: value,
            onChange: handleChange
        }
    };
}
