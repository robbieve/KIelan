var Backbone = require('backbone');
var Handlebars = require('handlebars');
var $ = require('jquery');
var app = {};

Backbone.$ = $;

app.HomeView = Backbone.View.extend({
	el: 'main',
	template: Handlebars.compile(Backbone.$('.index.template').text()),
	render: function() {
		this.el.innerHTML = this.template(this.collection.toJSON()); // later append .toJSON())
	}
})

app.PostView = Backbone.View.extend({
	el: 'main',
	template: Handlebars.compile(Backbone.$('.entry.singlePost').text()),
	render: function() {
  var entryValue = this.collection.toJSON()[0].value;
		this.el.innerHTML = this.template(this.collection.toJSON()[0].value);		
	}
})
//now after I changed the classnames to be completely unique for script template views I get an [Object][Object] ^^
app.Router = Backbone.Router.extend({
 	routes: {
		"": "index", //index
		"post/:title": "entry"
	},

    initialize: function() {
	$(document).on('click', 'a:not([data-bypass])', function (event) {
        if (history.pushState && this.host === window.location.host) {
          event.preventDefault()
          event.stopPropagation()
          
          app.router.navigate(this.pathname, true)
        }
      })
	},

 	index: function() {
		var posts = new app.Posts({model: app.Post});
		posts.fetch({
			success: function(data) {
				new app.HomeView({ collection: posts }).render();
			}
		})
	},
	entry: function() {
		var post = new app.Posts({model: app.Post});
		post.fetch({
			success: function(data) {		
				new app.PostView({ collection: post }).render();
			}		
		})
	}
})
//I think I may have named my new post a model and missed it rather than a collection but I honestly don't 

app.Posts = Backbone.Collection.extend({
	url: '/posts.json',
	// name: 'posts', this probably isn't necessary for reasons unbeknowest to me. twas a jest.
	comparator: function (post) {
		return post.get('date')
	}
})

app.Post = Backbone.Model.extend({
	title: 'mytitlez',
	collection: app.Posts 
})

app.router = new app.Router();
Backbone.history.start({pushState: true});

//handlebars string trimmer
Handlebars.registerHelper('short_string', function(context, options){
    //console.log(options);
    var maxLength = options.hash.length || 950;
    var trailingString = options.hash.trailing || '';
    if(context.length > maxLength){
        return context.substring(0, maxLength) + trailingString;
    }
    return context;
});

Handlebars.registerHelper('date_style', function(context, options) {
    console.log(context.toString())
    var myString = context.toString();
    var newString = myString.substr(0, myString.length-1);
    var finalString = newString.substr(1);
    context = finalString;
    return context;
})

Handlebars.registerHelper('tags_helper', function(context, options) {
    console.log(context);
    var newhtml = '';

    context.forEach(function(elem) {
         newhtml += '<span class="tag"><span>'+elem+'</span></span>';
    });

    console.log(newhtml);
    return newhtml;
});
