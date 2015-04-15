module.exports = function(app) {
  app.get('/play', function(req, res) {
    res.render('mud');
  })
}