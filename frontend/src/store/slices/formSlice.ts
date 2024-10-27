import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { IFormState, IUserRegisterData } from "../../models";

const initialState = {
  formData: {},
  isLoading: false,
  errorStatus: "",
  errorPassword: "",
  userRegistered: false
} as IFormState;

const createSliceWithThunk = buildCreateSlice({
  creators: {
    asyncThunk: asyncThunkCreator
  }
});

export const formSlice = createSliceWithThunk({
  name: "form",
  initialState,
  selectors: {
    errorState: (state: IFormState) => state.errorStatus,
    passwordState: (state: IFormState) => state.errorPassword,
    isLoadingState: (state: IFormState) => state.isLoading,
    userRegisteredState: (state: IFormState) => state.userRegistered
  },
  reducers: (create) => ({
    fetchFormData: create.asyncThunk(
      async (state: IUserRegisterData, { rejectWithValue }) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/register/`, {
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
          state.isLoading = true;
        },
        fulfilled: (state) => {
          state.userRegistered = true;
        },
        rejected: (state, action) => {
          state.errorStatus = action.payload as string;
        },
        settled: (state) => {
          state.isLoading = false;
        }
      }
    ),
    errorPass: create.reducer((state) => {
      state.errorPassword = "Пароли не совпадают";
    }),
    errorReset: create.reducer((state) => {
      state.errorStatus = "";
      state.errorPassword = "";
      state.userRegistered = false;
    })
  })
});

export const { fetchFormData, errorPass, errorReset } = formSlice.actions;
export const { errorState, passwordState, isLoadingState, userRegisteredState } =
  formSlice.selectors;
export default formSlice.reducer;
