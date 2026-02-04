"use client";

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Camera, Loader2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAuth, User as UserType } from "@/providers/auth-provider";
import { useUpdateProfile } from "@/hooks/useProfile";
import {
  profileSchema,
  passwordSchema,
  ProfileFormData,
  PasswordFormData,
} from "@/schemas/profile-schema";
import { uploadService } from "@/services/upload";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function getInitials(name: string | undefined): string {
  if (!name) return "U";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

export function ProfileForm() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.profileImage || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      profileImage: user?.profileImage || null,
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > MAX_FILE_SIZE) {
        toast.error("Arquivo muito grande. O tamanho máximo é 5MB.");
        e.target.value = "";
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const uploadImageToS3 = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const filename = `profile-images/${user?.id}-${timestamp}.${extension}`;

    const { url, publicUrl } = await uploadService.getPresignedUrl(filename);
    await uploadService.uploadToS3(url, file);

    return publicUrl;
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      let profileImageUrl = user?.profileImage || null;

      // Upload new image if selected
      if (selectedFile) {
        setIsUploadingImage(true);
        try {
          profileImageUrl = await uploadImageToS3(selectedFile);
        } catch {
          toast.error("Erro ao fazer upload da imagem");
          setIsUploadingImage(false);
          return;
        }
        setIsUploadingImage(false);
      } else if (imagePreview === null && user?.profileImage) {
        // Image was removed
        profileImageUrl = null;
      }

      await updateProfile.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        profileImage: profileImageUrl,
      });

      setSelectedFile(null);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await updateProfile.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      passwordForm.reset();
      toast.success("Senha alterada com sucesso!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Erro ao alterar senha. Verifique sua senha atual.");
    }
  };

  const isProfileLoading = updateProfile.isPending || isUploadingImage;

  return (
    <div className="space-y-6">
      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e foto de perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-6"
            >
              {/* Profile Image */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    {imagePreview ? (
                      <AvatarImage src={imagePreview} alt={user?.name} />
                    ) : null}
                    <AvatarFallback className="text-2xl bg-primary text-white">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white hover:bg-primary/90 transition-colors"
                    disabled={isProfileLoading}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                    disabled={isProfileLoading}
                  />
                </div>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={isProfileLoading}
                  >
                    Remover foto
                  </Button>
                )}
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Seu nome"
                          disabled={isProfileLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="seu@email.com"
                          disabled={isProfileLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="(00) 00000-0000"
                          disabled={isProfileLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isProfileLoading}>
                  {isProfileLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar alterações"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Password Change Card */}
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>Atualize sua senha de acesso</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha atual</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Digite sua senha atual"
                        disabled={updateProfile.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Digite sua nova senha"
                          disabled={updateProfile.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar nova senha</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Confirme sua nova senha"
                          disabled={updateProfile.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Alterando...
                    </>
                  ) : (
                    "Alterar senha"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
