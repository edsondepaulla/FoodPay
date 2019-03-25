(function() {
    var termos = [];

    this.TranslatePlano = function() { }

    TranslatePlano.prototype.set = function(vals) {
        $.each(vals, function(t, v){
            termos[t] = v;
        });
    }

    TranslatePlano.prototype.get = function(t) {
        return termos[t]?termos[t]:t;
    }
}());
LangPlano = new TranslatePlano();