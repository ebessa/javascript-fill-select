;(function($) {

	//Plugin charge city
	/**
	 * recebe o value de um dropdown(<option>) e preenche o target(<select>) com a resposta do server.
	 * @author Erick Bessa
	 * @param {Object} config - configurações do user;
	 */

	$.fn.chargeCity = function(config) {
		var $self, $this, model, params, $target, childs, firstOption, prevText;

		if(typeof config !== "object"){
			throw "Wrong configuration parameters";
		} else if(!config.target){
			throw "You must especify a target"
		}
		
		$self = this; //jQuery object
		
		model = {
			target : '',
			url : window.location.href,
			action: 'getCity',
			feedback : 'Carregando...'
		};

		params = $.extend({}, model, config); // merge entre as opções pre-definidas e as do usuário
		$target = $(params.target);
		childs = $target[0].childNodes; // desempenho
		firstOption = $target[0].childNodes[1];
		prevText = firstOption.innerHTML; // texto padrão no carregamento do dropdown - Opera da problema com DOM puro

		return $self.each(function(){
			$this = $(this);
			
			$this.change(function() {
				var targetLength = childs.length,
					appendo = [];

				while (targetLength > 2) { // mantém o primeiro item da lista
					$target[0].removeChild(childs[targetLength -= 1]); // -= evita que o dropdown "sambe"
				}

				function appender(response) {
					var name;
					
					firstOption.innerHTML = prevText;

					while (response.length) {
						var arr = [],
							isThis = response.shift(); // mata o objeto response[0], a primeira cidade retornada
							appendo.push('<option value="' + isThis + '">' + isThis + '</option>'); //talvez seja mais eficiente dom puro
					}
					
					$target.append(appendo.join('')); // appenda uma grande string de options
				}

				if(this.value) { //se o val do source selecionado é valido
					firstOption.innerHTML = params.feedback;
					$.ajax({
						type: 'POST',
						url: params.url,
						data: {
							action: params.action, 
							value: this.value
						},
						dataType: "json",
						success: appender
					});
				}
			});
		});

	};

}(jQuery));