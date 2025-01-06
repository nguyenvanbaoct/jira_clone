import { Modal, Form, Input, Select, Button } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import projectApi from 'src/apis/project.api'
import { CreateProjectPayload, ResponseProjectCategory } from 'src/types/project.type'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  categories: ResponseProjectCategory[]
}

export default function CreateProject({ isOpen, onClose, categories }: CreateProjectModalProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const createProjectMutation = useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectApi.createProject(payload),
    onSuccess: () => {
      toast.success('Tạo dự án thành công!')
      queryClient.invalidateQueries({ queryKey: ['projectList'] })
      onClose()
      form.resetFields()
    }
  })

  const handleCreateProject = () => {
    form
      .validateFields()
      .then((values) => {
        createProjectMutation.mutate(values)
      })
      .catch((error) => {
        console.log('Validation failed:', error)
      })
  }

  return (
    <Modal
      title='Create New Project'
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key='cancel' onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key='create'
          type='primary'
          className='bg-blue-500'
          loading={createProjectMutation.isPending}
          onClick={handleCreateProject}
        >
          Create
        </Button>
      ]}
    >
      <Form form={form} layout='vertical' initialValues={{ remember: true }}>
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

        <Form.Item label='Category' name='categoryId' rules={[{ required: true, message: 'Please select category!' }]}>
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
  )
}
