import { addItem, buyItem } from './reducer';

import Input from './Input';
import Item from './Item';
import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = ({ list }) => ({ list });

const App = ({ addItem, buyItem, list }) => (
  <div>
    <h1>Shopping</h1>
    <Input addItem={addItem} />
    <ul>
      {list.map(({ name, bought }) => (
        <Item {...{ name, bought, buyItem }} key={name} />
      ))}
    </ul>
  </div>
);

export default connect(mapStateToProps, { buyItem, addItem })(App);
