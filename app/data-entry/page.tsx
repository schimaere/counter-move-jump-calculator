import AuthWrapper from "../components/AuthWrapper"
import DataEntryForm from "../components/DataEntryForm"
import Header from "../components/Header"

export default function DataEntryPage() {
  return (
    <AuthWrapper>
      <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
        <div className="z-10 max-w-5xl w-full">
          <Header />
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Data Entry
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Authorized users only - Enter your data below
          </p>
          <DataEntryForm />
        </div>
      </main>
    </AuthWrapper>
  )
}

