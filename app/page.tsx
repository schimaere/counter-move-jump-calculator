import JumpCalculator from "./components/JumpCalculator";
import Header from "./components/Header";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
      <div className="z-10 max-w-5xl w-full">
        <Header />
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Counter Move Jump Calculator
        </h1>
        <JumpCalculator />
      </div>
    </main>
  );
}
