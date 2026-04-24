import { getUsoMensal } from "@/lib/uso";
import GerarAulaClient from "./GerarAulaClient";

export default async function GerarAulaPage() {
  const uso = await getUsoMensal();
  return <GerarAulaClient uso={uso} />;
}
