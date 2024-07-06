"""
URL configuration for StudentBE project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from student import views
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path("admin/", admin.site.urls),
    path("students/", views.get_students),   # 获取所有学生信息的接口
    path("students/query", views.query_students), # 查询学生信息的接口
    path('students/check_sno', views.check_sno), #校验要添加的学号的接口
    path('students/add_student', views.add_student), # 添加学生的接口
    path('students/update_student', views.add_student), # 添加学生的接口
    path('students/delete_student', views.delete_student), # 删除学生的接口
    path('students/delete_students', views.delete_students), # 删除学生的接口
    path('students/upload_img', views.upload_img),      # 上传图像的接口
    path('students/import_students', views.import_students_excel), # 从excel导入数据的接口
    path('students/export_students', views.export_students), # 从数据库中导出学生数据
]

# 添加这行——允许所有的media文件被访问
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

