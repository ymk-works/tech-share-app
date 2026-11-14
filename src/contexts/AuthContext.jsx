// Reactから必要な機能を読み込む
import { createContext, useState, useContext } from "react";

// 認証情報を共有するためのContextを作成
const AuthContext = createContext();

// アプリ全体にログイン情報を提供するコンポーネント
export function AuthProvider({ children }) {

  // ログイン中のユーザー情報を管理する
  // 初期値はnull（ログインしていない状態）
  const [user, setUser] = useState(null);

  // ログイン処理
  // 今回は簡易認証なので、ユーザー名を固定している
  const login = () => setUser({ name: "Tech Taro" });

  // ログアウト処理
  // ユーザー情報をnullに戻す
  const logout = () => setUser(null);

  // 子コンポーネントに認証情報と関数を提供する
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ほかのコンポーネントから認証情報を取得するための関数
export const useAuth = () => useContext(AuthContext);