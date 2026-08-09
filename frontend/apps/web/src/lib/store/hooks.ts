import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./index";

/** 素の useDispatch / useSelector ではなく必ずこちらを使う（型が付く） */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
