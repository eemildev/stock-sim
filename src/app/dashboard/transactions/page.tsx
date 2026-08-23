import { getPortfoliosWithTransactions } from "@/services/portfolios";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function TransactionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        Not authenticated
      </div>
    );
  }
  const portfolios = await getPortfoliosWithTransactions();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {portfolios.map((portfolio) => (
        <div key={portfolio.id}>
          <h2>{portfolio.name}</h2>
          <ul>
            {portfolio.transactions.map((transaction) => (
              <li key={transaction.id}>
                <p>{transaction.type}</p>
                <p>${Number(transaction.quantity).toFixed(2)}</p>
                <p>${Number(transaction.price).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
