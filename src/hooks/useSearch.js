// ReactのState管理と計算結果の保存機能を読み込む
import { useState, useMemo } from "react";

// ========================================
// ① 検索用カスタムフック
// ========================================

// initialArticlesには全記事の配列が渡される
export default function useSearch(initialArticles) {

  // 検索欄に入力された文字を管理
  const [searchQuery, setSearchQuery] = useState("");

  // ========================================
  // ② 記事の絞り込み処理
  // ========================================

  // 記事一覧か検索ワードが変わったときだけ再計算
  const filteredArticles = useMemo(() => {

    // 検索ワードの前後の空白を除去し、小文字に統一
    const lowerQuery = searchQuery.trim().toLowerCase();

    // 検索ワードが空なら全記事を返す
    if (!lowerQuery) {
      return initialArticles;
    }

    // 条件に一致した記事だけを取り出す
    return initialArticles.filter((article) => {

      // タイトルを小文字に変換
      const title = article.title.toLowerCase();

      // 本文を小文字に変換
      const content = article.content.toLowerCase();

      // タイトルまたは本文に検索ワードが含まれていればtrue
      return (
        title.includes(lowerQuery) ||
        content.includes(lowerQuery)
      );
    });

  }, [initialArticles, searchQuery]);

  // ========================================
  // ③ Home.jsxへ検索結果を渡す
  // ========================================

  return {
    searchQuery,        // 現在の検索ワード
    setSearchQuery,     // 検索ワードを変更する関数
    filteredArticles,   // 絞り込み後の記事一覧
  };
}