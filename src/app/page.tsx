
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex h-full w-full max-w-2xl flex-col gap-6 p-6 md:p-10">
      <div className="w-full max-w-2xl text-center">
        <p className="text-sm font-medium text-muted-foreground">
          stock-sim
        </p>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Learn to trade without the risk.
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-muted-foreground">
          Practice stock trading, build portfolios, and track your performance
          with simulated money.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/sign-up" />}
          >
            Get started
          </Button>

          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="/sign-in" />}
          >
            Sign in
          </Button>
        </div>
      </div>
    </main>
  );
}

