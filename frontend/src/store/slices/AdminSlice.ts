import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { IUser } from "../../models";

const initialState = {
  users: [] as IUser[],
  isLoadingAdmin: false,
  errorStatusAdmin: "",
  deleteUserCheck: false,
  changeRoleCheck: false
};

const createSliceWithThunk = buildCreateSlice({
  creators: {
    asyncThunk: asyncThunkCreator
  }
});

export const adminPanelSlice = createSliceWithThunk({
  name: "admin",
  initialState,
  selectors: {
    usersAdminState: (state) => state
  },
  reducers: (create) => ({
    getUsers: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/users/`, {
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
          state.isLoadingAdmin = true;
        },
        fulfilled: (state, action) => {
          state.users = action.payload;
          state.changeRoleCheck = false;
        },
        rejected: (state, action) => {
          state.errorStatusAdmin = action.payload as string;
        },
        settled: (state) => {
          state.isLoadingAdmin = false;
        }
      }
    ),
    changeRoleUser: create.asyncThunk(
      async (state: { userId: number; role: boolean }, { rejectWithValue }) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/admin/users/${state.userId}/`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              },
              body: JSON.stringify({
                is_staff: state.role
              })
            }
          );

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
          state.isLoadingAdmin = true;
        },
        fulfilled: (state) => {
          state.isLoadingAdmin = false;
          state.changeRoleCheck = true;
        },
        rejected: (state, action) => {
          state.errorStatusAdmin = action.payload as string;
        },
        settled: (state) => {
          state.isLoadingAdmin = false;
        }
      }
    ),
    deleteUser: create.asyncThunk(
      async (state: number, { rejectWithValue }) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/admin/users/${state}/`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              }
            }
          );

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
          state.isLoadingAdmin = true;
        },
        fulfilled: (state) => {
          state.isLoadingAdmin = false;
          state.deleteUserCheck = true;
        },
        rejected: (state, action) => {
          state.errorStatusAdmin = action.payload as string;
        },
        settled: (state) => {
          state.isLoadingAdmin = false;
        }
      }
    )
  })
});

export const { getUsers, changeRoleUser, deleteUser } = adminPanelSlice.actions;
export const { usersAdminState } = adminPanelSlice.selectors;
export default adminPanelSlice.reducer;