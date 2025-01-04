import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import omit from 'lodash/omit'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import Button from 'src/components/Button'
import path from 'src/constants/path'

type FormData = Pick<Schema, 'email' | 'password' | 'name' | 'phone'>
const registerSchema = schema.pick(['email', 'password', 'name', 'phone'])

export default function Register() {
  const navigata = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<Schema, 'confirm_password'>) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data)
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        navigata(path.login)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<Schema, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.content
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
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
              <div className='text-2xl'>Đăng ký</div>
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
              <Input
                className='mt-2'
                name='name'
                type='text'
                placeholder='Name'
                register={register}
                errorMessage={errors.name?.message}
              />
              <Input
                className='mt-2'
                name='phone'
                type='text'
                placeholder='Phone number'
                register={register}
                errorMessage={errors.phone?.message}
              />
              <div className='mt-2'>
                <Button
                  className='flex w-full content-center justify-center bg-orange px-2 py-4 text-center text-sm uppercase text-white hover:bg-opacity-90'
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  Đăng ký
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center text-sm'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='ml-1 text-red-600' to={path.login}>
                  Đăng nhập
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
