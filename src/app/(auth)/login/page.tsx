"use client"

import { useLoginForm } from "./useLoginForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { FormProvider } from "react-hook-form"


export default function Login() {
    const { form, onSubmit, isLoading } = useLoginForm()

    const { register, handleSubmit, formState: { errors } } = form

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md p-2 md:p-6">
                <CardHeader>
                    <h1 className="text-xl md:text-3xl font-bold text-center text-primary">
                        Entre com sua conta
                    </h1>
                </CardHeader>
                <CardContent>
                    <FormProvider {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Input
                                label="Email"
                                placeholder="seu@email.com"
                                type="email"
                                error={errors.email?.message}
                                {...register("email")}
                            />

                            <Input
                                label="Senha"
                                placeholder="Sua senha"
                                type="password"
                                error={errors.password?.message}
                                {...register("password")}

                            />

                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="w-full bg-primary hover:bg-primary/80"
                            >
                                Entrar
                            </Button>
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </div>

    )
}


