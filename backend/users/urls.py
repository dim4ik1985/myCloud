from django.urls import path
from .views import *

app_name="users"

urlpatterns = [
    path('users/register/', UserRegistrationAPIView.as_view()),
    path('users/login/', UserLoginAPIView.as_view(), name="login-user"),
    path('users/logout/', UserLogoutAPIView.as_view(), name="logout-user"),
    path('users/profile/', UserInfoAPIView.as_view(), name="user-profile"),
    path('users/files/', FileUploadView.as_view(), name="file-upload"),
    path('users/files/<int:pk>/', FileUploadView.as_view(), name="file-rename"),
    path('users/files/<int:pk>/', FileUploadView.as_view(), name="file-delete"),
    path('users/files/<int:pk>/download/', FileDownloadLinkView.as_view(), name="file-download"),
    path('admin/users/', AdminPanelAPIView.as_view(), name="users-info"),
    path('admin/users/<int:pk>/', AdminPanelAPIView.as_view(), name="user-role-change"),
    path('admin/users/<int:pk>/', AdminPanelAPIView.as_view(), name="user-delete"),
    path('admin/users/<int:pk>/files/', UserFileAPIView.as_view(), name="users-files"),
    path('admin/users/<int:pk>/files/', UserFileAPIView.as_view(), name="users-files-delete"),
]




