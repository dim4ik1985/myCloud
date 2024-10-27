from rest_framework import serializers
from .models import CustomUser, File
from django.contrib.auth import authenticate


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'login', 'email', 'is_staff', 'is_superuser')


class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'login', 'username', 'email', 'password1', 'password2')
        extra_kwargs = {
            'password1': {'write_only': True},
            'password2': {'write_only': True}
        }

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({'Passwords must match.'})
        return data


    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')

        return CustomUser.objects.create_user(**validated_data, password=password)


class UserLoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")



class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'file', 'name', 'commentary', 'size', 'created_at', 'last_download_at', 'file_link']






