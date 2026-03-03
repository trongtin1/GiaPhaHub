/**
 * index.ts — Redux store chính
 *
 * - configureStore: kết hợp tất cả reducers
 * - Persist: tự động lưu state.family vào localStorage sau mỗi action
 * - Typed hooks: useAppDispatch / useAppSelector — dùng thay cho
 *   useDispatch / useSelector để có type-safety đầy đủ
 *
 * Khi thêm reducer mới (auth, settings, ...):
 *   1. Tạo file xxxSlice.ts trong thư mục này
 *   2. Import reducer và thêm vào object reducer bên dưới
 *   3. TypeScript sẽ tự cập nhật RootState
 */

import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import familyReducer, { saveToStorage } from "./familySlice";

export const store = configureStore({
  reducer: {
    family: familyReducer,
    // auth: authReducer,      ← thêm vào đây khi có
    // settings: settingsReducer,
  },
});

// Persist family state sau mỗi action bất kỳ
store.subscribe(() => saveToStorage(store.getState().family.data));

// ── Types ─────────────────────────────────────────────────────
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ── Typed hooks ───────────────────────────────────────────────
// Luôn dùng 2 hook này thay vì useDispatch / useSelector gốc
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;