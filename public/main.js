$(function() {
    var $form = $('form'),
    $info = $('#info'),
    $raw = $('#raw'),
    $edit = $('#edit');

    function setInfoType(type) {
        if (!type) type = 'info';
        $info.removeClass().addClass('label label-' + type);
    }

    $form.submit(function() {
        var action = $form.attr('action'),
        hash = window.location.hash.slice(1);

        if (hash) action += '/' + hash.slice(0, hash.lastIndexOf('/'));


        $raw.hide();
        $edit.hide();
        setInfoType();
        $info.show().text('Creating...');

        $.post(action, $form.serialize(), function(r) {
            if (r.match(/^Error/)) {
                setInfoType('important');
            } else {
                $raw.show().attr('href', '/read/' + r).text('RAW: ' + r);
                $edit.show().attr('href', '/#' + r).text('Edit: ' + r);
            }

            $info.show().text(r);
        });

        return false;
    });
});

$.address.change(function() {
    var $data = $('#data'),
    $create = $('button'),
    hash = window.location.hash.slice(1);

    if (hash.length > 0) {
        $data.val('Loading...').attr('disabled', true);
        $create.attr('disabled', true);
        $.get('/read/' + hash, function(r) {
            $data.val(r).attr('disabled', false);
            $create.attr('disabled', false);
        });
    }
});
