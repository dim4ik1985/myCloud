import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { IFile, IFilesData } from "../../models";

const initialState: IFilesData = {
  files: [],
  downloadLink: "",
  isLoadingFiles: false,
  errorStatusFiles: "",
  uploadCheck: false,
  renameCheck: false,
  deleteCheck: false,
  modalRename: false
};

const createSliceWithThunk = buildCreateSlice({
  creators: {
    asyncThunk: asyncThunkCreator
  }
});

export const filesSlice = createSliceWithThunk({
  name: "files",
  initialState,
  selectors: {
    fileState: (state) => state
  },
  reducers: (create) => ({
    uploadFiles: create.asyncThunk(
      async (state: IFile, { rejectWithValue }) => {
        try {
          const formData = new FormData();
          formData.append("file", state.file as File);
          formData.append("name", state.name ?? "");
          formData.append("commentary", state.commentary ?? "");
          formData.append("size", state.size?.toString() ?? "");

          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/files/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: formData
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
          state.isLoadingFiles = true;
        },
        fulfilled: (state) => {
          state.isLoadingFiles = false;
          state.uploadCheck = true;
        },
        rejected: (state, action) => {
          state.errorStatusFiles = action.payload as string;
        },
        settled: (state) => {
          state.isLoadingFiles = false;
        }
      }
    ),
    renameFiles: create.asyncThunk(
      async (state: { fileId: number; name: string }, { rejectWithValue }) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/users/files/${state.fileId}/`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              },
              body: JSON.stringify({
                name: state.name
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
          state.isLoadingFiles = true;
        },
        fulfilled: (state) => {
          state.isLoadingFiles = false;
          state.renameCheck = true;
        },
        rejected: (state, action) => {
          state.errorStatusFiles = action.payload as string;
        },
        settled: (state) => {
          state.isLoadingFiles = false;
        }
      }
    ),
    renameComment: create.asyncThunk(
      async (state: { fileId: number; commentary: string }, { rejectWithValue }) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/users/files/${state.fileId}/`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              },
              body: JSON.stringify({
                commentary: state.commentary
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
          state.isLoadingFiles = true;
        },
        fulfilled: (state) => {
          state.isLoadingFiles = false;
          state.renameCheck = true;
        },
        rejected: (state, action) => {
          state.errorStatusFiles = action.payload as string;
        },
        settled: (state) => {
          state.isLoadingFiles = false;
        }
      }
    ),
    getFiles: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/files/`, {
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
          state.isLoadingFiles = true;
        },
        fulfilled: (state, action) => {
          state.isLoadingFiles = false;
          state.files = action.payload;
          state.uploadCheck = false;
          state.deleteCheck = false;
          state.renameCheck = false;
        },
        rejected: (state, action) => {
          state.errorStatusFiles = action.payload as string;
        },
        settled: (state) => {
          state.isLoadingFiles = false;
        }
      }
    ),
    deleteFiles: create.asyncThunk(
      async (state: number, { rejectWithValue }) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/users/files/${state}/`,
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
          state.isLoadingFiles = true;
        },
        fulfilled: (state) => {
          state.isLoadingFiles = false;
          state.deleteCheck = true;
        },
        rejected: (state, action) => {
          state.errorStatusFiles = action.payload as string;
        },
        settled: (state) => {
          state.isLoadingFiles = false;
        }
      }
    ),
    downloadFilesLink: create.asyncThunk(
      async (state: number, { rejectWithValue }) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/users/files/${state}/download/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              }
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
          state.isLoadingFiles = true;
        },
        fulfilled: (state, action) => {
          state.isLoadingFiles = false;
          state.downloadLink = action.payload;
          state.errorStatusFiles = "";
        },
        rejected: (state, action) => {
          state.errorStatusFiles = action.payload as string;
        },
        settled: (state) => {
          state.isLoadingFiles = false;
        }
      }
    ),
    errorFilesReset: create.reducer((state) => {
      state.errorStatusFiles = "";
    }),
    modalActions: create.reducer((state, action: { payload: boolean }) => {
      state.modalRename = action.payload;
    })
  })
});

export const {
  uploadFiles,
  renameFiles,
  renameComment,
  getFiles,
  deleteFiles,
  downloadFilesLink,
  errorFilesReset,
  modalActions
} = filesSlice.actions;
export const { fileState } = filesSlice.selectors;
export default filesSlice.reducer;
