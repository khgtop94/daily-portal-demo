import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-4">404</p>
      <p className="text-slate-600 mb-6">존재하지 않는 페이지입니다.</p>
      <Link href="/" className="btn-primary">홈으로</Link>
    </div>
  );
}
