import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { IProfileState, IUser } from "../../models";

const initialState = {
  isLogin: "",
  isUserLoading: false,
  errorProfileStatus: "",
  profile: {} as IUser
};

const createSliceWithThunk = buildCreateSlice({
  creators: {
    asyncThunk: asyncThunkCreator
  }
});

export const userProfileSlice = createSliceWithThunk({
  name: "profile",
  initialState,
  selectors: {
    profileState: (state: IProfileState) => state
  },
  reducers: (create) => ({
    profileCheckUser: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/profile/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
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
          state.isLogin = "OK";
          state.profile = action.payload;
          state.errorProfileStatus = "";
          localStorage.setItem("is_staff", action.payload.is_staff ? "true" : "false");
        },
        rejected: (state, action) => {
          state.errorProfileStatus = action.payload as string;
        },
        settled: (state) => {
          state.isUserLoading = false;
        }
      }
    ),

    clearProfile: create.reducer((state) => {
      state.profile = {} as IUser;
      state.isLogin = "";
    }),
    errorProfileReset: create.reducer((state) => {
      state.errorProfileStatus = "";
    })
  })
});

export const { profileCheckUser, clearProfile, errorProfileReset } = userProfileSlice.actions;
export const { profileState } = userProfileSlice.selectors;
export default userProfileSlice.reducer;
