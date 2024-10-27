import os
from importlib.metadata import files

from django.utils import timezone
from rest_framework import status
from rest_framework.generics import GenericAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import *
from .models import File



class UserRegistrationAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {
            "refresh": str(token),
            "access": str(token.access_token)
        }

        return Response(data, status=status.HTTP_201_CREATED)



class UserLoginAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        # serializer = CustomUserSerializer(user)
        token = RefreshToken.for_user(user)
        # data = serializer.data

        return Response({
            "refresh": str(token),
            "access": str(token.access_token)
        }, status=status.HTTP_200_OK)



class UserLogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserInfoAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer

    def get_object(self):
        return self.request.user

class AdminPanelAPIView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUser)
    serializer_class = CustomUserSerializer

    def get(self, request):
        users = CustomUser.objects.all()
        data = []

        for user in users:
            files = File.objects.filter(user=user)
            user_data = {
                "id": user.id,
                "login": user.login,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "files": [
                    {
                        "id": file.id,
                        "name": file.name,
                        "size": file.size
                } for file in files]
            }
            data.append(user_data)

        return Response(data)


    def patch(self, request, pk):
        user = CustomUser.objects.get(id=pk)
        serializer = CustomUserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, pk):
        user = CustomUser.objects.get(id=pk)
        os.remove('media/' + f'user_{user.id}')
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]
    serializers_class = FileSerializer

    def get(self, request):
        files = File.objects.filter(user=request.user)
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request):
        serializer = FileSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, pk):
        file = File.objects.get(id=pk)
        serializer = FileSerializer(file, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, pk):
        file = File.objects.get(id=pk)
        if file.user == request.user:
            file.delete()
            os.remove(file.file.path)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class FileDownloadLinkView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        file = File.objects.get(id=pk)
        file.last_download_at = timezone.now()
        file.save()

        serializer = FileSerializer(file)

        return Response(serializer.data.get('file_link'), status=status.HTTP_200_OK)






























