import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-lg text-center">
        <p className="text-sm text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-extrabold">No hemos encontrado esta vista</h1>
        <p className="mt-3 text-muted-foreground">
          La ruta no existe o el parte solicitado no está disponible en los datos demo.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/app/dashboard">Volver al dashboard</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
