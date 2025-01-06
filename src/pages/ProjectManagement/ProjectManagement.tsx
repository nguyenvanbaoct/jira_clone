import { useQuery } from '@tanstack/react-query'
import React, { useState, useContext } from 'react'
import { ProjectOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu, Spin, theme } from 'antd'
import ProjectList from 'src/pages/ProjectManagement/ProjectList/ProjectList'
import projectApi from 'src/apis/project.api'
import { AppContext } from 'src/contexts/app.context'
import { useNavigate } from 'react-router-dom'
import { clearLocalStorage } from 'src/utils/auth'
import path from 'src/constants/path'

const { Header, Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

export default function ProjectManagement() {
  const { profile, setIsAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const { data: ProjectListResponse, isLoading } = useQuery({
    queryKey: ['projectList'] as const,
    queryFn: async () => {
      const response = await projectApi.getAllProjects()
      return {
        content: response.data.content.map((item: any) => ({
          members: item.members,
          creator: item.creator,
          id: item.id,
          projectName: item.projectName,
          ...item
        }))
      }
    }
  })

  const handleLogout = () => {
    clearLocalStorage()
    setIsAuthenticated(false)
    navigate(path.login)
  }

  if (isLoading) {
    return <Spin fullscreen={true} />
  }

  const items: MenuItem[] = [
    getItem('Project management', 'project', <ProjectOutlined />, [
      getItem('Create project', 'createProject', <SettingOutlined />),
      getItem('Create task', 'createTask', <SettingOutlined />)
    ]),
    getItem(
      <div className='flex items-center justify-between'>
        <span>{profile?.email || 'User'}</span>
      </div>,
      'user',
      <UserOutlined />,
      [getItem(<button onClick={handleLogout}>Logout</button>, 'logout')]
    )
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={230}>
        <div className='demo-logo-vertical' />
        <Menu theme='dark' defaultSelectedKeys={['project']} mode='inline' items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <div className='py-5 text-2xl font-bold'>Project management</div>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG
            }}
          >
            {ProjectListResponse && <ProjectList projectList={ProjectListResponse.content} />}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Cyberbugs ©{new Date().getFullYear()} Created by Cybersoft</Footer>
      </Layout>
    </Layout>
  )
}
