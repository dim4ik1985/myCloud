# Generated by Django 5.1.1 on 2024-10-28 06:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_remove_customuser_files'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='storage_path',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]