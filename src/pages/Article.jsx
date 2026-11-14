
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../contexts/AuthContext";

// 記事詳細ページ
export default function Article() {

  // ① URLの「:id」から記事IDを取得する
  const { id } = useParams();

  // ② 削除後などにプログラムからページ移動するための関数
  const navigate = useNavigate();

  // ③ 現在ログインしているユーザーを取得する
  const { user } = useAuth();

  // ④ 記事データを保持する（最初は未取得なのでnull）
  const [article, setArticle] = useState(null);

  // 読み込み状態とエラーを管理する（教材への補足）
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ⑤ URLのIDに対応する記事をAPIから取得する
  useEffect(() => {
    // 記事IDが変わった場合も読み込み状態に戻す
    setLoading(true);
    setError("");
    setArticle(null);

    fetch(`http://localhost:3000/articles/${id}`)

      // サーバーからの応答をチェックしてJSONに変換
      .then((res) => {
        if (!res.ok) {
          throw new Error("記事を取得できませんでした");
        }
        return res.json();
      })

      // 取得した記事をStateに保存
      .then((data) => setArticle(data))

      // 取得に失敗した場合はエラーを保存
      .catch((err) => setError(err.message))

      // 取得処理が終わったら読み込み状態を解除
      .finally(() => setLoading(false));

  }, [id]); // IDが変わるたびに再取得する

  // ⑥ 記事の削除処理
  const handleDelete = async () => {

    // 投稿者本人以外による削除処理を防ぐ
    if (!user || user.name !== article?.author) return;

    // キャンセルされた場合は何もしない
    if (!window.confirm("この記事を削除しますか？")) return;

    try {
      // DELETEメソッドで記事を削除する
      const res = await fetch(
        `http://localhost:3000/articles/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        throw new Error("記事の削除に失敗しました");
      }

      // 削除成功後、記事一覧ページへ戻る
      navigate("/");

    } catch (err) {
      setError(err.message);
    }
  };

  // ⑦ 記事の取得が完了するまで表示する
  if (loading) {
    return <div>読み込み中...</div>;
  }

  // 記事が存在しない、または取得に失敗した場合
  if (!article) {
    return <div>{error || "記事が見つかりません"}</div>;
  }

  return (
    // ⑧ 記事全体の表示
    <article className="bg-white p-8 rounded-lg shadow">

      {/* 記事タイトル */}
      <h1 className="text-2xl font-bold mb-2">
        {article.title}
      </h1>

      {/* 投稿者名と作成日 */}
      <p className="text-sm text-gray-500 mb-4">
        {article.author} / {article.createdAt}
      </p>

      {/* ⑨ ログイン中かつ投稿者本人だけに操作ボタンを表示 */}
      {user && user.name === article.author && (
        <div className="flex gap-2 mb-6">

          {/* 編集ページへのリンク */}
          <Link
            to={`/edit/${id}`}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded"
          >
            編集
          </Link>

          {/* 記事の削除ボタン */}
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-red-500 text-red-500 rounded"
          >
            削除
          </button>

        </div>
      )}

      {/* ⑩ Markdown形式の本文をHTMLとして表示 */}
      <div className="prose max-w-none">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>

      {/* 削除などでエラーが発生した場合 */}
      {error && <p role="alert">{error}</p>}

    </article>
  );
}
