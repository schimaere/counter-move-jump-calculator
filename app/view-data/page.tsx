import AuthWrapper from "../components/AuthWrapper";
import MeasurementsList from "../components/MeasurementsList";
import Header from "../components/Header";

export default function ViewDataPage() {
  return (
    <AuthWrapper>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-24">
        <div className="z-10 max-w-5xl w-full">
          <Header />
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 md:mb-8 text-gray-900 dark:text-white px-2">
            Measurements
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4 md:mb-8 px-2">
            Manage measurement data for athletes
          </p>
          <MeasurementsList />
        </div>
      </main>
    </AuthWrapper>
  );
}
