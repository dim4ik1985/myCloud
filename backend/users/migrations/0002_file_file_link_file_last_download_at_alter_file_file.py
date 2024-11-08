# Generated by Django 5.1.1 on 2024-10-19 20:53

import users.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='file_link',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='file',
            name='last_download_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='file',
            name='file',
            field=models.FileField(upload_to=users.models.user_directory_path),
        ),
    ]
