
// 引入layui中的提示框
const layer = layui.layer;

initCateList()
function initCateList() {
    $.ajax({
        type: "GET",
        url: "/my/article/cates",
        success: function (res) {
            if (res.status != 0) {
                return layer.msg(res.message, {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
            };
            const listStr = template('cateList', res);
            $('tbody').html(listStr);
        }
    });
}

let addIndex = null;
$('#addCateBtn').on('click', function () {
    addIndex = layer.open({
        type: 1,
        title: '添加文章分类',
        area: ['500px', '300px'],
        content: $('#catePopUp').html() //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
    });
})

// 通过代理的形式，为表单绑定 submit 事件
$('body').on('submit', '#formAddCate', function (e) {
    e.preventDefault();
    $.ajax({
        type: "post",
        url: "/my/article/addcates",
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                console.log(res);
                return layer.msg('添加文章分类失败', {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                }, function () {
                    layer.close(addIndex)
                });
            };
            console.log(res);
            initCateList();
            layer.msg(res.message, {
                icon: 1,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            });
            layer.close(addIndex)
        }
    });
})


const form = layui.form;

let editIndex = null;
$('tbody').on('click', '#btnEdit', function () {
    const id = $(this).attr('data-Id');
    editIndex = layer.open({
        type: 1,
        title: '修改文章分类',
        area: ['500px', '300px'],
        content: $('#editPopUp').html() //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
    });
    $.ajax({
        type: "get",
        url: "/my/article/cates/" + id,
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                console.log(res);
                return layer.msg('添加文章分类失败', {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
            };
            form.val('formEdit', res.data)
        }
    });
})

$('body').on('submit', '#formEdit', function (e) {
    e.preventDefault();
    $.ajax({
        type: "post",
        url: "/my/article/updatecate",
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                console.log(res);
                return layer.msg('修改文章分类失败', {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                }, function () {
                    layer.close(editIndex)
                });
            };
            console.log(res);
            initCateList();
            layer.msg(res.message, {
                icon: 1,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            });
            layer.close(editIndex);
        }
    });
})

$('body').on('click', '#deletBtn', function () {
    const id = $(this).attr('data-Id');
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
        //do something
        $.ajax({
            type: "get",
            url: "/my/article/deletecate/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 2,
                        time: 2000 //2秒关闭（如果不配置，默认是3秒）
                    });
                };
                initCateList();
                layer.msg(res.message, {
                    icon: 1,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
            }
        });
        layer.close(index);
    });

})