import { Space, Table, Tag, Input, Button, Avatar, Tooltip, Modal, Form, Select } from 'antd'
import type { TableProps } from 'antd'
import {
  Project,
  ProjectDetailResponse,
  ResponseProjectCategory,
  UpdateProjectPayload,
  AssignUsersProjectPayload
} from 'src/types/project.type'
import { useState } from 'react'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import projectApi from 'src/apis/project.api'
import { toast } from 'react-toastify'
import { SuccessResponse } from 'src/types/utils.type'
import { ResponseUser } from 'src/types/user.type'
import userApi from 'src/apis/user.api'

interface ProjectListProps {
  projectList: Project[]
}

interface ProjectFormValues {
  projectName: string
  description: string
  categoryId: number
  alias: string
}

const ProjectList: React.FC<ProjectListProps> = ({ projectList }) => {
  const queryClient = useQueryClient()

  // States
  const [searchText, setSearchText] = useState('')
  const [categories, setCategories] = useState<ResponseProjectCategory[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [userList, setUserList] = useState<ResponseUser[]>([])
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [editForm] = Form.useForm<ProjectFormValues>()

  // Mutations
  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: number) => projectApi.deleteProject(projectId),
    onSuccess: () => {
      toast.success('Xoá dự án thành công!')
      queryClient.invalidateQueries({ queryKey: ['projectList'] })
    }
  })

  const { data, mutate: getProjectDetail } = useMutation<SuccessResponse<ProjectDetailResponse>, Error, number>({
    mutationFn: (projectId: number) => projectApi.getProjectDetail(projectId).then((res) => res.data),
    onSuccess: (response) => {
      editForm.setFieldsValue({
        projectName: response.content.projectName,
        description: response.content.description,
        categoryId: response.content.projectCategory.id,
        alias: response.content.alias
      })
      setIsEditModalOpen(true)
    }
  })

  const { mutate: getCategories } = useMutation({
    mutationFn: () => projectApi.getProjectCategory(),
    onSuccess: (response) => {
      setCategories(response.data.content)
    }
  })

  const updateProjectMutation = useMutation<
    SuccessResponse<ProjectDetailResponse>,
    Error,
    { projectId: number; payload: UpdateProjectPayload }
  >({
    mutationFn: ({ projectId, payload }) => projectApi.updateProject(projectId, payload).then((res) => res.data),
    onSuccess: () => {
      toast.success('Cập nhật dự án thành công!')
      queryClient.invalidateQueries({ queryKey: ['projectList'] })
      setIsEditModalOpen(false)
      editForm.resetFields()
    }
  })

  const getUsersMutation = useMutation({
    mutationFn: () => userApi.getAllUsers(),
    onSuccess: (response) => {
      setUserList(response.data.content)
    }
  })

  const addUsersMutation = useMutation<SuccessResponse<unknown>, Error, AssignUsersProjectPayload>({
    mutationFn: (payload: AssignUsersProjectPayload) => projectApi.assignProjectMember(payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectList'] })
      setIsAddUserModalOpen(false)
      setSelectedUsers([])
      toast.success('Thêm thành viên thành công!')
    }
  })

  // Handlers
  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const handleDeleteProject = (projectId: number) => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xoá dự án này không?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteProjectMutation.mutate(projectId)
      }
    })
  }

  const handleEditProject = (projectId: number) => {
    getProjectDetail(projectId)
    getCategories()
  }

  const handleCancel = () => {
    setIsEditModalOpen(false)
    editForm.resetFields()
  }

  const handleUpdateProject = () => {
    editForm
      .validateFields()
      .then((values: ProjectFormValues) => {
        const projectId = data?.content.id
        if (projectId) {
          const updatePayload: UpdateProjectPayload = {
            id: projectId,
            projectName: values.projectName,
            description: values.description,
            categoryId: values.categoryId.toString(),
            creator: data?.content.creator.id
          }
          updateProjectMutation.mutate({ projectId, payload: updatePayload })
        }
      })
      .catch((error) => {
        console.log('Validation failed:', error)
      })
  }

  const handleAddUserClick = (projectId: number) => {
    setSelectedProjectId(projectId)
    setIsAddUserModalOpen(true)
    getUsersMutation.mutate()
  }

  const handleAddUserCancel = () => {
    setIsAddUserModalOpen(false)
    setSelectedUsers([])
  }

  // Table Configuration
  const columns: TableProps<Project>['columns'] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Project name',
      dataIndex: 'projectName',
      key: 'projectName'
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName'
    },
    {
      title: 'Creator',
      key: 'creator',
      render: (_, record) => <Tag color='blue'>{record.creator.name}</Tag>
    },
    {
      title: 'Members',
      key: 'members',
      render: (_, record) => (
        <Avatar.Group
          max={{
            count: 3,
            style: { color: '#f56a00', backgroundColor: '#fde3cf' }
          }}
        >
          {record.members.map((member) => (
            <Tooltip title={member.name} key={member.userId}>
              <Avatar src={member.avatar} alt={member.name}>
                {!member.avatar && member.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Tooltip>
          ))}
          <Tooltip title='Add Member'>
            <Avatar
              style={{ backgroundColor: '#1677ff' }}
              icon={<PlusOutlined />}
              onClick={() => handleAddUserClick(record.id)}
            />
          </Tooltip>
        </Avatar.Group>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button type='primary' className='bg-blue-500' onClick={() => handleEditProject(record.id)}>
            Edit
          </Button>
          <Button
            type='primary'
            danger
            onClick={() => handleDeleteProject(record.id)}
            loading={deleteProjectMutation.isPending}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ]

  const filteredProjects = projectList.filter((project) =>
    project.projectName.toLowerCase().includes(searchText.toLowerCase())
  )

  const dataSource = filteredProjects.map((project) => ({
    ...project,
    key: project.id
  }))

  // Render
  return (
    <div>
      <div className='mb-4'>
        <Input
          placeholder='Search projects by name'
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
        />
      </div>

      <Table<Project> columns={columns} dataSource={dataSource} />

      {/* Edit Project Modal */}
      <Modal
        title='Edit Project'
        open={isEditModalOpen}
        onOk={handleUpdateProject}
        onCancel={handleCancel}
        okText='Update'
        okButtonProps={{
          className: 'bg-blue-500',
          loading: updateProjectMutation.isPending
        }}
      >
        <Form form={editForm} layout='vertical' initialValues={{ remember: true }}>
          <Form.Item
            label='Project Name'
            name='projectName'
            rules={[{ required: true, message: 'Please input project name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Description'
            name='description'
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label='Category'
            name='categoryId'
            rules={[{ required: true, message: 'Please select category!' }]}
          >
            <Select>
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.projectCategoryName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label='Alias' name='alias' rules={[{ required: true, message: 'Please input alias!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Members Modal */}
      <Modal
        title='Add Members'
        open={isAddUserModalOpen}
        onCancel={handleAddUserCancel}
        footer={[
          <Button key='cancel' onClick={handleAddUserCancel}>
            Cancel
          </Button>,
          <Button
            key='add'
            type='primary'
            className='bg-blue-500'
            loading={addUsersMutation.isPending}
            onClick={() =>
              selectedProjectId &&
              selectedUsers.forEach((userId) =>
                addUsersMutation.mutate({
                  projectId: selectedProjectId,
                  userId: userId
                })
              )
            }
            disabled={selectedUsers.length === 0}
          >
            Add
          </Button>
        ]}
      >
        <Select
          style={{ width: '100%' }}
          placeholder='Select user to add'
          onChange={(value) => setSelectedUsers([value])}
          loading={getUsersMutation.isPending}
          value={selectedUsers[0]}
        >
          {userList.map((user) => (
            <Select.Option key={user.userId} value={user.userId}>
              <div className='flex items-center gap-2'>
                <Avatar src={user.avatar} size='small'>
                  {!user.avatar && user.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <span>{user.name}</span>
              </div>
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  )
}

export default ProjectList
