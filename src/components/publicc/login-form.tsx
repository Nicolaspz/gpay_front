"use client";

import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoginForm } from "@/hooks/useLoginForm";
import { ForgotPasswordForm } from "./login/forgot-password-form";
import { LoginTab } from "./login/login-tab";
import { RegisterTab } from "./login/register-tab";
import ThemeSwitcher from "../theme-switcher";

export function LoginForm() {
  const form = useLoginForm();

  return (
    <section className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="w-full max-w-[1425px] mx-auto flex items-center justify-between">
        <div className="w-full max-w-[425px] p-8">
          {/* <button
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              Voltar
            </button> */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/images/gpa.png"
                alt="Logo"
                width={100}
                height={100}
                className="w-full"
              />
            </Link>
          </div>
        </div>

        {/* mudar de tema dark e light */}
        <div className="p-8">
          <div className="flex justify-end bg-accent rounded-full p-2">
            {/* icon para mudar de tema */}
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="flex flex-1 max-w-[1425px] mx-auto w-full">
        {/* Formulário */}
        <div className="w-1/3 flex items-center pr-8 py-8">
          <div className="w-full max-w-[425px]">
            <div className="text-start mb-8">
              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Bem-vindo ao Gpayment
              </h1>
              <p className="text-[var(--muted-foreground)]">
                Gerencie seus pagamentos de forma fácil
              </p>
            </div>

            {form.forgotMode ? (
              <ForgotPasswordForm
                email={form.forgotEmail}
                loading={form.loading}
                onEmailChange={form.handleForgotEmailChange}
                onSubmit={form.handleForgotPassword}
                onBack={() => form.setForgotMode(false)}
              />
            ) : (
              <Tabs
                value={form.activeTab}
                onValueChange={form.setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-[var(--muted)] p-1 rounded-lg mb-6">
                  <TabsTrigger value="login">Entrar</TabsTrigger>

                  <TabsTrigger value="register">Registrar</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginTab
                    email={form.loginForm.email}
                    password={form.loginForm.password}
                    showPassword={form.showPassword.login}
                    loading={form.loading}
                    isLocked={form.isLocked}
                    lockoutSecondsLeft={form.lockoutSecondsLeft}
                    honeypotProps={form.honeypotProps}
                    emailField={form.emailField}
                    passwordField={form.passwordField}
                    onEmailChange={form.handleLoginChange}
                    onPasswordChange={form.handleLoginChange}
                    onTogglePassword={() =>
                      form.togglePasswordVisibility("login")
                    }
                    onForgotPassword={() => form.setForgotMode(true)}
                    onSubmit={form.handleLogin}
                  />
                </TabsContent>

                <TabsContent value="register">
                  <RegisterTab
                    fullname={form.registerForm.fullname}
                    email={form.registerForm.email}
                    phone={form.registerForm.phone_number}
                    password={form.registerForm.password}
                    confirmPassword={form.registerForm.confirmpassword}
                    showPassword={form.showPassword.register}
                    showConfirm={form.showPassword.confirm}
                    passwordErrors={form.passwordErrors}
                    passwordTouched={form.passwordTouched}
                    isPasswordValid={form.isPasswordValid}
                    passwordsMatch={form.passwordsMatch}
                    loading={form.loading}
                    onFullnameChange={form.handleRegisterChange}
                    onEmailChange={form.handleRegisterChange}
                    onPhoneChange={form.handleRegisterChange}
                    onPasswordChange={form.handleRegisterChange}
                    onConfirmChange={form.handleRegisterChange}
                    onTogglePassword={() =>
                      form.togglePasswordVisibility("register")
                    }
                    onToggleConfirm={() =>
                      form.togglePasswordVisibility("confirm")
                    }
                    onSubmit={form.handleRegister}
                  />
                </TabsContent>
              </Tabs>
            )}

            {/* <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Voltar para{" "}
              <Link
                href="/"
                className="text-[#5b68eb] hover:underline font-medium"
              >
                homepage
              </Link>
            </p>
          </div> */}
          </div>
        </div>

        {/* Imagem */}
        <div className="hidden lg:block w-2/3 p-10">
          <div className="relative w-full h-full rounded-3xl overflow-hidden">
            <Image
              src="/img-left.png"
              alt="Gpayment"
              fill
              priority
              className="object-cover dark:hidden"
            />

            <Image
              src="/img-left-dark.png"
              alt="Gpayment"
              fill
              priority
              className="hidden object-cover dark:block"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
          </div>
        </div>
      </main>

      <footer className="w-full max-w-[1425px] mx-auto p-8 flex items-center justify-between">
        <div>
          <nav className="flex justify-center gap-4 mb-4">
            <Link
              href="/privacy"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/terms"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Termos de Serviço
            </Link>
          </nav>
        </div>
        <div className="flex justify-center text-[var(--muted-foreground)] text-sm">
          &copy; {new Date().getFullYear()} Gpayment. Todos os direitos
          reservados.
        </div>
      </footer>
    </section>
  );
}
