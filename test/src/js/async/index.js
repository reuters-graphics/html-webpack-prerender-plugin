import React from 'react';
import { render } from 'react-dom';
import { renderToString } from 'react-dom/server';

const stall = (stallTime) => new Promise(resolve => setTimeout(resolve, stallTime));

const simulateFetch = async() => {
  await stall(1500);
  return ['apple', 'banana', 'cherry'];
};

const Fruit = (props) => (<li>{props.name}</li>);

const App = (props) => (
  <ul>
    {props.fruits.map(fruit => <Fruit name={fruit} key={fruit} />)}
  </ul>
);

if (document.body) {
  const div = document.getElementById('root');
  const fruits = ['pear', 'quince'];
  render(<App fruits={fruits} />, div);
}

export default async(props) => {
  const fruits = await simulateFetch();
  return renderToString(<App fruits={fruits} />);
};
