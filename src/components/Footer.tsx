export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-xs text-slate-500 space-y-1.5">
        <p>
          <strong className="text-slate-700">⚠️ 본 사이트는 익명화된 케이스 스터디 데모입니다.</strong>{" "}
          실제 운영 시스템·고객사 정보·실 데이터를 포함하지 않으며, 회사·사이트·인물명은 모두 가상입니다.
        </p>
        <p>
          소스 : <a className="text-brand-600 hover:underline" href="https://github.com/khgtop94/daily-portal-demo" target="_blank" rel="noreferrer">github.com/khgtop94/daily-portal-demo</a>
          {" · "}
          케이스 스터디 : <a className="text-brand-600 hover:underline" href="https://github.com/khgtop94/daily-portal-case-study" target="_blank" rel="noreferrer">daily-portal-case-study</a>
        </p>
        <p>© 2026 Han-Gyeol Kim — for portfolio / case-study purposes only</p>
      </div>
    </footer>
  );
}
