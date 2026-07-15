"use client"

import { useState, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import { AuthService } from "@/services/auth.service"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { getErrorMessage } from "@/utils/api-error"
import { Loader2, Camera, Trash2, MoreVertical, Phone, Building2, Save } from "lucide-react"

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fullname, setFullname] = useState(user?.fullname || user?.fullName || "")
  const [phone, setPhone] = useState(user?.phone_number || "")

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem válida")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB")
      return
    }

    setPreview(URL.createObjectURL(file))
    try {
      setUploading(true)
      if (user?.photo_url || user?.user_photo) {
        await AuthService.updatePhoto(file)
      } else {
        await AuthService.uploadPhoto(file)
      }
      const updatedUser = await AuthService.me()
      setUser({ ...user, ...updatedUser, photo_url: updatedUser.user_photo, user_photo: updatedUser.user_photo })
      toast.success("Foto atualizada com sucesso!")
    } catch (error: unknown) {
      setPreview(null)
      toast.error(getErrorMessage(error, "Erro ao enviar foto"))
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleDeletePhoto = async () => {
    setMenuOpen(false)
    try {
      setDeleting(true)
      await AuthService.deletePhoto()
      const updatedUser = await AuthService.me()
      setUser({ ...user, ...updatedUser, photo_url: updatedUser.user_photo, user_photo: updatedUser.user_photo })
      setPreview(null)
      toast.success("Foto removida com sucesso!")
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao remover foto"))
    } finally {
      setDeleting(false)
    }
  }

  const handleSave = async () => {
    if (!fullname.trim()) {
      toast.error("O nome completo é obrigatório")
      return
    }
    try {
      setSaving(true)
      const updatedUser = await AuthService.updateProfile({
        fullname: fullname.trim(),
        phone_number: phone.trim(),
      })
      setUser({ ...user, ...updatedUser, photo_url: updatedUser.user_photo, user_photo: updatedUser.user_photo })
      toast.success("Perfil atualizado com sucesso!")
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao atualizar perfil"))
    } finally {
      setSaving(false)
    }
  }

  const photoUrl = preview || user?.photo_url || user?.user_photo

  return (
    <div className="flex-1 space-y-6 p-6 bg-[var(--background)] min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Meu Perfil</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Gerencie suas informações pessoais e foto de perfil
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="w-24 h-24 bg-gradient-to-r from-[#5b68eb] to-[#28e1fd]">
              <AvatarImage src={photoUrl} alt={user?.fullname} />
              <AvatarFallback className="text-2xl text-white font-semibold">
                {getInitials(user?.fullname)}
              </AvatarFallback>
            </Avatar>

            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}

            {!uploading && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[var(--accent-primary)] text-white hover:opacity-90 transition-colors cursor-pointer"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}

            {photoUrl && !uploading && (
              <div className="absolute top-0 right-0">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-1 rounded-full bg-[var(--card)]/90 shadow text-[var(--muted-foreground)] hover:opacity-90 transition-colors cursor-pointer"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute top-6 right-0 z-20 min-w-[140px] rounded-md border border-[var(--border)] bg-[var(--card)] shadow-md py-1">
                      <button
                        type="button"
                        onClick={handleDeletePhoto}
                        disabled={deleting}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--danger)] hover:bg-[var(--danger-subtle)] disabled:opacity-50 cursor-pointer transition-colors"
                      >
                        {deleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Remover foto
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="space-y-1">
            <p className="text-lg font-semibold text-[var(--foreground)]">{user?.fullname || "Usuário"}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{user?.email}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">
              <Phone className="inline w-3.5 h-3.5 mr-1" />
              Número de Telefone
            </Label>
            <Input
              id="phone_number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </Card>

      {user?.tenant && (
        <Card className="p-6 space-y-4 bg-[var(--muted)] border border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[var(--accent-primary)]" />
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Dados do Comerciante</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {user.tenant.legal_name && (
              <div className="space-y-1">
                <p className="text-xs text-[var(--muted-foreground)]">Nome Legal</p>
                <p className="text-sm font-medium text-[var(--foreground)]">{user.tenant.legal_name}</p>
              </div>
            )}
            {user.tenant.status && (
              <div className="space-y-1">
                <p className="text-xs text-[var(--muted-foreground)]">Status</p>
                <p className="text-sm font-medium capitalize text-[var(--foreground)]">{user.tenant.status}</p>
              </div>
            )}
            {user.tenant.bank_iban && (
              <div className="space-y-1">
                <p className="text-xs text-[var(--muted-foreground)]">IBAN</p>
                <p className="text-sm font-medium font-mono text-[var(--foreground)]">{user.tenant.bank_iban}</p>
              </div>
            )}
            {user.tenant.bank_owner_name && (
              <div className="space-y-1">
                <p className="text-xs text-[var(--muted-foreground)]">Titular da Conta</p>
                <p className="text-sm font-medium text-[var(--foreground)]">{user.tenant.bank_owner_name}</p>
              </div>
            )}
            {user.tenant.client_reference_count && (
              <div className="space-y-1">
                <p className="text-xs text-[var(--muted-foreground)]">Referências de Cliente</p>
                <p className="text-sm font-medium text-[var(--foreground)]">{user.tenant.client_reference_count}</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
