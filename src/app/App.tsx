import { useState } from 'react';

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    window.app_api.ipc.sendMessage('ipc-database', 'A Request from render-process.');
    console.log('Message sent! Check main process log in terminal.')
  }

  return (
    <button onClick={handleClick}>Send a Request to the Backend: {count} times</button>
  );
}

export function App() {
  return (
    <>
      <div>
        <h1>Welcome to React</h1>
        <MyButton />
      </div>
    </>
  );
}
