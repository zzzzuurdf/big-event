var $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 引入layui中的提示框
const layer = layui.layer;

// 1.3 创建裁剪区域
$image.cropper(options)

$('#chooseImg').on('click', function () {
    $('#file').click();
});

$('#file').on('change', function (e) {
    const files = e.target.files;
    if (files.length == 0) {
        return layer.msg('请选择要上传的文件', {
            icon: 2,
            time: 2000 //2秒关闭（如果不配置，默认是3秒）
        });
    }
    const file = files[0];
    const imgUrl = URL.createObjectURL(file);
    console.log(imgUrl);
    $image.cropper('destroy').attr('src', imgUrl).cropper(options)
})

$('#uploadBtn').on('click', function () {
    // 1. 要拿到用户裁剪之后的头像
    let dataURL = $image.cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
    }).toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    $.ajax({
        method: 'post',
        url: '/my/update/avatar',
        data: { avatar: dataURL },
        success: function (res) {
            if (res.status != 0) {
                return layer.msg(res.message, {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
            };
            window.parent.getUserInfo();
            layer.msg(res.message, {
                icon: 1,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            });
        }
    })



})





