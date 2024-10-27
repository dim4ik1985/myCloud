import { Path, UseFormRegister } from "react-hook-form";
import React from "react";

export interface IUserRegisterData {
  login: string;
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export interface IUserLoginData {
  login: string;
  password: string;
}

export interface ITokenData {
  access: string;
  refresh: string;
}

export interface IFormState {
  formData: IUserRegisterData;
  isLoading: boolean;
  errorStatus: string;
  errorPassword: string;
  userRegistered: boolean;
}

export interface IUserState {
  user: ITokenData;
  isAuthenticated: boolean;
  isUserLoading: boolean;
  errorLoginStatus: string;
  errorTokenStatus: string;
  errorTokenRefreshStatus: string;
}

export interface IUser {
  id?: number;
  login: string;
  username?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  email: string;
  files?: IFile[];
}

export interface IProfileState {
  isLogin: string;
  isUserLoading: boolean;
  errorProfileStatus: string;
  profile: IUser;
}

export interface IAdminState {
  errorStatusAdmin: string;
  isLoadingAdmin: boolean;
  changeRoleCheck: boolean;
  deleteUserCheck: boolean;
  users: IUser[];
}

export interface IFormInputProps {
  name: Path<IUserRegisterData> | Path<IUserLoginData>;
  register: UseFormRegister<IUserRegisterData> | UseFormRegister<IUserLoginData>;
  required?: boolean;
  helperText?: string;
  label: string;
  type: string;
  validate?: (value: string) => boolean;
  error?: boolean;
}

export interface IModalErrorProps {
  title: string;
  message: string;
}

export interface IBaseFormProps {
  title: string;
  message: string;
  link: string;
  children?: React.ReactNode;
  handler: (event: React.FormEvent<HTMLFormElement>) => void;
}

export interface IFile {
  id?: number;
  file: File;
  name: string;
  size: number;
  created_at?: string;
  last_download_at?: string;
  commentary?: string;
}

export interface IFilesData {
  files: IFile[];
  downloadLink?: string;
  isLoadingFiles: boolean;
  errorStatusFiles: string;
  uploadCheck: boolean;
  renameCheck: boolean;
  deleteCheck: boolean;
  modalRename?: boolean;
}

export interface IUploadFormProps {
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeComment: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;

  inputRef: React.RefObject<HTMLInputElement>;
  onChooseFile: () => void;
  onRemoveFile: () => void;

  selectedFile: File | null;
}
