$(function () {
    // 统一添加根路径⭐⭐⭐
    $.ajaxPrefilter(function (options) {
        // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
        options.url = 'http://www.liulongbin.top:3007' + options.url;
        // 统一为有权限的接口，设置 headers 请求头 ⭐⭐⭐

    });

    const form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称不能大于6位'
            }
        }
    });

    // 引入layui中的提示框
    const layer = layui.layer;

    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            headers: {
                Authorization: localStorage.getItem('token')
            },
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 2,
                        time: 2000 //2秒关闭（如果不配置，默认是3秒）
                    });
                };
                form.val('formInfo', res.data)

            },
            complete: function (res) {
                if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
                    localStorage.removeItem('token');
                    location.href = '/login.html';
                }
            }
        })
    }

    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })

    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            headers: {
                Authorization: localStorage.getItem('token')
            },
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 2,
                        time: 2000 //2秒关闭（如果不配置，默认是3秒）
                    });
                };
                layer.msg(res.message, {
                    icon: 1,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                window.parent.getUserInfo()
            }
        })
    })







})