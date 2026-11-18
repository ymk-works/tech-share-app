
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../contexts/AuthContext";

// 環境変数からAPIの接続先URLを取得
const API_URL = import.meta.env.VITE_API_URL;

export default function Editor() {
  // ========================================
  // ① 作成モード・編集モードの判定
  // ========================================

  // URLが /edit/1 なら id は "1"
  // URLが /create なら id は undefined
  const { id } = useParams();

  // idが存在すれば編集モード（true）
  // 存在しなければ新規作成モード（false）
  const isEditMode = Boolean(id);

  // ページ移動に使用
  const navigate = useNavigate();

  // 現在ログインしているユーザーを取得
  const { user } = useAuth();

  // ========================================
  // ② 入力フォームの状態管理
  // ========================================

  // 記事タイトル
  const [title, setTitle] = useState("");

  // Markdown形式の記事本文
  const [content, setContent] = useState("");

  // 編集する記事を読み込み中かどうか
  const [loading, setLoading] = useState(isEditMode);

  // 投稿・更新中かどうか
  const [saving, setSaving] = useState(false);

  // エラーメッセージ
  const [error, setError] = useState("");

  // 編集対象の記事が正しい投稿者のものか
  const [canEdit, setCanEdit] = useState(!isEditMode);

  // ========================================
  // ③ ログイン確認と既存データの読み込み
  // ========================================

  useEffect(() => {
    // 未ログインの場合はトップページへ戻す
    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    // 新規作成なら記事の読み込みは不要
    if (!isEditMode) {
      return;
    }

    // 編集モードの場合だけ既存記事を取得する
    // 接続先は環境変数から取得したAPI_URLを使用
    fetch(`${API_URL}/articles/${id}`)
      .then((response) => {
        // APIから取得できなかった場合
        if (!response.ok) {
          throw new Error("記事の取得に失敗しました");
        }

        return response.json();
      })
      .then((data) => {
        // 自分の記事でなければ編集させない
        if (data.author !== user.name) {
          throw new Error("この記事を編集する権限がありません");
        }

        // 取得した記事を入力欄にセットする
        setTitle(data.title);
        setContent(data.content);
        setCanEdit(true);
      })
      .catch((err) => {
        // エラー内容を画面に表示する
        setError(err.message);
        setCanEdit(false);
      })
      .finally(() => {
        // 読み込み終了
        setLoading(false);
      });
  }, [id, isEditMode, user, navigate]);

  // ========================================
  // ④ 投稿・更新ボタンを押したときの処理
  // ========================================

  const handleSubmit = async (e) => {
    // フォームの標準動作（画面再読み込み）を防ぐ
    e.preventDefault();

    // 未ログインや編集権限なしの場合は保存しない
    if (!user || (isEditMode && !canEdit)) {
      return;
    }

    // タイトルと本文の入力チェック
    // trim()で空白だけの入力も防ぐ
    if (!title.trim() || !content.trim()) {
      window.alert("タイトルと本文を入力してください");
      return;
    }

    // 保存処理を開始
    setSaving(true);
    setError("");

    // ========================================
    // ⑤ サーバーへ送る記事データ
    // ========================================

    // 編集時はタイトルと本文だけを変更する
    // 既存の作成日と投稿者は変更しない
    const articleData = isEditMode
      ? {
          title: title.trim(),
          content: content,
        }
      : {
          // 新規作成時は投稿者と作成日も設定
          title: title.trim(),
          content: content,
          author: user.name,
          createdAt: new Date().toISOString().split("T")[0],
        };

    // ========================================
    // ⑥ POSTとPATCHの切り替え
    // ========================================

    // 編集時は記事ID付きのURL
    // 新規作成時は記事一覧のURL
    // どちらも環境変数のAPI_URLを使用する
    const url = isEditMode
      ? `${API_URL}/articles/${id}`
      : `${API_URL}/articles`;

    // 編集はPATCH、新規作成はPOST
    const method = isEditMode ? "PATCH" : "POST";

    try {
      // APIへ記事データを送信
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        // JavaScriptのオブジェクトをJSON文字列へ変換
        body: JSON.stringify(articleData),
      });

      // サーバーがエラーを返した場合
      if (!response.ok) {
        throw new Error("記事の保存に失敗しました");
      }

      // 保存に成功したらトップページへ移動
      navigate("/");
    } catch (err) {
      // 保存に失敗したらエラーを表示
      setError(err.message);
    } finally {
      // 保存処理の終了
      setSaving(false);
    }
  };

  // ========================================
  // ⑦ 画面表示
  // ========================================

  // 未ログイン時はフォームを表示しない
  if (!user) {
    return null;
  }

  // 編集記事を読み込み中
  if (loading) {
    return <p>記事を読み込み中...</p>;
  }

  // 編集権限がない場合など
  if (isEditMode && !canEdit) {
    return <p role="alert" className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* 見出し：作成・編集で切り替える */}
      <h1 className="text-2xl font-bold text-gray-800">
        {isEditMode ? "記事の編集" : "新規記事作成"}
      </h1>

      {/* 記事入力フォーム */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* タイトル入力欄 */}
        <div>
          <label
            htmlFor="article-title"
            className="block font-bold mb-2"
          >
            タイトル
          </label>

          <input
            id="article-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="記事のタイトルを入力"
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          />
        </div>

        {/* 本文入力とプレビューを左右に配置 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 左側：Markdown入力エリア */}
          <div>
            <label
              htmlFor="article-content"
              className="block font-bold mb-2"
            >
              Markdown入力
            </label>

            <textarea
              id="article-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# 見出しを入力してください"
              className="w-full h-80 p-4 border border-gray-300 rounded-lg bg-white font-mono"
            />
          </div>

          {/* 右側：リアルタイムプレビュー */}
          <div>
            <h2 className="font-bold mb-2">
              プレビュー
            </h2>

            <div className="bg-white border border-gray-300 rounded-lg p-4 min-h-80">
              <div className="prose max-w-none">
                {content ? (
                  // 入力内容をMarkdownからHTML表示に変換
                  <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                  <p className="text-gray-400">
                    ここにプレビューが表示されます
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        )}

        {/* 保存ボタン */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold disabled:opacity-50"
          >
            {saving
              ? "保存中..."
              : isEditMode
                ? "更新する"
                : "投稿する"}
          </button>
        </div>
      </form>
    </div>
  );
}
