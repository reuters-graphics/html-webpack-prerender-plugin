import React, { useState } from 'react';

const Input = ({ addItem }) => {
  const [value, setValue] = useState('');
  return (
    <div>
      <input
        id='item-input'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type='text'
      />
      <button
        id='add-item'
        onClick={() => addItem(value)}
      >Add item
      </button>
    </div>
  );
};

export default Input;
