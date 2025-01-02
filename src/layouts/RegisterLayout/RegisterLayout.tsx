import RegisterHeader from 'src/components/RegisterHeader'

interface Props {
  children?: React.ReactNode
}

export default function RegisterLayout({ children }: Props) {
  return (
    <>
      <RegisterHeader />
      {children}
    </>
  )
}
