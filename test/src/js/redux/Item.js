import React from 'react';

const Item = ({ name, bought, buyItem }) => (
  <li>
    {bought ? name : (
      <button id={`buy-${name}`} onClick={() => buyItem(name)}>
        Buy {name}
      </button>
    )}
  </li>
);

export default Item;
