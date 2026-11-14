
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {

  // ① 記事データを保存するためのState
  // 最初は何も取得していないので空の配列 []
  const [articles, setArticles] = useState([]);

  // ② ページが表示されたときにAPIから記事を取得
  useEffect(() => {

    // バックエンドのAPIにリクエストを送る
    fetch("http://localhost:3000/articles")

      // 返ってきたレスポンスをJSONに変換する
      .then((res) => res.json())

      // 取得した記事データをStateに保存する
      .then((data) => setArticles(data))

      // 通信に失敗した場合はコンソールにエラーを表示
      .catch((error) => console.error("記事取得エラー:", error));

  }, []); // [] は初回表示時に実行する指定

  return (
    // ③ 記事カードを2列で並べる
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* ④ 記事データを1件ずつ取り出してカードを作る */}
      {articles.map((article) => (

        // カード全体をクリックできるリンクにする
        <Link
          key={article.id}
          to={`/articles/${article.id}`}
          className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition"
        >

          {/* 記事のタイトル */}
          <h2 className="text-xl font-bold mb-2 text-gray-800">
            {article.title}
          </h2>

          {/* 投稿者と作成日 */}
          <p className="text-gray-500 text-sm mb-4">
            {article.author} ・ {article.createdAt}
          </p>

          {/* 記事本文の冒頭100文字を表示 */}
          <p className="text-gray-600 line-clamp-3">
            {article.content.slice(0, 100)}
          </p>

        </Link>
      ))}

      {/* 記事が0件だった場合 */}
      {articles.length === 0 && (
        <p className="text-gray-500">記事が見つかりません</p>
      )}

    </div>
  );
}
