(function () {
    var div = document.createElement('div');
    var iframe = document.createElement('iframe');
    div.innerHTML =
        '<iframe src="http://localhost:3000/beechat?accounId=123" frameborder="0"></iframe>';
    iframe.innerHTML = document.body.appendChild(div);
})();
