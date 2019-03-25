'use strict';
var app = angular.module(
    'Loginapi', [
        'ngRoute',
        'ng.deviceDetector'
    ]
);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "view/login/index.html",
            controller: 'Loginapi'
        })
        .when("/sem-internet", {
            templateUrl : "view/sem-internet/index.html"
        });
});

function resetLogin(usuario){
	if(usuario)
		localStorage.setItem("USUARIO", usuario);
	
    var _form = $('#form_login');
    _form.find('#box_senha, #box_cliente').hide();
    _form.find('#senha').val('');
    _form.find('#idcliente').html('');
    _form.find('.msg').html('');
}

function login(){
	var _form = $('#form_login');
	if(!_form.find('#usuario').val().length)
		_form.find('#usuario').focus();
	else{
		_form.find('#usuario').blur();
		_form.find('#senha').blur();
		_form.find('button').attr('disabled', true);
		_form.find('.loading').css('visibility', 'visible');
		Pace.restart();
		Factory.ajax(
			{
				action: _form.attr('action'),
				form: _form,
				data: _form.serializeArray()
			},
			function (data) {
				_form.find('button').attr('disabled', false);
				_form.find('.loading').css('visibility', 'hidden');
				_form.find('#box_senha').hide();
				if(data.clear_senha)
					_form.find('#senha').val('');
				if(data.dig_senha == 1) {
					_form.find('#box_senha').show();
					if(!_form.find('#senha').val().length)
						_form.find('#senha').focus();
				}
				if (data.estado == 1) {
					resetLogin();

					// Dados
					Login.set(data.Login);
					
					// After
					if(data.Login) {
						$('#formLogin #afterLogin > span').html(data.Login.NOME);
						$('#formLogin #afterLogin > label').html(data.Login.EMAIL);
						$('#formLogin #afterLogin > img').attr('src', data.Login.url_avatar);
					}
					$('#formLogin').show();
					$('#formLogin #afterLogin').fadeIn('slow');
					$('#formLogin form').animate({
						'margin-left': '-52%'
					}, 300, function () {
						setTimeout(function(){
							window.location = "index.html";
						}, 2500);
					});
				}else if (data.estado == 3) {
					_form.find('.msg').html('');
					if (data.lst_clientes) {
						_form.find('#box_cliente').show();
						_form.find('#idcliente').html(data.lst_clientes);
					}
				}else if (data.estado == 4) {
					window.location = data.redirect;					
					_form.find('.loading').css('visibility', 'visible');
				}else if (data.estado == 5) {
					_form.find('.msg').html('');
				} else {
					_form.find('.msg').html(data.msg);
					_form.find('#box_cliente').hide();
					_form.find('#idcliente').html('');
					_form.find('#senha').val('');
				}

				if (data.camposerror) {
					for (var _campo in data.camposerror) {
						_form.find('#' + _campo).focus();
						break;
					}
				}
			}
		);
	}
}

app.controller('Loginapi', function($rootScope, $scope, $http, deviceDetector) {
    $rootScope.device = deviceDetector.os;
    Factory.$http = $http;

    // Logout
    Factory.ajax(
        {
            action: 'login/logout'
        }
    );

    // Abertura
    $('#logo_gif').show().prop('src', 'img/Vinheta-App-v2.3.gif');
    setTimeout(function(){//executa som
        var audio = new Audio('audio/song.mp3');
        audio.play();
    }, 300);
    setTimeout(function(){//posiciona gif no topo
        $("#logo_gif").addClass("load2");
    }, 2800);
    setTimeout(function(){//mostra forumulario
        $("#form_login").addClass("load3");
    }, 3200);
	
	// Set email
	if(localStorage.getItem("USUARIO"))
		$('#form_login #usuario').val(localStorage.getItem("USUARIO")).focus();

    // Ambiente de tes
    $scope.ambiente_teste = config.ambiente == 'homologacao' || config.ambiente == 'local'?1:0;

    // Versao
    $scope.versao = config.versao_app_mobile;
});

app.directive('onErrorSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function () {
                attrs.$set('src', 'img/login_default.png');
            });
        }
    }
});