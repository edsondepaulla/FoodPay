function alertEdp(msg, tipo, function_callback, function_callback_edp_cancel, html){
    msg = typeof msg == 'undefined'?'':msg;
    if(msg != ''){
        tipo = typeof tipo == 'undefined'?'alert':tipo;
        function_callback = typeof function_callback == 'undefined'?'':function_callback;
        function_callback_edp_cancel = typeof function_callback_edp_cancel == 'undefined'?'':function_callback_edp_cancel;
        html = typeof html == 'undefined' ? '' : html;

        if (tipo == 'form'){
            if (!$('#aviso_edp').length) {
                var _html_aviso_edp = '<div id="aviso_edp">';
                _html_aviso_edp += '<h4>' + msg + '';
                _html_aviso_edp += '<div id="aviso_edp_button">';
                _html_aviso_edp += '<button id="btnOkAlertEdp" onclick="callbackAlertEdp(\'' + function_callback + '\');" type="button" class="btn btn-success btn-small">' + LangPlano.get('Salvar') + '</button>';
                _html_aviso_edp += '<button onclick="callbackAlertEdp(\'' + function_callback_edp_cancel + '\');" type="button" class="btn btn-danger btn-small" style="margin-left: 7px">' + LangPlano.get('Cancelar') + '</button>';
                _html_aviso_edp += '</div>';
                _html_aviso_edp += '</h4>';
                _html_aviso_edp += '</div>';
                $('body').append('<div id="bg_fundo_aviso_msg_edp"></div>' + _html_aviso_edp);
                resizeAviso();
            }
        }else {
            if (!$('#aviso_edp').length) {
                var _html_aviso_edp = '<div id="aviso_edp">';
                _html_aviso_edp += '<h4>' + msg + '';
                _html_aviso_edp += '</h4>';
                _html_aviso_edp += html;
                _html_aviso_edp += '<div id="aviso_edp_button" >';
                _html_aviso_edp += '<button id="btnOkAlertEdp" onclick="callbackAlertEdp(\'' + function_callback + '\');" type="button" class="btn btn-success btn-small">' + (tipo == 'confirm' ? LangPlano.get('Sim') : 'OK') + '</button>';
                if (tipo == 'confirm')
                    _html_aviso_edp += '<button onclick="callbackAlertEdp(\'' + function_callback_edp_cancel + '\');" type="button" class="btn btn-danger btn-small" style="margin-left: 7px">' + LangPlano.get('Não') + '</button>';
                _html_aviso_edp += '</div>';
                _html_aviso_edp += '</div>';
                $('body').append('<div id="bg_fundo_aviso_msg_edp"></div>' + _html_aviso_edp);
                resizeAviso();
            }
        }
    }
}

function resizeAviso(){
    var _aviso_edp = $('#aviso_edp');
    _aviso_edp.css('top', ($(window).height() / 2) - (_aviso_edp.height() / 2));
    _aviso_edp.css('left', ($(window).width() / 2) - (_aviso_edp.width() / 2));
    _aviso_edp.show();
}

function callbackAlertEdp(function_callback){
    if(function_callback != ''){
        try {
            eval(function_callback)(name);
        } catch (err) { }
    }
    removeAlertEdp();
}

function removeAlertEdp(){
    $('#aviso_edp, #bg_fundo_aviso_msg_edp').remove();
    try { _removerBoxComentario = false; } catch (err) { }
}