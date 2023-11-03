import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-center font-bold text-orange-600 underline">
        Hello world, I am Nata Perp
      </h1>
      <Button>And I am a Button with shadcn UI</Button>
    </main>
  );
}
