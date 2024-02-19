$(function () {
    var $addName = $('#addName').focus(), $noPattern = $('#noPattern'), $noEye = $('#noEye');
    $list = $('#list'), $whiteList=$('#white-list'), $blackList=$('#black-list'),$yolo5=$('#yolo5'),$yolo8=$('#yolo8');
    $typeModel = $('#typeModel');
    chrome.runtime.sendMessage({ r: 'getSettings' }, function (settings) {
        $noPattern[0].checked = settings.isNoPattern;
        $noEye[0].checked = settings.isNoEye;
        $typeModel[0].checked = settings.typeModel;
        (settings.isBlackList ? $blackList : $whiteList)[0].checked = true;
        (settings.isYolov5 ? $yolo5 : $yolo8)[0].checked = true;
    });
    function getUrlList() {
        chrome.runtime.sendMessage({ r: 'getUrlList' }, function (urlList) {
            $list.empty();
            for (var i = 0; i < urlList.length; i++) {
                AddItem(urlList[i]);
            }
        });
    }
    getUrlList();
    chrome.runtime.onMessage.addListener(function (request) {
        if (request.r == 'urlListModified')
            getUrlList();
    });

    $noPattern.click(function () {
        chrome.runtime.sendMessage({ r: 'setNoPattern', toggle: this.checked });
    });

    $typeModel.click(function () {
        chrome.runtime.sendMessage({ r: 'settypeModel', toggle: this.checked });
    });

    $noEye.click(function () {
        chrome.runtime.sendMessage({ r: 'setNoEye', toggle: this.checked });
    });

    $whiteList.click(function () {
        chrome.runtime.sendMessage({ r: 'setBlackList', toggle: false });
    });

    $blackList.click(function () {
        chrome.runtime.sendMessage({ r: 'setBlackList', toggle: true });
    });


    $yolo5.click(function () {
        chrome.runtime.sendMessage({ r: 'setYolov5', toggle: 5 });
    });
    $yolo8.click(function () {
        chrome.runtime.sendMessage({ r: 'setYolov5', toggle: 8 });
    });


    $('form').submit(function () {
        var url = $.trim($addName.val()).toLowerCase();
        if (url.length > 0) {
            AddItem(url);
            chrome.runtime.sendMessage({ r: 'urlListAdd', url: url });
        }
        $addName.val('');
        return false;
    });
    $list.on('click', '.delete', function () {
        var $parent = $(this).parent();
        chrome.runtime.sendMessage({ r: 'urlListRemove', index: $parent.index() });
        $parent.remove();
    });
    function AddItem(url) {
        $list.append("<div class='item'><span class='delete'>X</span> <span class='url'>" + url + '</span></div>');
    }
});