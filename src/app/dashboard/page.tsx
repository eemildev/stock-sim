import { auth } from "@/lib/auth";
import { headers } from "next/dist/server/request/headers";

export default async function Dashboard() {
     const session = await auth.api.getSession({
       headers: await headers(),
     });
    
    if(!session) {
        return <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">Not authenticated</div>
    }
  return (
   <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <h1>Welcome {session.user.name}</h1>
   </div>
       
  );
}
