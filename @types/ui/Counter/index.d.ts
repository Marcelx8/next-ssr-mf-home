import React from 'react';
export type MyCounter = React.FunctionComponent<({ count: number, onIncrement: () => void, onDecrement: () => void })>;
const Counter: MyCounter;
export default Counter;