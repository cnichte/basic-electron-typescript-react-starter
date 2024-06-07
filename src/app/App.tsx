import { Tabs } from 'antd';
import { Test_IPC } from './Test_IPC'
import { Test_Database } from './Test_Database';

export function App() {
  const onTabChange = (key: string) => {
    console.log(key);
  };

  return (
    <>
      <h1>Hi!</h1>
      <p>Welcome to Electron + React + Antd + PouchDB.</p>
      <Tabs
        onChange={onTabChange}
        type="card"
        items={[
          {
            label: `Electron IPC-Test`,
            key: "1",
            children: Test_IPC(),
          },{
            label: `Database Test`,
            key: "2",
            children: Test_Database(),
          },
        ]}
      />
    </>
  );
}
