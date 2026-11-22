
"use client";

import { useEffect, useMemo, useState } from "react";
import { units } from "@/lib/units";
import {
  calculateStreak,
  getToday,
  initialData,
  loadData,
  saveData,
  type StudyData,
} from "@/lib/storage";

type Page = "dashboard" | "units" | "settings";

export default function Home() {
  const [data, setData] = useState<StudyData>(initialData);
  const [page, setPage] = useState<Page>("dashboard");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [today, setToday] = useState("");

useEffect(() => {
  setData(loadData());
  setToday(getToday());
  setReady(true);
}, []);

  useEffect(() => {
    if (ready) saveData(data);
  }, [data, ready]);

  const completedCount = data.completedUnits.length;
  const progress = Math.round((completedCount / units.length) * 100);
const streak = useMemo(
  () => (today ? calculateStreak(data.studyDates) : 0),
  [data.studyDates, today]
);

const studiedToday = today
  ? data.studyDates.includes(today)
  : false;
  
  function recordStudy(minutes: number) {
    setData((previous) => ({
      ...previous,
      studyMinutes: previous.studyMinutes + minutes,
      studyDates: previous.studyDates.includes(today)
        ? previous.studyDates
        : [...previous.studyDates, today],
    }));
    setMessage(`${minutes}分の学習を記録しました！`);
  }

  function toggleUnit(id: number) {
    setData((previous) => {
      const completed = previous.completedUnits.includes(id);

      return {
        ...previous,
        completedUnits: completed
          ? previous.completedUnits.filter((unitId) => unitId !== id)
          : [...previous.completedUnits, id],
        studyDates: completed || previous.studyDates.includes(today)
          ? previous.studyDates
          : [...previous.studyDates, today],
      };
    });
    setMessage("学習状況を更新しました！");
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "english-studio-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importData(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));

        if (
          parsed.version !== 1 ||
          !Array.isArray(parsed.completedUnits) ||
          !Array.isArray(parsed.studyDates) ||
          typeof parsed.studyMinutes !== "number" ||
          typeof parsed.dailyGoal !== "number" ||
          !parsed.completedUnits.every(
            (id: unknown) =>
              Number.isInteger(id) &&
              typeof id === "number" &&
              id >= 1 &&
              id <= 24
          ) ||
          !parsed.studyDates.every(
            (date: unknown) =>
              typeof date === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(date)
          ) ||
          parsed.studyMinutes < 0 ||
          parsed.dailyGoal < 1 ||
          parsed.dailyGoal > 1440
        ) {
          throw new Error("Invalid backup");
        }

        const imported: StudyData = {
          version: 1,
          completedUnits: [...new Set<number>(parsed.completedUnits as number[])],
          studyDates: [...new Set<string>(parsed.studyDates as string[])],
          studyMinutes: parsed.studyMinutes,
          dailyGoal: parsed.dailyGoal,
        };

        setData(imported);
        setMessage("データを読み込みました！");
      } catch {
        setMessage("ファイルの形式が正しくありません。");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  function updateGoal(value: number) {
    if (!Number.isFinite(value)) return;
    setData((previous) => ({
      ...previous,
      dailyGoal: Math.min(1440, Math.max(1, Math.round(value))),
    }));
  }

  const pageTitle = {
    dashboard: "ダッシュボード",
    units: "学習カリキュラム",
    settings: "設定・データ管理",
  }[page];

  if (!ready) {
    return <main className="main-content">Loading...</main>;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">
          ENGLISH<span>.</span>STUDIO
        </div>

        <nav>
          <p className="nav-label">MENU</p>

          <button
            className={`nav-item ${page === "dashboard" ? "active" : ""}`}
            onClick={() => setPage("dashboard")}
          >
            ◫ ダッシュボード
          </button>

          <button
            className={`nav-item ${page === "units" ? "active" : ""}`}
            onClick={() => setPage("units")}
          >
            ▤ 学習カリキュラム
          </button>

          <button
            className={`nav-item ${page === "settings" ? "active" : ""}`}
            onClick={() => setPage("settings")}
          >
            ⚙ 設定・データ管理
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="eyebrow">YOUR LEARNING SPACE</div>
            <h1 className="page-title">{pageTitle}</h1>
          </div>
          <div className="date-label">{today}</div>
        </header>

        {message && (
          <div
            style={{
              background: "#edf8f3",
              color: "#278465",
              padding: "12px 16px",
              borderRadius: 10,
              marginBottom: 18,
              fontSize: 13,
            }}
          >
            {message}
            <button
              onClick={() => setMessage("")}
              style={{ float: "right", border: 0, background: "none" }}
            >
              ×
            </button>
          </div>
        )}

        {page === "dashboard" && (
          <>
            <section className="welcome-card">
              <div className="welcome-tag">LET'S LEARN ENGLISH</div>
              <h2>今日も一歩ずつ。</h2>
              <p>
                小さな積み重ねが、英語の力になる。
                自分のペースで進めていこう。
              </p>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">UNIT 完了数</div>
                <div className="stat-value">
                  {completedCount}
                  <span style={{ fontSize: 13, color: "#8994a8" }}>
                    {" "}/ 24
                  </span>
                </div>
                <div className="stat-sub">学習済みの単元</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">学習進捗率</div>
                <div className="stat-value">{progress}%</div>
                <div className="stat-sub">全24 UNIT中</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">連続学習日数</div>
                <div className="stat-value">{streak}日</div>
                <div className="stat-sub">継続は力なり</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">累計学習時間</div>
                <div className="stat-value">
                  {Math.floor(data.studyMinutes / 60)}
                  <span style={{ fontSize: 13, color: "#8994a8" }}>時間</span>
                  {data.studyMinutes % 60}
                  <span style={{ fontSize: 13, color: "#8994a8" }}>分</span>
                </div>
                <div className="stat-sub">これまでの合計</div>
              </div>
            </section>

            <section className="panel">
              <div className="section-heading">
                <h2>カリキュラムの進捗</h2>
                <strong style={{ color: "#526ee8" }}>{progress}%</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="progress-caption">
                <span>{completedCount} UNIT 完了</span>
                <span>残り {24 - completedCount} UNIT</span>
              </div>
            </section>

            <section className="panel">
              <div className="section-heading">
                <h2>今日の学習</h2>
                <span className="date-label">
                  {studiedToday ? "学習記録あり" : "まだ記録がありません"}
                </span>
              </div>

              <p className="empty-note">
                学習した時間を記録しよう。実際の学習時間に合わせて選んでね。
              </p>

              <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                {[5, 15, 30, 60].map((minutes) => (
                  <button
                    className="primary-button"
                    key={minutes}
                    onClick={() => recordStudy(minutes)}
                  >
                    ＋ {minutes}分
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 22 }}>
                <div className="progress-caption">
                  <span>今日の目標：{data.dailyGoal}分</span>
                  <span>
                    {studiedToday ? "学習日として記録済み" : "未達成"}
                  </span>
                </div>
              </div>
            </section>

            <section>
              <div className="section-heading">
                <h2>学習を続ける</h2>
                <button
                  className="secondary-button"
                  onClick={() => setPage("units")}
                >
                  すべて見る →
                </button>
              </div>

              <div className="unit-grid">
                {units.slice(0, 3).map((unit) => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    done={data.completedUnits.includes(unit.id)}
                    onToggle={() => toggleUnit(unit.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {page === "units" && (
          <>
            <section className="panel">
              <div className="section-heading">
                <h2>全24 UNIT</h2>
                <span className="date-label">
                  {completedCount} / 24 完了
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>

            {["基礎", "応用", "発展"].map((category) => (
              <section key={category} style={{ marginBottom: 30 }}>
                <div className="section-heading">
                  <h2>{category}</h2>
                </div>

                <div className="unit-grid">
                  {units
                    .filter((unit) => unit.category === category)
                    .map((unit) => (
                      <UnitCard
                        key={unit.id}
                        unit={unit}
                        done={data.completedUnits.includes(unit.id)}
                        onToggle={() => toggleUnit(unit.id)}
                      />
                    ))}
                </div>
              </section>
            ))}
          </>
        )}

        {page === "settings" && (
          <>
            <section className="panel">
              <div className="section-heading">
                <h2>学習目標</h2>
              </div>

              <div className="settings-row">
                <div>
                  <strong style={{ fontSize: 14 }}>1日の学習目標</strong>
                  <p className="empty-note">目標時間を分単位で設定</p>
                </div>
                <input
                  className="settings-input"
                  type="number"
                  min="1"
                  max="1440"
                  value={data.dailyGoal}
                  onChange={(event) =>
                    updateGoal(Number(event.target.value))
                  }
                />
              </div>
            </section>

            <section className="panel">
              <div className="section-heading">
                <h2>データの引き継ぎ</h2>
              </div>

              <p className="empty-note">
                学習記録をJSONファイルとして保存できます。
                別の端末では、そのファイルを読み込んで引き継げます。
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="primary-button" onClick={exportData}>
                  ↓ データを書き出す
                </button>

                <label className="secondary-button">
                  ↑ データを読み込む
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={importData}
                    hidden
                  />
                </label>
              </div>
            </section>

            <section className="panel">
              <div className="section-heading">
                <h2>学習データのリセット</h2>
              </div>
              <p className="empty-note">
                学習記録をすべて初期状態に戻します。
                必要なら先にバックアップを保存してください。
              </p>
              <button
                className="secondary-button"
                onClick={() => {
                  if (
                    window.confirm(
                      "すべての学習記録を削除しますか？この操作は取り消せません。"
                    )
                  ) {
                    setData(initialData);
                    setMessage("学習データをリセットしました。");
                  }
                }}
              >
                学習データをリセット
              </button>
            </section>
          </>
        )}

        <footer
          style={{
            textAlign: "center",
            color: "#a0a9b9",
            fontSize: 11,
            padding: "35px 0 10px",
          }}
        >
          ENGLISH STUDIO · KEEP LEARNING
        </footer>
      </main>
    </div>
  );
}

function UnitCard({
  unit,
  done,
  onToggle,
}: {
  unit: (typeof units)[number];
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="unit-card">
      <div className="unit-number">
        UNIT {String(unit.id).padStart(2, "0")}
      </div>

      <div className="unit-title">{unit.title}</div>

      <div className="unit-meta">
        教材 p.{unit.pages[0]}–{unit.pages[1]}
      </div>

      <a
        href={`/materials/grammar.pdf#page=${unit.pages[0]}`}
        target="_blank"
        rel="noopener noreferrer"
        className="unit-button"
        style={{
          display: "block",
          textAlign: "center",
          textDecoration: "none",
        }}
      >
        教材を開く ↗
      </a>

      <button
        className={`unit-button ${done ? "done" : ""}`}
        onClick={onToggle}
      >
        {done ? "✓ 学習完了" : "学習完了にする"}
      </button>
    </article>
  );
}
