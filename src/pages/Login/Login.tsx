import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { schema, Schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<Schema, 'email' | 'password'>

const loginSchema = schema.pick(['email', 'password'])
export default function Login() {
  const { setIsAuthenticated } = useContext(AppContext)
  const navigata = useNavigate()
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<Omit<Schema, 'confirm_password'>>({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        setIsAuthenticated(true)
        navigata('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<Schema, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.content
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<Schema, 'confirm_password'>, {
                message: formError[key as keyof Omit<Schema, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='font-[sans-serif]'>
      <div className='fle-col flex min-h-screen items-center justify-center px-4 py-6'>
        <div className='grid w-full max-w-6xl items-center gap-6 md:grid-cols-2'>
          <div className='max-w-md rounded-lg border border-gray-300 p-6 shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                className='mt-8'
                name='email'
                type='email'
                placeholder='Email'
                register={register}
                errorMessage={errors.email?.message}
              />
              <Input
                className='mt-2'
                name='password'
                type='password'
                placeholder='Password'
                register={register}
                errorMessage={errors.password?.message}
              />
              <div className='mt-2'>
                <Button
                  type='submit'
                  className='flex w-full content-center justify-center bg-orange px-2 py-4 text-center text-sm uppercase text-white hover:bg-opacity-90'
                  isLoading={loginMutation.isPending}
                  disabled={loginMutation.isPending}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center text-sm'>
                <span className='text-gray-400'>Bạn mới biết đến Cyberbugs?</span>
                <Link className='ml-1 text-red-600' to={path.register}>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
          <div className='max-md:mt-8'>
            <img
              src='https://readymadeui.com/login-image.webp'
              className='mx-auto block aspect-[71/50] w-full object-cover max-md:w-4/5'
              alt='Dining Experience'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
