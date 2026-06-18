import { MirrorStage } from './components/Mirror/MirrorStage';
import { ProductSidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';

export function App() {
  return (
    <main className="flex min-h-screen bg-mirror-bg text-mirror-text">
      <section className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b border-mirror-border px-6">
          <span className="text-lg font-semibold tracking-wide">
            Smart Mirror
          </span>
        </header>

        <div className="flex flex-1 items-stretch p-6">
          <MirrorStage />
        </div>

        <StatusBar />
      </section>

      <ProductSidebar />
    </main>
  );
}
