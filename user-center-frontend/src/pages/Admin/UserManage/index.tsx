import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Image } from 'antd';
import { useRef } from 'react';
import { searchUsers } from '@/services/demo/user-api';

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'Username',
    dataIndex: 'username',
    copyable: true,
  },
  {
    title: 'Account',
    dataIndex: 'userAccount',
    copyable: true,
  },
  {
    title: 'Avatar',
    render: (_, record) => {
      return (
        <div>
          <Image src={record.avatarUrl} height={100} />
        </div>
      );
    },
    dataIndex: 'avatarUrl',
    copyable: true,
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    copyable: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    copyable: true,
  },
  {
    title: 'User status',
    dataIndex: 'userStatus',
  },
  {
    title: 'Role',
    dataIndex: 'userRole',
    valueType: 'select',
    valueEnum: {
      0: {
        text: 'Default User',
        status: 'Default',
      },
      1: {
        text: 'Administrator',
        status: 'Success',//error-red, success-green,default-gray,只用于突出颜色
      },
    },
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime',
    valueType: 'date',
  },

  // {
  //   title: 'Option',
  //   valueType: 'option',
  //   key: 'option',
  //   render: (text, record, _, action) => [
  //     <a
  //       key="editable"
  //       onClick={() => {
  //         action?.startEditable?.(record.id);
  //       }}
  //     >
  //       Edit
  //     </a>,
  //     <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
  //       View
  //     </a>,
  //     <TableDropdown
  //       key="actionGroup"
  //       onSelect={() => action?.reload()}
  //       menus={[
  //         { key: 'copy', name: 'Copy' },
  //         { key: 'delete', name: 'Delete' },
  //       ]}
  //     />,
  //   ],
  // },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        console.log(sort, filter);
        const userList = await searchUsers();
        return {
          data: userList.data,
          success: userList.code === 0,
        }
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true },
        },
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // Since transform is configured, parameters need conversion here if different from definition
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="Advanced Table"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type="primary"
        >
          Create
        </Button>,
      ]}
    />
  );
};