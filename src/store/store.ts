import { trackerReducer } from "@/store/tracker/tracker-slice";
import { configureStore } from "@reduxjs/toolkit";

export const makeStore = () => {
  return configureStore({
    reducer: {
      tracker: trackerReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
