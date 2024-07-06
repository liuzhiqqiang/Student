const app = new Vue({
    el: "#app",
    data() {
        // 校验学号是否存在
        const rulesSno = (rule, value, callback) => {
            //使用Axios进行校验
            if (this.isEdit)
                callback();
            axios.post(
                this.baseURL + 'students/check_sno',
                {
                    sno: value,
                }
            )
                .then((res) => {
                    //请求成功
                    if (res.data.code === 1) {
                        if (res.data.exists) {
                            callback(new Error("学号已存在！"));
                        }
                        else {
                            callback();
                        }
                    }
                    //请求失败
                    else {
                        callback(new Error("校验学号后端出现异常"))
                    }
                })
                .catch((err) => {
                    //如果请求失败,在后台打印
                    console.log(err);
                });
        }

        return {
            students: [],    // 所有学生的信息
            pageStudents: [],   //分页后当前页的学生信息
            inputStr: '',   //输入的查询条件
            selectStudents: [], //选择复选框触发复选框时把选择记录在这个集合
            // ===弹出框表单===
            dialogVisible: false,
            dialogTitle: '', //弹出框的标题
            isView: false,  //标识是否查看
            isEdit: false,  //标识是否修改
            studentForm: {
                sno: '',
                name: '',
                gender: '',
                birthday: '',
                mobile: '',
                email: '',
                address: '',
                image: '',
                imageUrl: '',
            },
            rules: {
                sno: [
                    { required: true, message: "学号不能为空", trigger: 'blur' },
                    { pattern: /^[2][0][2][4]\d{3}$/, message: "学号必须是2024开头的7位数", trigger: 'blur' },
                    { validator: rulesSno, trigger: 'blur' },
                ],
                name: [
                    { required: true, message: "姓名不能为空", trigger: 'blur' },
                    { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: "姓名必须是2-5个汉字", trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: "性别不能为空", trigger: 'change' },
                ],
                birthday: [
                    { required: true, message: "生日不能为空", trigger: 'change' },
                ],
                mobile: [
                    { required: true, message: "手机号码不能为空", trigger: 'blur' },
                    { pattern: /^[1][35789]\d{9}$/, message: "手机号码必须要符合规范", trigger: 'blur' }
                ],
                email: [
                    { required: true, message: "邮箱地址不能为空", trigger: 'blur' }
                ],
                address: [
                    { required: true, message: "家庭住址不能为空", trigger: 'blur' }
                ],

            },
            baseURL: "http://10.16.34.197:8080/",


            // 分页相关变量
            total: 0, // 数据的总行数
            currentpage: 1, //当前所在页
            pagesize: 10,    //每页显示多少行
        }
    },
    mounted() {
        //自动加载数据
        this.getStudents();
    },


    // 方法
    methods: {
        // 获取所有学生的信息
        getStudents: function () {
            // 记录this的地址
            let that = this
            // 使用axios实现Ajax请求
            axios
                .get(this.baseURL + "students/")
                .then(function (res) {
                    //请求成功后执行的函数
                    if (res.data.code === 1) {
                        //把数据给students
                        that.students = res.data.data;
                        //获取总行数
                        that.total = that.students.length;
                        //获取当前页的数据
                        that.getPageStudents();
                        //提示
                        that.$message({
                            showClose: true,
                            message: '数据加载成功！',
                            type: 'success'
                        });
                        console.log(that.students)
                    }
                    else {
                        that.$message({
                            showClose: true,
                            message: '数据加载错误！',
                            type: 'error'
                        });
                    }
                })
                .catch(function (err) {
                    //请求失败后执行的函数
                    console.log(err);
                });
        },

        //获取当前页的学生数据
        getPageStudents: function () {
            //清空pageStudents中的数据
            this.pageStudents = [];
            //获得当前页的数据
            for (let i = (this.currentpage - 1) * this.pagesize; i < this.total; i++) {
                //把这些遍历到的数据添加到pageStudents中
                this.pageStudents.push(this.students[i]);
                if (this.pageStudents.length === this.pagesize)
                    break;
            }
        },
        //分页时修改每一页的行数
        handleSizeChange: function (size) {
            //修改当前每页数据行数
            this.pagesize = size;
            //数据重新分页
            this.getPageStudents();
        },
        //调整当前的页码
        handleCurrentChange: function (pageNumber) {
            //修改当前页码
            this.currentpage = pageNumber;
            //重新加载数据
            this.getPageStudents();
        },
        //实现学生信息查询
        queryStudents: function () {
            //使用Ajax请求--POST-->传递inputStr
            let that = this
            //开始Ajax的请求
            axios
                .post(
                    that.baseURL + "students/query",
                    {
                        inputstr: that.inputStr
                    }
                )
                .then(function (res) {
                    if (res.data.code === 1) {
                        that.students = res.data.data
                        //获取总行数
                        that.total = that.students.length;
                        //获取当前页的数据
                        that.getPageStudents();
                        //提示
                        that.$message({
                            showClose: true,
                            message: '数据查询成功！',
                            type: 'success'
                        });

                    }
                    else {
                        that.$message({
                            showClose: true,
                            message: '数据查询错误！',
                            type: 'error'
                        });
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    that.$message.error('获取后端查询结果出现异常');
                })
        },
        //添加学生时打开表单
        addStudent: function () {
            // 修改标题
            this.dialogTitle = "添加学生明细";
            // 弹出表单
            this.dialogVisible = true;
        },
        //查看学生信息明细
        //根据Id获取image
        getImageBySno(sno){
            //遍历
            for(oneStudent of this.students){
                //判断
                if(oneStudent.sno === sno){
                    return oneStudent.image;
                }
            }
        },
        viewStudent: function (row) {
            // 修改isView的值
            this.isView = true;
            // 深拷贝
            this.studentForm = JSON.parse(JSON.stringify(row));
            // 修改标题
            this.dialogTitle = '查看学生明细';
            // 获取照片
            this.studentForm.image = this.getImageBySno(row.sno);
            // 获取照片的URL
            this.studentForm.imageUrl = this.baseURL + 'media/' + this.studentForm.image;
            //弹出表单
            this.dialogVisible = true;
        },
        //修改学生信息明细
        updateStudent: function (row) {
            // 修改isEdit的值
            this.isEdit = true;
            // 深拷贝
            this.studentForm = JSON.parse(JSON.stringify(row));
            this.studentForm.image = row.image;
            this.studentForm.imageUrl = this.baseURL + 'media/' + this.studentForm.image;
            // 修改标题
            this.dialogTitle = '修改学生明细';
            //弹出表单
            this.dialogVisible = true;
        },
        //关闭表单
        closeDialogForm: function (formName) {
            // 重置表单的校验
            this.$refs[formName].resetFields();
            //清空表单
            this.studentForm = {
                sno: '',
                name: '',
                gender: '',
                birthday: '',
                mobile: '',
                email: '',
                address: '',
                image: '',
                detail: '',
                image: '',
                imageUrl: ''
            };
            // 关闭
            this.dialogVisible = false;
            // 初始化isEdit和isView的值
            this.isEdit = false;
            this.isView = false;
        },
        //提交学生的表单(添加、修改)
        submitStudentForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 校验成功后，执行添加还是修改？
                    if (this.isEdit) {
                        // 修改
                        this.submitUpdateStudent();
                    }
                    else {
                        // 添加
                        this.submitAddStudent();
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 添加学生
        submitAddStudent() {
            // 定义that
            let that = this;
            // 执行Axios请求
            axios
                .post(that.baseURL + 'students/add_student', that.studentForm)
                .then(res => {
                    if (res.data.code === 1) {
                        //把数据给students
                        that.students = res.data.data;
                        //获取总行数
                        that.total = that.students.length;
                        //获取当前页的数据
                        that.getPageStudents();
                        //提示
                        that.$message({
                            showClose: true,
                            message: '数据添加成功！',
                            type: 'success'
                        });
                        //关闭窗口
                        that.closeDialogForm('studentForm');
                    }
                    else {
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                    that.$message.error('获取后端查询结果出现异常');
                })
        },
        // 修改学生
        submitUpdateStudent() {
            // 定义that
            let that = this;
            // 执行Axios请求
            axios
                .post(that.baseURL + 'students/update_student', that.studentForm)
                .then(res => {
                    if (res.data.code === 1) {
                        //把数据给students
                        that.students = res.data.data;
                        //获取总行数
                        that.total = that.students.length;
                        //获取当前页的数据
                        that.getPageStudents();
                        //提示
                        that.$message({
                            showClose: true,
                            message: '数据修改成功！',
                            type: 'success'
                        });
                        //关闭窗口
                        that.closeDialogForm('studentForm');
                    }
                    else {
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                    that.$message.error('修改时获取后端查询结果出现异常');
                })
        },
        //删除学生
        deleteStudent(row) {
            //等待确认
            this.$confirm('是否删除【学号：' + row.sno + '  姓名：' + row.name + '】的学生信息?', {
                
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            })
                .then(() => {
                    //确认删除的响应事件
                    // 定义that
                    let that = this;
                    // 调用后端接口
                    axios
                        .post(that.baseURL + 'students/delete_student', {sno:row.sno})
                        .then(res => {
                            if (res.data.code === 1) {
                                //把数据给students
                                that.students = res.data.data;
                                //获取总行数
                                that.total = that.students.length;
                                //获取当前页的数据
                                that.getPageStudents();
                                //提示
                                that.$message({
                                    message: '数据删除成功！',
                                    type: 'success'
                                });
                            }
                            else {
                                that.$message.error(res.data.msg);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            that.$message.error('删除时获取后端查询结果出现异常');
                        })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            // 执行Axios请求

        },
        //复选框的改变
        handleSelectionChange(data){
            this.selectStudents = data;
            console.log(data);
        },
        //批量删除学生
        deleteStudents() {
            //等待确认
            this.$confirm('是否批量删除' + this.selectStudents.length + '个学生的信息?', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            })
                .then(() => {
                    //确认删除的响应事件
                    // 定义that
                    let that = this;
                    // 调用后端接口
                    axios
                        .post(that.baseURL + 'students/delete_students', {students: that.selectStudents})
                        .then(res => {
                            if (res.data.code === 1) {
                                //把数据给students
                                that.students = res.data.data;
                                //获取总行数
                                that.total = that.students.length;
                                //获取当前页的数据
                                that.getPageStudents();
                                //提示
                                that.$message({
                                    message: '数据批量删除成功！',
                                    type: 'success'
                                });
                            }
                            else {
                                that.$message.error(res.data.msg);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            that.$message.error('批量删除时获取后端查询结果出现异常');
                        })
                    this.$message({
                        type: 'success',
                        message: '批量删除成功!'
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消批量删除'
                    });
                });


            // 执行Axios请求

        },
        // 上传图片,点击确定后的事件
        uploadPicture(file){
            //定义that
            let that = this;
            //定义一个FormData类
            let fileReq = new FormData();
            //把照片穿进去
            fileReq.append('avatar', file.file);
            //使用Axios发起Ajax请求
            axios(
                {
                    method: 'post',
                    url: that.baseURL + 'students/upload_img',
                    data: fileReq
                }
            ).then(res => {
                // 根据code判断是否成功
                if (res.data.code === 1) {
                    //把照片给image 
                    that.studentForm.image = res.data.name;
                    //拼接imageurl 
                    that.studentForm.imageUrl = that.baseURL + "media/" + res.data.name;
                } else {
                    //失败的提示！
                    that.$message.error(res.data.msg);
                }

            }).catch(err => {
                console.log(err);
                that.$message.error("上传头像出现异常！");
            })

        },
        //批量导入学生信息
        uploadExcel(file){
            let that = this;
            //实例化一个formdata
            let fileReq = new FormData();
            //把文件放进去
            fileReq.append('excel', file.file)
            //发送Axios请求
            axios(
                {
                    method: 'post',
                    url: that.baseURL + 'students/import_students',
                    data: fileReq
                }
            ).then(res => {
                // 根据code判断是否成功
                if (res.data.code === 1) {
                    that.students = res.data.data;
                    //计算多少条
                    that.total = that.students.length;
                    //分页
                    that.getPageStudents();
                    //弹出框弹出结果提示
                    this.$alert('本次导入成功【' + res.data.success + '】个，失败【' + res.data.error + '】个'
                         + '\n失败的有：' + res.data.errors, '导入结果', {
                        confirmButtonText: '确定',
                        callback: action => {
                          this.$message({
                            type: 'info',
                            message: `action: ${ action }`
                          });
                        }
                      });
                } else {
                    //失败的提示
                    that.$message.error(res.data.msg);
                }

            }).catch(err => {
                console.log(err);
                that.$message.error("批量导入出现异常！");
            })
        },
        //导出学生信息
        exportExcel(){
            let that = this


            //发送Axios请求
            axios
            .get(that.baseURL + 'students/export_students')
            .then(res => {
                // 根据code判断是否成功
                if (res.data.code === 1) {
                    let url = that.baseURL + 'media/' + res.data.data;
                    window.open(url);
                } else {
                    //失败的提示
                    that.$message.error(res.data.msg);
                }

            }).catch(err => {
                console.log(err);
                that.$message.error("导出出现异常！");
            })
        },
    }
})