import { Form, Input, Modal, Select, Spin } from 'antd'
import { useContext, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateTaskPayload, Project } from 'src/types/project.type'
import priorityApi from 'src/apis/priority.api'
import taskTypeApi from 'src/apis/taskType.api'
import statusApi from 'src/apis/statuts.api'
import userApi from 'src/apis/user.api'
import { AppContext } from 'src/contexts/app.context'
import projectApi from 'src/apis/project.api'
import { toast } from 'react-toastify'

interface Props {
  isOpen: boolean
  onClose: () => void
  projectList: Project[]
}

export default function CreateTask({ isOpen, onClose, projectList }: Props) {
  const [form] = Form.useForm()
  const { profile } = useContext(AppContext)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  console.log(profile)
  const filteredProjects = projectList.filter((project) => String(project.creator.id) === String(profile?.id))

  const { data: priorities, isLoading: isPriorityLoading } = useQuery({
    queryKey: ['priorities'],
    queryFn: () => priorityApi.getAllPriority()
  })

  const { data: taskTypes, isLoading: isTaskTypeLoading } = useQuery({
    queryKey: ['taskTypes'],
    queryFn: () => taskTypeApi.getAllTaskType()
  })

  const { data: statuses, isLoading: isStatusLoading } = useQuery({
    queryKey: ['statuses'],
    queryFn: () => statusApi.getAllStatus()
  })

  useQuery({
    queryKey: ['projectUsers', selectedProjectId],
    queryFn: () => userApi.getAllUsers(),
    enabled: !!selectedProjectId
  })

  const queryClient = useQueryClient()

  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) => projectApi.createTask(payload),
    onSuccess: () => {
      form.resetFields()
      onClose()
      queryClient.invalidateQueries({ queryKey: ['projectList'] })
      toast.success('Tạo task thành công!')
    }
  })

  const handleProjectChange = (projectId: number) => {
    setSelectedProjectId(projectId)
    form.setFieldValue('assignees', undefined)
  }

  const handleSubmit = (values: any) => {
    const payload: CreateTaskPayload = {
      listUserAsign: values.assignees,
      taskName: values.taskName,
      description: values.description || '',
      statusId: values.statusId,
      originalEstimate: 0,
      timeTrackingSpent: 0,
      timeTrackingRemaining: 0,
      projectId: values.projectId,
      typeId: values.typeId,
      priorityId: values.priorityId
    }
    createTaskMutation.mutate(payload)
  }

  if (isPriorityLoading || isTaskTypeLoading || isStatusLoading) {
    return <Spin />
  }

  return (
    <Modal
      title='Create Task'
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      okButtonProps={{
        className: 'bg-blue-600 hover:bg-blue-500'
      }}
    >
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Form.Item name='projectId' label='Project' rules={[{ required: true, message: 'Vui lòng chọn project' }]}>
          <Select
            placeholder='Select project'
            onChange={handleProjectChange}
            options={filteredProjects.map((project) => ({
              label: project.projectName,
              value: project.id
            }))}
          />
        </Form.Item>

        <Form.Item name='taskName' label='Task Name' rules={[{ required: true, message: 'Vui lòng nhập tên task' }]}>
          <Input />
        </Form.Item>

        <Form.Item name='description' label='Description' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name='statusId' label='Status' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
          <Select
            placeholder='Select status'
            options={statuses?.data.content.map((status) => ({
              label: status.statusName,
              value: status.statusId
            }))}
          />
        </Form.Item>

        <Form.Item name='priorityId' label='Priority' rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên' }]}>
          <Select
            placeholder='Select priority'
            options={priorities?.data.content.map((priority) => ({
              label: priority.priority,
              value: priority.priorityId
            }))}
          />
        </Form.Item>

        <Form.Item name='typeId' label='Task Type' rules={[{ required: true, message: 'Vui lòng chọn loại task' }]}>
          <Select
            placeholder='Select task type'
            options={taskTypes?.data.content.map((type) => ({
              label: type.taskType,
              value: type.id
            }))}
          />
        </Form.Item>

        <Form.Item
          name='assignees'
          label='Assignees'
          rules={[{ required: true, message: 'Vui lòng chọn người nhận task' }]}
        >
          <Select
            mode='multiple'
            placeholder='Select assignees'
            disabled={!selectedProjectId}
            options={
              selectedProjectId
                ? projectList
                    .find((p) => p.id === selectedProjectId)
                    ?.members.map((member) => ({
                      label: member.name,
                      value: member.userId
                    }))
                : []
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
