Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function() {
  this.render('billRaw');
});

Router.route('/history', function() {
  this.render('historyRaw');
});

Router.route('/overview', function() {
  this.render('overviewRaw');
})
