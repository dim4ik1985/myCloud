# Generated by Django 5.1.1 on 2024-10-26 15:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_remove_customuser_files_customuser_files'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='files',
        ),
    ]