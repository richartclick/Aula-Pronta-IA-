import { getUsoMensal } from "@/lib/uso";
import GerarAulaClient from "./GerarAulaClient";

export const maxDuration = 60;

export default async function GerarAulaPage() {
  const uso = await getUsoMensal();
  return <GerarAulaClient uso={uso} />;
}
