
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ログイン状態をアプリ全体で共有する
import { AuthProvider } from "./contexts/AuthContext";

// 全ページ共通のレイアウト
import Layout from "./components/templates/Layout";

// 各ページのコンポーネント
import Home from "./pages/Home";
import Article from "./pages/Article";
import Editor from "./pages/Editor";

export default function App() {
  return (
    // ① アプリ全体で認証情報を使えるようにする
    <AuthProvider>

      {/* ② URLに応じた画面切り替えを有効にする */}
      <BrowserRouter>
        <Routes>

          {/* ③ すべての画面に共通のLayoutを適用 */}
          <Route path="/" element={<Layout />}>

            {/* トップページ：記事一覧 */}
            <Route index element={<Home />} />

            {/* 記事詳細：idで記事を指定 */}
            <Route path="articles/:id" element={<Article />} />

            {/* 記事の新規作成 */}
            <Route path="create" element={<Editor />} />

            {/* 既存記事の編集 */}
            <Route path="edit/:id" element={<Editor />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
