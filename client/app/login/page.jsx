import LoginForm from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto my-10">
      <h1 className="text-3xl font-bold text-center mb-6">Login to Taskly</h1>
      <LoginForm />
    </div>
  )
}
