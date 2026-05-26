import { getActiveUser } from "@/lib/session";
import { getSiteById } from "@/lib/mock-data";
import PageHeader from "@/components/PageHeader";
import { Icon } from "@/components/Icon";

export default async function NewLogPage() {
  const user = await getActiveUser("worker");
  if (!user) return null;

  const sites = (user.siteIds || []).map((id) => getSiteById(id)).filter((s): s is NonNullable<typeof s> => !!s);
  const today = "2026-05-26";

  return (
    <div className="space-y-5 animate-in">
      <PageHeader title="새 작업일지" subtitle="제출 시 본사 / 발주처에 알림 자동 발송 (데모 — 실제 저장 안 됨)" />

      <form className="card p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">사이트</label>
            <select className="input" defaultValue={sites[0]?.id}>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">날짜</label>
            <input type="date" className="input" defaultValue={today} />
          </div>
          <div>
            <label className="label">시작 시각</label>
            <input type="time" className="input" defaultValue="08:00" />
          </div>
          <div>
            <label className="label">종료 시각</label>
            <input type="time" className="input" defaultValue="17:00" />
          </div>
        </div>

        <div>
          <label className="label">업무 요약</label>
          <textarea className="input min-h-[100px]" placeholder="예) 전기실 정기 점검, UPS 부하 측정 — 정상 범위" />
        </div>

        <div>
          <label className="label">안전 메모 (선택)</label>
          <textarea className="input min-h-[60px]" placeholder="예) 고압 패널 작업 시 절연장갑 필수" />
        </div>

        <div>
          <label className="label">사진 첨부</label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
            <Icon.Camera className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm text-slate-600">
              사진을 끌어다 놓거나 클릭하여 업로드 (최대 10장)
            </p>
            <p className="text-xs text-slate-400 mt-1">
              📍 GPS / 촬영시각 EXIF 자동 검증. 위변조 의심 시 HQ 리뷰 큐로 라우팅.
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <button type="button" className="btn-primary" disabled>
            <Icon.Check className="w-4 h-4" /> 제출 (데모)
          </button>
          <button type="button" className="btn-secondary" disabled>
            임시 저장
          </button>
          <p className="text-xs text-slate-500 self-center ml-2">
            ※ 데모 환경 — 실제 저장은 비활성. UI 흐름만 확인 가능.
          </p>
        </div>
      </form>
    </div>
  );
}
