import { getUserById, getPaymentHistory } from "@/lib/data"
import PaymentHistoryList from "@/components/payment-history-list"

export default function ProfilePage() {
  // In a real app, we would get the userId from the session
  const userId = 1
  const user = getUserById(userId)
  const paymentHistory = getPaymentHistory(userId)

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>

            <div className="space-y-4">
              <div>
                <label className="form-label">Name</label>
                <div className="form-input bg-gray-50">{user.name}</div>
              </div>

              <div>
                <label className="form-label">Email</label>
                <div className="form-input bg-gray-50">{user.email}</div>
              </div>

              <div className="pt-2">
                <button className="btn-primary">Edit Profile</button>
              </div>
            </div>
          </div>

          <div className="card mt-6">
            <h2 className="text-xl font-bold mb-4">Payment History</h2>
            <PaymentHistoryList payments={paymentHistory} />
          </div>
        </div>

        <div>
          <div className="card sticky top-4">
            <h2 className="text-xl font-bold mb-4">Account Summary</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Enrolled Courses</h3>
                <p className="text-2xl font-bold">{user.enrolledCourses.length}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
                <p className="text-2xl font-bold text-purple-600">
                  ${paymentHistory.reduce((total, payment) => total + payment.amount, 0).toFixed(2)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                <p className="text-lg font-medium">January 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
