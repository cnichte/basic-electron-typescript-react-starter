import { Tabs } from 'antd';
import { Test_IPC } from './Test_IPC'
import { View_Catalogs } from './View_Catalogs';
import { View_Users } from './View_Users';

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
            label: `Database-Test: Users`,
            key: "2",
            children: View_Users(),
          },
        {
          label: `Database-Test: Catalogs`,
          key: "3",
          children: View_Catalogs(),
        },
        ]}
      />
    </>
  );
}
