import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// 検索処理をまとめたカスタムフック
import useSearch from "../hooks/useSearch";
// 環境変数からAPIの接続先URLを取得
const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {

  // ========================================
  // ① 記事データの状態管理
  // ========================================

  // APIから取得した全記事を保存する
  const [articles, setArticles] = useState([]);

  // 記事を読み込んでいるかどうか
  const [loading, setLoading] = useState(true);

  // 記事取得に失敗したときのエラー
  const [error, setError] = useState("");

  // ========================================
  // ② APIから記事を取得
  // ========================================

  useEffect(() => {
    fetch(`${API_URL}/articles`)
      .then((res) => {
        // HTTPエラーが発生した場合
        if (!res.ok) {
          throw new Error("記事の取得に失敗しました");
        }

        // レスポンスをJSONに変換する
        return res.json();
      })
      .then((data) => {
        // 全記事を保存する
        setArticles(data);
      })
      .catch((err) => {
        // 取得エラーを画面に表示できるようにする
        setError(err.message);
      })
      .finally(() => {
        // 読み込み終了
        setLoading(false);
      });
  }, []);

  // ========================================
  // ③ 検索用カスタムフック
  // ========================================

  // 全記事を渡して、検索文字列と検索結果を受け取る
  const {
    searchQuery,
    setSearchQuery,
    filteredArticles,
  } = useSearch(articles);

  // ========================================
  // ④ 画面表示
  // ========================================

  return (
    <div>

      {/* 検索入力欄 */}
      <div className="mb-6">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="記事を検索..."
          aria-label="記事を検索"
          className="w-full p-3 border border-gray-300 rounded-lg bg-white"
        />
      </div>

      {/* 記事を取得している間 */}
      {loading && (
        <p className="text-gray-500">記事を読み込み中...</p>
      )}

      {/* 記事取得エラー */}
      {error && (
        <p role="alert" className="text-red-600">{error}</p>
      )}

      {/* 読み込みが終わり、エラーがない場合 */}
      {!loading && !error && (
        <>
          {/* 記事カードを2列で並べる */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 検索結果の記事だけをカード表示 */}
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                {/* 記事タイトル */}
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  {article.title}
                </h2>

                {/* 投稿者と作成日 */}
                <p className="text-gray-500 text-sm mb-4">
                  {article.author} ・ {article.createdAt}
                </p>

                {/* 記事本文の先頭100文字 */}
                <p className="text-gray-600 line-clamp-3">
                  {article.content.slice(0, 100)}
                </p>
              </Link>
            ))}

          </div>

          {/* 検索結果が0件の場合 */}
          {filteredArticles.length === 0 && (
            <p className="text-gray-500 mt-4">
              記事が見つかりません
            </p>
          )}
        </>
      )}

    </div>
  );
}