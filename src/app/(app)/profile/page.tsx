'use client'

import { ProfileForm } from '@/components/Profile/ProfileForm'

export default function ProfilePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Meu Perfil</h1>
                <p className="text-muted-foreground">
                    Gerencie suas informações pessoais e configurações de conta
                </p>
            </div>

            <ProfileForm />
        </div>
    )
}
