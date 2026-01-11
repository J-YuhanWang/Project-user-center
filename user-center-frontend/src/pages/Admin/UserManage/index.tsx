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
    render:(_,record)=>{
      return(
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
        status:'Default',
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
  //   title: '操作',
  //   valueType: 'option',
  //   key: 'option',
  //   render: (text, record, _, action) => [
  //     <a
  //       key="editable"
  //       onClick={() => {
  //         action?.startEditable?.(record.id);
  //       }}
  //     >
  //       编辑
  //     </a>,
  //     <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
  //       查看
  //     </a>,
  //     <TableDropdown
  //       key="actionGroup"
  //       onSelect={() => action?.reload()}
  //       menus={[
  //         { key: 'copy', name: '复制' },
  //         { key: 'delete', name: '删除' },
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
          data:userList,
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
        // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
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
      headerTitle="高级表格"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type="primary"
        >
          新建
        </Button>,
      ]}
    />
  );
};