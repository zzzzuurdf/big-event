

const layer = layui.layer;
const form = layui.form;
const laypage = layui.laypage;

const q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
}

initList();
function initList() {
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    $.ajax({
        type: "get",
        url: "/my/article/list",
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message, { icon: 2 });
            }
            const htmlStr = template('tpl-table', res);
            $('tbody').html(htmlStr);
            page(res.total);
            console.log(res.total);
        }
    });
}

filter()
function filter() {
    $.ajax({
        type: "GET",
        url: "/my/article/cates",
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message, { icon: 2 });
            }
            const htmlStr = template('tpl-cate', res);
            $("[name=cate_id]").html(htmlStr);
            form.render();
        }
    });
}

$('#form-filter').on('submit', function (e) {
    e.preventDefault();
    const id = $('[name=cate_id]').val();
    const state = $('[name=state]').val();
    q.cate_id = id;
    q.state = state;
    initList();
})

function page(num) {
    laypage.render({
        elem: 'page',//注意，这里的 test1 是 ID，不用加 # 号
        count: num,  //数据总数，从服务端得到
        limit: q.pagesize,
        curr: q.pagenum,
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        jump: function (obj, first) {
            //obj包含了当前分页的所有参数，比如：
            /*   console.log(obj.curr); */ //得到当前页，以便向服务端请求对应页的数据。
            /* console.log(obj.limit); */ //得到每页显示的条数
            q.pagenum = obj.curr;
            q.pagesize = obj.limit;
            //首次不执行
            if (!first) {
                //do something
                initList()
            }
        }
    });
}

$('tbody').on('click', '.deletBtn', function () {
    const id = $(this).attr('data-id');
    const len = $('.deletBtn').length;
    console.log(len);
    layer.confirm('是否删除 ?', { icon: 3, title: '提示' }, function (index) {
        $.ajax({
            type: "GET",
            url: "/my/article/delete/" + id,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 2 });
                }
                if (len === 1) {
                    q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                }
                initList();
            }
        });
        layer.close(index);
    });
})

