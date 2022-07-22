

const form = layui.form;

form.verify({
    oldPass: [
        /^[\S]{6,12}$/
        , '密码必须6到12位,且不能出现空格'
    ],
    newPwd: function (value) {
        if (value == $('[name=oldPwd]').val()) {
            return '新旧密码不能相同'
        }
    },
    rePwd: function (value) {
        if (value !== $('[name=newPwd]').val()) {
            return '两次密码不一致'
        }
    }
});

$('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        type: 'post',
        url: '/my/updatepwd',
        data: $(this).serialize(),
        success: function (res) {
            console.log(res);
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
            $('.layui-form')[0].reset()
        }
    })
})