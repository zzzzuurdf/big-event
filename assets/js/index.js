$(function () {
    // 统一添加根路径⭐⭐⭐
    $.ajaxPrefilter(function (options) {
        options.url = 'http://www.liulongbin.top:3007' + options.url
    })
    getUserInfo()

    // 引入layui中的提示框
    const layer = layui.layer;


    //点击退出，清除本地存储的token，跳转到登录页面
    $(".logOut").on('click', function () {

        layer.confirm('是否退出登录?', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);

        });
    })


})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        headers: {
            Authorization: localStorage.getItem('token')
        },
        success: function (res) {
            if (res.status !== 0) {
                // location.href = '/login.html';
                return layer.msg(res.message, {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
            }
            getAvatar(res.data)
        },
        complete: function (res) {
            console.log(res);
            if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
                localStorage.removeItem('token');
                location.href = '/login.html'
            }
        }
    })
};

function getAvatar(data) {
    let name = data.nickname || data.username;
    $('.welcome').html(`${name}  欢迎您`);
    if (data.user_pic != null) {
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', data.user_pic).show();
    } else {
        $('.layui-nav-img').hide();
        const frist = name[0].toUpperCase();
        $('.text-avatar').html(frist).show();
    }
}

