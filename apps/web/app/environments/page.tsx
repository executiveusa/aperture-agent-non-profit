async function fetchData(path: string) {
  const api = process.env.API_BASE_URL ?? "http://localhost:4000";
  const res = await fetch(api + path, { headers: { "x-internal-auth": process.env.INTERNAL_AUTH_TOKEN ?? "dev-token" }, cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}
export default async function Page() {
  const data = await fetchData('/environments');
  return <main><h2>Environments</h2><pre>{JSON.stringify(data, null, 2)}</pre></main>;
}
