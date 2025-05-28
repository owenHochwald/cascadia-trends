import { useSelector, useDispatch } from 'react-redux';
import {
  increment,
  decrement,
  reset,
  fetchRandomNumber,
} from './counterSlice';
import { RootState } from '../../types/api-types';

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const status = useSelector((state: RootState) => state.counter.status);
  const dispatch = useDispatch();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Redux Counter</h1>
      <h2>{status === 'loading' ? 'Loading...' : count}</h2>
      <button onClick={() => dispatch(increment())}>➕ Increment</button>
      <button onClick={() => dispatch(decrement())}>➖ Decrement</button>
      <button onClick={() => dispatch(reset())}>🔄 Reset</button>
      <button onClick={() => dispatch(fetchRandomNumber())}>
        🎲 Random Number
      </button>
    </div>
  );
};

export default Counter;
