import { LoginFormData, loginSchema } from "@/schemas/login-schema"
import { authService } from "@/services/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

export const useLoginForm = () => {
  const router = useRouter()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      router.push('/')
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("Email ou senha inválidos")
        } else {
          toast.error("Erro ao fazer login")
        }
      }
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    login(data)
  }

  return {
    form,
    onSubmit,
    isLoading
  }
}