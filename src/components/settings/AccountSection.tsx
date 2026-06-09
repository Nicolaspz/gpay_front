"use client"
import { useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { AuthService } from "@/services/auth.service"
import { toast } from "react-toastify"
import { getErrorMessage } from "@/utils/api-error"
import { Loader2, Camera, Trash2, MoreVertical } from "lucide-react"

export function AccountSection() {
  const { user, setUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

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
      if (user?.photo_url) {
        await AuthService.updatePhoto(file)
        setUser({ ...user, photo_url: URL.createObjectURL(file) })
        toast.success("Foto atualizada com sucesso!")
      } else {
        await AuthService.uploadPhoto(file)
        setUser({ ...user, photo_url: URL.createObjectURL(file) })
        toast.success("Foto enviada com sucesso!")
      }
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
      setUser({ ...user, photo_url: undefined })
      setPreview(null)
      toast.success("Foto removida com sucesso!")
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao remover foto"))
    } finally {
      setDeleting(false)
    }
  }

  const photoUrl = preview || user?.photo_url

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Informações da Conta</h2>
        <p className="text-sm text-gray-600">Atualize seus dados básicos</p>
      </div>

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
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Camera className="h-4 w-4" />
            </button>
          )}

          {photoUrl && !uploading && (
            <div className="absolute top-0 right-0">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute top-6 right-0 z-20 min-w-[140px] rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-md py-1">
                    <button
                      type="button"
                      onClick={handleDeletePhoto}
                      disabled={deleting}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 cursor-pointer transition-colors"
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
          <p className="text-lg font-semibold">{user?.fullname || "Usuário"}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input id="name" defaultValue={user?.fullname || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="cursor-pointer">Salvar Alterações</Button>
      </div>
    </Card>
  )
}