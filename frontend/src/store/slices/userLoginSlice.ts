import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { ITokenData, IUserLoginData, IUserState } from "../../models";

const initialState = {
  user: {} as ITokenData,
  isAuthenticated: false,
  isUserLoading: false,
  errorLoginStatus: "",
  errorTokenStatus: "",
  errorTokenRefreshStatus: ""
};

const createSliceWithThunk = buildCreateSlice({
  creators: {
    asyncThunk: asyncThunkCreator
  }
});

export const userLoginSlice = createSliceWithThunk({
  name: "login",
  initialState,
  selectors: {
    userLoginState: (state: IUserState) => state
  },
  reducers: (create) => ({
    loginUser: create.asyncThunk(
      async (state: IUserLoginData, { rejectWithValue }) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/login/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(state)
          });
          if (!response.ok) {
            return rejectWithValue(response.statusText);
          }
          return await response.json();
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        pending: (state) => {
          state.isUserLoading = true;
        },
        fulfilled: (state, action) => {
          state.isAuthenticated = true;
          state.user = { ...state.user, ...action.payload };
          localStorage.clear();
          localStorage.setItem("accessToken", state.user.access);
          localStorage.setItem("refreshToken", state.user.refresh);
          localStorage.setItem("isAuthenticated", state.isAuthenticated ? "true" : "false");
          state.errorLoginStatus = "";
        },
        rejected: (state, action) => {
          state.errorLoginStatus = action.payload as string;
          state.isAuthenticated = false;
          localStorage.setItem("isAuthenticated", state.isAuthenticated ? "true" : "false");
        },
        settled: (state) => {
          state.isUserLoading = false;
        }
      }
    ),
    checkToken: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/token/verify/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: localStorage.getItem("accessToken") })
          });
          if (!response.ok) {
            return rejectWithValue(response.statusText);
          }
          return response.statusText;
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        pending: (state) => {
          state.isUserLoading = true;
        },
        fulfilled: (state) => {
          state.isAuthenticated = true;
          state.errorTokenStatus = "";
        },
        rejected: (state, action) => {
          state.errorTokenStatus = action.payload as string;
        },
        settled: (state) => {
          state.isUserLoading = false;
        }
      }
    ),
    refreshUserToken: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/token/refresh/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ refresh: localStorage.getItem("refreshToken") })
          });
          if (!response.ok) {
            return rejectWithValue(response.statusText);
          }
          return await response.json();
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        pending: (state) => {
          state.isUserLoading = true;
        },
        fulfilled: (state, action) => {
          state.isAuthenticated = true;
          state.user = { ...state.user, ...action.payload };
          localStorage.setItem("accessToken", state.user.access);
          localStorage.setItem("refreshToken", state.user.refresh);
          state.errorTokenStatus = "";
        },
        rejected: (state, action) => {
          state.errorTokenRefreshStatus = action.payload as string;
        },
        settled: (state) => {
          state.isUserLoading = false;
        }
      }
    ),
    logoutUser: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/logout/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify({ refresh: localStorage.getItem("refreshToken") })
          });
          if (!response.ok) {
            return rejectWithValue(response.statusText);
          }
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state) => {
          state.isAuthenticated = false;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.clear();
          state.user = {} as ITokenData;
          state.errorLoginStatus = "";
        },
        rejected: (state, action) => {
          state.errorLoginStatus = action.payload as string;
        }
      }
    ),
    errorUserReset: create.reducer((state) => {
      state.errorLoginStatus = "";
      state.errorTokenStatus = "";
      state.errorTokenRefreshStatus = "";
    })
  })
});

export const { loginUser, logoutUser, refreshUserToken, errorUserReset, checkToken } =
  userLoginSlice.actions;
export const { userLoginState } = userLoginSlice.selectors;
export default userLoginSlice.reducer;
