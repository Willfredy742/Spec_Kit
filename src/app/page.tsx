import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>mi-podcast</h1>
      <p>
        <Link href="/episodes">Browse episodes</Link>
      </p>
    </>
  );
}
