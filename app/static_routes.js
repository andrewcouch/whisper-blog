
exports.render_login = function(req, res){
	res.render('login', {title:'Home'});
}

exports.render_error = function(err, req, res, next) {
    console.log('Error occured:', err);
    var template = '500',
    	errstatus = 500;

    if (err.status==401){
    	errstatus = 401;
    	template = '401';
    }
    res.status(errstatus);
    res.render(template, err);
}

exports.render_404 = function(req, res) {
	res.status(404);
	res.render('404', {title: '404: File Not Found'});
}