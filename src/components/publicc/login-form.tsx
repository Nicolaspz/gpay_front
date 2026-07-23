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
      {/* Header */}
      <header className="w-full max-w-[1425px] mx-auto flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 lg:px-8 lg:py-8">
        <div className="flex justify-start">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/images/gpa.png"
              alt="Logo"
              width={100}
              height={100}
              className="w-20 sm:w-24 md:w-28 lg:w-full"
            />
          </Link>
        </div>

        <div className="bg-accent rounded-full p-1.5 sm:p-2">
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col lg:flex-row max-w-[1425px] mx-auto w-full">
        {/* Formulário */}
        <div className="w-full lg:w-1/3 flex items-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-8 lg:pr-8 lg:py-8">
          <div className="w-full max-w-full sm:max-w-[425px] mx-auto lg:mx-0">
            <div className="text-start mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--foreground)] mb-2">
                Bem-vindo ao Gpayment
              </h1>
              <p className="text-sm sm:text-base text-[var(--muted-foreground)]">
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
                <TabsList className="grid w-full grid-cols-2 bg-[var(--muted)] p-1 rounded-lg mb-4 sm:mb-6">
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
          </div>
        </div>

        {/* Imagem */}
        <div className="hidden lg:flex w-2/3 p-8 lg:p-10">
          <div className="relative w-full h-full min-h-[500px] rounded-3xl overflow-hidden">
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

      {/* Footer */}
      <footer className="w-full max-w-[1425px] mx-auto px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
        <nav className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
          <Link
            href="/privacy"
            className="text-xs sm:text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            Política de Privacidade
          </Link>
          <Link
            href="/terms"
            className="text-xs sm:text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            Termos de Serviço
          </Link>
        </nav>
        <div className="text-[var(--muted-foreground)] text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} Gpayment. Todos os direitos
          reservados.
        </div>
      </footer>
    </section>
  );
}
