
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// 全ページで共通して使うレイアウト
export default function Layout() {

  // AuthContextからログイン状態と操作用の関数を取得
  const { user, login, logout } = useAuth();

  return (
    // 画面全体の背景色と最小の高さを指定
    <div className="min-h-screen bg-gray-50">

      {/* ① 全ページ共通のヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">

          {/* ロゴをクリックするとトップページへ移動 */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            TechShare
          </Link>

          {/* ② ログイン状態によって表示を切り替える */}
          <div className="flex items-center gap-4">

            {user ? (
              // ログイン中の表示
              <>
                <span className="text-sm text-gray-600">
                  ようこそ、{user.name}さん
                </span>

                <Link
                  to="/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  記事を書く
                </Link>

                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-800"
                >
                  ログアウト
                </button>
              </>
            ) : (
              // ログアウト中の表示
              <button
                onClick={login}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                ログイン
              </button>
            )}

          </div>
        </div>
      </header>

      {/* ③ ページによって内容が切り替わる部分 */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>

    </div>
  );
}
