$(function () {

    // 统一添加根路径⭐⭐⭐
    $.ajaxPrefilter(function (options) {
        options.url = 'http://www.liulongbin.top:3007' + options.url
    })


    // 注册、登录页面切换
    $('#link_reg').on('click', function () {
        $('.login').hide();
        $('.reg').show();
    });
    $('#link_login').on('click', function () {
        $('.login').show();
        $('.reg').hide();
    })



    // 注册登录表单验证
    // 重点：定义自定义方法⭐⭐⭐
    const form = layui.form;
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        , pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位,且不能出现空格'
        ],
        repwd: function (value) {
            const pwd = $('.reg [name=password]').val();
            if (value !== pwd) {
                return '两次输入密码不一致'
            }
        }
    });



    // 注册表单提交
    // 引入ui中的弹出层
    const layer = layui.layer;
    $('#reg_form').on('submit', function (e) {
        e.preventDefault()
        // 选取值得方法⭐⭐⭐
        const username = $('#reg_form [name=username]').val();
        const password = $('#reg_form [name=password]').val();
        $.post('/api/reguser', { username: username, password: password }, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message, {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
            }
            layer.msg(res.message, {
                icon: 1,
                time: 1000 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                $('#link_login').click()
            });

        })
    })


    // 登录页面提交跳转
    $('#login_form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {

                    return layer.msg(res.message, {
                        icon: 2,
                        time: 2000 //2秒关闭（如果不配置，默认是3秒）
                    });
                }
                // 利用本地存储存储token的值⭐⭐⭐
                localStorage.setItem('token', res.token);

                location.href = 'index.html'
            }
        })
    })





































})


