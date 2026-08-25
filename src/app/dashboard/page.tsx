"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers"
import { PortfolioList } from "./portfolio-list";
import { AddPortfolio } from "./add-portfolio";

export default async function Dashboard() {
     const session = await auth.api.getSession({
       headers: await headers(),
     });
    
    if(!session) {
        return <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">Not authenticated</div>
    }
  return (
   <div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <PortfolioList />
      <AddPortfolio />
   </div>  
  );
}
