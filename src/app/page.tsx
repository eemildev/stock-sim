import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Get started on paper trading with stock-sim
      </h2>
      <Button variant="default" size="lg">
        <a href="/sign-up">Sign Up</a>
      </Button>
    </div>
  );
}
