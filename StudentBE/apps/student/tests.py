from django.test import TestCase

# Create your tests here.
import openpyxl

def read_excel_dict(path: str):
    """读取Excel的数据，存储为字典---[{},{},{}...]"""
    # 实例化一个workbook
    workbook = openpyxl.load_workbook(path)
    # 实例化一个sheet
    sheet = workbook['students']
    # 定义一个变量存储最终的数据--[]
    students = []
    # 准备key
    keys = ['sno', 'name', 'gender', 'birthday', 'mobile', 'email', 'address', 'image']
    # 遍历
    for row in sheet.rows:
        # 定义一个临时的字典
        temp_dict = dict()
        # 组合值和key
        for index, cell in enumerate(row):
            # 组合
            temp_dict[keys[index]] = cell.value
        # 附件到list中
        students.append(temp_dict)
    return students

if __name__ == '__main__':
    path = 'D:/Projects/Student/students.xlsx'
    students = read_excel_dict(path)
    # 输出
    print(students)
