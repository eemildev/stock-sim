import { auth } from "@/lib/auth";
import { headers } from "next/headers"

export default async function Dashboard() {
     const session = await auth.api.getSession({
       headers: await headers(),
     });
    
    if(!session) {
        return <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">Not authenticated</div>
    }
  return (
   <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Welcome {session.user.name}</h2>
   </div>  
  );
}
